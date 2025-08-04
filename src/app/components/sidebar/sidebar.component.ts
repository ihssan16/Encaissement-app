import { Component, OnInit  } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isClosed = false;
  showNotifications = false;
  notifications: { message: string, time: string }[] = [];

constructor(
  private notifService: NotificationService,
  private router: Router) {}

logout(): void {
  // Ne pas supprimer l'utilisateur modifié du localStorage
  // Juste supprimer son ID pour déconnecter l’utilisateur
localStorage.removeItem('userId');
localStorage.removeItem('userEmail');
localStorage.removeItem('userId');
// Vider les notifications du compte précédent
  this.notifService.clearNotifications();

  // Redirection vers la page de connexion
  this.router.navigate(['/login']);
}

  ngOnInit() {
    this.notifications = this.notifService.getNotifications();
    this.notifService.notifications$.subscribe(n => {
      this.notifications = n;
    });
  }

  toggleSidebar() {
    this.isClosed = !this.isClosed;
    // Ferme aussi les notifications quand on réduit la sidebar
  if (this.isClosed) this.showNotifications = false; 

  }

  

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }


}
