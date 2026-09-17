import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Alergias {
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
    MatIconModule,
  ],
  selector: 'app-buscador-alergias',
  templateUrl: './buscador-alergias.component.html',
  styleUrls: ['./buscador-alergias.component.scss'],
})
export class BuscadorAlergiasComponent implements OnInit, OnChanges {
  // ========== DATOS DE PRUEBA ==========
  listaAlergias: Alergias[] = [
    { id: '1', nombre: 'Polen', cie10: 'T78.4', descripcion: 'Reacción al polen', categoria: 'Respiratoria' },
    { id: '2', nombre: 'Penicilina', cie10: 'T36.0', descripcion: 'Reacción al antibiótico', categoria: 'Medicamentos' },
    { id: '3', nombre: 'Mariscos', cie10: 'T78.1', descripcion: 'Reacción alimentaria', categoria: 'Alimentos' },
    { id: '4', nombre: 'Ácaros', cie10: 'T78.4', descripcion: 'Reacción ambiental', categoria: 'Dermatología' },
    { id: '5', nombre: 'Látex', cie10: 'T78.4', descripcion: 'Reacción por contacto', categoria: 'Dermatología' },
  ];

  // ========== INPUTS ==========
  @Input() alergiasDisponibles: Alergias[] = [];
  @Input() alergiasPreseleccionadas: Alergias[] = [];
  @Input() placeholder: string = 'Buscar alergia...';
  @Input() label: string = 'Alergias';
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
  @Input() textoBotonGuardar: string = 'Guardar Alergias';

  // ========== OUTPUTS ==========
  @Output() alergiasSeleccionadasChange = new EventEmitter<Alergias[]>();
  @Output() onSeleccionar = new EventEmitter<Alergias>();
  @Output() onRemover = new EventEmitter<Alergias>();
  @Output() onGuardar = new EventEmitter<Alergias[]>();
  @Output() onChange = new EventEmitter<Alergias[]>();

  // ========== VARIABLES INTERNAS ==========
  alergiaControl = new FormControl('');
  alergiasSeleccionadas: Alergias[] = [];
  alergiasFiltradas!: Observable<Alergias[]>;

  // ========== CICLO DE VIDA ==========
  ngOnInit() {
    this._inicializarFiltrado();

    if (this.alergiasPreseleccionadas?.length > 0) {
      this.alergiasSeleccionadas = [...this.alergiasPreseleccionadas];
    }

    if (this.disabled) {
      this.alergiaControl.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['alergiasDisponibles']) {
      this._inicializarFiltrado();
    }

    if (changes['alergiasPreseleccionadas'] && !changes['alergiasPreseleccionadas'].firstChange) {
      this.alergiasSeleccionadas = [...this.alergiasPreseleccionadas];
    }

    if (changes['disabled']) {
      if (this.disabled) {
        this.alergiaControl.disable();
      } else {
        this.alergiaControl.enable();
      }
    }
  }

  // ========== LÓGICA PRINCIPAL ==========
  private _inicializarFiltrado() {
    const base = this.alergiasDisponibles?.length > 0 ? this.alergiasDisponibles : this.listaAlergias;
    this.alergiasFiltradas = this.alergiaControl.valueChanges.pipe(
      startWith(''),
      map((valor) => this._filtrarAlergias(valor || '', base))
    );
  }

  private _filtrarAlergias(valor: string | Alergias, lista: Alergias[]): Alergias[] {
    if (typeof valor !== 'string') return lista;
    const filtro = valor.toLowerCase().trim();

    return lista.filter((a) => {
      const coincide =
        a.nombre.toLowerCase().includes(filtro) ||
        a.cie10.toLowerCase().includes(filtro) ||
        a.categoria?.toLowerCase().includes(filtro);
      const noSeleccionado = !this.alergiasSeleccionadas.find((sel) => sel.id === a.id);
      return coincide && noSeleccionado;
    });
  }

  seleccionarAlergia(alergia: Alergias) {
    if (this.maxSelecciones && this.alergiasSeleccionadas.length >= this.maxSelecciones) {
      console.warn(`Máximo ${this.maxSelecciones} alergias permitidas`);
      return;
    }

    if (!this.multipleSeleccion) {
      this.alergiasSeleccionadas = [];
    }

    const yaExiste = this.alergiasSeleccionadas.find((d) => d.id === alergia.id);
    if (!yaExiste) {
      this.alergiasSeleccionadas.push(alergia);
      this._emitirCambios(alergia, 'seleccionar');
    }

    this.alergiaControl.setValue('');
  }

  removerAlergia(alergia: Alergias) {
    const index = this.alergiasSeleccionadas.findIndex((d) => d.id === alergia.id);
    if (index >= 0) {
      this.alergiasSeleccionadas.splice(index, 1);
      this._emitirCambios(alergia, 'remover');
    }
  }

  limpiarTodo() {
    this.alergiasSeleccionadas = [];
    this.alergiaControl.setValue('');
    this._emitirCambios(null, 'limpiar');
  }

  private _emitirCambios(alergia: Alergias | null, accion: 'seleccionar' | 'remover' | 'limpiar') {
    this.alergiasSeleccionadasChange.emit([...this.alergiasSeleccionadas]);
    this.onChange.emit([...this.alergiasSeleccionadas]);

    if (accion === 'seleccionar' && alergia) this.onSeleccionar.emit(alergia);
    if (accion === 'remover' && alergia) this.onRemover.emit(alergia);
  }

  displayFn(alergia: Alergias): string {
    return alergia ? alergia.nombre : '';
  }

  guardarAlergias() {
    this.onGuardar.emit([...this.alergiasSeleccionadas]);
  }

  // ========== MÉTODOS AUXILIARES ==========
  obtenerSeleccionados(): Alergias[] {
    return [...this.alergiasSeleccionadas];
  }

  establecerSeleccionados(alergias: Alergias[]) {
    this.alergiasSeleccionadas = [...alergias];
    this._emitirCambios(null, 'limpiar');
  }

  tieneSelecciones(): boolean {
    return this.alergiasSeleccionadas.length > 0;
  }

  esValido(): boolean {
    return this.required ? this.alergiasSeleccionadas.length > 0 : true;
  }
}
