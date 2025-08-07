// src/app/components/paiement-list/paiement-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaimentService } from 'src/app/services/paiment.service';
import { Paiement } from '../../models/paiement.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {jsPDF}  from 'jspdf';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-paiement-list',
  templateUrl: './paiement-list.component.html',
  styleUrls: ['./paiement-list.component.scss']
})
export class PaiementListComponent implements OnInit {
  paiements: Paiement[] = [];
  isLoading = false;
  searchTerm: string = '';

  // Variables pour la pagination
  currentPage = 1;
  itemsPerPage = 10;
  pageSizeOptions = [5, 10, 15, 20];

  constructor(
    private paimentService: PaimentService, 
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.chargerPaiements();
  }

  chargerPaiements(): void {
    this.isLoading = true;
    this.paimentService.getPaiements().subscribe({
      next: (data) => {
        this.paiements = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement:', error);
        this.isLoading = false;
      }
    });
  }
supprimerPaiement(id?: string): void {
  if (!id) {
    console.error('ID de paiement manquant.');
    return;
  }

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: {
      title: 'Suppression de paiement',
      message: 'Êtes-vous sûr de vouloir supprimer ce paiement ?',
      confirmText: 'Supprimer',
      cancelText: 'Annuler'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.paimentService.supprimerPaiement(id).subscribe({
        next: () => {
          this.snackBar.open('Paiement supprimé avec succès !', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar']
          });
          this.chargerPaiements();
        },
        error: () => {
          this.snackBar.open('Échec de suppression du paiement.', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar-error']
          });
        }
      });
    }
  });
}

// Ajoute cette méthode à ta classe PaiementListComponent
// Ajoute cette méthode à ta classe PaiementListComponent
telechargerRecu(paiement: Paiement): void {
  try {
    // Créer un nouveau document PDF
    const pdf = new jsPDF();
    
    // === EN-TÊTE AVEC FOND BLEU UNIVERSITÉ ===
    pdf.setFillColor(41, 128, 185); // Bleu universitaire
    pdf.rect(0, 0, 210, 45, 'F');
    
    // Logo/Nom de l'université (en blanc)
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text('UNIVERSITÉ PRIVÉE', 105, 20, { align: 'center' });
    pdf.text('DE CASABLANCA', 105, 30, { align: 'center' });
    
    // Sous-titre université
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Excellence • Innovation • Formation', 105, 38, { align: 'center' });
    
    // === TITRE DU DOCUMENT ===
    pdf.setTextColor(41, 128, 185);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('REÇU DE PAIEMENT', 105, 60, { align: 'center' });
    
    // Ligne décorative sous le titre
    pdf.setDrawColor(46, 204, 113); // Vert
    pdf.setLineWidth(2);
    pdf.line(60, 65, 150, 65);
    
    // === INFORMATIONS DU REÇU (Encadré) ===
    pdf.setDrawColor(41, 128, 185);
    pdf.setLineWidth(0.5);
    pdf.rect(15, 75, 180, 20);
    
    // Numéro de reçu
    const numeroRecu = paiement._id ? paiement._id.substring(0, 8).toUpperCase() : 'N/A';
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`N° de Reçu: ${numeroRecu}`, 20, 85);
    
    // Date avec vérification
    let dateRecu = 'Date non disponible';
    try {
      if (paiement.date) {
        const date = new Date(paiement.date);
        if (!isNaN(date.getTime())) {
          dateRecu = date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      }
    } catch (error) {
      console.error('Erreur de format de date:', error);
    }
    pdf.text(`Date: ${dateRecu}`, 120, 85);
    
    // === SECTION ÉTUDIANT ===
    pdf.setFillColor(248, 249, 250); // Gris très clair
    pdf.rect(15, 105, 180, 35, 'F');
    pdf.rect(15, 105, 180, 35, 'S');
    
    pdf.setTextColor(41, 128, 185);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INFORMATIONS ÉTUDIANT', 20, 118);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nom complet: ${paiement.client}`, 25, 128);
    
    if (paiement.faculte) {
      pdf.text(`Faculté/École: ${paiement.faculte}`, 25, 135);
    }
    
    // === SECTION PAIEMENT ===
    pdf.setFillColor(248, 249, 250);
    pdf.rect(15, 150, 180, 45, 'F');
    pdf.rect(15, 150, 180, 45, 'S');
    
    pdf.setTextColor(41, 128, 185);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DÉTAILS DU PAIEMENT', 20, 163);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Service payé: ${paiement.description || 'Frais universitaires'}`, 25, 173);
    pdf.text(`Mode de paiement: ${paiement.moyen}`, 25, 183);
    
    // === MONTANT EN ÉVIDENCE ===
    pdf.setFillColor(46, 204, 113); // Vert
    pdf.rect(15, 205, 180, 25, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MONTANT PAYÉ:', 25, 220);
    pdf.text(`${paiement.montant.toFixed(2)} MAD`, 165, 220, { align: 'right' });
    
    // === SECTION SIGNATURE ===
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Signature et cachet:', 130, 245);
    pdf.rect(130, 250, 60, 20);
    
    // === PIED DE PAGE ===
    pdf.setDrawColor(41, 128, 185);
    pdf.setLineWidth(1);
    pdf.line(15, 280, 195, 280);
    
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Ce reçu constitue une pièce justificative de votre paiement.', 105, 287, { align: 'center' });
    pdf.text('Conservez-le précieusement pour vos dossiers administratifs.', 105, 292, { align: 'center' });
    
    // Coordonnées université
    /*pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('📍 123 Avenue Hassan II, Casablanca 20000', 20, 287);
    pdf.text('📞 +212 5XX XX XX XX', 20, 292);
    pdf.text('✉️ finance@universite.ma', 20, 297);*/
    
    // === TÉLÉCHARGEMENT ===
    const nomFichier = `Recu_UPC_${paiement.client.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    pdf.save(nomFichier);
    
    // Message de succès
    this.snackBar.open('Reçu universitaire téléchargé avec succès!', 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']
    });
    
  } catch (error) {
    console.error('Erreur lors de la génération du reçu:', error);
    this.snackBar.open('Erreur lors de la génération du reçu', 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar-error']
    });
  }
}

  modifierPaiement(id: string | undefined): void {
    console.log('ID envoyé à la modification:', id);
    if (id) {
      this.router.navigate(['/modifier', id]);
    } else {
      console.error('ID est undefined');
    }
  }


  
  // Getter pour les paiements filtrés (sans pagination)
  get paiementsFiltres(): Paiement[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.paiements.filter(p =>
      p.client.toLowerCase().includes(term) ||
      p.montant.toString().includes(term) ||
      p.moyen.toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term)
    );
  }

  // Getter pour les paiements paginés
  get paiementsPagines(): Paiement[] {
    const filteredData = this.paiementsFiltres;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }

  // Calcul du nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.paiementsFiltres.length / this.itemsPerPage);
  }

  // Calcul du nombre total d'éléments filtrés
  get totalItems(): number {
    return this.paiementsFiltres.length;
  }

  // Navigation vers la page précédente
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Navigation vers la page suivante
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Navigation vers une page spécifique
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Changement du nombre d'éléments par page
  onItemsPerPageChange(newSize: number): void {
    this.itemsPerPage = newSize;
    this.currentPage = 1; // Retour à la première page
  }

  // Générer la liste des numéros de pages à afficher
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // Afficher toutes les pages si le total est petit
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher un nombre limité de pages
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, this.currentPage - half);
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
      
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  // Réajuster la page courante après suppression
  private adjustPageAfterDelete(): void {
    if (this.paiementsPagines.length === 0 && this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Réinitialiser la pagination lors d'une recherche
  onSearchChange(): void {
    this.currentPage = 1;
  }

  // Calculer l'index de début pour l'affichage
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  // Calculer l'index de fin pour l'affichage
  get endIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }
}