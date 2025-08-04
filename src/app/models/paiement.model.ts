// paiement.model.ts
export interface Paiement {
  _id?: string;
  client: string;  // Changez 'nom' en 'client' pour correspondre à votre interface
  faculte?: string;
  date?: Date | string;
  montant: number;
  moyen: 'espèces' | 'carte' | 'virement';
  description?: string;
  refId?: number;
}