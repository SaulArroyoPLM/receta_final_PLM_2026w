import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';

// ==========================================
// INTERFACES
// ==========================================

export interface UsuarioRegistro {
  nombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: Date;
  estado: string;
  celular: string;
  correo: string;
  contrasena: string;
  cedula_profesional: string;
  especialidad_medica: string;
  institucion: string;
  consultorio: string;
  direccion: string;
  telconsultorio: string;
  fechaRegistro?: Date;
  emailVerificado?: boolean;
  kycCompletado?: boolean;
}

export interface UsuarioAutenticado {
  id: string;
  nombreCompleto: string;
  nombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido: string;
  correo: string;
  especialidad: string;
  cedula: string;
  emailVerificado: boolean;
  kycCompletado: boolean;
  token: string;
  especialidad_medica?: string;
}

export interface LoginCredentials {
  correo: string;
  contrasena: string;
}

// Nueva interfaz para validación SEP
export interface ValidacionCedulaSEP {
  success: boolean;
  mensaje: string;
  datosSEP?: {
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    fechaNacimiento: string;
    cedula: string;
    titulo: string;
    institucion: string;
    fechaExpedicion: string;
  };
  errores?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthMockService {
  // BehaviorSubject para el usuario autenticado
  private currentUserSubject = new BehaviorSubject<UsuarioAutenticado | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Simulación de base de datos
  private usuariosRegistrados: Map<string, UsuarioRegistro> = new Map();
  private codigosVerificacion: Map<string, string> = new Map();

  // URL del servicio SEP (reemplaza con la URL real)
  private readonly SEP_API_URL = 'https://www.cedulaprofesional.sep.gob.mx/cedula/buscaCedula.action';

  constructor(private http: HttpClient) {
    this.cargarUsuarioGuardado();
    this.agregarUsuarioPrueba();
  }

  // ==========================================
  // 🎯 VALIDACIÓN DE CÉDULA PROFESIONAL CON SEP
  // ==========================================

  /**
   * Valida la cédula profesional contra el servicio de la SEP
   * Verifica que nombre, apellidos y fecha de nacimiento coincidan
   */
  validarCedulaProfesionalSEP(
    cedula: string,
    nombre: string,
    primerApellido: string,
    segundoApellido: string,
    fechaNacimiento: Date | null = null
  ): Observable<ValidacionCedulaSEP> {
    console.log('🔍 Validando cédula profesional con SEP:', cedula);

    // En desarrollo, usar mock
    if (this.esEntornoDesarrollo()) {
      return this.validarCedulaMock(cedula, nombre, primerApellido, segundoApellido, fechaNacimiento);
    }

    // En producción, llamar al servicio real de la SEP
    return this.consultarServicioSEP(cedula).pipe(
      map(datosSEP => {
        return this.compararDatosConSEP(
          datosSEP,
          nombre,
          primerApellido,
          segundoApellido,
          fechaNacimiento
        );
      }),
      catchError(error => {
        console.error('❌ Error al consultar SEP:', error);
        return of({
          success: false,
          mensaje: 'No se pudo verificar la cédula. Intenta nuevamente.',
          errores: ['Error de conexión con el servicio de la SEP']
        });
      })
    );
  }

  /**
   * Consulta el servicio real de la SEP
   */
  private consultarServicioSEP(cedula: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = `idCedula=${cedula}`;

    return this.http.post(this.SEP_API_URL, body, { headers }).pipe(
      delay(1000) // Simular latencia de red
    );
  }

  /**
   * Compara los datos ingresados con los datos de la SEP
   */
  private compararDatosConSEP(
    datosSEP: any,
    nombre: string,
    primerApellido: string,
    segundoApellido: string,
    fechaNacimiento: Date | null = null
  ): ValidacionCedulaSEP {
    const errores: string[] = [];

    // Normalizar textos para comparación (sin acentos, mayúsculas)
    const normalizarTexto = (texto: string) => {
      return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .trim();
    };

    const nombreNormalizado = normalizarTexto(nombre);
    const primerApellidoNormalizado = normalizarTexto(primerApellido);
    const segundoApellidoNormalizado = normalizarTexto(segundoApellido);

    const nombreSEP = normalizarTexto(datosSEP.nombre);
    const primerApellidoSEP = normalizarTexto(datosSEP.primerApellido);
    const segundoApellidoSEP = normalizarTexto(datosSEP.segundoApellido);

    // Validar nombre
    if (nombreNormalizado !== nombreSEP) {
      errores.push(`El nombre no coincide. SEP: "${datosSEP.nombre}"`);
    }

    // Validar primer apellido
    if (primerApellidoNormalizado !== primerApellidoSEP) {
      errores.push(`El primer apellido no coincide. SEP: "${datosSEP.primerApellido}"`);
    }

    // Validar segundo apellido
    if (segundoApellidoNormalizado !== segundoApellidoSEP) {
      errores.push(`El segundo apellido no coincide. SEP: "${datosSEP.segundoApellido}"`);
    }

    // Validar fecha de nacimiento (solo si se proporciona)
    if (fechaNacimiento) {
      const fechaNacimientoStr = this.formatearFecha(fechaNacimiento);
      if (fechaNacimientoStr !== datosSEP.fechaNacimiento) {
        errores.push(`La fecha de nacimiento no coincide. SEP: "${datosSEP.fechaNacimiento}"`);
      }
    }

    // Resultado
    if (errores.length === 0) {
      return {
        success: true,
        mensaje: '✅ Cédula profesional validada correctamente',
        datosSEP: {
          nombre: datosSEP.nombre,
          primerApellido: datosSEP.primerApellido,
          segundoApellido: datosSEP.segundoApellido,
          fechaNacimiento: datosSEP.fechaNacimiento,
          cedula: datosSEP.cedula,
          titulo: datosSEP.titulo,
          institucion: datosSEP.institucion,
          fechaExpedicion: datosSEP.fechaExpedicion
        }
      };
    } else {
      return {
        success: false,
        mensaje: '❌ Los datos no coinciden con la cédula profesional',
        errores
      };
    }
  }

  /**
   * Mock para desarrollo - Simula la respuesta de la SEP
   * Base de datos simulada de cédulas profesionales
   */
  private getCedulasMockSEP(): Map<string, any> {
    const cedulasSEP = new Map();
    
    // Cédula 1: Datos del usuario de prueba
    cedulasSEP.set('12345678', {
      nombre: 'Saul',
      primerApellido: 'Arroyo',
      segundoApellido: 'Pozos',
      fechaNacimiento: '11/06/1997',
      cedula: '12345678',
      titulo: 'Cirugía General',
      institucion: 'UNAM',
      fechaExpedicion: '2010-06-15'
    });

    // Cédula 2: Datos de ejemplo
    cedulasSEP.set('87654321', {
      nombre: 'MARIA',
      primerApellido: 'GONZALEZ',
      segundoApellido: 'LOPEZ',
      fechaNacimiento: '20/03/1990',
      cedula: '87654321',
      titulo: 'Médico General',
      institucion: 'IPN',
      fechaExpedicion: '2015-08-20'
    });

    // Cédula 3: Otro ejemplo
    cedulasSEP.set('11111111', {
      nombre: 'JUAN',
      primerApellido: 'PEREZ',
      segundoApellido: 'MARTINEZ',
      fechaNacimiento: '10/12/1988',
      cedula: '11111111',
      titulo: 'Pediatría',
      institucion: 'UAM',
      fechaExpedicion: '2012-05-10'
    });

    return cedulasSEP;
  }

  /**
   * Mock para desarrollo - Simula la respuesta de la SEP con validación real
   */
  private validarCedulaMock(
    cedula: string,
    nombre: string,
    primerApellido: string,
    segundoApellido: string,
    fechaNacimiento: Date | null = null
  ): Observable<ValidacionCedulaSEP> {
    return new Observable(observer => {
      setTimeout(() => {
        console.log('🧪 Usando validación MOCK para desarrollo');
        console.log('📋 Datos ingresados:', { cedula, nombre, primerApellido, segundoApellido, fechaNacimiento });

        // Obtener base de datos simulada de cédulas
        const cedulasSEP = this.getCedulasMockSEP();
        const datosSEP = cedulasSEP.get(cedula);

        // Si la cédula no existe en la base de datos simulada
        if (!datosSEP) {
          observer.next({
            success: false,
            mensaje: '❌ La cédula profesional no se encuentra registrada en la SEP',
            errores: ['La cédula profesional no existe en el sistema de la SEP']
          });
          observer.complete();
          return;
        }

        // Comparar datos usando la misma lógica que el servicio real
        const resultadoValidacion = this.compararDatosConSEP(
          datosSEP,
          nombre,
          primerApellido,
          segundoApellido,
          fechaNacimiento
        );

        // Agregar marca de MOCK al mensaje
        if (resultadoValidacion.success) {
          resultadoValidacion.mensaje = '✅ Cédula profesional validada correctamente (MOCK)';
        } else {
          resultadoValidacion.mensaje = '❌ Los datos no coinciden con la cédula profesional (MOCK)';
        }

        observer.next(resultadoValidacion);
        observer.complete();
      }, 1500); // Simular latencia
    });
  }

  /**
   * Formatear fecha a formato DD/MM/YYYY
   */
  private formatearFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  /**
   * Detectar si estamos en desarrollo
   */
  private esEntornoDesarrollo(): boolean {
    return !window.location.hostname.includes('produccion.com');
  }

  // ==========================================
  // MÉTODOS EXISTENTES (sin cambios)
  // ==========================================

  private cargarUsuarioGuardado(): void {
    const usuarioGuardado = localStorage.getItem('currentUser');
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        this.currentUserSubject.next(usuario);
      } catch (error) {
        console.error('Error al cargar usuario guardado:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  private agregarUsuarioPrueba(): void {
    const usuariosPrueba: UsuarioRegistro[] = [
      {
        nombre: 'Ramiro',
        segundoNombre: 'Fernando',
        primerApellido: 'Fernandez',
        segundoApellido: 'Ledezma',
        fechaNacimiento: new Date('1985-05-15'),
        estado: 'Ciudad de México',
        celular: '5512345678',
        correo: 'doctor@ejemplo.com',
        contrasena: 'Password123!',
        cedula_profesional: '12345678',
        especialidad_medica: 'Pediatría',
        institucion: 'UNAM',
        consultorio: 'Consultorio Médico Ejemplo',
        direccion: 'Av. Insurgentes Sur 123, Col. Roma',
        telconsultorio: '5587654321',
        fechaRegistro: new Date(),
        emailVerificado: true,
        kycCompletado: true
      },
      {
        nombre: 'Maria',
        segundoNombre: '',
        primerApellido: 'Gonzalez',
        segundoApellido: 'Lopez',
        fechaNacimiento: new Date('1990-03-20'),
        estado: 'Ciudad de México',
        celular: '5587654322',
        correo: 'maria@ejemplo.com',
        contrasena: 'Password123!',
        cedula_profesional: '87654321',
        especialidad_medica: 'Médico General',
        institucion: 'IPN',
        consultorio: 'Consultorio María Ejemplo',
        direccion: 'Av. Reforma 456, Col. Centro',
        telconsultorio: '5587654322',
        fechaRegistro: new Date(),
        emailVerificado: true,
        kycCompletado: true
      },
      {
        nombre: 'Juan',
        segundoNombre: '',
        primerApellido: 'Perez',
        segundoApellido: 'Martinez',
        fechaNacimiento: new Date('1988-12-10'),
        estado: 'Ciudad de México',
        celular: '5587654323',
        correo: 'juan@ejemplo.com',
        contrasena: 'Password123!',
        cedula_profesional: '11111111',
        especialidad_medica: 'Pediatría',
        institucion: 'UAM',
        consultorio: 'Consultorio Juan Ejemplo',
        direccion: 'Av. Chapultepec 789, Col. Condesa',
        telconsultorio: '5587654323',
        fechaRegistro: new Date(),
        emailVerificado: true,
        kycCompletado: true
      }
    ];

    usuariosPrueba.forEach(u => this.usuariosRegistrados.set(u.correo.toLowerCase(), u));
    console.log('👥 Usuarios de prueba cargados:', usuariosPrueba.map(u => `${u.correo} (${u.cedula_profesional})`).join(', '));
  }

  private guardarUsuario(usuario: UsuarioAutenticado): void {
    localStorage.setItem('currentUser', JSON.stringify(usuario));
  }

  registrarUsuario(datos: UsuarioRegistro): Observable<{ success: boolean; mensaje: string; userId?: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const correoLower = datos.correo.toLowerCase();
        
        if (this.usuariosRegistrados.has(correoLower)) {
          observer.next({
            success: false,
            mensaje: 'Este correo electrónico ya está registrado'
          });
          observer.complete();
          return;
        }

        const nuevoUsuario: UsuarioRegistro = {
          ...datos,
          fechaRegistro: new Date(),
          emailVerificado: false,
          kycCompletado: false
        };
        
        this.usuariosRegistrados.set(correoLower, nuevoUsuario);
        
        const codigo = this.generarCodigoVerificacion();
        this.codigosVerificacion.set(correoLower, codigo);
        
        console.log(`📧 Código de verificación para ${correoLower}: ${codigo}`);
        
        observer.next({
          success: true,
          mensaje: 'Usuario registrado exitosamente. Revisa tu correo para el código de verificación.',
          userId: correoLower
        });
        observer.complete();
      }, 1000);
    });
  }

  private generarCodigoVerificacion(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  verificarCodigoEmail(correo: string, codigo: string): Observable<{ success: boolean; mensaje: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const correoLower = correo.toLowerCase();
        const codigoGuardado = this.codigosVerificacion.get(correoLower);
        
        if (!codigoGuardado) {
          observer.next({
            success: false,
            mensaje: 'No se encontró un código de verificación para este correo'
          });
          observer.complete();
          return;
        }

        if (codigoGuardado !== codigo) {
          observer.next({
            success: false,
            mensaje: 'Código de verificación incorrecto'
          });
          observer.complete();
          return;
        }

        const usuario = this.usuariosRegistrados.get(correoLower);
        if (usuario) {
          usuario.emailVerificado = true;
          this.usuariosRegistrados.set(correoLower, usuario);
        }

        this.codigosVerificacion.delete(correoLower);

        observer.next({
          success: true,
          mensaje: 'Email verificado exitosamente'
        });
        observer.complete();
      }, 800);
    });
  }

  reenviarCodigoEmail(correo: string): Observable<{ success: boolean; mensaje: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const correoLower = correo.toLowerCase();
        const usuario = this.usuariosRegistrados.get(correoLower);
        
        if (!usuario) {
          observer.next({
            success: false,
            mensaje: 'Usuario no encontrado'
          });
          observer.complete();
          return;
        }

        const nuevoCodigo = this.generarCodigoVerificacion();
        this.codigosVerificacion.set(correoLower, nuevoCodigo);
        
        console.log(`📧 Nuevo código de verificación para ${correoLower}: ${nuevoCodigo}`);

        observer.next({
          success: true,
          mensaje: 'Código reenviado exitosamente'
        });
        observer.complete();
      }, 800);
    });
  }

  actualizarDatosProfesionales(
    correo: string, 
    datosProfesionales: Partial<UsuarioRegistro>
  ): Observable<{ success: boolean; mensaje: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const correoLower = correo.toLowerCase();
        const usuario = this.usuariosRegistrados.get(correoLower);
        
        if (!usuario) {
          observer.next({
            success: false,
            mensaje: 'Usuario no encontrado'
          });
          observer.complete();
          return;
        }

        Object.assign(usuario, datosProfesionales);
        this.usuariosRegistrados.set(correoLower, usuario);

        observer.next({
          success: true,
          mensaje: 'Datos profesionales actualizados'
        });
        observer.complete();
      }, 800);
    });
  }

  completarVerificacionKYC(
    correo: string, 
    documentoINE: boolean, 
    verificacionFacial: boolean
  ): Observable<{ success: boolean; mensaje: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const correoLower = correo.toLowerCase();
        const usuario = this.usuariosRegistrados.get(correoLower);
        
        if (!usuario) {
          observer.next({
            success: false,
            mensaje: 'Usuario no encontrado'
          });
          observer.complete();
          return;
        }

        usuario.kycCompletado = documentoINE && verificacionFacial;
        this.usuariosRegistrados.set(correoLower, usuario);

        observer.next({
          success: true,
          mensaje: 'Verificación KYC completada'
        });
        observer.complete();
      }, 1000);
    });
  }

  finalizarRegistro(correo: string): Observable<{ success: boolean; usuario: UsuarioAutenticado }> {
    return new Observable(observer => {
      setTimeout(() => {
        const correoLower = correo.toLowerCase();
        const usuario = this.usuariosRegistrados.get(correoLower);
        
        if (!usuario) {
          observer.error({ success: false, mensaje: 'Usuario no encontrado' });
          return;
        }

        const usuarioAutenticado = this.crearUsuarioAutenticado(usuario);
        
        this.guardarUsuario(usuarioAutenticado);
        this.currentUserSubject.next(usuarioAutenticado);

        observer.next({
          success: true,
          usuario: usuarioAutenticado
        });
        observer.complete();
      }, 500);
    });
  }

  login(credentials: LoginCredentials): Observable<{ success: boolean; usuario?: UsuarioAutenticado; mensaje?: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const correoLower = credentials.correo.toLowerCase();
        const usuario = this.usuariosRegistrados.get(correoLower);
        
        if (!usuario) {
          observer.next({
            success: false,
            mensaje: 'Correo o contraseña incorrectos'
          });
          observer.complete();
          return;
        }

        if (usuario.contrasena !== credentials.contrasena) {
          observer.next({
            success: false,
            mensaje: 'Correo o contraseña incorrectos'
          });
          observer.complete();
          return;
        }

        const usuarioAutenticado = this.crearUsuarioAutenticado(usuario);
        
        this.guardarUsuario(usuarioAutenticado);
        this.currentUserSubject.next(usuarioAutenticado);

        observer.next({
          success: true,
          usuario: usuarioAutenticado
        });
        observer.complete();
      }, 1000);
    });
  }

  private crearUsuarioAutenticado(usuario: UsuarioRegistro): UsuarioAutenticado {
    return {
      id: usuario.correo,
      nombreCompleto: `${usuario.nombre} ${usuario.segundoNombre} ${usuario.primerApellido} ${usuario.segundoApellido}`,
      nombre: usuario.nombre,
      segundoNombre: usuario.segundoNombre,
      primerApellido: usuario.primerApellido,
      segundoApellido: usuario.segundoApellido,
      correo: usuario.correo,
      especialidad: usuario.especialidad_medica,
      especialidad_medica: usuario.especialidad_medica,
      cedula: usuario.cedula_profesional,
      emailVerificado: usuario.emailVerificado || false,
      kycCompletado: usuario.kycCompletado || false,
      token: this.generarToken()
    };
  }

  private generarToken(): string {
    return 'mock-token-' + Math.random().toString(36).substring(2, 15);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): UsuarioAutenticado | null {
    return this.currentUserSubject.value;
  }

  getUsuarioRegistrado(correo: string): UsuarioRegistro | undefined {
    return this.usuariosRegistrados.get(correo.toLowerCase());
  }

  getCodigoVerificacion(correo: string): string | undefined {
    return this.codigosVerificacion.get(correo.toLowerCase());
  }
}