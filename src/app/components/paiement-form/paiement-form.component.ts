
// src/app/components/paiement-form/paiement-form.component.ts
import { Component, OnInit } from '@angular/core';
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
export class PaiementFormComponent implements OnInit{
   paiement: Paiement = {
    client: '',
    montant: 0,
    moyen: 'espèces',
    description: '',
    faculte: '',
    etudiantId: '',
    pieceJoint:''
  };

  isLoading = false;
  isEditMode = false;
  
  facultes: string[] = ['Sciences', 'Informatique', 'Gestion', 'Lettres', 'Droit', 'Médecine'];
  etudiants: any[] = [];          // Tous les étudiants récupérés depuis le backend
  etudiantsFiltres: any[] = [];   // Étudiants filtrés par faculté
  fraisSelectionne: number = 0;   // Frais forcé

// paiement-form.component.ts
moyensPaiement: string[] = ['Espèce', 'Chèque', 'Virement bancaire', 'Carte bancaire'];


  servicesDisponibles = [
    {name: 'Frais de scolarité', price: 10000},
    {name: 'Hébergement et restauration', price: 3000},
    {name: 'Bibliothèque et ressources', price: 500},
    {name: 'Activités et sport', price: 450},
    {name: 'Transport', price: 1000}
  ];
serviceSelectionne: { name: string, price: number } | null = null;

  constructor(
    private paimentService: PaimentService,
    private router: Router,
    private notificationService: NotificationService,
    private dialog: MatDialog
   ) {}
  ngOnInit(): void {
  this.chargerEtudiants();
}

// NOUVELLE MÉTHODE : Charger tous les étudiants depuis le backend
  chargerEtudiants(): void {
    this.paimentService.getEtudiants().subscribe({
      next: (etudiants: any[]) => {
        this.etudiants = etudiants;
        console.log('Étudiants chargés:', this.etudiants);
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des étudiants:', error);
        this.notificationService.showError('Erreur lors du chargement des étudiants');
      }
    });
  }

  onFraisChange(): void {
  if (this.serviceSelectionne) {
    this.paiement.description = this.serviceSelectionne.name;
    this.paiement.montant = this.serviceSelectionne.price;
    console.log('Service sélectionné :', this.serviceSelectionne);
  } else {
    this.paiement.description = '';
    this.paiement.montant = 0;
  }
}



  onFaculteChange(): void {
    console.log('Faculté sélectionnée:', this.paiement.faculte);
    console.log(this.etudiants);
    
    // Filtrer les étudiants selon la faculté sélectionnée
    this.etudiantsFiltres = this.etudiants.filter(etu => etu.faculte === this.paiement.faculte);
    
    console.log('Étudiants filtrés:', this.etudiantsFiltres);
    
    // Réinitialiser l'étudiant et le montant
    this.paiement.etudiantId = '';
    this.paiement.montant = 0;
    this.fraisSelectionne = 0;
  }


  onEtudiantChange(): void {
  const etudiantSelectionne = this.etudiantsFiltres.find(etu => etu._id === this.paiement.etudiantId);
  if (etudiantSelectionne) {
    const frais = etudiantSelectionne.frais || 0;
    
    // Trouver dans servicesDisponibles un service correspondant au montant de l'étudiant
    const serviceCorrespondant = this.servicesDisponibles.find(service => service.price === frais);

    if (serviceCorrespondant) {
      // Mettre à jour la sélection du service (pour synchroniser le select HTML)
      this.serviceSelectionne = serviceCorrespondant;
      this.paiement.description = serviceCorrespondant.name;
      this.paiement.montant = serviceCorrespondant.price;
    } else {
      // Aucun service connu ne correspond aux frais, vider les champs
      this.serviceSelectionne = null;
      this.paiement.description = '';
      this.paiement.montant = 0;
    }

    this.paiement.client = `${etudiantSelectionne.nom} ${etudiantSelectionne.prenom}`;
    console.log('Étudiant sélectionné:', etudiantSelectionne);
  } else {
    this.serviceSelectionne = null;
    this.paiement.montant = 0;
    this.paiement.client = '';
    this.paiement.description = '';
  }
}

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    console.log('Fichier sélectionné :', file);

    // Exemple de chemin simulé (à adapter si tu fais un vrai upload)
    this.paiement.pieceJoint =`uploads/${file.name}`;
  } else {
    this.paiement.pieceJoint = ''; // vide si aucun fichier
  }
}


  ajouterPaiement(): void {

  if (this.isLoading) return;
  
  this.isLoading = true;
  console.log('Données du formulaire:', this.paiement); // Log de débogage
  const utilisateurId = localStorage.getItem('userId'); // récupère l'ID utilisateur connecté

  const paiementData = {
    ...this.paiement,
    utilisateurId: utilisateurId || '' // on ajoute l'ID dans le paiement
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

}

