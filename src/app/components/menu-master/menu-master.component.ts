import { Component, HostListener, Inject, Input, Output, EventEmitter, OnInit, OnChanges, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select'; // NUEVO IMPORT PARA SELECT
import { MatFormFieldModule } from '@angular/material/form-field'; // NUEVO IMPORT
import { FormsModule } from '@angular/forms'; // NUEVO IMPORT PARA ngModel
import { NotificationMasterComponent } from '../notificaciones-master-componet/notificaciones-master-componet.component';
import { StarRatingComponent } from '../star-rating-component/star-rating-component.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // 👈 AGREGAR ESTA LÍNEA
// import { NuevaRecetaComponent } from '../../modals/nueva-receta/nueva-receta.component';// 
import { AuthMockService, UsuarioAutenticado } from '../../services/auth-mock.service'; // Importar el servicio
import { Subscription } from 'rxjs'; // Para manejar la suscripción
// === INTERFACES ===
export interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  icon: string;
  time: string;
  unread: boolean;
  actions?: NotificationAction[];
}
export interface NotificationAction {
  action: string;
  label: string;
  icon: string;
}
export interface MenuItem {
  label: string;
  route?: string;
  action?: string; // <-- agregar
  icon?: string;
  badge?: number;
}
export interface MenuGroup {
  label: string;
  children: MenuItem[];
}
@Component({
  selector: 'app-menu-master',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, // NUEVO IMPORT
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSelectModule, // NUEVO IMPORT
    MatFormFieldModule, // NUEVO IMPORT
    NotificationMasterComponent,
    StarRatingComponent,
    CommonModule,
      MatDialogModule, // 👈 AGREGAR ESTA LÍNEA
  ],
  templateUrl: './menu-master.component.html',
  styleUrls: ['./menu-master.component.scss'],
})
export class MenuMasterComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  // === VIEWCHILD PARA CONTROLAR MENÚS DESKTOP - SIN CAMBIOS ===
  @ViewChild('consultorioTriggerDesktop', { static: false }) consultorioTriggerDesktop!: MatMenuTrigger;
  @ViewChild('consultorioTriggerDesktopCollapsed', { static: false }) consultorioTriggerDesktopCollapsed!: MatMenuTrigger;
  // === INPUTS Y OUTPUTS BASES ===
  @Input() selectedConsultorio = 'Consultorio 1';
  @Input() sidebarOpen = true;
  @Input() sidebarCollapsed = false; // Añadido como entrada
  @Output() consultorioSeleccionado = new EventEmitter<string>();
 @Output() sidebarToggle = new EventEmitter<{ open: boolean; collapsed: boolean }>(); // Cambiado a objeto
  @Output() menuItemClick = new EventEmitter<void>();
  @Output() nuevaRecetaClick = new EventEmitter<void>();
  // === NUEVOS INPUTS Y OUTPUTS ===
  @Input() notificaciones: Notification[] = [];
  @Input() hasNotificationComponent = false;
  @Input() hasStarRatingComponent = false;
  @Output() ratingSelected = new EventEmitter<number>();
  @Output() notificationActionClicked = new EventEmitter<{ notification: Notification | null; action: NotificationAction }>();
  // === ESTADOS DE PANTALLA ACTUALIZADOS ===
  isMobile = false;
  isTablet = false;
  isLaptopSmall = false; // 992px - 1199px
  isDesktopS = false;    // 1200px - 1439px (sin panel notificaciones)
  isDesktopL = false;    // 1440px+ (con panel notificaciones)
  mobileDrawerOpen = false;
  notificationPanelOpen = false;
  // === DATOS DE USUARIO Y MENÚ ===
  notificationCount = 0;
  currentRating = 0;
  showRatingSection = true;
  notifications: Notification[] = [];
  menuItems: MenuGroup[] = [];
  perfilItems: MenuItem[] = [];
  consultorios = ['Consultorio 1', 'Consultorio 2', 'Consultorio 3', 'Consultorio 4'];
 usuario: UsuarioAutenticado | null = null;
  private userSubscription: Subscription | null = null;
  private isBrowser: boolean = false; // Declarar la propiedad
constructor(
  @Inject(PLATFORM_ID) private platformId: Object,
  private router: Router,
  private dialog: MatDialog, // 👈 Agregar esto
  private authMock: AuthMockService // Inyectar el servicio
) {
  this.isBrowser = isPlatformBrowser(this.platformId);
  console.log('🔍 DEBUG - Consultorios disponibles:', this.consultorios);
  console.log('🔍 DEBUG - Consultorio seleccionado:', this.selectedConsultorio);
}
ngOnInit() {
    if (this.isBrowser) {
      this.updateLayoutMode();
      this.initializeSelectedConsultorio();
      this.initializeExampleData();
      // Suscribirse al usuario actual
     this.userSubscription = this.authMock.currentUser$.subscribe({
        next: (usuario: UsuarioAutenticado | null) => {
          this.usuario = usuario;
          console.log('🔍 DEBUG - Usuario actualizado:', this.usuario);
        },
        error: (error: any) => {
          console.error('❌ Error al obtener usuario:', error);
          this.usuario = null;
        }
      });
      console.log('🔍 menuItems después de init:', this.menuItems);
      console.log('🔍 Primer item del menú:', this.menuItems[0]?.children[0]);
    }
  }
 ngAfterViewInit() {
    console.log('ViewChild Status:', {
      consultorioTriggerDesktop: !!this.consultorioTriggerDesktop,
      consultorioTriggerDesktopCollapsed: !!this.consultorioTriggerDesktopCollapsed
    });
  }
ngOnChanges(changes: import('@angular/core').SimpleChanges) {
    if (changes['selectedConsultorio']?.currentValue) {
      this.selectedConsultorio = changes['selectedConsultorio'].currentValue;
    }
    if (changes['sidebarOpen']) {
      this.sidebarOpen = changes['sidebarOpen'].currentValue;
    }
    if (changes['notificaciones']?.currentValue) {
      this.syncNotifications();
    }
  }
  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      this.updateLayoutMode();
    }
  }
  // === INICIALIZACIONES - SIN CAMBIOS ===
  private initializeSelectedConsultorio() {
    if (!this.selectedConsultorio && this.consultorios.length > 0) {
      this.selectedConsultorio = this.consultorios[0];
    }
    if (!this.consultorios.includes(this.selectedConsultorio)) {
      this.selectedConsultorio = this.consultorios[0];
    }
    const match = this.selectedConsultorio.match(/(\d+)/);
    if (match && !this.selectedConsultorio.toLowerCase().includes('consultorio')) {
      this.selectedConsultorio = `Consultorio ${match[1]}`;
    }
  }
  private initializeExampleData() {
    this.notifications = [
      {
        id: 1,
        type: 'info',
        title: 'Información',
        message: 'Cédula pendiente de verificación',
        icon: 'info',
        time: 'Hace 2 minutos',
        unread: true,
        actions: [
          { action: 'view', label: 'Ver', icon: 'visibility' },
          { action: 'delete', label: 'Eliminar', icon: 'delete' },
        ],
      },
      {
        id: 2,
        type: 'success',
        title: 'Éxito',
        message: 'Receta guardada correctamente',
        icon: 'check_circle',
        time: 'Hace 5 minutos',
        unread: true,
        actions: [{ action: 'view', label: 'Ver', icon: 'visibility' }],
      },
      {
        id: 3,
        type: 'warning',
        title: 'Advertencia',
        message: 'Sesión por expirar',
        icon: 'warning',
        time: 'Hace 10 minutos',
        unread: false,
        actions: [{ action: 'update', label: 'Renovar', icon: 'refresh' }],
      },
    ];
    this.updateNotificationCount();
    this.menuItems = [
      {
        label: 'CONSULTA',
        children: [
          { label: 'Nueva receta', action: 'openModal', icon: 'assets/icons/nueva_receta.svg' },
          { label: 'Pacientes', route: '/pacientes', icon: 'assets/icons/pacientes.svg' },
          { label: 'Consultar medicamentos', route: '/consultar-medicamentos', icon: 'assets/icons/consultar_medica.svg' },
         { label: 'Mis recetas favoritas', route: '/favoritas', icon: 'assets/icons/favoritas.svg' },
         { label: 'Interacciones', route: '/favoritas', icon: 'assets/icons/interacciones.svg' },
        ],
      },
    ];
    this.perfilItems = [
      { label: 'Datos personales', route: '/datos-personales', icon: 'assets/icons/datos_personales.svg' },
      { label: 'Datos profesionales', route: '/datos-profesionales', icon: 'assets/icons/datos_profecionales.svg' },
      { label: 'Consultorios y recetas', route: '/consultorios', icon: 'assets/icons/consultorio.svg', badge: 1 },
      { label: 'Verificación de identidad y firma', route: '/verificacion', icon: 'assets/icons/firma.svg', badge: 1 },
    ];
  }
  // === RESPONSIVE - SIN CAMBIOS ===
  private updateLayoutMode() {
    if (!this.isBrowser) return;
    const width = window.innerWidth;
    this.isMobile = width < 768;
    this.isTablet = width >= 768 && width < 992;
    this.isLaptopSmall = width >= 992 && width < 1200; 
    this.isDesktopS = width >= 1200 && width < 1440;
    this.isDesktopL = width >= 1440;
    if (this.isDesktopS || this.isDesktopL) {
      if (this.mobileDrawerOpen) {
        this.mobileDrawerOpen = false;
        this.updateBodyScroll();
      }
    }
  }
  // === SCROLL MANAGEMENT - SIN CAMBIOS ===
  private updateBodyScroll() {
    if (!this.isBrowser) return;
    const shouldDisableScroll = this.mobileDrawerOpen || this.notificationPanelOpen;
    if (shouldDisableScroll) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }
  private getScrollbarWidth(): number {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const widthNoScroll = outer.offsetWidth;
    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);
    const widthWithScroll = inner.offsetWidth;
    outer.parentNode?.removeChild(outer);
    return widthNoScroll - widthWithScroll;
  }
  // === ACCIONES ===
toggleSidebar() {
  if (this.isDesktopS || this.isDesktopL) {
    this.sidebarCollapsed = !this.sidebarCollapsed; // 👈 CAMBIAR EL ESTADO
    this.sidebarOpen = !this.sidebarCollapsed; // 👈 SINCRONIZAR
    
    console.log('Toggle Sidebar - Open:', this.sidebarOpen, 'Collapsed:', this.sidebarCollapsed);
    
    // Emitir AMBOS estados
    this.sidebarToggle.emit({ 
      open: this.sidebarOpen, 
      collapsed: this.sidebarCollapsed 
    });
  }
}
onSidebarToggle(event: { open: boolean; collapsed: boolean }): void {
  this.sidebarOpen = event.open;
  this.sidebarCollapsed = event.collapsed;
  console.log('Received Sidebar Toggle - Open:', this.sidebarOpen, 'Collapsed:', this.sidebarCollapsed);
}
  toggleMobileDrawer() {
    if (this.isMobile || this.isTablet || this.isLaptopSmall) {
      this.mobileDrawerOpen = !this.mobileDrawerOpen;
      this.updateBodyScroll();
    }
  }
  closeMobileDrawer() {
    if (this.mobileDrawerOpen) {
      this.mobileDrawerOpen = false;
      this.updateBodyScroll();
    }
  }
  // === FUNCIÓN PARA DESKTOP SOLAMENTE - MANTENER SIN CAMBIOS ===
  openConsultorioMenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Abriendo menú consultorio desktop, modo:', {
      isDesktopS: this.isDesktopS,
      isDesktopL: this.isDesktopL,
      sidebarOpen: this.sidebarOpen
    });
    
    // SOLO PARA DESKTOP
    if (this.isDesktopS || this.isDesktopL) {
      if (this.sidebarOpen) {
        if (this.consultorioTriggerDesktop) {
          console.log('Abriendo menú desktop expandido');
          this.consultorioTriggerDesktop.openMenu();
        } else {
          console.warn('consultorioTriggerDesktop no está disponible');
        }
      } else {
        if (this.consultorioTriggerDesktopCollapsed) {
          console.log('Abriendo menú desktop colapsado');
          this.consultorioTriggerDesktopCollapsed.openMenu();
        } else {
          console.warn('consultorioTriggerDesktopCollapsed no está disponible');
        }
      }
    }
  }
  // === FUNCIÓN PARA SELECT NATIVO - LIMPIA ===
  onNativeSelectChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue && this.consultorios.includes(selectedValue)) {
      this.seleccionarConsultorio(selectedValue);
    }
  }
  // === FUNCIÓN PARA SELECT RESPONSIVE - LIMPIA ===
  onConsultorioSelectChange(event: any) {
    const selectedValue = event.value;
    if (selectedValue && this.consultorios.includes(selectedValue)) {
      this.seleccionarConsultorio(selectedValue);
    }
  }
  
  // === FUNCIÓN MEJORADA PARA SELECCIONAR CONSULTORIO ===
  seleccionarConsultorio(nombre: string) {
    console.log('Seleccionando consultorio:', nombre);
    
    if (!this.consultorios.includes(nombre)) {
      console.warn('Consultorio no válido:', nombre);
      return;
    }
    const consultorioAnterior = this.selectedConsultorio;
    this.selectedConsultorio = nombre;
    
    console.log(`Consultorio cambiado de "${consultorioAnterior}" a "${this.selectedConsultorio}"`);
    
    // Emitir el evento
    this.consultorioSeleccionado.emit(nombre);
    
    // Cerrar menús SOLO para desktop
    if (this.isDesktopS || this.isDesktopL) {
      if (this.consultorioTriggerDesktop?.menuOpen) {
        console.log('Cerrando menú consultorio desktop');
        this.consultorioTriggerDesktop.closeMenu();
      }
      if (this.consultorioTriggerDesktopCollapsed?.menuOpen) {
        console.log('Cerrando menú consultorio desktop colapsado');
        this.consultorioTriggerDesktopCollapsed.closeMenu();
      }
    }
    console.log('Consultorio seleccionado exitosamente:', this.selectedConsultorio);
  }
  onMenuItemClick() {
    this.menuItemClick.emit();
    this.closeMobileDrawer();
  }
  onLogout() {
    this.closeMobileDrawer();
    this.closeNotificationPanel();
    console.log('Cerrar sesión');
  }
  onNuevaReceta() {
    this.nuevaRecetaClick.emit();
    this.closeMobileDrawer();
    this.router.navigate(['/nueva-receta']);
  }
  toggleNotificationPanel() {
    this.notificationPanelOpen = !this.notificationPanelOpen;
    this.updateBodyScroll();
  }
  closeNotificationPanel() {
    if (this.notificationPanelOpen) {
      this.notificationPanelOpen = false;
      this.updateBodyScroll();
    }
  }
  // === NOTIFICACIONES - SIN CAMBIOS ===
  getUnreadNotificationCount(): number {
    const notificationsToCheck = this.isMobile || this.isTablet || this.isLaptopSmall ? this.notificaciones || [] : this.notifications;
    return notificationsToCheck.filter((n) => n.unread).length;
  }
  getNotificationsToDisplay(): Notification[] {
    return this.isMobile || this.isTablet || this.isLaptopSmall ? this.notificaciones || [] : this.notifications;
  }
  onNotificationAction(notification: Notification, action: NotificationAction) {
    if (this.isMobile || this.isTablet || this.isLaptopSmall) {
      this.notificationActionClicked.emit({ notification, action });
    } else {
      this.handleDesktopNotificationAction(notification, action);
    }
  }
  private handleDesktopNotificationAction(notification: Notification, action: NotificationAction) {
    switch (action.action) {
      case 'delete':
        this.removeNotification(notification.id);
        break;
      case 'view':
        console.log('Ver notificación:', notification);
        break;
      case 'restock':
        console.log('Restock notificación:', notification);
        break;
      case 'update':
        console.log('Actualizar notificación:', notification);
        break;
      default:
        console.log('Acción no manejada:', action.action);
    }
  }
  removeNotification(id: number) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.updateNotificationCount();
  }
  clearAllNotifications() {
    if (this.isMobile || this.isTablet || this.isLaptopSmall) {
      this.notificationActionClicked.emit({
        notification: null,
        action: { action: 'clear_all', label: 'Limpiar todo', icon: 'clear_all' },
      });
    } else {
      this.notifications = this.notifications.map((n) => ({ ...n, unread: false }));
      this.updateNotificationCount();
    }
  }
  private updateNotificationCount() {
    this.notificationCount = this.getUnreadNotificationCount();
  }
  // === RATING - SIN CAMBIOS ===
  setRating(rating: number) {
    if (rating >= 1 && rating <= 5) {
      this.currentRating = rating;
    }
  }
  submitRating() {
    if (this.currentRating > 0) {
      if (this.isMobile || this.isTablet || this.isLaptopSmall) {
        this.ratingSelected.emit(this.currentRating);
      }
      this.showRatingSection = false;
      this.currentRating = 0;
    }
  }
  onRatingChange(rating: number) {
    this.setRating(rating);
    this.ratingSelected.emit(rating);
  }
  // === HELPERS - SIN CAMBIOS ===
  getBellButtonStyles() {
    const hasUnread = this.getUnreadNotificationCount() > 0;
    return {
      position: 'relative',
      color: hasUnread ? '#ff4444' : '#666',
    };
  }
  syncNotifications() {
    if (this.isMobile || this.isTablet || this.isLaptopSmall) {
      this.notifications = [...(this.notificaciones || [])];
    }
    this.updateNotificationCount();
  }
  getNotificationPanelState(): boolean {
    return this.notificationPanelOpen;
  }
  getConsultorioNumber(): string {
    const match = this.selectedConsultorio.match(/(\d+)/);
    return match ? match[1] : '1';
  }
  getConsultorioDisplayText(): string {
    return this.selectedConsultorio || 'Consultorio 1';
  }
// Actualizar métodos que usan usuario
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

  getSectionInitial(label: string): string {
    return label?.charAt(0).toUpperCase() || '';
  }
  trackByIndex(index: number): number {
    return index;
  }
  trackByLabel(index: number, item: MenuItem): string {
    return item.label;
  }
  trackByNotificationId(index: number, item: Notification): number {
    return item.id;
  }
  trackByConsultorio(index: number, item: string): string {
    return item;
  }
  getResponsiveState() {
    return { 
      isMobile: this.isMobile, 
      isTablet: this.isTablet, 
      isLaptopSmall: this.isLaptopSmall,
      isDesktopS: this.isDesktopS, 
      isDesktopL: this.isDesktopL 
    };
  }
ngOnDestroy() {
    if (this.isBrowser) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    // Cancelar la suscripción para evitar memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
async handleMenuClick(item: any) {
  console.log('🔥 CLICK DETECTADO - item:', JSON.stringify(item, null, 2));
  
  if (item.label === 'Nueva receta') {
    console.log('🎯 Es Nueva receta!');
    console.log('🔍 item.action:', item.action);
    console.log('🔍 tipo de action:', typeof item.action);
    console.log('🔍 action === "openModal":', item.action === 'openModal');
  }
  
  if (item.action === 'openModal') {
    //console.log('✅ Abriendo modal...');
     // const dialogRef = this.dialog.open(NuevaRecetaComponent, {
  //   width: '1080px',
  //   height: '500px',
  //   disableClose: false,
  //   panelClass: 'custom-modal'
  // });
  } else if (item.route) {
    console.log('📍 Navegando a:', item.route);
    this.router.navigate([item.route]);
  } else {
    console.log('❌ No hay action ni route definidos');
  }
}
goHome() {
  this.router.navigate(['/home']);
}

}