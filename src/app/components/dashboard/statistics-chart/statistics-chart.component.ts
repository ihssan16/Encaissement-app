import { Component, Input } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-statistics-chart',
  template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 400px;
    }
  `]
})
export class StatisticsChartComponent {
  @Input() paiements: any[] = [];

  public chartType: ChartType = 'bar';
  public chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Paiements (MAD)',
      backgroundColor: 'rgba(54, 162, 235, 0.7)'
    }]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value} MAD`
        }
      }
    }
  };

  ngOnChanges() {
    this.updateChart();
  }

  private updateChart() {
    const stats = this.calculateStats();
    this.chartData = {
      labels: stats.map(s => s.month),
      datasets: [{
        data: stats.map(s => s.amount),
        label: 'Paiements (MAD)',
        backgroundColor: 'rgba(54, 162, 235, 0.7)'
      }]
    };
  }

  private calculateStats() {
    const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const stats: {[key: string]: number} = {};

    this.paiements?.forEach(p => {
      if (!p?.date) return;
      const date = new Date(p.date);
      const moisKey = mois[date.getMonth()];
      stats[moisKey] = (stats[moisKey] || 0) + (p.montant || 0);
    });

    return Object.keys(stats).map(m => ({ month: m, amount: stats[m] }));
  }
}