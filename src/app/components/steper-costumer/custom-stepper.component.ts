import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StepperStep {
  label: string;
  completed: boolean;
  active: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-custom-stepper',
  standalone: true,
  imports: [CommonModule], // Importar CommonModule para usar *ngFor, *ngIf, ngClass
  templateUrl: './custom-stepper.component.html',
  styleUrls: ['./custom-stepper.component.css']
})
export class CustomStepperComponent implements OnInit, OnChanges {
  @Input() steps: StepperStep[] = [];
  @Input() currentStepIndex: number = 0;
  @Input() linear: boolean = true;
  @Input() showNavigationButtons: boolean = true;
  @Output() stepChange = new EventEmitter<number>();
  @Output() stepClick = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
    this.updateStepsState();
  }

  ngOnChanges(): void {
    this.updateStepsState();
  }

  /**
   * Maneja el click en un paso específico
   */
  onStepClick(index: number): void {
    if (this.canNavigateToStep(index)) {
      this.currentStepIndex = index;
      this.updateStepsState();
      this.stepClick.emit(index);
      this.stepChange.emit(index);
    }
  }

  /**
   * Navega al siguiente paso
   */
  nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.updateStepsState();
      this.stepChange.emit(this.currentStepIndex);
    }
  }

  /**
   * Navega al paso anterior
   */
  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.updateStepsState();
      this.stepChange.emit(this.currentStepIndex);
    }
  }

  /**
   * Marca el paso actual como completado
   */
  completeCurrentStep(): void {
    if (this.steps[this.currentStepIndex]) {
      this.steps[this.currentStepIndex].completed = true;
    }
  }

  /**
   * Reinicia el stepper al primer paso
   */
  reset(): void {
    this.currentStepIndex = 0;
    this.steps.forEach(step => {
      step.completed = false;
      step.active = false;
    });
    this.updateStepsState();
    this.stepChange.emit(0);
  }

  /**
   * Verifica si se puede navegar a un paso específico
   */
  private canNavigateToStep(index: number): boolean {
    if (this.steps[index]?.disabled) {
      return false;
    }
    
    if (!this.linear) {
      return true;
    }

    // En modo linear, solo se puede navegar a pasos completados o al paso actual
    return index <= this.currentStepIndex;
  }

  /**
   * Actualiza el estado de todos los pasos
   */
  private updateStepsState(): void {
    this.steps.forEach((step, index) => {
      step.active = index === this.currentStepIndex;
      
      // Marcar como completado si es anterior al paso actual
      if (index < this.currentStepIndex && !step.completed) {
        step.completed = true;
      }
    });
  }

  /**
   * Métodos de utilidad para el template
   */
  isStepCompleted(index: number): boolean {
    return this.steps[index]?.completed || false;
  }

  isStepActive(index: number): boolean {
    return index === this.currentStepIndex;
  }

  isStepDisabled(index: number): boolean {
    return this.steps[index]?.disabled || 
           (this.linear && index > this.currentStepIndex && !this.isStepCompleted(index));
  }

  getProgressPercentage(): number {
    if (this.steps.length <= 1) return 0;
    return (this.currentStepIndex / (this.steps.length - 1)) * 100;
  }

  getStepClasses(index: number): { [key: string]: boolean } {
    return {
      'step-item': true,
      'active': this.isStepActive(index),
      'completed': this.isStepCompleted(index),
      'disabled': this.isStepDisabled(index)
    };
  }

  /**
   * =============== NUEVOS MÉTODOS PARA MOBILE STEPPER ===============
   */

  /**
   * Obtiene las clases CSS para los círculos del stepper móvil
   */
  getMobileStepClasses(index: number): { [key: string]: boolean } {
    return {
      'mobile-step-circle': true,
      'pending': !this.isStepCompleted(index) && !this.isStepActive(index) && !this.isStepDisabled(index),
      'active': this.isStepActive(index),
      'completed': this.isStepCompleted(index),
      'disabled': this.isStepDisabled(index)
    };
  }

  /**
   * Obtiene las clases CSS para los conectores entre pasos en móvil
   */
  getMobileConnectorClasses(index: number): { [key: string]: boolean } {
    // El conector se considera completado si el paso siguiente está completado o activo
    const nextStepCompleted = this.isStepCompleted(index + 1);
    const nextStepActive = this.isStepActive(index + 1);
    const currentStepCompleted = this.isStepCompleted(index);
    
    return {
      'mobile-step-connector': true,
      'completed': currentStepCompleted && (nextStepCompleted || nextStepActive),
      'active': nextStepActive && currentStepCompleted
    };
  }

  /**
   * NUEVO MÉTODO - Obtiene las clases CSS para los textos del stepper móvil (sin círculos)
   */
  getMobileStepTextClasses(index: number): { [key: string]: boolean } {
    return {
      'mobile-text-pending': !this.isStepCompleted(index) && !this.isStepActive(index) && !this.isStepDisabled(index),
      'mobile-text-active': this.isStepActive(index),
      'mobile-text-completed': this.isStepCompleted(index),
      'mobile-text-disabled': this.isStepDisabled(index)
    };
  }

  /**
   * Verifica si el botón "Anterior" debe estar habilitado
   */
  isPreviousButtonEnabled(): boolean {
    return this.currentStepIndex > 0;
  }

  /**
   * Verifica si el botón "Siguiente" debe estar habilitado
   */
  isNextButtonEnabled(): boolean {
    return this.currentStepIndex < this.steps.length - 1;
  }

  /**
   * Obtiene el texto del paso actual (útil para debug o mostrar info adicional)
   */
  getCurrentStepLabel(): string {
    return this.steps[this.currentStepIndex]?.label || '';
  }

  /**
   * Obtiene el porcentaje de progreso completado
   */
  getCompletionPercentage(): number {
    const completedSteps = this.steps.filter(step => step.completed).length;
    const currentStepProgress = this.currentStepIndex > 0 ? 1 : 0;
    
    return ((completedSteps + currentStepProgress) / this.steps.length) * 100;
  }

  /**
   * Verifica si todos los pasos están completados
   */
  isAllStepsCompleted(): boolean {
    return this.steps.every(step => step.completed) && 
           this.currentStepIndex === this.steps.length - 1;
  }

  /**
   * Obtiene información del estado actual del stepper
   */
  getStepperStatus(): {
    currentStep: number;
    totalSteps: number;
    currentLabel: string;
    completionPercentage: number;
    isCompleted: boolean;
  } {
    return {
      currentStep: this.currentStepIndex + 1,
      totalSteps: this.steps.length,
      currentLabel: this.getCurrentStepLabel(),
      completionPercentage: this.getCompletionPercentage(),
      isCompleted: this.isAllStepsCompleted()
    };
  }
}