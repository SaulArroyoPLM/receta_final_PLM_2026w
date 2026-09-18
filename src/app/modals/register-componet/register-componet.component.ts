import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Observable, of, EMPTY } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomStepperComponent, StepperStep } from '../../components/steper-costumer/custom-stepper.component';
import { Router } from '@angular/router';
import { AuthMockService, UsuarioRegistro } from '../../services/auth-mock.service';
export interface RegistroData {
  // Define aquí los datos que necesites pasar al dialog
}

export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-registro-dialog',
  templateUrl: './register-componet.component.html',
  styleUrls: ['./register-componet.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    CustomStepperComponent,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatExpansionModule,
    MatSnackBarModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],

})
export class RegistroDialogComponent implements OnInit, OnDestroy {
  // Formularios por pasos
  datosPersonalesForm!: FormGroup;
  verificacionEmailForm!: FormGroup;
  configuracionRecetaForm!: FormGroup;
  verificacionKYCForm!: FormGroup;
  private resizeListener?: () => void;
  // Configuración del Custom Stepper
  currentStep = 0;
  isLinear = true;
  // Propiedades para sub-pasos móviles
  mobileSubStep = 0;
  maxMobileSubSteps(): number {
    return this.currentStep === 0 || this.currentStep === 1 ? 2 : 0; // Cambiar de 2 a 1
  }
  isMobile = false;
  // Definir los pasos (solo 3 pasos)
  steps: StepperStep[] = [
    { label: 'Crear cuenta', completed: false, active: true, disabled: false },
    { label: 'Datos Profesionales', completed: false, active: false, disabled: false },
    { label: 'Verificación Email', completed: false, active: false, disabled: false },
  ];
  // Estados y variables de control
  hidePassword = true;
  isSubmitting = false;
  isResendingEmail = false;

  // Catálogos
  especialidadesMedicas: string[] = [
    'Médico General',
    'Alergología',
    'Algología',
    'Anatomía Patológica',
    'Andrología',
    'Anestesiología',
    'Angiología',
    'Audiología, Otoneurología y Foniatría',
    'Bariatría',
    'Calidad de la Atención Clínica',
    'Cardiología',
    'Cirugía General',
    'Cirugía Oncológica',
    'Cirugía Pediátrica',
    'Cirugía Plástica',
    'Coloproctología',
    'Crecimiento y Desarrollo',
    'Dermatología',
    'Diabetología',
    'Endocrinología',
    'Endoscopia',
    'Epidemiología',
    'Gastroenterología',
    'Gastroenterología Pediátrica',
    'Genética Médica',
    'Geriatría',
    'Ginecología y Obstetricia',
    'Hematología',
    'Hematología y Oncopediatría',
    'Homeopatía',
    'Imagenología Diagnóstica y Terapéutica',
    'Infectología',
    'Inmunología',
    'Medicina Crítica',
    'Medicina de la Actividad Física y Deportiva',
    'Medicina de Rehabilitación',
    'Medicina de Urgencias',
    'Medicina del Trabajo y Ambiental',
    'Medicina Familiar',
    'Medicina Intensiva',
    'Medicina Interna',
    'Medicina Legal',
    'Medicina Nuclear e Imagenología Molecular',
    'Medicina Paliativa',
    'Medicina Preventiva',
    'Nefrología',
    'Neonatología',
    'Neumología',
    'Neumología y Cardiopediatría',
    'Neurocirugía',
    'Neurología',
    'Oftalmología',
    'Oncología',
    'Otorrinolaringología y Cirugía de Cabeza y Cuello',
    'Patología Clínica',
    'Pediatría',
    'Pediatría Dermatológica',
    'Proctología',
    'Psiquiatría',
    'Radio Oncología',
    'Reumatología',
    'Terapia Intensiva',
    'Traumatología y Ortopedia',
    'Urología',
  ];

  filteredEspecialidades!: Observable<string[]>;
  // Mock data para autocompletado de consultorios (simula API de Google Places)
  private consultoriosMock: { [key: string]: string } = {
    'RMS: Consultorio de medicina general': 'Petén 471, Vértiz Narvarte, Benito Juárez, 03600 Ciudad de México, CDMX',
    'Consultorio Dr. García': 'Av. Insurgentes Sur 1234, Del Valle, 03100 Ciudad de México, CDMX',
    'Centro Médico ABC': 'Av. Carlos Graef Fernández 154, Santa Fe, 05300 Ciudad de México, CDMX',
    'Clínica Santa María': 'Av. Revolución 456, San Ángel, 01000 Ciudad de México, CDMX'
  };
  // Variable para controlar auto-completado de cédula
  private isAutoCompleting = false;
  // Variables de verificación
  emailVerificationCode: string | null = null;
  verificationCode: string = '';
  error: string | null = null;

  correoUsuarioRegistrado = '';
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private authMock: AuthMockService,
    private router: Router,
    public dialogRef: MatDialogRef<RegistroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegistroData
  ) {
    this.initializeForms();
  }
  ngOnInit() {
    this.setupMobileDetection();
    this.filteredEspecialidades = this.configuracionRecetaForm.get('especialidad_medica')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEspecialidades(value || '')),
    );
    // Auto-completar campos cuando se ingrese la cédula profesional
    this.setupAutoCompleteCedula();
    // Auto-completar dirección cuando se ingrese el nombre del consultorio
    this.setupAutoCompleteConsultorio();
  }
  /**
   * Configura el auto-completado de campos cuando se ingresa la cédula profesional
   */
  private setupAutoCompleteCedula(): void {
    this.configuracionRecetaForm.get('cedula_profesional')?.valueChanges.pipe(
      debounceTime(800), // Esperar 800ms después de que el usuario deje de escribir
      distinctUntilChanged(), // Solo si el valor cambió
      tap(() => {
        // Limpiar errores previos cuando empieza a escribir
        const cedulaControl = this.configuracionRecetaForm.get('cedula_profesional');
        if (cedulaControl?.hasError('cedulaInvalida')) {
          cedulaControl.setErrors(null);
          cedulaControl.updateValueAndValidity();
        }
      }),
      switchMap(cedula => {
        // Solo validar si la cédula tiene 6-8 dígitos
        if (!cedula || cedula.length < 6 || cedula.length > 8) {
          return EMPTY;
        }
        // Obtener datos personales del formulario
        const nombre = this.datosPersonalesForm.get('nombre')?.value;
        const primerApellido = this.datosPersonalesForm.get('primerApellido')?.value;
        const segundoApellido = this.datosPersonalesForm.get('segundoApellido')?.value;
        // Solo validar si tenemos los datos personales necesarios (sin fecha de nacimiento)
        if (!nombre || !primerApellido || !segundoApellido) {
          return EMPTY;
        }
        console.log('🔍 Auto-validando cédula:', cedula);
        return this.authMock.validarCedulaProfesionalSEP(
          cedula,
          nombre,
          primerApellido,
          segundoApellido,
          null // fechaNacimiento es opcional ahora
        );
      })
    ).subscribe({
      next: (resultado) => {
        if (resultado && resultado.success && resultado.datosSEP) {
          console.log('✅ Cédula válida, auto-completando campos:', resultado.datosSEP);
          this.isAutoCompleting = true;
          // Auto-completar especialidad médica (título)
          if (resultado.datosSEP.titulo) {
            this.configuracionRecetaForm.patchValue({
              especialidad_medica: resultado.datosSEP.titulo
            }, { emitEvent: false });
          }
          // Auto-completar institución
          if (resultado.datosSEP.institucion) {
            this.configuracionRecetaForm.patchValue({
              institucion: resultado.datosSEP.institucion
            }, { emitEvent: false });
          }
          this.isAutoCompleting = false;
          this.cdr.detectChanges();
        } else if (resultado && !resultado.success) {
          // Si la cédula no es válida, no auto-completar pero tampoco mostrar error todavía
          // El error se mostrará cuando el usuario intente avanzar
          console.log('⚠️ Cédula no válida para auto-completado');
        }
      },
      error: (error) => {
        console.error('❌ Error al auto-validar cédula:', error);
        this.isAutoCompleting = false;
      }
    });
  }
  /**
   * Configura el auto-completado de dirección cuando se ingresa el nombre del consultorio
   * MOCK: Simula la integración con Google Places API
   */
  private setupAutoCompleteConsultorio(): void {
    this.configuracionRecetaForm.get('consultorio')?.valueChanges.pipe(
      debounceTime(500), // Esperar 500ms después de que el usuario deje de escribir
      distinctUntilChanged() // Solo si el valor cambió
    ).subscribe(nombreConsultorio => {
      if (!nombreConsultorio) {
        return;
      }
      // Buscar coincidencia exacta en el mock
      const direccionMock = this.consultoriosMock[nombreConsultorio];
      if (direccionMock) {
        console.log('🏥 Consultorio encontrado en mock, autocompletando dirección:', direccionMock);
        // Auto-completar el campo de dirección
        this.configuracionRecetaForm.patchValue({
          direccion: direccionMock
        }, { emitEvent: false });
        this.cdr.detectChanges();
      } else {
        // Buscar coincidencia parcial (case-insensitive)
        const nombreLower = nombreConsultorio.toLowerCase();
        const consultorioEncontrado = Object.keys(this.consultoriosMock).find(key =>
          key.toLowerCase().includes(nombreLower) || nombreLower.includes(key.toLowerCase())
        );
        if (consultorioEncontrado) {
          const direccion = this.consultoriosMock[consultorioEncontrado];
          console.log('🏥 Consultorio encontrado (coincidencia parcial), autocompletando dirección:', direccion);
          this.configuracionRecetaForm.patchValue({
            direccion: direccion
          }, { emitEvent: false });
          this.cdr.detectChanges();
        }
      }
    });
  }
  ngOnDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  // Métodos de detección móvil
  private setupMobileDetection(): void {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    this.isMobile = mediaQuery.matches;
    let timeoutId: any;
    this.resizeListener = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const previousMobile = this.isMobile;
        this.isMobile = mediaQuery.matches;
        if (previousMobile !== this.isMobile) {
          this.resetMobileSubSteps();
          this.cdr.detectChanges();
        }
      }, 150);
    };
    mediaQuery.addEventListener('change', this.resizeListener);
  }
  // Métodos de sub-pasos móviles
  getMobileSubStepTitle(): string {
    if (this.currentStep === 0) {
      const titles = ['Información básica', 'Contacto y acceso'];
      return titles[this.mobileSubStep] || '';
    } else if (this.currentStep === 1) { // Cambiar de 2 a 1
      const titles = ['Estudios', 'Consultorio médico'];
      return titles[this.mobileSubStep] || '';
    }
    return '';
  }
  getMobileSubStepProgress(): string {
    if (this.currentStep === 0 || this.currentStep === 1) { // Cambiar de 2 a 1
      return `${this.mobileSubStep + 1} de ${this.maxMobileSubSteps()}`;
    }
    return '';
  }

  nextMobileSubStep(): void {
    if (this.mobileSubStep < this.maxMobileSubSteps() - 1) {
      if (this.canProceedToNextMobileSubStep()) {
        this.mobileSubStep++;
        this.cdr.detectChanges();
      } else {
        this.markCurrentMobileSubStepAsTouched();
        this.showErrorMessage('Por favor, completa todos los campos requeridos.');
      }
    } else {
      this.nextStepCustom();
    }
  }
  previousMobileSubStep(): void {
    if (this.mobileSubStep > 0) {
      this.mobileSubStep--;
      this.cdr.detectChanges();
    } else {
      this.previousStepCustom();
    }
  }
  canProceedToNextMobileSubStep(): boolean {
    if (!this.isMobile) return true;
    if (this.currentStep === 0) {
      switch (this.mobileSubStep) {
        case 0:
          return this.isSubStepFieldsValid(this.datosPersonalesForm, ['nombre', 'primerApellido', 'segundoApellido', 'telefonoProfesional']);
        case 1:
          return this.isSubStepFieldsValid(this.datosPersonalesForm, ['correo', 'contrasena', 'fechaNacimiento', 'terminosCondiciones']);
        default:
          return true;
      }
    } else if (this.currentStep === 1) { // Cambiar de 2 a 1
      switch (this.mobileSubStep) {
        case 0:
          return this.isSubStepFieldsValid(this.configuracionRecetaForm, ['cedula_profesional', 'especialidad_medica', 'institucion']);
        case 1:
          return this.isSubStepFieldsValid(this.configuracionRecetaForm, ['consultorio', 'direccion', 'telconsultorio']);
        default:
          return true;
      }
    }
    return true;
  }

  private isSubStepFieldsValid(form: FormGroup, fieldNames: string[]): boolean {
    return fieldNames.every(fieldName => {
      const control = form.get(fieldName);
      return control && control.valid;
    });
  }
  markCurrentMobileSubStepAsTouched(): void {
    let fieldsToMark: string[] = [];
    if (this.currentStep === 0) {
      switch (this.mobileSubStep) {
        case 0:
          fieldsToMark = ['nombre', 'primerApellido', 'segundoApellido', 'telefonoProfesional'];
          break;
        case 1:
          fieldsToMark = ['correo', 'contrasena', 'fechaNacimiento', 'terminosCondiciones'];
          break;
      }
      fieldsToMark.forEach(field => {
        const control = this.datosPersonalesForm.get(field);
        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });
    } else if (this.currentStep === 1) { // Cambiar de 2 a 1
      switch (this.mobileSubStep) {
        case 0:
          fieldsToMark = ['cedula_profesional', 'especialidad_medica', 'institucion'];
          break;
        case 1:
          fieldsToMark = ['consultorio', 'direccion', 'telconsultorio'];
          break;
      }
      fieldsToMark.forEach(field => {
        const control = this.configuracionRecetaForm.get(field);
        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });
    }
    this.cdr.detectChanges();
  }
  resetMobileSubSteps(): void {
    this.mobileSubStep = 0;
    this.cdr.detectChanges();
  }
  shouldShowMobileSubStepFields(subStep: number): boolean {
    if (!this.isMobile) return false;
    if (this.currentStep !== 0 && this.currentStep !== 1) return false; // Cambiar de 2 a 1
    return this.mobileSubStep === subStep;
  }
  // 8. Actualizar shouldShowMobileHeader() (línea ~304):
  shouldShowMobileHeader(): boolean {
    return this.isMobile && (this.currentStep === 0 || this.currentStep === 1); // Cambiar de 2 a 1
  }
  // 9. Actualizar shouldShowMainStepper() (línea ~308):
  shouldShowMainStepper(): boolean {
    return !this.isMobile || (this.currentStep !== 0 && this.currentStep !== 1); // Cambiar de 2 a 1
  }

  shouldShowNavigationButtons(): boolean {
    // Mostrar botones en los pasos 0, 1, 2
    return [0, 1, 2].includes(this.currentStep);
  }

  getMainContainerClass(): string {
    return this.isMobile ? 'mobile-container step-content' : 'desktop-container step-content';
  }
  getFormContainerClass(): string {
    return this.isMobile ? 'mobile-form step-form' : 'desktop-form step-form';
  }
  getMobileStepButtonText(): string {
    if (!this.isMobile) {
      if (this.currentStep === 2) {
        return 'Ir al Dashboard';
      }
      return 'Siguiente';
    }
    if (this.currentStep === 0) {
      return this.mobileSubStep < this.maxMobileSubSteps() - 1 ? 'Continuar' : 'Crear cuenta';
    } else if (this.currentStep === 1) {
      return this.mobileSubStep < this.maxMobileSubSteps() - 1 ? 'Continuar' : 'Siguiente';
    } else if (this.currentStep === 2) {
      return 'Ir al Dashboard';
    }
    return 'Siguiente';
  }
  getMobileBackButtonText(): string {
    if (!this.isMobile) {
      return this.currentStep > 0 ? 'Atrás' : 'Cancelar';
    }
    if ((this.currentStep === 0 || this.currentStep === 1) && this.mobileSubStep > 0) {
      return 'Atrás';
    }
    return this.currentStep > 0 ? 'Atrás' : 'Cancelar';
  }

  // Eventos del custom stepper
  onStepChange(stepIndex: number): void {
    console.log('Paso cambiado a:', stepIndex);
    this.currentStep = stepIndex;
    this.resetMobileSubSteps();
    this.updateStepsState();
  }
  onStepClick(stepIndex: number): void {
    console.log('Clic en paso:', stepIndex);
    if (this.canNavigateToStep(stepIndex)) {
      this.currentStep = stepIndex;
      this.resetMobileSubSteps();
      this.updateStepsState();
    }
  }
  canNavigateToStep(stepIndex: number): boolean {
    if (!this.isLinear) return true;
    if (stepIndex <= this.currentStep) return true;
    return this.steps[stepIndex - 1]?.completed || false;
  }
  updateStepsState(): void {
    this.steps.forEach((step, index) => {
      step.active = index === this.currentStep;
    });
  }
  // Métodos de navegación
  nextStepCustom(): void {
    console.log('nextStepCustom ejecutado, currentStep:', this.currentStep, 'mobileSubStep:', this.mobileSubStep);
    switch (this.currentStep) {
      case 0:
        // Paso 0: Crear cuenta - Registrar usuario
        if (this.isMobile && this.mobileSubStep < this.maxMobileSubSteps() - 1) {
          this.nextMobileSubStep();
          return;
        }
        this.registrarYEnviarCodigo();
        break;
      case 1:
        // Paso 1: Datos Profesionales (antes era paso 2)
        if (this.isMobile && this.mobileSubStep < this.maxMobileSubSteps() - 1) {
          this.nextMobileSubStep();
          return;
        }
        this.guardarDatosProfesionalesReal();
        break;
      case 2:
        // Paso 2: Verificación Email - Navegar al Home
        this.verificarCodigoEmailReal();
        break;
      default:
        console.log('Paso no válido:', this.currentStep);
    }
  }
  previousStepCustom(): void {
    if (this.isMobile && this.currentStep === 0 && this.mobileSubStep > 0) {
      this.previousMobileSubStep();
      return;
    }
    if (this.currentStep > 0) {
      this.currentStep--;
      this.resetMobileSubSteps();
      this.updateStepsState();
      console.log('Paso anterior, currentStep:', this.currentStep);
    } else {
      this.onCancel();
    }
  }
  completeCurrentStepAndAdvance(): void {
    this.steps[this.currentStep].completed = true;
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.resetMobileSubSteps();
      this.updateStepsState();
    }
  }
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  // Inicialización de formularios
  initializeForms() {
    this.datosPersonalesForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      primerApellido: ['', [Validators.required, Validators.minLength(2)]],
      segundoApellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      telefonoProfesional: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]],
      fechaNacimiento: ['', Validators.required],
      terminosCondiciones: [false, Validators.requiredTrue],
    });
    this.verificacionEmailForm = this.fb.group({
      codigoVerificacionEmail: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern(/^[0-9]{6}$/),
      ]],
    });
    this.configuracionRecetaForm = this.fb.group({
      cedula_profesional: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      especialidad_medica: ['', Validators.required],
      institucion: ['', Validators.required],
      consultorio: ['', Validators.required],
      direccion: ['', Validators.required],
      telconsultorio: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  // Métodos de verificación email
  enviarCodigoVerificacionEmail() {
    const email = this.datosPersonalesForm.get('correo')?.value;
    if (email && this.datosPersonalesForm.valid) {
      console.log('Enviando código de verificación por email a:', email);
      this.emailVerificationCode = this.generateVerificationCode();
      console.log('Código email generado:', this.emailVerificationCode);
    } else {
      console.log('Formulario no válido o correo no ingresado');
      this.showErrorMessage('Formulario no válido o correo no ingresado.');
    }
  }
  reenviarCodigoEmail() {
    this.reenviarCodigoEmailReal();
  }
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  validarCodigoEmail(): boolean {
    const enteredCode = this.verificacionEmailForm.get('codigoVerificacionEmail')?.value;
    if (enteredCode === this.emailVerificationCode || enteredCode === '000000') {
      return true;
    }
    this.verificacionEmailForm.get('codigoVerificacionEmail')?.setErrors({ invalidCode: true });
    return false;
  }
  onCancel() {
    const confirmClose = confirm('¿Estás seguro de que quieres cancelar el registro? Se perderán todos los datos ingresados.');
    if (confirmClose) {
      this.dialogRef.close();
    }
  }
  // Métodos de utilidad
  private _filterEspecialidades(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.especialidadesMedicas.filter(option => option.toLowerCase().includes(filterValue));
  }
  onCodeInput(event: any): void {
    console.log('onCodeInput ejecutado');
    const input = event.target as HTMLInputElement;
    this.verificationCode = input.value.replace(/[^0-9]/g, '').slice(0, 6);
    this.verificacionEmailForm.get('codigoVerificacionEmail')?.setValue(this.verificationCode);
    input.value = this.verificationCode;
    console.log('Código actual:', this.verificationCode);
    if (this.verificationCode === '000000' && this.verificationCode.length === 6) {
      console.log('Código 000000 detectado, validando automáticamente');
      this.nextStepCustom();
    }
  }
  getPasswordErrors(): string | null {
    const control = this.datosPersonalesForm.get('contrasena');
    if (control?.hasError('required')) return 'La contraseña es requerida';
    if (control?.hasError('minlength')) return 'Mínimo 8 caracteres';
    return null;
  }

  resetForms() {
    this.datosPersonalesForm.reset();
    this.verificacionEmailForm.reset();
    this.configuracionRecetaForm.reset();
    this.verificacionKYCForm.reset();
    this.currentStep = 0;
    this.emailVerificationCode = null;
    this.verificationCode = '';
    this.error = null;
    // Resetear los pasos
    this.steps.forEach((step, index) => {
      step.completed = false;
      step.active = index === 0;
    });
    this.cdr.detectChanges();
  }
  canProceedToNext(): boolean {
    switch (this.currentStep) {
      case 0:
        return this.datosPersonalesForm.valid;
      case 1:
        return this.configuracionRecetaForm.valid; // Datos Profesionales
      case 2:
        return this.verificacionEmailForm.valid && this.validarCodigoEmail(); // Verificación Email
      default:
        return false;
    }
  }
  getCurrentStepTitle(): string {
    const titles = [
      'Datos Personales',
      'Información Profesional',      // Paso 1: Datos Profesionales
      'Verificación por Email',       // Paso 2: Verificación Email
    ];
    return titles[this.currentStep] || 'Paso';
  }
  // Métodos legacy
  nextStep(stepper?: any) {
    this.nextStepCustom();
  }
  previousStep(stepper?: any) {
    this.previousStepCustom();
  }
  // Métodos para botones dinámicos

  getTotalProgress(): number {
    if (!this.isMobile) {
      return Math.round(((this.currentStep + 1) / this.steps.length) * 100);
    }
    // Progreso en móvil
    if (this.currentStep === 0 || this.currentStep === 1) { // Cambiar de 2 a 1
      const maxSubSteps = this.maxMobileSubSteps();
      if (maxSubSteps === 0) {
        return Math.round((this.currentStep / this.steps.length) * 100);
      }
      const subStepProgress = (this.mobileSubStep + 1) / maxSubSteps;
      const stepProgress = (this.currentStep + subStepProgress) / this.steps.length;
      return Math.round(stepProgress * 100);
    }
    return Math.round(((this.currentStep + 1) / this.steps.length) * 100);
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  /**
   * 📝 PASO 0 → PASO 1: Registrar usuario y enviar código
   */
  registrarYEnviarCodigo(): void {
    if (this.datosPersonalesForm.invalid) {
      this.markFormGroupTouched(this.datosPersonalesForm);
      this.showErrorMessage('Por favor, completa todos los campos requeridos.');
      return;
    }
    this.isSubmitting = true;
    // Separar Nombre(s) en nombre + segundoNombre si viene con espacio (ej: "Maria Fernanda")
    const nombreCompletoInput: string = (this.datosPersonalesForm.value.nombre || '').trim();
    const partesNombre = nombreCompletoInput.split(' ').filter((p: string) => p.length > 0);
    const nombrePrincipal = partesNombre[0] || '';
    const segundoNombreParsed = partesNombre.slice(1).join(' ') || '';

    const datosRegistro: UsuarioRegistro = {
      nombre: nombrePrincipal,
      segundoNombre: segundoNombreParsed,
      primerApellido: this.datosPersonalesForm.value.primerApellido,
      segundoApellido: this.datosPersonalesForm.value.segundoApellido,
      fechaNacimiento: this.datosPersonalesForm.value.fechaNacimiento || new Date(),
      estado: '', // Ya no se solicita
      celular: this.datosPersonalesForm.value.telefonoProfesional,
      correo: this.datosPersonalesForm.value.correo,
      contrasena: this.datosPersonalesForm.value.contrasena,
      cedula_profesional: '',
      especialidad_medica: '',
      institucion: '',
      consultorio: '',
      direccion: '',
      telconsultorio: ''
    };
    console.log('📤 Registrando usuario:', datosRegistro.correo);
    this.authMock.registrarUsuario(datosRegistro).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.correoUsuarioRegistrado = datosRegistro.correo;
          this.emailVerificationCode = this.authMock.getCodigoVerificacion(datosRegistro.correo) || null;
          console.log('📧 Código de verificación generado:', this.emailVerificationCode);
          // CAMBIO: Ahora avanza al paso 1 (Datos Profesionales) en lugar del paso de verificación
          this.completeCurrentStepAndAdvance();
          this.snackBar.open(
            'Usuario registrado exitosamente. Código de verificación generado.',
            'Cerrar',
            { duration: 3000 }
          );
        } else {
          this.showErrorMessage(response.mensaje);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('❌ Error en registro:', error);
        this.showErrorMessage('Error al registrar usuario. Intenta de nuevo.');
      }
    });
  }
  /**
   * 📧 PASO 2: Verificar código de email y navegar al Home
   */
  verificarCodigoEmailReal(): void {
    if (this.verificacionEmailForm.invalid) {
      this.markFormGroupTouched(this.verificacionEmailForm);
      this.showErrorMessage('Por favor, ingresa el código de verificación.');
      return;
    }
    this.isSubmitting = true;
    const codigo = this.verificacionEmailForm.value.codigoVerificacionEmail;
    console.log('🔍 Verificando código:', codigo);
    if (codigo === '000000') {
      console.log('✅ Bypass con código de prueba 000000 - forzando verificación');
      // Bypass: marcar email como verificado manualmente y finalizar registro
      const usuario = this.authMock.getUsuarioRegistrado(this.correoUsuarioRegistrado);
      if (usuario) {
        usuario.emailVerificado = true;
      }
      this.finalizarRegistroYRedirigir();
      return;
    }
    this.authMock.verificarCodigoEmail(this.correoUsuarioRegistrado, codigo).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('✅ Código verificado correctamente');
          this.finalizarRegistroYRedirigir();
        } else {
          this.isSubmitting = false;
          this.verificacionEmailForm.get('codigoVerificacionEmail')?.setErrors({
            invalidCode: true
          });
          this.showErrorMessage(response.mensaje);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('❌ Error al verificar código:', error);
        this.showErrorMessage('Error al verificar código. Intenta de nuevo.');
      }
    });
  }

  /**
   * 🔐 Finaliza registro, crea UsuarioAutenticado y redirige al Home
   * Esto asegura que el Dashboard muestre al usuario RECIÉN registrado (ej: María) y no al anterior (Ramiro)
   */
  private finalizarRegistroYRedirigir(): void {
    this.authMock.finalizarRegistro(this.correoUsuarioRegistrado).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        console.log('✅ Registro finalizado, usuario autenticado:', result.usuario);
        this.snackBar.open(
          `¡Bienvenido Dr. ${result.usuario.nombreCompleto}!`,
          'Cerrar',
          { duration: 2000 }
        );
        setTimeout(() => {
          this.dialogRef.close({ success: true, usuario: result.usuario });
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('❌ Error al finalizar registro:', error);
        this.showErrorMessage('Error al finalizar registro. Intenta de nuevo.');
      }
    });
  }
  /**
   * 🔄 PASO 1: Reenviar código de email
   */
  reenviarCodigoEmailReal(): void {
    this.isResendingEmail = true;
    this.authMock.reenviarCodigoEmail(this.correoUsuarioRegistrado).subscribe({
      next: (response) => {
        this.isResendingEmail = false;
        if (response.success) {
          // Actualizar código en la variable local
          this.emailVerificationCode = this.authMock.getCodigoVerificacion(this.correoUsuarioRegistrado) || null;
          // Mostrar en consola (solo desarrollo)
          console.log('📧 Nuevo código de verificación:', this.emailVerificationCode);
          this.snackBar.open(
            'Código reenviado exitosamente',
            'Cerrar',
            { duration: 3000 }
          );
        } else {
          this.showErrorMessage(response.mensaje);
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isResendingEmail = false;
        console.error('❌ Error al reenviar código:', error);
        this.showErrorMessage('Error al reenviar código.');
        this.cdr.detectChanges();
      }
    });
  }
  /**
   * 💼 PASO 1 → PASO 2: Guardar datos profesionales CON VALIDACIÓN SEP
   */
  guardarDatosProfesionalesReal(): void {
    if (this.configuracionRecetaForm.invalid) {
      this.markFormGroupTouched(this.configuracionRecetaForm);
      this.showErrorMessage('Por favor, completa todos los datos profesionales.');
      return;
    }
    this.isSubmitting = true;
    // 🎯 PRIMERO: Validar la cédula profesional con la SEP (sin fecha de nacimiento)
    this.authMock.validarCedulaProfesionalSEP(
      this.configuracionRecetaForm.value.cedula_profesional,
      this.datosPersonalesForm.value.nombre,
      this.datosPersonalesForm.value.primerApellido,
      this.datosPersonalesForm.value.segundoApellido,
      null // fechaNacimiento es opcional ahora
    ).subscribe({
      next: (resultadoValidacion) => {
        if (!resultadoValidacion.success) {
          // ❌ La cédula NO es válida
          this.isSubmitting = false;
          // Mostrar errores específicos
          let mensajeError = resultadoValidacion.mensaje;
          if (resultadoValidacion.errores && resultadoValidacion.errores.length > 0) {
            mensajeError += '\n\n' + resultadoValidacion.errores.join('\n');
          }
          this.showErrorMessage(mensajeError);
          // Marcar el campo de cédula con error
          this.configuracionRecetaForm.get('cedula_profesional')?.setErrors({
            cedulaInvalida: true
          });
          return;
        }
        // ✅ La cédula ES válida, continuar con el guardado
        console.log('✅ Cédula validada:', resultadoValidacion.datosSEP);
        const datosProfesionales = {
          cedula_profesional: this.configuracionRecetaForm.value.cedula_profesional,
          especialidad_medica: this.configuracionRecetaForm.value.especialidad_medica,
          institucion: this.configuracionRecetaForm.value.institucion,
          consultorio: this.configuracionRecetaForm.value.consultorio,
          direccion: this.configuracionRecetaForm.value.direccion,
          telconsultorio: this.configuracionRecetaForm.value.telconsultorio
        };
        this.authMock.actualizarDatosProfesionales(
          this.correoUsuarioRegistrado,
          datosProfesionales
        ).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            if (response.success) {
              console.log('✅ Datos profesionales guardados');
              this.completeCurrentStepAndAdvance(); // Avanza al paso 2 (Verificación Email)
              this.snackBar.open(
                '✅ Cédula profesional validada. Verifica tu email.',
                'Cerrar',
                { duration: 3000 }
              );
            } else {
              this.showErrorMessage(response.mensaje);
            }
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('❌ Error al guardar datos profesionales:', error);
            this.showErrorMessage('Error al guardar datos profesionales.');
          }
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('❌ Error al validar cédula:', error);
        this.showErrorMessage('Error al conectar con el servicio de validación de la SEP.');
      }
    });
  }

}