import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  searchTerm = '';
  showNotif = false;
  notifications = [
    'Paiement retardé pour CIN 123456',
    '3 paiements effectués aujourd\'hui',
  ];

  toggleNotifications() {
    this.showNotif = !this.showNotif;
  }

}
