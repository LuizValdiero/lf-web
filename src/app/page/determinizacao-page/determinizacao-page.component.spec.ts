import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeterminizacaoPageComponent } from './determinizacao-page.component';

describe('DeterminizacaoPageComponent', () => {
  let component: DeterminizacaoPageComponent;
  let fixture: ComponentFixture<DeterminizacaoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeterminizacaoPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeterminizacaoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
