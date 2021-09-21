import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalizadorLexicoPageComponent } from './page/analizador-lexico-page/analizador-lexico-page.component';
import { AutomatoPageComponent } from './page/automato-page/automato-page.component';
import { DeterminizacaoPageComponent } from './page/determinizacao-page/determinizacao-page.component';
import { ExpressaoRegularPageComponent } from './page/expressao-regular-page/expressao-regular-page.component';
import { GeradorAnalizadorLexicoPageComponent } from './page/gerador-analizador-lexico-page/gerador-analizador-lexico-page.component';
import { GeradorAnalizadorSintaticoPageComponent } from './page/gerador-analizador-sintatico-page/gerador-analizador-sintatico-page.component';
import { VanguardaPageComponent } from './page/vanguarda-page/vanguarda-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo:'vanguarda'},
  { path: 'exp', component: ExpressaoRegularPageComponent },
  { path: 'af', component: AutomatoPageComponent },
  { path: 'af/determinizacao', component: DeterminizacaoPageComponent },
  { path: 'la', component: AnalizadorLexicoPageComponent },
  { path: 'la/generate', component: GeradorAnalizadorLexicoPageComponent },
  { path: 'sa/generate', component: GeradorAnalizadorSintaticoPageComponent },
  { path: 'vanguarda', component: VanguardaPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64],
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
