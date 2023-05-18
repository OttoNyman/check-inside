import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckCosmeticsComponent } from './check-cosmetics.component';

describe('CheckCosmeticsComponent', () => {
  let component: CheckCosmeticsComponent;
  let fixture: ComponentFixture<CheckCosmeticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckCosmeticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckCosmeticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
