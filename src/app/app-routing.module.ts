import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutomatoPageComponent } from './page/automato-page/automato-page.component';
import { DeterminizacaoPageComponent } from './page/determinizacao-page/determinizacao-page.component';
import { ExpressaoRegularPageComponent } from './page/expressao-regular-page/expressao-regular-page.component';

const routes: Routes = [
  { path: '', component: ExpressaoRegularPageComponent },
  { path: 'af', component: AutomatoPageComponent },
  { path: 'af/determinizacao', component: DeterminizacaoPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
