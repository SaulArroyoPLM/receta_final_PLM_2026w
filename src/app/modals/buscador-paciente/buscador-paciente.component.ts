import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
interface Paciente {
  id: number;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  edad: number;
  fechaNacimiento?: string;
  sexo?: string;
}
@Component({
  selector: 'app-buscador-paciente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './buscador-paciente.component.html',
  styleUrls: ['./buscador-paciente.component.scss'],
})
export class BuscadorPacienteComponent implements OnInit {
  searchControl = new FormControl('');
  pacientes: Paciente[] = [];
  pacientesFiltrados: Paciente[] = [];
  pacienteSeleccionado: Paciente | null = null;
  isLoading = false;
  // Estado de focus para mostrar lista general
  isFocused = false;
  // Datos de ejemplo
  pacientesData: Paciente[] = [
    { id: 1, nombre: 'Gabriela', primerApellido: 'Martinez', segundoApellido: 'Lopez', edad: 31 },
    { id: 2, nombre: 'Luis Mario', primerApellido: 'Gonzalez', segundoApellido: 'Ruiz', edad: 45 },
    { id: 3, nombre: 'Ana Sofia', primerApellido: 'Rodriguez', segundoApellido: 'Mendez', edad: 28 },
    { id: 4, nombre: 'Francisco Javier', primerApellido: 'Silva', segundoApellido: 'Herrera', edad: 35 },
    { id: 5, nombre: 'Maria Elena', primerApellido: 'Vargas', segundoApellido: 'Castro', edad: 52 }
  ];
  constructor(public dialogRef: MatDialogRef<BuscadorPacienteComponent>) {}
  ngOnInit() {
    this.pacientes = this.pacientesData;
    this.pacientesFiltrados = [];
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(searchTerm => {
        this.filtrarPacientes(searchTerm || '');
      });
  }
  filtrarPacientes(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.pacientesFiltrados = [];
      return;
    }
    const termino = searchTerm.toLowerCase().trim();
    this.pacientesFiltrados = this.pacientes.filter(paciente => {
      const nombreCompleto = `${paciente.nombre} ${paciente.primerApellido} ${paciente.segundoApellido}`.toLowerCase();
      return (
        nombreCompleto.includes(termino) ||
        paciente.nombre.toLowerCase().includes(termino) ||
        paciente.primerApellido.toLowerCase().includes(termino) ||
        paciente.segundoApellido.toLowerCase().includes(termino)
      );
    });
  }
  onPacienteSelected(paciente: Paciente) {
    this.pacienteSeleccionado = paciente;
    // Opcional: También puedes llenar el input con el nombre del paciente seleccionado
    this.searchControl.setValue(this.getNombreCompleto(paciente));
    this.isFocused = false; // Ocultar la lista después de seleccionar
  }
  onClose() {
    this.dialogRef.close();
  }
  getNombreCompleto(paciente: Paciente): string {
    return `${paciente.nombre} ${paciente.primerApellido} ${paciente.segundoApellido}`;
  }
  getEdadTexto(edad: number): string {
    return `${edad} años`;
  }
  // Focus handlers
  onFocus() {
    this.isFocused = true;
  }
  onBlur() {
    // Usar setTimeout para dar tiempo a que se registre el clic en la lista
    setTimeout(() => {
      if (!this.pacienteSeleccionado) {
        this.isFocused = false;
      }
    }, 150);
  }
  comenzarReceta() {
    this.dialogRef.close(this.pacienteSeleccionado); // 🔥 Aquí se manda al padre
  }
}