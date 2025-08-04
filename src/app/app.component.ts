import { Component } from '@angular/core';
import { NotificationService } from './services/notification.service';
import { Router,NavigationEnd } from '@angular/router'
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentRoute = '';
  title = 'encaissement-app';
  isSidebarClosed = false;
   
/*
  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }*/
  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
    });
  }
  isLoginPage(): boolean {
  return this.currentRoute.startsWith('/login');
}

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}