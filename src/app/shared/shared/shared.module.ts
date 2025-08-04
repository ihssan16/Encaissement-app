import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCardsComponent } from 'src/app/components/dashboard/summary-cards/summary-cards.component';
import { RecentPaymentsComponent } from 'src/app/components/dashboard/recent-payments/recent-payments.component';
import { StatisticsChartComponent } from 'src/app/components/dashboard/statistics-chart/statistics-chart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StatisticsChartComponent,
    SummaryCardsComponent,
    RecentPaymentsComponent
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    SummaryCardsComponent,
    RecentPaymentsComponent,
    StatisticsChartComponent,
    CommonModule 
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
