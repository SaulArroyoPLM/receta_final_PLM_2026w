import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Notification } from '../../interfaces/notification.interface';
import { Router , RouterModule} from '@angular/router';

@Component({
  selector: 'notification-master',
  standalone: true,
  imports: [CommonModule,
     MatCardModule,
      MatButtonModule,
      MatIconModule,
      RouterModule 
    ],
  templateUrl: './notificaciones-master-componet.component.html',
  styleUrls: ['./notificaciones-master-componet.component.scss']
})
export class NotificationMasterComponent {
  @Input() notification!: Notification;
  @Output() notificationActionClicked = new EventEmitter<any>();


  constructor(private router: Router) {}

  getIcon(): string {
    return this.notification.icon || 'info';
  }

  getCardClass(): string {
    return `notification-card notification-card--${this.notification.type}`;
  }

  // NUEVO: Obtener la acción principal (primera del array)
  getPrimaryAction() {
    return this.notification.actions && this.notification.actions.length > 0 
      ? this.notification.actions[0] 
      : { action: 'view', label: 'Ver', icon: 'visibility' };
  }

  // NUEVO: Obtener el texto del botón basado en la notificación
  getButtonText(): string {
    const primaryAction = this.getPrimaryAction();
    return primaryAction.label;
  }

  // NUEVO: Obtener el ícono del botón
  getButtonIcon(): string {
    const primaryAction = this.getPrimaryAction();
    return primaryAction.icon || 'info';
  }

  // NUEVO: Obtener el color del botón basado en el tipo de notificación
  getButtonColor(): string {
    switch (this.notification.type) {
      case 'success':
        return 'primary';
      case 'warning':
        return 'warn';
      case 'error':
        return 'warn';
      case 'info':
      default:
        return 'primary';
    }
  }

  // ACTUALIZADO: Emitir la acción correcta
  onActionClick(): void {
    const primaryAction = this.getPrimaryAction();
    this.notificationActionClicked.emit({
      notification: this.notification,
      action: primaryAction
    });
  }

  // NUEVO: Método para manejar múltiples acciones si las hay
  onSecondaryActionClick(action: any): void {
    this.notificationActionClicked.emit({
      notification: this.notification,
      action: action
    });
  }

  // NUEVO: Verificar si hay acciones secundarias
  hasSecondaryActions(): boolean {
    return !!(this.notification.actions && this.notification.actions.length > 1);
  }

  // NUEVO: Obtener acciones secundarias
  getSecondaryActions() {
    return this.notification.actions && this.notification.actions.length > 1 
      ? this.notification.actions.slice(1) 
      : [];
  }
  goTo(link: string) {
  this.router.navigateByUrl(link);
}
}