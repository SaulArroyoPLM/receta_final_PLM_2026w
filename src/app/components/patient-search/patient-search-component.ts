// patient-search-component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

interface Paciente {
  id: number;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  sexo: string;
  edad: number;
  diagnostico?: {
    header: string;
    fecha: string;
    titulo: string;
  };
}

@Component({
  selector: 'app-patient-search',
  standalone: true,
  templateUrl: './patient-search-component.html',
  styleUrls: ['./patient-search-component.scss'],
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class PatientSearchComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'primerApellido', 'segundoApellido', 'sexo', 'edad', 'acciones'];
  
  // Detectar si es móvil
  isMobile = false;
  
  // Control del acordeón
  expandedElement: Paciente | null = null;

  pacientes: Paciente[] = [
    { 
      id: 1,
      nombre: 'María Magdalena', 
      primerApellido: 'Gómez', 
      segundoApellido: 'Hernández', 
      sexo: 'F', 
      edad: 37,
      diagnostico: {
        header: 'Última receta emitida',
        fecha: '03/06/2025',
        titulo: 'Úlcera gástrica | Anemia poshemorrágica crónica',
      }
    },
    { 
      id: 2,
      nombre: 'Ramiro Fernando', 
      primerApellido: 'Gómez', 
      segundoApellido: 'Gómez', 
      sexo: 'M', 
      edad: 35,
      diagnostico: {
         header: 'Última receta emitida',
        fecha: '28/07/2025',
        titulo: 'Hipertensión arterial | Diabetes mellitus tipo 2',
      }
    },
    { 
      id: 3,
      nombre: 'Emilio Moises', 
      primerApellido: 'Hernández', 
      segundoApellido: 'Fernández', 
      sexo: 'M', 
      edad: 35,
      diagnostico: {
         header: 'Última receta emitida',
        fecha: '20/07/2025',
        titulo: 'Bronquitis aguda | Síndrome gripal',
      }
    },
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    // Detectar cambios en el breakpoint para móvil
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  getSexoLabel(sexo: string): string {
    return sexo === 'M' ? 'Masculino' : 'Femenino';
  }

  getSexoColor(sexo: string): string {
    return sexo === 'M' ? 'primary' : 'accent';
  }

  getNombreCompleto(paciente: Paciente): string {
    return `${paciente.nombre} ${paciente.primerApellido} ${paciente.segundoApellido}`;
  }

  // Funciones del acordeón para la tabla desktop
  toggleRow(element: Paciente) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  isExpanded(element: Paciente): boolean {
    return this.expandedElement === element;
  }

  // Funciones de los botones de acción
  onZoom(paciente: Paciente, event: Event) {
    event.stopPropagation();
    console.log('Zoom paciente:', paciente);
    // Aquí implementarías la lógica de zoom/vista detallada
  }

  onResurtir(paciente: Paciente, event: Event) {
    event.stopPropagation();
    console.log('Resurtir paciente:', paciente);
    // Aquí implementarías la lógica de resurtir/restaurar
  }

  onEliminar(paciente: Paciente, event: Event) {
    event.stopPropagation();
    console.log('Eliminar paciente:', paciente);
    // Aquí implementarías la lógica de eliminación
    if (confirm(`¿Estás seguro de eliminar a ${this.getNombreCompleto(paciente)}?`)) {
      const index = this.pacientes.findIndex(p => p.id === paciente.id);
      if (index > -1) {
        this.pacientes.splice(index, 1);
        // Reinicializar el dataSource si usas MatTableDataSource
      }
    }
  }

  // Función para obtener las columnas expandidas (incluye la fila de detalle)
  getDisplayedColumnsWithExpand(): string[] {
    return [...this.displayedColumns];
  }
}