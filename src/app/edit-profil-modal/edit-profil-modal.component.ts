import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-edit-profil-modal',
  templateUrl: './edit-profil-modal.component.html',
  styleUrls: ['./edit-profil-modal.component.scss']
})
export class EditProfilModalComponent {
   @Input() user: any;
  @Output() saved = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();
editForm: FormGroup;
constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    // Initialise le formulaire avec les valeurs actuelles
    this.editForm.patchValue({
      nom: this.user.nom,
      email: this.user.email
    });
  }
  close() {
    this.closed.emit();
  }

  onSubmit() {
    console.log('Submit appelé'); // Debug 1
    
    if (this.editForm.valid) {
      console.log('Formulaire valide', this.editForm.value); // Debug 2
      this.saved.emit(this.editForm.value);
      this.close();
    } else {
      // Affiche les erreurs de validation
      console.log('Formulaire invalide'); // Debug 3
      this.markFormGroupTouched(this.editForm);

    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
