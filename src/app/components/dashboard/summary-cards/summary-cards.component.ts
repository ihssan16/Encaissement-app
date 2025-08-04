import { Component,OnInit } from '@angular/core';
import { StatsService } from 'src/app/services/stats.service';

@Component({
  selector: 'app-summary-cards',
  templateUrl: './summary-cards.component.html',
  styleUrls: ['./summary-cards.component.scss']
})
export class SummaryCardsComponent implements OnInit {
  cards = [
    { icon: '💰', title: 'Total paiements', value: 0, key: 'total' },
    { icon: '👨‍🎓', title: 'Étudiants', value: 0, key: 'etudiants' },
    { icon: '🏛️', title: 'Facultés', value: 0, key: 'facultes' },
    { icon: '🧾', title: 'Paiements ce mois', value: 0, key: 'ceMois' }
  ];

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.loadStats();
    this.setupAutoRefresh();
  }

  loadStats() {
    this.statsService.getStats().subscribe({
      next: (stats:any) => {
        this.cards[0].value = stats.total;
        this.cards[1].value = stats.etudiants;
        this.cards[2].value = stats.facultes;
        this.cards[3].value = stats.ceMois;
      },
      error: (err: any) => console.error(err)

    });
  }

  setupAutoRefresh() {
    setInterval(() => this.loadStats(), 60000); // Actualisation minute
  }

}
