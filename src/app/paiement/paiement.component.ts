import { Component, OnInit } from '@angular/core';
import { PaimentService } from '../services/paiment.service';
import { Paiement } from '../models/paiement.model';


@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.scss']
})
export class PaiementComponent implements OnInit{
  paiements: Paiement[] = [];

  constructor(private paimentService: PaimentService) {}

  ngOnInit(): void {
    this.paimentService.getPaiements().subscribe(data => {
      this.paiements = data;
    });
  }

  ajouterPaiement() {
    const nouveauPaiement: Paiement = {
      client: 'Najat',
      montant: 150,
      moyen: 'carte',
      description: 'Frais d’inscription',
      faculte:'Medcine',
      pieceJoint:''
    };

    this.paimentService.ajouterPaiement(nouveauPaiement).subscribe(() => {
      this.ngOnInit(); // recharger les paiements
    });
  }

}
