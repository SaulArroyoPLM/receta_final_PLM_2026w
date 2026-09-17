import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthMockService, UsuarioAutenticado } from '../../services/auth-mock.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doctor-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-name.component.html',
  styleUrls: ['./doctor-name.component.scss']
})
export class DoctorNameComponent implements OnInit, OnDestroy {
  @Input() showTitle: boolean = false; 
  @Input() showRole: boolean = true; 
  @Input() showEmail: boolean = true; 
  usuario: UsuarioAutenticado | null = null;
  private userSubscription: Subscription | null = null;

  constructor(private authMock: AuthMockService) {}

  ngOnInit(): void {
    this.userSubscription = this.authMock.currentUser$.subscribe({
      next: (usuario: UsuarioAutenticado | null) => {
        this.usuario = usuario;
        console.log('🔍 DEBUG - Usuario en DoctorNameComponent:', this.usuario);
      },
      error: (error: any) => {
        console.error('❌ Error al obtener usuario en DoctorNameComponent:', error);
        this.usuario = null;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getShortName(): string {
    if (!this.usuario) return 'Usuario';
    const nombres = [
      this.usuario.nombre,
      this.usuario.segundoNombre
    ].filter(n => n).join(' ').trim();
    if (!nombres) return 'Usuario';
    const partes = nombres.split(' ').filter(p => p.length > 0);
    if (partes[0]?.toLowerCase().includes('dr')) {
      return partes.length > 2 ? `${partes[1]} ${partes[2] || ''}`.trim() : partes[1] || 'Usuario';
    }
    return partes.length > 1 ? `${partes[0]} ${partes[1] || ''}`.trim() : partes[0] || 'Usuario';
  }

  getApellidos(): string {
    if (!this.usuario) return 'Apellidos';
    const apellidos = [
      this.usuario.primerApellido,
      this.usuario.segundoApellido
    ].filter(a => a).join(' ').trim();
    return apellidos || 'Apellidos';
  }

  getShortRole(): string {
    if (!this.usuario) return 'Rol';
    return this.usuario.especialidad_medica || this.usuario.especialidad || 'Rol';
  }
}