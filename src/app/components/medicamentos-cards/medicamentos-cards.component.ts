import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IpaComponent } from '../../modals/Ipa.component/ipa.component';
import { Medicamento } from '../../interfaces/medicamento.interface';
import { MedicamentosService } from '../../services/medicamentos.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  selector: 'app-medicamentos-cards',
  templateUrl: './medicamentos-cards.component.html',
  styleUrls: ['./medicamentos-cards.component.scss']
})
export class MedicamentosCardsComponent implements OnInit {
  @Input() medicamentos: Medicamento[] = [];
  @Input() loading: boolean = false;


  expandedCards: Set<number> = new Set();


  constructor(
    private router: Router,
    private dialog: MatDialog,
    private medicamentosService: MedicamentosService
  ) {}

  ngOnInit() {
    if (this.medicamentos.length === 0) {
      this.medicamentos = this.medicamentosService.getMedicamentos();
    }
  }



  // Toggle de expansión de cards
  toggleExpand(medicamentoId: number, event: Event) {
    event.stopPropagation();
    if (this.expandedCards.has(medicamentoId)) {
      this.expandedCards.delete(medicamentoId);
    } else {
      this.expandedCards.add(medicamentoId);
    }
  }


  isExpanded(medicamentoId: number): boolean {
    return this.expandedCards.has(medicamentoId);
  }

  navigateToMedicamento(medicamento: Medicamento) {
    const dialogRef = this.dialog.open(IpaComponent, {
      data: { medicamento },
      width: '90vw',
      maxWidth: '890px',
      maxHeight: '100vh',
      panelClass: 'modal-medicamento',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog cerrado con:', result);
      }
    });
  }

  onKeyPress(event: KeyboardEvent, medicamento: Medicamento) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToMedicamento(medicamento);
    }
  }

  trackByMedicamento(index: number, medicamento: any): string {
    return medicamento.id || index;
  }
}
