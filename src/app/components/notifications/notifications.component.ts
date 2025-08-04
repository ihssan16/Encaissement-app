import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  showDropdown = false;
  notifications: { message: string, time: string }[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    //  Souscription au flux des notifications
    this.notificationService.notifications$.subscribe((data) => {
    this.notifications = data;
      console.log('Notifications reçues :', this.notifications); // 🔍 Debug
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

}
