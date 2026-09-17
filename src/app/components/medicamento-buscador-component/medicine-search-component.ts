import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, takeUntil, switchMap } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

// Interfaces y Servicios
import { Medicamento } from '../../interfaces/medicamento.interface';
import { MedicamentosService } from '../../services/medicamentos.service';

@Component({
  selector: 'app-medicine-search',
  standalone: true,
  templateUrl: './medicine-search-component.html',
  styleUrls: ['./medicine-search-component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatOptionModule,
    MatButtonModule,
    RouterModule
  ]
})
export class MedicineSearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  filteredMedicamentos!: Observable<Medicamento[]>;
  private destroy$ = new Subject<void>();

  // ✅ Inyectamos el servicio
  constructor(
    private router: Router,
    private medicamentosService: MedicamentosService
  ) {}

  ngOnInit(): void {
    this.initializeSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSearch(): void {
    this.filteredMedicamentos = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => this.getSearchValue(value)),
      switchMap(query => {
        // Si no hay búsqueda, mostramos todos los medicamentos
        if (!query || query.trim().length === 0) {
          return [this.medicamentosService.getMedicamentos()];
        }
        // Si hay búsqueda, usamos el método de búsqueda del servicio
        return this.medicamentosService.buscarMedicamentos(query);
      }),
      takeUntil(this.destroy$)
    );
  }

  private getSearchValue(value: string | Medicamento | null): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object') {
      return value.marca ?? '';
    }
    return '';
  }

  // ✅ Navega a consultar-medicamentos con el medicamento seleccionado
  onMedicamentoSelected(medicamento: Medicamento): void {
    console.log('Medicamento seleccionado:', medicamento);
    
    this.router.navigate(['/consultar-medicamentos'], {
      state: { 
        medicamento: medicamento,
        filtro: medicamento.marca
      }
    });
  }

  displayFn = (medicamento: Medicamento | null): string => {
    if (!medicamento) return '';
    return medicamento.marca ?? '';
  };
  
  ejecutarBusqueda(): void {
    const searchValue = this.getSearchValue(this.searchControl.value);
    console.log('Ejecutando búsqueda:', searchValue);
    
    if (searchValue.trim().length > 0) {
      this.router.navigate(['/consultar-medicamentos'], {
        queryParams: { busqueda: searchValue }
      });
    }
  }

  limpiarBusqueda(): void {
    this.searchControl.setValue('');
    this.searchControl.markAsUntouched();
    console.log('Búsqueda limpiada');
  }

  trackByMedicamento(index: number, medicamento: Medicamento): number {
    return medicamento.id;
  }

  verTodo(): void {
    this.router.navigate(['/consultar-medicamentos']);
  }
}