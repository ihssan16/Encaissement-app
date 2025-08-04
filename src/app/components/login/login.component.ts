import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email :string= '';
  password :string= '';
  isLoading = false; 

  constructor(private http: HttpClient, private router: Router,private snackBar: MatSnackBar ) {}

  login() {
    // Nettoyer les données de l'ancien utilisateur
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userId');
    this.isLoading = true;

    this.http.post<any>('http://localhost:3000/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        const email = res.user.email;
        const userKey = `user_${email}`;
 
   // Vérifie si un profil personnalisé existe déjà pour cet utilisateur
const existingUserData = localStorage.getItem('userKey');
if (!existingUserData) {
  const defaultUser = {
    nom: res.user.nom || 'Utilisateur',
    email: res.user.email,
    role: res.user.role,
    photoUrl: '' // valeur par défaut vide
  };
  localStorage.setItem('userKey', JSON.stringify(defaultUser));
}

        localStorage.setItem('userId', res.user._id); // ← Important pour filtrer les paiements
        localStorage.setItem('userEmail', res.user.email); 
        this.router.navigate(['/mes-paiements']);
      // Notification de succès
        this.snackBar.open('Connexion réussie !', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        this.router.navigate(['/mes-paiements']);
      },
      error: (err) => {
        this.isLoading = false; // Désactivation du spinner
        
        // Remplacement de l'alert par une snackbar
        this.snackBar.open(
          err.error.message || 'Erreur de connexion. Veuillez réessayer.', 
          'Fermer', 
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      },
      complete: () => {
        this.isLoading = false; // Désactivation du spinner quand complet
      }
    });
  }

}
