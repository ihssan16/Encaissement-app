import { Component,OnInit } from '@angular/core';
import { PaimentService } from 'src/app/services/paiment.service';
@Component({
  selector: 'app-mes-paiements',
  templateUrl: './mes-paiements.component.html',
  styleUrls: ['./mes-paiements.component.scss']
})
export class MesPaiementsComponent implements OnInit{
  mesPaiements: any[] = [];
  nom: any;

  constructor(private paimentService: PaimentService) {}

  ngOnInit(): void {
    ///
  const user = localStorage.getItem('user');
  if (user) {
    this.nom = JSON.parse(user).nom;
  }


    const userId = localStorage.getItem('userId'); // ✅ récupération directe

    if (userId) {
      this.paimentService.getPaiementsByUser(userId).subscribe({
        next: (data) => {
          this.mesPaiements = data;
        },
        error: (err) => {
          console.error("Erreur lors de la récupération des paiements :", err);
        }
      });
    } else {
      console.warn("Aucun utilisateur connecté !");
    }
  }


}
