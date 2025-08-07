import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
// Supprimez la définition locale et importez depuis le modèle
import { Paiement } from '../models/paiement.model';


@Injectable({
  providedIn: 'root'
})
export class PaimentService {
  private apiUrl = 'http://localhost:3000/paiements'; // lien backend
  
  constructor(private http: HttpClient) { }

   getPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(this.apiUrl);
  }
  getEtudiants() {
  return this.http.get<any[]>('http://localhost:3000/etudiants');
}


getPaiementsByUtilisateur(userId: string): Observable<Paiement[]> {
  return this.http.get<Paiement[]>(`${this.apiUrl}/utilisateur/${userId}`);
}

 supprimerPaiement(id: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
// Récupérer un paiement par ID
getPaiementById(id: string): Observable<Paiement> {
  
  return this.http.get<Paiement>(`${this.apiUrl}/${id}`).pipe(
    catchError(error => {
      console.error('Erreur détaillée:', error);
      let message = 'Erreur inconnue';
      
      if (error.status === 404) {
        message = 'Paiement non trouvé';
      } else if (error.status === 400) {
        message = 'ID invalide';
      }
      
      return throwError(() => new Error(message));
    })
  );
}

private isValidId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}
modifierPaiement(id: string, paiement: Paiement): Observable<Paiement> {
  return this.http.put<Paiement>(`${this.apiUrl}/${id}`, paiement).pipe(
    catchError(error => {
      console.error('Erreur API:', error);
      return throwError(() => new Error('Échec de la modification'));
    })
  );
}

 // Dans paiement.service.ts
ajouterPaiement(paiement: Paiement): Observable<Paiement> {
  // Ajoutez un log pour débogage
  console.log('Données envoyées:', paiement);
  return this.http.post<Paiement>(this.apiUrl, paiement).pipe(
    catchError(error => {
      console.error('Erreur détaillée:', error);
      return throwError(() => new Error('Échec de l\'ajout du paiement'));
    })
  );
}
  // paiement.service.ts
getRecentPayments(limit: number): Observable<Paiement[]> {
  return this.http.get<Paiement[]>(`${this.apiUrl}?limit=${limit}`).pipe(
    map(payments => payments.map(p => ({
      ...p,
      date: p.date ? new Date(p.date) : new Date() // Conversion des dates
    }))),
    catchError(error => {
      console.error('Erreur:', error);
      return of([]);
    })
  );
}
getPaiementsByUser(userId: string): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:3000/paiements/utilisateur/${userId}`);
}

}

