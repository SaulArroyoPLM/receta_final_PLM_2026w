import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';

interface RecetaFavorita {
  nombre: string;
  icono: string;
  id?: number;
}

@Component({
  selector: 'app-recetas-favoritas',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    MatCardModule
  ],
  templateUrl: './recetas-favoritas-componet.html',
  styleUrls: ['./recetas-favoritas-componet.scss']
})
export class RecetasFavoritasComponent implements OnInit {
  displayedColumns: string[] = ['icono', 'nombre', 'receta_acciones'];
  
  panelOpenState = signal<boolean>(false); // For the main favorites panel
  archivedPanelState = signal<boolean>(false); // For the archived panel
  
  recetasFavoritas = new MatTableDataSource<RecetaFavorita>([
    { id: 1, nombre: 'Resfriado común', icono: 'add_notes' },
    { id: 2, nombre: 'Lumbalgia aguda', icono: 'add_notes' },
    { id: 3, nombre: 'Migraña', icono: 'add_notes' },
  ]);

  ngOnInit() {}

  onEditarReceta(receta: RecetaFavorita, event: Event) {
    event.stopPropagation();
    console.log('Editando receta:', receta);
  }

  onDuplicarReceta(receta: RecetaFavorita, event: Event) {
    event.stopPropagation();
    console.log('Duplicando receta:', receta);
    const nuevaReceta: RecetaFavorita = {
      ...receta,
      id: this.recetasFavoritas.data.length + 1,
      nombre: `${receta.nombre} (Copia)`
    };
    this.recetasFavoritas.data = [...this.recetasFavoritas.data, nuevaReceta];
  }

  onEliminarReceta(receta: RecetaFavorita, event: Event) {
    event.stopPropagation();
    console.log('Eliminando receta:', receta);
    if (confirm(`¿Estás seguro de que quieres eliminar la receta "${receta.nombre}"?`)) {
      this.recetasFavoritas.data = this.recetasFavoritas.data.filter(r => r.id !== receta.id);
    }
  }
}