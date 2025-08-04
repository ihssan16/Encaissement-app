// src/app/components/paiement-form/paiement-form.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import {  PaimentService } from 'src/app/services/paiment.service';
import { Paiement } from '../../models/paiement.model';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-paiement-form',
  templateUrl: './paiement-form.component.html',
  styleUrls: ['./paiement-form.component.scss']
})
export class PaiementFormComponent {
  paiement: Paiement = {
    client: '',
    montant: 0,
    moyen: 'espèces',
    description:'' ,
    faculte: ''
  };
  
  isLoading = false;
  isEditMode=false;

  constructor(
    private paimentService: PaimentService,
    private router: Router,
    private notificationService: NotificationService,
    private dialog: MatDialog
   ) {}

  ajouterPaiement(): void {

  if (this.isLoading) return;
  
  this.isLoading = true;
  console.log('Données du formulaire:', this.paiement); // Log de débogage
  const utilisateurId = localStorage.getItem('userId'); // récupère l'ID utilisateur connecté

  const paiementData = {
    ...this.paiement,
    utilisateurId: utilisateurId // on ajoute l'ID dans le paiement
  };
  this.paimentService.ajouterPaiement(paiementData).subscribe({
    next: (response) => {
      console.log('Réponse du serveur:', response); // Log la réponse
      this.notificationService.showSuccess('Paiement ajouté avec succès !');
      this.router.navigate(['/paiements']);
    },
    error: (error) => {
      console.error('Erreur complète:', error); // Log l'erreur complète
      this.notificationService.showError(`Erreur lors de l'ajout: ${error.message}`);
      this.isLoading = false;
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}
  servicesDisponibles = [
  'Frais de scolarité',
  'Hébergement et restauration',
  'Bibliothèque et ressources',
  'Activités et sport',
  'Transport'
];


}
