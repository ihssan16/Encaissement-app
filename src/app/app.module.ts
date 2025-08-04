import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaiementComponent } from './paiement/paiement.component';
import { HistoriqueComponent } from './historique/historique.component';
import { PaiementListComponent } from './components/paiement-list/paiement-list.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PaiementFormComponent } from './components/paiement-form/paiement-form.component';
import { PaiementEditComponent } from './components/paiement-edit/paiement-edit.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ProfilComponent } from './profil/profil.component';
import { EditProfilModalComponent } from './edit-profil-modal/edit-profil-modal.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SummaryCardsComponent } from './components/dashboard/summary-cards/summary-cards.component';
import { RecentPaymentsComponent } from './components/dashboard/recent-payments/recent-payments.component';
import { StatisticsChartComponent } from './components/dashboard/statistics-chart/statistics-chart.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RegisterComponent } from './components/register/register.component';
import { MesPaiementsComponent } from './pages/mes-paiements/mes-paiements.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    NotificationsComponent,
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    EditProfilModalComponent,
    ChangePasswordModalComponent,
  ProfilComponent,
  PaiementFormComponent,
  PaiementListComponent,
  PaiementEditComponent,
  MainLayoutComponent,
  AuthLayoutComponent,
  RegisterComponent,
  MesPaiementsComponent,
  ConfirmDialogComponent
   

  ],
  imports: [
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    DashboardModule,
    RouterModule, // Pour router-outlet
    CommonModule, BrowserAnimationsModule // Pour les pipes (number, date


],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
