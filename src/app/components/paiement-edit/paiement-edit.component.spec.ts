import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementEditComponent } from './paiement-edit.component';

describe('PaiementEditComponent', () => {
  let component: PaiementEditComponent;
  let fixture: ComponentFixture<PaiementEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaiementEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
