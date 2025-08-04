import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaiementFormComponent } from './components/paiement-form/paiement-form.component';
import { PaiementListComponent } from './components/paiement-list/paiement-list.component';
import { PaiementEditComponent } from './components/paiement-edit/paiement-edit.component';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProfilComponent } from './profil/profil.component';
import{DashboardComponent} from'src/app/pages/dashboard/dashboard.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RegisterComponent } from './components/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import{MesPaiementsComponent}from'./pages/mes-paiements/mes-paiements.component';
import { authGuard } from './guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'paiements', component: PaiementListComponent,canActivate: [authGuard]  },
  { path: 'ajouter', component: PaiementFormComponent,canActivate: [authGuard]  },
  { path: 'modifier/:id', component: PaiementEditComponent,canActivate: [authGuard]  },
  { path: 'dashboard', component: SidebarComponent,canActivate: [authGuard]  },
  { path: 'profil', component: ProfilComponent,canActivate: [authGuard]  },
  { path: 'tableaudebord', component: DashboardComponent,canActivate: [authGuard]  },
  { path: 'notifications', component: NotificationsComponent ,canActivate: [authGuard] },
  { path: 'mes-paiements', component: MesPaiementsComponent, canActivate: [authGuard] }

]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    
    ]
  },
  { path: '**', redirectTo: '/login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
