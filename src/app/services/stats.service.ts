import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<any> { // <-- Spécifiez le type de retour
    return this.http.get<any>('/api/stats');
  }
}
