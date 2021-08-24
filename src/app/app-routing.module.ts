import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalizadorLexicoPageComponent } from './page/analizador-lexico-page/analizador-lexico-page.component';
import { AutomatoPageComponent } from './page/automato-page/automato-page.component';
import { DeterminizacaoPageComponent } from './page/determinizacao-page/determinizacao-page.component';
import { ExpressaoRegularPageComponent } from './page/expressao-regular-page/expressao-regular-page.component';
import { GeradorAnalizadorLexicoPageComponent } from './page/gerador-analizador-lexico-page/gerador-analizador-lexico-page.component';

const routes: Routes = [
  { path: '', component: ExpressaoRegularPageComponent },
  { path: 'af', component: AutomatoPageComponent },
  { path: 'af/determinizacao', component: DeterminizacaoPageComponent },
  { path: 'la', component: AnalizadorLexicoPageComponent },
  { path: 'la/generate', component: GeradorAnalizadorLexicoPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
