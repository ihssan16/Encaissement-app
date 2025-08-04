import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { PaimentService } from '../services/paiment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  user: any = {
    nom: '',
    email: '',
    role: '',
    photoUrl: ''
  };

  isDarkTheme = false;
  showEditModal = false;
  showPasswordModal = false;

  constructor(
    private paimentService: PaimentService,
    private notifService: NotificationService,
    private snackBar: MatSnackBar
  ) {}

  // Remplacez tous les `alert()` par :
  private showNotification(message: string, action: string = 'OK'): void {
    this.snackBar.open(message, action, {
      duration: 3000, // 3 secondes
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  ngOnInit(): void {
    this.loadThemePreference();
    this.loadUserData();
  }

  loadUserData(): void {
    const email = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');

    if (email) {
      this.user.email = email; // 👈 Garde l'email du compte connecté
      const userKey = `user_${email}`;
      const savedUser = localStorage.getItem(userKey);

      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        this.user.nom = parsed.nom || 'Utilisateur';
        this.user.role = parsed.role || '';
        this.user.photoUrl = parsed.photoUrl || '';
      }
    }

    if (userId) {
      this.paimentService.getPaiementsByUser(userId).subscribe({
        next: (paiements) => {
          if (paiements && paiements.length > 0) {
            this.user.nom = paiements[0].client;
          }
        },
        error: (err) => {
          console.error("Erreur récupération paiements:", err);
        }
      });
    }
  }

  updateUser(updatedData: any): void {
    this.user = { ...this.user, ...updatedData };
    const email = localStorage.getItem('userEmail');
    if (email) {
      localStorage.setItem(`user_${email}`, JSON.stringify(this.user));
    }

    this.showEditModal = false;
    this.showNotification('Profil mis à jour avec succès!');
    this.notifService.addNotification("Votre profil a été mis à jour");
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');

    const themeMessage = this.isDarkTheme ? "Thème sombre activé" : "Thème clair activé";
    this.notifService.addNotification(themeMessage);
  }

  private applyTheme(): void {
    const html = document.documentElement;
    html.classList.toggle('dark-theme', this.isDarkTheme);
  }

  changePassword(passwordData: any) {
    if (passwordData.newPassword === passwordData.confirmPassword) {
      localStorage.setItem('userPassword', passwordData.newPassword);
      this.showPasswordModal = false;
      this.notifService.addNotification("Votre mot de passe a été changé avec succès");
      this.showNotification('Mot de passe changé avec succès!');
    } else {
      this.notifService.addNotification("Erreur: Les mots de passe ne correspondent pas");
      this.showNotification('Les mots de passe ne correspondent pas!');
    }
  }

  openEditModal(): void {
    this.showEditModal = true;
  }

  openPasswordModal(): void {
    this.showPasswordModal = true;
  }

  onPhotoSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const photoUrl = reader.result as string;
        this.user.photoUrl = photoUrl;

        const email = localStorage.getItem('userEmail');
        if (email) {
          localStorage.setItem(`user_${email}`, JSON.stringify(this.user));
        }

        this.notifService.addNotification("Votre photo de profil a été mise à jour");
        this.showNotification('Photo de profil mise à jour !');
      };

      reader.readAsDataURL(file);
    }
  }

  getInitial(): string {
    return this.user.nom ? this.user.nom.charAt(0).toUpperCase() : '?';
  }

  loadThemePreference(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
    this.applyTheme();
  }
}
