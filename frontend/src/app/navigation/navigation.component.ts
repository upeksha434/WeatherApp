import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent {
  @Input() currentPage: string = 'weather';
  @Output() pageChange = new EventEmitter<string>();

  navigateTo(page: string) {
    this.pageChange.emit(page);
  }
}
