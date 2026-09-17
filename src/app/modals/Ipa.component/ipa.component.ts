import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips'; // 👈 NUEVO
import { Medicamento } from '../../interfaces/medicamento.interface';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
    MatRadioModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule,
    MatChipsModule, // 👈 NUEVO
  ],
  selector: 'app-ipa',
  templateUrl: './ipa.component.html',
  styleUrls: ['./ipa.component.scss'],
})
export class IpaComponent implements OnInit, OnDestroy {
  medicamento?: Medicamento;
  imagenMostrar: string = '';
  presentaciones: string[] = [];
  tempSelection: string = ''; // 👈 NUEVO: variable temporal para el select
  // 👇 CAMBIADO: ahora es un array para múltiples selecciones
  selectedPresentations: string[] = [];
  searchPresentacionQuery: string = '';
  filteredPresentaciones: string[] = [];
  private searchPresentacionTerms = new Subject<string>();
  private searchPresentacionSub?: Subscription;
  constructor(
    public dialogRef: MatDialogRef<IpaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { medicamento: Medicamento }
  ) {
    this.medicamento = data.medicamento;
  }
  ngOnInit() {
    console.log('Medicamento recibido:', this.medicamento);
    
    this.imagenMostrar = this.medicamento?.imagenDetalle || 
                         this.medicamento?.imagen || 
                         this.medicamento?.imagenBuscador || 
                         'assets/images/default-medicine.png';
    
    console.log('Mostrando imagen:', this.imagenMostrar);
    
    if (this.medicamento?.presentaciones && this.medicamento.presentaciones.length > 0) {
      this.presentaciones = this.medicamento.presentaciones;
    } else if (this.medicamento?.presentacion) {
      this.presentaciones = [this.medicamento.presentacion];
    } else {
      this.presentaciones = [];
    }
    
    this.filteredPresentaciones = [...this.presentaciones];
    
    console.log('Presentaciones cargadas:', this.presentaciones);
    console.log('IPPA Info disponible:', !!this.medicamento?.ippaInfo);
    this.searchPresentacionSub = this.searchPresentacionTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(term => {
      const lowerTerm = term.toLowerCase();
      this.filteredPresentaciones = this.presentaciones.filter(presentacion => 
        presentacion.toLowerCase().includes(lowerTerm)
      );
    });
  }
  ngOnDestroy() {
    if (this.searchPresentacionSub) this.searchPresentacionSub.unsubscribe();
  }
  buscarPresentacion() {
    this.searchPresentacionTerms.next(this.searchPresentacionQuery);
  }
   // 👇 NUEVO: Agregar presentación al array
  onSelectionChange(presentacion: string) {
    if (presentacion && !this.selectedPresentations.includes(presentacion)) {
      this.selectedPresentations.push(presentacion);
      this.tempSelection = ''; // Limpiar el select después de agregar
    }
  }
  // 👇 NUEVO: Eliminar chip
  removePresentation(presentacion: string) {
    const index = this.selectedPresentations.indexOf(presentacion);
    if (index >= 0) {
      this.selectedPresentations.splice(index, 1);
    }
  }
  agregarARecetaNueva() {
    if (this.selectedPresentations.length > 0) {
      this.dialogRef.close({
        action: 'new',
        presentations: this.selectedPresentations // 👈 Ahora es array
      });
    }
  }
  agregarARecetaExistente() {
    if (this.selectedPresentations.length > 0) {
      this.dialogRef.close({
        action: 'existing',
        presentations: this.selectedPresentations // 👈 Ahora es array
      });
    }
  }
  cerrarModal() {
    this.dialogRef.close({ dismissed: true });
  }
}
