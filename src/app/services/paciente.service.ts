// src/app/services/paciente.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PacienteData {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  sexo: string;
  motivoConsulta: string;
   edad?: number; // 👈 la agregas aquí (opcional con '?')
}

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private pacienteActual = new BehaviorSubject<PacienteData | null>(null);
  public paciente$ = this.pacienteActual.asObservable();

setPaciente(paciente: PacienteData) {
  // Calcular edad si hay fechaNacimiento
  if (paciente.fechaNacimiento) {
    paciente.edad = this.calcularEdad(paciente.fechaNacimiento);
  }

  this.pacienteActual.next(paciente);
  console.log('✅ Paciente guardado en service:', paciente);
}


  getPaciente(): PacienteData | null {
    return this.pacienteActual.value;
  }

  clearPaciente() {
    this.pacienteActual.next(null);
  }

    // ✅ Calcula la edad según la fecha de nacimiento
private calcularEdad(fechaNacimiento: string): number {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();

  // Obtener diferencias base
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();
  const mesNacimiento = nacimiento.getMonth();
  const diaNacimiento = nacimiento.getDate();

  // Si aún no ha pasado el cumpleaños este año, restamos 1
  if (
    mesActual < mesNacimiento ||
    (mesActual === mesNacimiento && diaActual < diaNacimiento)
  ) {
    edad--;
  }

  return edad;
}

}