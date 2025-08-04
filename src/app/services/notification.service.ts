import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notifications = new BehaviorSubject<{ message: string, time: string, type: string }[]>([]);
  public notifications$ = this._notifications.asObservable();
  private notifications: { message: string, time: string, type: string }[] = [];

  constructor(private snackBar: MatSnackBar) {}

  // Méthode pour les notifications rapides (snackbar)
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  // Méthode pour les notifications persistantes (sidebar)
  addNotification(message: string, type: 'success'|'error'|'info' = 'info'): void {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newNotification = { message, time, type };
    this.notifications.unshift(newNotification);
    this._notifications.next(this.notifications);
    
    // Affiche aussi une snackbar pour les erreurs/urgences
    if (type === 'error') {
      this.showError(message);
    }
  }

  getNotifications() {
    return this.notifications;
  }

clearNotifications(): void {
  this.notifications = [];
  this._notifications.next([]);
}


}
