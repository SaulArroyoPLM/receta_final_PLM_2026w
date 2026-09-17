import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Observable, startWith, map } from 'rxjs';
export interface EstudioLaboratorio {
  id: string;
  nombre: string;
  categoria?: string;
  descripcion?: string;
}
@Component({
  selector: 'app-buscador-estudios-laboratorio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './buscador-estudios-laboratorio.component.html',
  styleUrls: ['./buscador-estudios-laboratorio.component.scss']
})
export class BuscadorEstudiosLaboratorioComponent {
  @Input() label: string = 'Buscar estudio de laboratorio';
  @Input() placeholder: string = 'Ej. Hemograma, Glucosa, Perfil lipídico';
  @Input() required: boolean = false;
  @Input() hint?: string;
  @Input() estudiosDisponibles: EstudioLaboratorio[] = [];
  @Input() mostrarCategoria: boolean = true;
  @Input() chipColor: string = 'primary';
  @Input() disabled: boolean = false;
  @Output() estudiosSeleccionadosChange = new EventEmitter<EstudioLaboratorio[]>();
  estudioControl = new FormControl('');
  estudiosFiltrados!: Observable<EstudioLaboratorio[]>;
  estudiosSeleccionados: EstudioLaboratorio[] = [];
  ngOnInit() {
    this.estudiosFiltrados = this.estudioControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filtrarEstudios(value || ''))
    );
  }
  private _filtrarEstudios(value: string): EstudioLaboratorio[] {
    const filtro = value.toLowerCase();
    return this.estudiosDisponibles.filter(estudio =>
      estudio.nombre.toLowerCase().includes(filtro)
    );
  }
  seleccionarEstudio(estudio: EstudioLaboratorio) {
    const yaExiste = this.estudiosSeleccionados.some(e => e.id === estudio.id);
    if (!yaExiste) {
      this.estudiosSeleccionados.push(estudio);
      this.estudiosSeleccionadosChange.emit(this.estudiosSeleccionados);
    }
    this.estudioControl.setValue('');
  }
  removerEstudio(estudio: EstudioLaboratorio) {
    this.estudiosSeleccionados = this.estudiosSeleccionados.filter(e => e.id !== estudio.id);
    this.estudiosSeleccionadosChange.emit(this.estudiosSeleccionados);
  }
  displayFn(estudio: EstudioLaboratorio): string {
    return estudio && estudio.nombre ? estudio.nombre : '';
  }
  tieneSelecciones(): boolean {
    return this.estudiosSeleccionados.length > 0;
  }
}
