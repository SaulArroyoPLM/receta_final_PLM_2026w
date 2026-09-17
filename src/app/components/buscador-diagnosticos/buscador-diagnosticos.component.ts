import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Diagnostico {
  id: string;
  nombre: string;
  cie10: string;
  descripcion?: string;
  categoria?: string;
}


@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  selector: 'app-buscador-diagnosticos',
  templateUrl: './buscador-diagnosticos.component.html',
  styleUrls: ['./buscador-diagnosticos.component.scss'],
})
export class BuscadorDiagnosticosComponent  implements OnInit {

  // nuevo-diagnostico.page.ts
listaDiagnosticos: Diagnostico[] = [
  { id: '1', nombre: 'Migraña', cie10: 'G43', descripcion: 'Dolor de cabeza recurrente', categoria: 'Neurología' },
  { id: '2', nombre: 'Diarrea Tipo A', cie10: 'A09', descripcion: 'Diarrea infecciosa aguda', categoria: 'Gastroenterología' },
  { id: '3', nombre: 'Hipertensión', cie10: 'I10', descripcion: 'Presión arterial elevada', categoria: 'Cardiología' },
  { id: '4', nombre: 'Asma', cie10: 'J45', descripcion: 'Enfermedad respiratoria crónica', categoria: 'Neumología' },
  { id: '5', nombre: 'Diabetes Tipo 2', cie10: 'E11', descripcion: 'Alteración de glucosa', categoria: 'Endocrinología' },
];


  // ========== INPUTS ==========
  
  @Input() diagnosticosDisponibles: Diagnostico[] = [];
  @Input() diagnosticosPreseleccionados: Diagnostico[] = [];
  @Input() placeholder: string = 'Buscar diagnóstico...';
  @Input() label: string = 'Diagnósticos';
  @Input() hint: string = 'Busca por nombre o código CIE-10';
  @Input() multipleSeleccion: boolean = true;
  @Input() maxSelecciones?: number;
  @Input() mostrarCategoria: boolean = false;
  @Input() mostrarResumen: boolean = true;
  @Input() chipColor: 'primary' | 'secondary' | 'success' | 'warning' = 'primary';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() appearance: 'outline' | 'fill' = 'outline';
  @Input() mostrarBotonGuardar: boolean = false;
  @Input() textoBotonGuardar: string = 'Guardar Diagnósticos';
  
  // ========== OUTPUTS ==========
  
  @Output() diagnosticosSeleccionadosChange = new EventEmitter<Diagnostico[]>();
  @Output() onSeleccionar = new EventEmitter<Diagnostico>();
  @Output() onRemover = new EventEmitter<Diagnostico>();
  @Output() onGuardar = new EventEmitter<Diagnostico[]>();
  @Output() onChange = new EventEmitter<Diagnostico[]>();
  
  // ========== VARIABLES INTERNAS ==========
  
  diagnosticoControl = new FormControl('');
  diagnosticosSeleccionados: Diagnostico[] = [];
  diagnosticosFiltrados!: Observable<Diagnostico[]>;

  ngOnInit() {
    this._inicializarFiltrado();
    
    // Si hay preseleccionados, cargarlos
    if (this.diagnosticosPreseleccionados?.length > 0) {
      this.diagnosticosSeleccionados = [...this.diagnosticosPreseleccionados];
    }

    // Deshabilitar si es necesario
    if (this.disabled) {
      this.diagnosticoControl.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Actualizar cuando cambien los datos disponibles
    if (changes['diagnosticosDisponibles']) {
      this._inicializarFiltrado();
    }

    // Actualizar cuando cambien los preseleccionados
    if (changes['diagnosticosPreseleccionados'] && !changes['diagnosticosPreseleccionados'].firstChange) {
      this.diagnosticosSeleccionados = [...this.diagnosticosPreseleccionados];
    }

    // Manejar cambio de disabled
    if (changes['disabled']) {
      if (this.disabled) {
        this.diagnosticoControl.disable();
      } else {
        this.diagnosticoControl.enable();
      }
    }
  }

  private _inicializarFiltrado() {
    this.diagnosticosFiltrados = this.diagnosticoControl.valueChanges.pipe(
      startWith(''),
      map(valor => this._filtrarDiagnosticos(valor || ''))
    );
  }

  private _filtrarDiagnosticos(valor: string | Diagnostico): Diagnostico[] {
    if (typeof valor !== 'string') {
      return this.diagnosticosDisponibles;
    }

    const filtro = valor.toLowerCase().trim();
    
    if (!filtro) {
      return this.diagnosticosDisponibles.filter(d => 
        !this.diagnosticosSeleccionados.find(sel => sel.id === d.id)
      );
    }

    return this.diagnosticosDisponibles.filter(diagnostico => {
      const nombreCoincide = diagnostico.nombre.toLowerCase().includes(filtro);
      const cieCoincide = diagnostico.cie10.toLowerCase().includes(filtro);
      const categoriaCoincide = diagnostico.categoria?.toLowerCase().includes(filtro);
      const noEstaSeleccionado = !this.diagnosticosSeleccionados.find(
        d => d.id === diagnostico.id
      );
      
      return (nombreCoincide || cieCoincide || categoriaCoincide) && noEstaSeleccionado;
    });
  }

  seleccionarDiagnostico(diagnostico: Diagnostico) {
    // Verificar límite de selecciones
    if (this.maxSelecciones && this.diagnosticosSeleccionados.length >= this.maxSelecciones) {
      // Puedes emitir un evento de error o mostrar toast
      console.warn(`Máximo ${this.maxSelecciones} diagnósticos permitidos`);
      return;
    }

    // Si no es múltiple, limpiar selección anterior
    if (!this.multipleSeleccion) {
      this.diagnosticosSeleccionados = [];
    }

    // Verificar que no esté ya seleccionado
    const yaExiste = this.diagnosticosSeleccionados.find(
      d => d.id === diagnostico.id
    );

    if (!yaExiste) {
      this.diagnosticosSeleccionados.push(diagnostico);
      this._emitirCambios(diagnostico, 'seleccionar');
    }

    // Limpiar el input
    this.diagnosticoControl.setValue('');
  }

  removerDiagnostico(diagnostico: Diagnostico) {
    const index = this.diagnosticosSeleccionados.findIndex(
      d => d.id === diagnostico.id
    );
    
    if (index >= 0) {
      this.diagnosticosSeleccionados.splice(index, 1);
      this._emitirCambios(diagnostico, 'remover');
    }
  }

  limpiarTodo() {
    this.diagnosticosSeleccionados = [];
    this.diagnosticoControl.setValue('');
    this._emitirCambios(null, 'limpiar');
  }

  private _emitirCambios(diagnostico: Diagnostico | null, accion: 'seleccionar' | 'remover' | 'limpiar') {
    // Emitir el array actualizado
    this.diagnosticosSeleccionadosChange.emit([...this.diagnosticosSeleccionados]);
    this.onChange.emit([...this.diagnosticosSeleccionados]);

    // Emitir eventos específicos
    if (accion === 'seleccionar' && diagnostico) {
      this.onSeleccionar.emit(diagnostico);
    } else if (accion === 'remover' && diagnostico) {
      this.onRemover.emit(diagnostico);
    }
  }

  displayFn(diagnostico: Diagnostico): string {
    return diagnostico ? diagnostico.nombre : '';
  }

  guardarDiagnosticos() {
    this.onGuardar.emit([...this.diagnosticosSeleccionados]);
  }

  // ========== MÉTODOS PÚBLICOS PARA USO EXTERNO ==========
  
  /**
   * Obtener diagnósticos seleccionados
   */
  obtenerSeleccionados(): Diagnostico[] {
    return [...this.diagnosticosSeleccionados];
  }

  /**
   * Establecer diagnósticos seleccionados programáticamente
   */
  establecerSeleccionados(diagnosticos: Diagnostico[]) {
    this.diagnosticosSeleccionados = [...diagnosticos];
    this._emitirCambios(null, 'limpiar');
  }

  /**
   * Validar si hay selecciones
   */
  tieneSelecciones(): boolean {
    return this.diagnosticosSeleccionados.length > 0;
  }

  /**
   * Validar si cumple con requerimientos
   */
  esValido(): boolean {
    if (this.required) {
      return this.diagnosticosSeleccionados.length > 0;
    }
    return true;
  }

}
