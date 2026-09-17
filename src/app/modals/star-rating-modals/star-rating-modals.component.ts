import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; 

@Component({
  standalone: true,
  selector: 'app-star-rating-modals',
  templateUrl: './star-rating-modals.component.html',
  styleUrls: ['./star-rating-modals.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    FormsModule 
  ]
})
export class StarRatingModalsComponent implements OnInit {

  selectedRating = 0; // Calificación del Escenario 1
  comment = '';

  // ✅ Nuevas calificaciones para cada sección
  ratingCrearReceta = 0;
  ratingPacientes = 0;
  ratingExperienciaGeneral = 0;

  ratings = [
    { id: 1, name: 'Terrible' },
    { id: 2, name: 'Malo' },
    { id: 3, name: 'Regular' },
    { id: 4, name: 'Bueno' },
    { id: 5, name: 'Excelente' }
  ];

  constructor(
    public dialogRef: MatDialogRef<StarRatingModalsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    // ✅ Recibir la calificación inicial del Escenario 1
    if (this.data?.rating) {
      this.selectedRating = this.data.rating;
    }
    if (this.data?.comment) {
      this.comment = this.data.comment;
    }
  }

  getStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getRatingText(): string {
    const rating = this.ratings.find(r => r.id === this.selectedRating);
    return rating ? rating.name : '';
  }

  // ✅ Método para seleccionar calificación de cada sección
  selectRating(section: string, star: number) {
    switch(section) {
      case 'crear-receta':
        this.ratingCrearReceta = star;
        break;
      case 'pacientes':
        this.ratingPacientes = star;
        break;
      case 'experiencia':
        this.ratingExperienciaGeneral = star;
        break;
    }
  }

  onYesSurvey() {
    const result = {
      ratingInicial: this.selectedRating,
      ratingCrearReceta: this.ratingCrearReceta,
      ratingPacientes: this.ratingPacientes,
      ratingExperienciaGeneral: this.ratingExperienciaGeneral,
      comment: this.comment,
      wantsSurvey: true
    };
    console.log('Datos enviados:', result);
    this.dialogRef.close(result);
  }

  onNoThanks() {
    this.dialogRef.close(null);
  }


}