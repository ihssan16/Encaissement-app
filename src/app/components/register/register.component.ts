import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email = '';
  password = '';
constructor(
  private http: HttpClient, 
  private router: Router,
  private notificationService: NotificationService
) {}

  register() {
    this.http.post('http://localhost:3000/api/auth/register', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Compte créé avec succès !');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.notificationService.showError(err.error.message || 'Erreur lors de la création du compte.');
      }
    });
  }

}
