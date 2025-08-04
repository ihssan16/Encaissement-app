import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-statistics-chart',
  templateUrl: './statistics-chart.component.html',
  styleUrls: ['./statistics-chart.component.scss']
})
export class StatisticsChartComponent {
  // Données de paiement
  payments = [
    { month: 'Jan', amount: 10000 },
    { month: 'Fév', amount: 5000 },
    { month: 'Mar', amount: 12000 },
    { month: 'Avr', amount: 8000 },
    { month: 'Mai', amount: 6000 },
    { month: 'Juin', amount: 9500 }
  ];

  // Calculs statistiques
  get total() {
    return this.payments.reduce((sum, item) => sum + item.amount, 0);
  }

  get average() {
    return this.total / this.payments.length;
  }

  get highest() {
    return Math.max(...this.payments.map(p => p.amount));
  }
}
