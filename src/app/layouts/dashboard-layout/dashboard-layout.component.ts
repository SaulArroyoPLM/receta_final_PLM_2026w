// src/app/layouts/dashboard-layout/dashboard-layout.component.ts
import { Component, Input, OnInit, OnDestroy, AfterViewInit, ViewChild, Renderer2, Inject, PLATFORM_ID, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { MenuMasterComponent } from '../../components/menu-master/menu-master.component';
import { NotificationMasterComponent } from '../../components/notificaciones-master-componet/notificaciones-master-componet.component';
import { StarRatingComponent } from '../../components/star-rating-component/star-rating-component.component';
import { FooterTabsComponent } from '../../components/footer-tabs/footer-tabs.component';
import { Notification } from '../../interfaces/notification.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';


  //import { NuevaRecetaComponent } from '../../modals/nueva-receta/nueva-receta.component';  //
  
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuMasterComponent,
    NotificationMasterComponent,
    StarRatingComponent,
    FooterTabsComponent,
    MatIconModule,
    MatBadgeModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('menuMaster') menuMaster!: MenuMasterComponent;
  @ViewChild('content', { read: ElementRef }) contentEl!: ElementRef;
  @ViewChild('footer', { read: ElementRef }) footerEl!: ElementRef;

  // ===== INPUTS OPCIONALES =====
  @Input() pageTitle: string = 'Dashboard';
  @Input() showNotifications: boolean = true; // 🔥 Por defecto TRUE para mostrar notificaciones
  @Input() showFooter: boolean = true;
  @Input() showNewRecipeButton: boolean = true;
  @Input() customNotifications: Notification[] = [];

  // ===== PROPIEDADES PRINCIPALES =====
  nombreDoctor = '';
  ratingValue = 0;
  consultorios = ['Consultorio 1', 'Consultorio 2', 'Consultorio 3'];
  selectedConsultorio = this.consultorios[0];

  // ===== NOTIFICACIONES =====
  notificaciones: Notification[] = [];

  // ===== ESTADOS DEL UI =====
  showMobileNotifications = false;
  sidebarOpen = true;
  sidebarCollapsed = false; // 🔥 Estado de colapso del sidebar

  // ===== BREAKPOINTS RESPONSIVOS =====
  isMobile = false;
  isTablet = false;
  isDesktopSmall = false;
  isDesktopMedium = false;
  isDesktopLarge = false;
  is4K = false;
  isUltraWide = false;

  // ===== ESCALAS ADAPTATIVAS =====
  adaptiveScale = 1;
  contentScale = 1;
  
  // ===== UTILIDADES =====
  private isBrowser = false;
  private resizeTimeout: any;
  private scrollObserver!: MutationObserver;
  private resizeObserver!: ResizeObserver;
  private autoScrollPadding = 0;
  private scrollThrottle = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private usuarioService: UsuarioService,
    private router: Router,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.nombreDoctor = this.usuarioService.getUsuario().nombre;
    this.usuarioService.usuario$.subscribe(u => {
      this.nombreDoctor = u.nombre;
      this.cdr.detectChanges();
    });
  }

  // ===== LIFECYCLE HOOKS =====
  
  ngOnInit(): void {
    if (this.isBrowser) {
      this.initializeLayout();
      this.setupEventListeners();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.refreshLayout();
        this.setupObservers();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.removeEventListeners();
    this.cleanupObservers();
    
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  // ===== INICIALIZACIÓN =====

  private initializeLayout(): void {
    this.refreshLayout();
    this.loadNotifications();
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleOrientationChange);
  }

  private removeEventListeners(): void {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
  }

  // ===== MANEJO DE EVENTOS DE RESIZE =====

  private handleResize = (): void => {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      this.refreshLayout();
    }, 150);
  };

  private handleOrientationChange = (): void => {
    setTimeout(() => {
      this.refreshLayout();
    }, 300);
  };

  // ===== LÓGICA RESPONSIVA PRINCIPAL =====

  private refreshLayout = (): void => {
    const width = window.innerWidth;
    
    this.resetBreakpoints();
    
    if (width < 768) {
      this.isMobile = true;
    } else if (width >= 768 && width < 1024) {
      this.isTablet = true;
    } else if (width >= 1024 && width < 1200) {
      this.isDesktopSmall = true;
    } else if (width >= 1200 && width < 1440) {
      this.isDesktopMedium = true;
    } else if (width >= 1440 && width < 1920) {
      this.isDesktopLarge = true;
    } else if (width >= 1920 && width < 2560) {
      this.is4K = true;
    } else {
      this.isUltraWide = true;
    }

    this.updateAdaptiveScales(width);
    this.adjustScrollHeight();

    if (this.isDesktop && this.showMobileNotifications) {
      this.showMobileNotifications = false;
    }

    this.logBreakpointChange(width);
  };

  private resetBreakpoints(): void {
    this.isMobile = false;
    this.isTablet = false;
    this.isDesktopSmall = false;
    this.isDesktopMedium = false;
    this.isDesktopLarge = false;
    this.is4K = false;
    this.isUltraWide = false;
  }

  private updateAdaptiveScales(width: number): void {
    if (width < 768) {
      this.adaptiveScale = 0.85;
      this.contentScale = 0.9;
    } else if (width < 1024) {
      this.adaptiveScale = 0.9;
      this.contentScale = 0.95;
    } else if (width < 1440) {
      this.adaptiveScale = 1;
      this.contentScale = 1;
    } else if (width < 1920) {
      this.adaptiveScale = 1.05;
      this.contentScale = 1.02;
    } else {
      this.adaptiveScale = 1.1;
      this.contentScale = 1.05;
    }
  }

  // ===== GETTERS =====

  get isDesktop(): boolean {
    return this.isDesktopSmall || this.isDesktopMedium || 
           this.isDesktopLarge || this.is4K || this.isUltraWide;
  }

  get isMobileOrTablet(): boolean {
    return this.isMobile || this.isTablet;
  }

  get unreadNotifications(): Notification[] {
    return this.notificaciones.filter(n => n.unread || false);
  }

  // 🔥 SISTEMA DE GRID DINÁMICO - MIGRADO DESDE HOME
  getGridTemplateColumns(): string {
    // Mobile y Tablet - solo main (sin sidebar ni notificaciones)
    if (this.isMobile || this.isTablet) {
      return '1fr';
    }
    
    // Desktop Small (1024-1199px) - main + notificaciones
    // El sidebar del menu-master está en el header superior
    if (this.isDesktopSmall) {
      return this.showNotifications ? '1fr 300px' : '1fr';
    }
    
    // Desktop Medium y superiores (≥1200px) - sidebar + main + notificaciones
    if (this.sidebarCollapsed) {
      return this.showNotifications ? '130px 1fr 300px' : '130px 1fr'; // Sidebar colapsado
    }
    
    return this.showNotifications ? '280px 1fr 300px' : '280px 1fr'; // Sidebar expandido
  }

  getGridTemplateAreas(): string {
    // Mobile y Tablet - solo main
    if (this.isMobile || this.isTablet) {
      return '"main"';
    }
    
    // Desktop Small (1024-1199px) - main + notificaciones (sin sidebar inline)
    if (this.isDesktopSmall) {
      return this.showNotifications ? '"main notifications"' : '"main"';
    }
    
    // Desktop Medium y superiores - sidebar + main + notificaciones
    return this.showNotifications ? '"sidebar main notifications"' : '"sidebar main"';
  }

  // 🔥 Método para controlar cuándo mostrar notificaciones
  shouldShowNotifications(): boolean {
    return this.showNotifications && (this.isDesktopSmall || this.isDesktop);
  }

  shouldShowSidebarInline(): boolean {
    // Sidebar inline solo desde Desktop Medium en adelante
    return this.isDesktopMedium || this.isDesktopLarge || this.is4K || this.isUltraWide;
  }

  shouldShowMobileHeader(): boolean {
    // Header móvil en Mobile, Tablet y Desktop Small
    return this.isMobile || this.isTablet || this.isDesktopSmall;
  }

  // ===== MÉTODOS PARA OBTENER DIMENSIONES =====

  getSidebarWidth(): string {
    return this.sidebarCollapsed ? '130px' : '280px';
  }

  getNotificationsWidth(): string {
    if (this.isDesktopSmall) return '250px';
    if (this.isDesktopMedium) return '280px';
    if (this.isDesktopLarge) return '300px';
    if (this.is4K || this.isUltraWide) return '';
    return '300px';
  }

  getNotificationsListHeight(): string {
    const notificationCount = this.notificaciones.length;
    if (notificationCount === 0) return '120px';
    
    const baseHeightPerNotification = 70;
    const dynamicHeight = notificationCount * baseHeightPerNotification;
    const maxHeight = 300;
    
    return `${Math.min(dynamicHeight, maxHeight)}px`;
  }

  // ===== MÉTODOS DE EVENTOS =====

  onConsultorioSeleccionado(nombre: string): void {
    this.selectedConsultorio = nombre;
    console.log('Consultorio seleccionado:', nombre);
  }

  // 🔥 FIXED: Manejo correcto del evento sidebarToggle
  onSidebarToggle(event: { open: boolean; collapsed: boolean }): void {
    this.sidebarOpen = event.open;
    this.sidebarCollapsed = event.collapsed;
    console.log('Sidebar Toggle - Open:', this.sidebarOpen, 'Collapsed:', this.sidebarCollapsed);
    this.forceLayoutRefresh();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    
    if (this.isMobile) {
      this.sidebarOpen = !this.sidebarOpen;
      if (this.sidebarOpen) {
        this.showMobileNotifications = false;
      }
    }
    
    this.forceLayoutRefresh();
  }

  onMenuItemClick(): void {
    if (this.showMobileNotifications) {
      this.showMobileNotifications = false;
    }
    
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  // ===== MODAL NUEVA RECETA (COMENTADO) =====
  //onNuevaRecetaClick() {
    //const dialogRef = this.dialog.open(NuevaRecetaComponent, {
      //width: '1080px',
      //height: '500px',
    //});
    //dialogRef.afterClosed().subscribe(result => {
      //console.log('Modal cerrado, acción:', result);
    //});
  //}

  // ===== MÉTODOS DE NOTIFICACIONES =====

  toggleMobileNotifications(): void {
    this.showMobileNotifications = !this.showMobileNotifications;
    
    if (this.showMobileNotifications && this.isMobile && this.sidebarOpen) {
      this.sidebarOpen = false;
    }

    this.updateScrollBehavior();
  }

  closeMobileNotifications(): void {
    this.showMobileNotifications = false;
    this.updateScrollBehavior();
  }

  private updateScrollBehavior(): void {
    if (this.showMobileNotifications && this.isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  onNotificationAction(event: any): void {
    console.log('Acción de notificación:', event);
    switch (event.action) {
      case 'mark_read':
        this.markNotificationAsRead(event.notificationId);
        break;
      case 'delete':
        this.deleteNotification(event.notificationId);
        break;
      case 'navigate':
        this.router.navigate([event.route]);
        break;
      default:
        console.log('Acción no reconocida:', event);
    }
  }

  private markNotificationAsRead(id: number): void {
    const notification = this.notificaciones.find(n => n.id === id);
    if (notification) {
      notification.unread = false;
    }
  }

  private deleteNotification(id: number): void {
    this.notificaciones = this.notificaciones.filter(n => n.id !== id);
  }

  private loadNotifications(): void {
    if (this.customNotifications.length > 0) {
      this.notificaciones = this.customNotifications;
    } else {
      this.notificaciones = [
        {
          id: 1,
          type: 'info',
          title: 'Verificación pendiente',
          message: 'Aún no puedes recetar exitosamente porque tu cédula aún no está verificada',
          icon: 'info',
          time: 'Hace 2 minutos',
          unread: true,
          link: '/verificacion',
          actions: [{ action: 'view', label: 'Verificar cédula', icon: 'visibility' }]
        },
        {
          id: 2,
          type: 'success',
          title: 'Receta pendiente',
          message: 'Tienes una receta pendiente de completar',
          icon: 'assignment',
          time: 'Hace 5 minutos',
          link: '/verificacion',
          unread: true,
          actions: [{ action: 'view', label: 'Ir a receta', icon: 'visibility' }]
        }
      ];
    }
  }

  // ===== MÉTODOS DE RATING =====

  onRatingSelected(data: { rating: number, comment: string }): void {
    this.ratingValue = data.rating;
    console.log('Rating seleccionado:', data);
  }

  onMenuRatingSelected(event: any): void {
    this.onRatingSelected(event);
  }

  // ===== UTILIDADES =====

  trackByNotificationId(index: number, item: Notification): any {
    return item.id || index;
  }

  forceLayoutRefresh(): void {
    this.cdr.detectChanges();
  }

  // ===== SCROLL SYSTEM =====

  private adjustScrollHeight(): void {
    if (!this.contentEl || !this.contentEl.nativeElement) return;

    const innerScroll = this.contentEl.nativeElement.querySelector('.inner-scroll') as HTMLElement;
    const scrollableContent = this.contentEl.nativeElement.querySelector('.scrollable-content') as HTMLElement;

    if (innerScroll && scrollableContent) {
      const viewportHeight = window.innerHeight;
      const headerEl = document.querySelector('.mobile-toolbar') as HTMLElement;
      const footerEl = this.footerEl ? this.footerEl.nativeElement : null;
      const headerHeight = headerEl ? headerEl.offsetHeight : 56;
      const footerHeight = footerEl ? footerEl.offsetHeight : (this.showFooter ? 50 : 0);
      const paddingTotal = 48;
      const desiredGap = 40;

      const calculatedHeight = viewportHeight - headerHeight - footerHeight - paddingTotal - desiredGap;

      this.renderer.setStyle(innerScroll, 'height', `${calculatedHeight}px`);
      this.renderer.setStyle(innerScroll, 'overflow-y', 'auto');
      this.renderer.setStyle(scrollableContent, 'min-height', `${calculatedHeight}px`);
      this.renderer.setStyle(scrollableContent, 'padding-bottom', `${desiredGap + footerHeight + 20}px`);

      if (scrollableContent.scrollHeight > calculatedHeight) {
        this.renderer.addClass(scrollableContent, 'has-more-content');
      } else {
        this.renderer.removeClass(scrollableContent, 'has-more-content');
      }
    }
  }

  private setupObservers(): void {
    const scrollableContent = document.querySelector('.scrollable-content') as HTMLElement;
    const mainContentArea = document.querySelector('.main-content-area') as HTMLElement;

    if (scrollableContent && mainContentArea) {
      this.scrollObserver = new MutationObserver(() => {
        if (!this.scrollThrottle) {
          this.scrollThrottle = true;
          this.adjustScrollHeight();
          this.updateAutoPadding(scrollableContent);
          setTimeout(() => this.scrollThrottle = false, 300);
        }
      });
      this.scrollObserver.observe(scrollableContent, { childList: true, subtree: true });

      this.resizeObserver = new ResizeObserver(() => {
        this.adjustScrollHeight();
      });
      this.resizeObserver.observe(mainContentArea);
    }
  }

  private cleanupObservers(): void {
    if (this.scrollObserver) this.scrollObserver.disconnect();
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  private updateAutoPadding(scrollableContent: HTMLElement): void {
    const cards = scrollableContent.querySelectorAll('.medication-card, .recipe-card, mat-card');
    const lastCard = cards[cards.length - 1] as HTMLElement;

    if (lastCard) {
      this.autoScrollPadding = cards.length > 4 ? 60 : 40;
      this.renderer.setStyle(scrollableContent, 'padding-bottom', `${this.autoScrollPadding}px`);
      this.renderer.addClass(scrollableContent, 'debug-auto-scroll');
      this.renderer.setAttribute(scrollableContent, 'data-padding', this.autoScrollPadding.toString());
    }
  }

  // ===== DEBUG =====

  private logBreakpointChange(width: number): void {
    if (typeof console !== 'undefined' && console.log) {
      const breakpoint = this.getCurrentBreakpointName();
      console.log(`📱 Layout: ${breakpoint} (${width}px) | Grid: ${this.getGridTemplateColumns()} | Areas: ${this.getGridTemplateAreas()}`);
    }
  }

  private getCurrentBreakpointName(): string {
    if (this.isMobile) return 'Mobile';
    if (this.isTablet) return 'Tablet';
    if (this.isDesktopSmall) return 'Desktop Small';
    if (this.isDesktopMedium) return 'Desktop Medium';
    if (this.isDesktopLarge) return 'Desktop Large';
    if (this.is4K) return '4K';
    if (this.isUltraWide) return 'Ultra Wide';
    return 'Unknown';
  }

  getLayoutInfo(): { [key: string]: any } {
    return {
      breakpoint: this.getCurrentBreakpointName(),
      width: window.innerWidth,
      showNotifications: this.shouldShowNotifications(),
      sidebarCollapsed: this.sidebarCollapsed,
      gridColumns: this.getGridTemplateColumns(),
      gridAreas: this.getGridTemplateAreas()
    };
  }
}