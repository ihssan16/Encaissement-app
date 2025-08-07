// paiement.model.ts
export interface Paiement {
  etudiantId?: string;
  _id?: string;
  client: string;  // Changez 'nom' en 'client' pour correspondre à votre interface
  faculte?: string;
  date?: Date | string;
  montant: number;
  moyen: String;
  description?: string;
  refId?: number;
  pieceJoint:string;
}