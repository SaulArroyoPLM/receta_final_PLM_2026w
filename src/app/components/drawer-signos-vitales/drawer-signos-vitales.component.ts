// drawer-signos-vitales.component.ts

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { trigger, state, style, transition, animate } from '@angular/animations';

export interface DrawerSection {
  title: string;
  icon?: string;
  items: DrawerItem[];
  expanded?: boolean;
}

export interface DrawerItem {
  label: string;
  value: string | number;
  icon?: string;
  selected?: boolean;
  unit?: string;
}

@Component({
  selector: 'app-drawer-signos-vitales',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './drawer-signos-vitales.component.html',
  styleUrls: ['./drawer-signos-vitales.component.scss'],
  animations: [
    trigger('slideIn', [
      state('closed', style({
        transform: 'translateX(100%)'
      })),
      state('open', style({
        transform: 'translateX(0)'
      })),
      transition('closed => open', animate('300ms ease-in')),
      transition('open => closed', animate('300ms ease-out'))
    ]),
    trigger('fadeIn', [
      state('hidden', style({
        opacity: 0,
        display: 'none'
      })),
      state('visible', style({
        opacity: 1,
        display: 'block'
      })),
      transition('hidden => visible', animate('200ms ease-in')),
      transition('visible => hidden', animate('200ms ease-out'))
    ])
  ]
})
export class DrawerSignosVitalesComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Datos';
  @Input() sections: DrawerSection[] = [];
  @Input() showPrintButton: boolean = true;
  @Input() printButtonText: string = 'Agregar en la receta';
  @Input() warningMessage?: string;
  
  @Output() closeDrawer = new EventEmitter<void>();
  @Output() printSelected = new EventEmitter<DrawerItem[]>();
  @Output() itemToggled = new EventEmitter<{ section: string; item: DrawerItem }>();
  @Output() valueChanged = new EventEmitter<DrawerItem>();

  ngOnInit() {
    // Inicializar expanded en true si no está definido
    this.sections.forEach(section => {
      if (section.expanded === undefined) {
        section.expanded = true;
      }
    });
  }

  close() {
    this.isOpen = false;
    this.closeDrawer.emit();
  }

  toggleSection(section: DrawerSection) {
    section.expanded = !section.expanded;
  }

  toggleItem(section: DrawerSection, item: DrawerItem) {
    item.selected = !item.selected;
    this.itemToggled.emit({ section: section.title, item });
  }

  onValueChange(item: DrawerItem) {
    // Emitir cuando cambia el valor
    this.valueChanged.emit(item);
    
    // Auto-seleccionar el item si tiene un valor
    if (item.value && item.value !== '') {
      item.selected = true;
    }
  }

  getSelectedItems(): DrawerItem[] {
    const selected: DrawerItem[] = [];
    this.sections.forEach(section => {
      section.items.forEach(item => {
        // Solo incluir items que estén seleccionados Y tengan valor
        if (item.selected && item.value && item.value !== '') {
          selected.push(item);
        }
      });
    });
    return selected;
  }

  onPrint() {
    const selectedItems = this.getSelectedItems();
    
    // Validar que haya al menos un item seleccionado con valor
    if (selectedItems.length === 0) {
      alert('Por favor ingrese al menos un valor y selecciónelo');
      return;
    }

    this.printSelected.emit(selectedItems);
  }

  hasSelectedItems(): boolean {
    return this.getSelectedItems().length > 0;
  }

  // Método helper para validar los datos antes de guardar
  validateData(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const selected = this.getSelectedItems();

    if (selected.length === 0) {
      errors.push('Debe seleccionar al menos un dato con valor');
    }

    selected.forEach(item => {
      const numValue = Number(item.value);
      
      // Validaciones por tipo de dato
      switch(item.label) {
        case 'Estatura':
          if (numValue <= 0 || numValue > 3) {
            errors.push('Estatura debe estar entre 0 y 3 metros');
          }
          break;
        case 'Peso':
          if (numValue <= 0 || numValue > 500) {
            errors.push('Peso debe estar entre 0 y 500 kg');
          }
          break;
        case 'IMC':
          if (numValue <= 0 || numValue > 100) {
            errors.push('IMC debe estar entre 0 y 100');
          }
          break;
        case 'Temperatura':
          if (numValue < 30 || numValue > 45) {
            errors.push('Temperatura debe estar entre 30°C y 45°C');
          }
          break;
        case 'SpO₂':
          if (numValue < 0 || numValue > 100) {
            errors.push('SpO₂ debe estar entre 0% y 100%');
          }
          break;
      }
    });

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
}