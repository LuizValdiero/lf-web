import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalizadorLexicoPageComponent } from './analizador-lexico-page.component';

describe('AnalizadorLexicoPageComponent', () => {
  let component: AnalizadorLexicoPageComponent;
  let fixture: ComponentFixture<AnalizadorLexicoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalizadorLexicoPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalizadorLexicoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
