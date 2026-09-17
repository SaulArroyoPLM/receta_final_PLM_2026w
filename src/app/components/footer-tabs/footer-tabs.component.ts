import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
@Component({
  selector: 'app-footer-tabs',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './footer-tabs.component.html',  
  styleUrls: ['./footer-tabs.component.scss']   
})
export class FooterTabsComponent {
  
  constructor(private router: Router) {}
  
  navigateTo(route: string): void {
    this.router.navigate([route]);
    console.log('Navegando a:', route); // Para debug
  }
}