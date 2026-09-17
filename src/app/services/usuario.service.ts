import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private usuarioSubject = new BehaviorSubject<{ nombre: string }>({ nombre: 'Dr(a). Fernando Ramírez' });
  usuario$ = this.usuarioSubject.asObservable();

  getUsuario() {
    return this.usuarioSubject.value;
  }

  setNombre(nombre: string) {
    this.usuarioSubject.next({ nombre });
  }
}
