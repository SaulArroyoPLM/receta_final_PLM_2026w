// nueva-receta.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AgregarPacienteComponent } from '../agregar-paciente/agregar-paciente.component';
import {BuscadorPacienteComponent} from '../buscador-paciente/buscador-paciente.component';

@Component({
  selector: 'app-nueva-receta',
  standalone: true,
imports: [
    CommonModule, 
    MatDialogModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
  ],
  templateUrl: './nueva-receta.component.html',
  styleUrls: ['./nueva-receta.component.scss'],
})
export class NuevaRecetaComponent implements OnInit {
  
  constructor( 
    public dialogRef: MatDialogRef<NuevaRecetaComponent>,
     private dialog: MatDialog,
      private router: Router   // 👈 agregar
  ) {}
  ngOnInit() {}
    onNewPatient() {
    // Cerrar el modal actual
    this.dialogRef.close();
    
    // Abrir el modal de agregar paciente
    const agregarPacienteRef = this.dialog.open(AgregarPacienteComponent, {
      width: '700px',
      maxWidth: '90vw',
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });
    
 agregarPacienteRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Nuevo paciente creado:', result);
      // Navegar al nuevo diagnóstico con el paciente recién creado
      this.router.navigate(['/nuevo-diagnostico'], {
        state: { paciente: result }
      });
    }
  });
    
  }

  onSearchPatient() {
  this.dialogRef.close(); // cierro el modal de "Nueva receta"
  
  const dialogRef = this.dialog.open(BuscadorPacienteComponent, {
    width: '700px',
    maxWidth: '90vw',
    disableClose: false,
    panelClass: 'custom-dialog-container'
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Paciente seleccionado:', result);
      // 🚀 Aquí navegamos al nuevo diagnóstico
      this.router.navigate(['/nuevo-diagnostico'], {
        state: { paciente: result }
      });
    }
  });
}

  onClose() {
    this.dialogRef.close();
  }
}
