import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {  PaimentService } from 'src/app/services/paiment.service';
import { Paiement } from '../../models/paiement.model';

@Component({
  selector: 'app-paiement-edit',
  templateUrl: './paiement-edit.component.html',
  styleUrls: ['./paiement-edit.component.scss']
})
export class PaiementEditComponent implements OnInit {
  paiementForm: FormGroup;
  isLoading = false;
  facultes = ['Sciences', 'Lettres', 'Droit', 'Médecine'];
services = [
  'Frais de scolarité',
  'Hébergement et restaurant',
  'Bibliothèque et ressources',
  'Activités et sport',
  'Transport'
];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paimentService: PaimentService
  ) {
    this.paiementForm = this.fb.group({
      _id: [''],
      client: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      moyen: ['espèces', Validators.required],
      description: ['',Validators.required],
      faculte: ['', Validators.required],
    });
  }

 ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  console.log('ID reçu :', id); // 🔍

  if (!id) {
    alert('ID manquant dans l\'URL');
    return;
  }

  this.isLoading = true;
  this.paimentService.getPaiementById(id).subscribe({
    next: (p) => {
          console.log('Données reçues:', p); // Debug
      // Formatage des données pour le formulaire
      this.paiementForm.patchValue({
        _id: p._id,
        client: p.client,
        montant: p.montant,
        moyen: p.moyen,
        description: p.description || '' ,
        faculte: p.faculte || '',
         // Gestion des valeurs null
      });
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Erreur détaillée:', err);
      alert('Erreur lors du chargement. Voir la console pour plus de détails.');
      this.isLoading = false;
    }
  });
}

modifierPaiement(): void {
  if (this.paiementForm.invalid) {
    alert('Formulaire invalide');
    return;
  }

  this.isLoading = true;
  const { _id, ...paiementData } = this.paiementForm.value;
  
  this.paimentService.modifierPaiement(_id, paiementData)
    .subscribe({
      next: () => {
        this.router.navigate(['/paiements']);
      },
      error: (err) => {
        console.error('Erreur détaillée:', err);
        alert('Échec de la modification. Voir la console.');
        this.isLoading = false;
      }
    });
}
  }
