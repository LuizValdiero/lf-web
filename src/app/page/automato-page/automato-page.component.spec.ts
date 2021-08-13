import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatoPageComponent } from './automato-page.component';

describe('AutomatoPageComponent', () => {
  let component: AutomatoPageComponent;
  let fixture: ComponentFixture<AutomatoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomatoPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
