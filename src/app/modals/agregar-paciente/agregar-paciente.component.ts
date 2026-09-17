import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // 👈 AGREGAR
import { PacienteService } from '../../services/paciente.service'; 
@Component({
  selector: 'app-agregar-paciente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule
  ],
  templateUrl: './agregar-paciente.component.html',
  styleUrls: ['./agregar-paciente.component.scss'],
})
export class AgregarPacienteComponent implements OnInit {
  pacienteForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AgregarPacienteComponent>,
    private fb: FormBuilder,
    private router: Router, // 👈 AGREGAR
    private pacienteService: PacienteService // 👈 INYECTAR
  ) {
    this.pacienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      primerApellido: ['', [Validators.required, Validators.minLength(2)]],
      segundoApellido: ['', [Validators.required, Validators.minLength(2)]],
      fechaNacimiento: this.fb.group({
        dia: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
        mes: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
        año: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]]
      }),
      sexo: ['', Validators.required],
      motivoConsulta: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  ngOnInit() {}
  onClose() {
    this.dialogRef.close();
  }
  onSubmit() {
    if (this.pacienteForm.valid) {
      const pacienteData = {
        ...this.pacienteForm.value,
        fechaNacimiento: `${this.pacienteForm.value.fechaNacimiento.dia}/${this.pacienteForm.value.fechaNacimiento.mes}/${this.pacienteForm.value.fechaNacimiento.año}`
      };
      
      console.log('Datos del paciente:', pacienteData);
      // 👇 GUARDAR EN EL SERVICE
      this.pacienteService.setPaciente(pacienteData);
      
      // Cerrar modal y enviar los datos
      this.dialogRef.close(pacienteData);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.markFormGroupTouched(this.pacienteForm);
    }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
  // Método para obtener errores de validación
  getErrorMessage(fieldName: string, nestedField?: string): string {
    const field = nestedField 
      ? this.pacienteForm.get(fieldName)?.get(nestedField)
      : this.pacienteForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (field?.hasError('min') || field?.hasError('max')) {
      return 'Valor fuera del rango válido';
    }
    return '';
  }
  comenzarReceta() {
    if (this.pacienteForm.valid) {
      const pacienteData = {
        ...this.pacienteForm.value,
        fechaNacimiento: `${this.pacienteForm.value.fechaNacimiento.dia}/${this.pacienteForm.value.fechaNacimiento.mes}/${this.pacienteForm.value.fechaNacimiento.año}`
      };
      
      // Guardar en service
      this.pacienteService.setPaciente(pacienteData);
      
      // Cerrar modal
      this.dialogRef.close();
      
      // Navegar a nueva receta
      this.router.navigate(['/nuevo-diagnostico']);
    } else {
      this.markFormGroupTouched(this.pacienteForm);
    }
  }
}