import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-recordar-contrasena',
  standalone: true,
  templateUrl: './recordar-contrasena.component.html',
  styleUrls: ['./recordar-contrasena.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class RecordarContrasenaComponent {
  recordarForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RecordarContrasenaComponent>
  ) {
    this.recordarForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
    });
  }
  recordar() {
    if (this.recordarForm.invalid) {
      this.recordarForm.markAllAsTouched();
      return;
    }
    const email = this.recordarForm.value.correo;
    alert(`Ya se envió un enlace a tu correo (${email}). Revisa tu bandeja de entrada.`);
    this.dialogRef.close();
  }
  cancelar() {
    this.dialogRef.close();
  }
}
