// alphabet-navigator.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface NavigationItem {
  letter: string;
  totalPages: number;
  currentPage: number;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  selector: 'app-alphabet-navigator',
  templateUrl: './alphabet-navigator.component.html',
  styleUrls: ['./alphabet-navigator.component.scss']
})
export class AlphabetNavigatorComponent implements OnInit {
  @Input() productData: { [key: string]: number } = {}; // Ejemplo: {'A': 15, 'B': 8, 'C': 23}
  @Input() itemsPerPage: number = 10;
  @Output() navigationChange = new EventEmitter<{letter: string, page: number}>();

  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  selectedLetter: string = 'A';
  selectedPage: number = 1;
  navigationData: { [key: string]: NavigationItem } = {};

  ngOnInit() {
    this.initializeNavigationData();
  }

  initializeNavigationData() {
    this.alphabet.forEach(letter => {
      const totalItems = this.productData[letter] || 0;
      const totalPages = Math.ceil(totalItems / this.itemsPerPage);
      
      this.navigationData[letter] = {
        letter: letter,
        totalPages: Math.max(totalPages, 1),
        currentPage: 1
      };
    });
  }

  selectLetter(letter: string) {
    this.selectedLetter = letter;
    this.selectedPage = this.navigationData[letter].currentPage;
    this.emitNavigation();
  }

  selectPage(page: number) {
    this.selectedPage = page;
    this.navigationData[this.selectedLetter].currentPage = page;
    this.emitNavigation();
  }

  getPageNumbers(): number[] {
    const totalPages = this.navigationData[this.selectedLetter]?.totalPages || 1;
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  hasProducts(letter: string): boolean {
    return (this.productData[letter] || 0) > 0;
  }

  goToPreviousPage() {
    const currentPages = this.getPageNumbers();
    const currentIndex = currentPages.indexOf(this.selectedPage);
    if (currentIndex > 0) {
      this.selectPage(currentPages[currentIndex - 1]);
    }
  }

  goToNextPage() {
    const currentPages = this.getPageNumbers();
    const currentIndex = currentPages.indexOf(this.selectedPage);
    if (currentIndex < currentPages.length - 1) {
      this.selectPage(currentPages[currentIndex + 1]);
    }
  }

  canGoToPrevious(): boolean {
    return this.selectedPage > 1;
  }

  canGoToNext(): boolean {
    const totalPages = this.navigationData[this.selectedLetter]?.totalPages || 1;
    return this.selectedPage < totalPages;
  }

  private emitNavigation() {
    this.navigationChange.emit({
      letter: this.selectedLetter,
      page: this.selectedPage
    });
  }
}