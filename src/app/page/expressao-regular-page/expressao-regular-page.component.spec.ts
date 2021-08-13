import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressaoRegularPageComponent } from './expressao-regular-page.component';

describe('ExpressaoRegularPageComponent', () => {
  let component: ExpressaoRegularPageComponent;
  let fixture: ComponentFixture<ExpressaoRegularPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpressaoRegularPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpressaoRegularPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
