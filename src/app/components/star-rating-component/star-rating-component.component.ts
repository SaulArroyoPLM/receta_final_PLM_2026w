// star-rating-component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { StarRatingModalsComponent } from '../../modals/star-rating-modals/star-rating-modals.component';


@Component({
  selector: 'star-rating',
  standalone: true,
  imports: [CommonModule,
     FormsModule,
      MatButtonModule,
       MatIconModule],
  templateUrl: './star-rating-component.component.html',
  styleUrls: ['./star-rating-component.component.scss']
})
export class StarRatingComponent {
  @Output() ratingSubmitted = new EventEmitter<{rating: number, comment: string, wantsSurvey: boolean}>();
  @Output() ratingChange = new EventEmitter<number>(); // ✅ NUEVO: Event emitter para cuando cambia la calificación

  
  currentState = 0; // 0: estrellas, 1: comentario, 2: dialog de encuesta
  selectedRating = 0;
  comment = '';

  ratings = [
    { id: 1, name: 'Terrible' },
    { id: 2, name: 'Bad' },
    { id: 3, name: 'OK' },
    { id: 4, name: 'Good' },
    { id: 5, name: 'Excellent' }
  ];
   constructor(private dialog: MatDialog) {}

  onRate(value: number) {
    this.selectedRating = value;
    this.ratingChange.emit(value); // ✅ NUEVO: Emitir el evento cuando se selecciona una estrella
    setTimeout(() => {
      this.currentState = 1;
    }, 300);
  }

  getRatingText(): string {
    const rating = this.ratings.find(r => r.id === this.selectedRating);
    return rating ? rating.name : '';
  }

getStarsArray(): number[] {
  return [5, 4, 3, 2, 1]; // ✅ Invertido para que funcione con direction: rtl
}

  cancel() {
    this.currentState = 0;
    this.selectedRating = 0;
    this.comment = '';
    this.resetRadioButtons();
  }


  openModal() {
    const dialogRef = this.dialog.open(StarRatingModalsComponent, {
       width: '90vw',
      maxWidth: '850px',
      maxHeight: '85vh',
      
      data: { 
      rating: this.selectedRating,  // ✅ Pasar la calificación
      comment: this.comment          // ✅ Pasar el comentario si existe
    }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ratingSubmitted.emit(result);
         this.resetComponent();
      }
      this.selectedRating = 0;
    });
  }



  
  onYesSurvey(): void {
    this.ratingSubmitted.emit({
      rating: this.selectedRating,
      comment: this.comment,
      wantsSurvey: true
    });
    this.resetComponent();
  }

  private resetComponent() {
    this.currentState = 0;
    this.selectedRating = 0;
    this.comment = '';
    this.resetRadioButtons();
  }

  private resetRadioButtons() {
    const radioButtons = document.querySelectorAll('input[name="rating"]') as NodeListOf<HTMLInputElement>;
    radioButtons.forEach(radio => radio.checked = false);
  }

  
}