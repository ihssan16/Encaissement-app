// src/app/components/paiement-list/paiement-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaimentService } from 'src/app/services/paiment.service';
import { Paiement } from '../../models/paiement.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
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