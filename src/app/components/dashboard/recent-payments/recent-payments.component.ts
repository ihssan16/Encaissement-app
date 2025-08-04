import { Component,OnInit } from '@angular/core';
import { PaimentService } from 'src/app/services/paiment.service';
import { Paiement } from '../../../models/paiement.model';

@Component({
  selector: 'app-recent-payments',
  templateUrl: './recent-payments.component.html',
  styleUrls: ['./recent-payments.component.scss']
})
export class RecentPaymentsComponent implements OnInit {
  recentPayments: Paiement[] = [];

  constructor(private paimentService: PaimentService) {}

  ngOnInit() {
    this.loadRecentPayments();
  }

 loadRecentPayments() {
    this.paimentService.getRecentPayments(5).subscribe({
      next: (payments) => {
        this.recentPayments = payments.map(p => ({
          ...p,
          date: p.date ? new Date(p.date) : new Date() // Gestion des dates
        }));
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  setupAutoRefresh() {
    // Actualisation toutes les 30 secondes
    setInterval(() => this.loadRecentPayments(), 30000);
  }
}
