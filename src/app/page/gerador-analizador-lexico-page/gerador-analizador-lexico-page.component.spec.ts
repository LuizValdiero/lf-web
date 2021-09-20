import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeradorAnalizadorLexicoPageComponent } from './gerador-analizador-lexico-page.component';

describe('GeradorAnalizadorLexicoPageComponent', () => {
  let component: GeradorAnalizadorLexicoPageComponent;
  let fixture: ComponentFixture<GeradorAnalizadorLexicoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeradorAnalizadorLexicoPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeradorAnalizadorLexicoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
