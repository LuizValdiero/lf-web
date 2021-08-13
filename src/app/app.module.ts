import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { ExpressaoRegularPageComponent } from './page/expressao-regular-page/expressao-regular-page.component';
import { AutomatoPageComponent } from './page/automato-page/automato-page.component';
import { DeterminizacaoPageComponent } from './page/determinizacao-page/determinizacao-page.component';
import { FileListComponent } from './components/file-list/file-list.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCopy, faTrash, faPlus, faPaste, faSave} from '@fortawesome/free-solid-svg-icons';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ExpressaoRegularPageComponent,
    AutomatoPageComponent,
    DeterminizacaoPageComponent,
    FileListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCopy)
    library.addIcons(faTrash)
    library.addIcons(faPlus)
    library.addIcons(faPaste)
    library.addIcons(faSave)
  }
}
