import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthMockService } from './auth-mock.service';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private usuarioSubject = new BehaviorSubject<{ nombre: string }>({ nombre: 'Dr(a). Fernando Ramírez' });
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private authMock: AuthMockService) {
    this.authMock.currentUser$.subscribe(user => {
      if (user) {
        const nombreCompleto = `${user.nombre} ${user.primerApellido} ${user.segundoApellido}`.trim();
        this.usuarioSubject.next({ nombre: nombreCompleto });
      } else {
        this.usuarioSubject.next({ nombre: 'Dr(a). Fernando Ramírez' });
      }
    });
  }

  getUsuario() {
    return this.usuarioSubject.value;
  }

  setNombre(nombre: string) {
    this.usuarioSubject.next({ nombre });
  }
}
