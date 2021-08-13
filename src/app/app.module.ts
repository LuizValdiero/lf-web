import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ClipboardModule } from 'ngx-clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCopy, faTrash, faSync, faPaste, faSave} from '@fortawesome/free-solid-svg-icons';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { ExpressaoRegularPageComponent } from './page/expressao-regular-page/expressao-regular-page.component';
import { AutomatoPageComponent } from './page/automato-page/automato-page.component';
import { DeterminizacaoPageComponent } from './page/determinizacao-page/determinizacao-page.component';
import { FileListComponent } from './components/file-list/file-list.component';


const dbConfig: DBConfig = {
  name: 'filesDB',
  version: 1,
  objectStoresMeta: [{
    store: 'files',
    storeConfig: {keyPath: 'id', autoIncrement: true},
    storeSchema: [
      {name: 'name', keypath: 'name', options: { unique: false}},
      {name: 'file', keypath: 'file', options: { unique: false}},
    ]
  }]
};


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
    FontAwesomeModule,
    NgxIndexedDBModule.forRoot(dbConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCopy)
    library.addIcons(faTrash)
    library.addIcons(faSync)
    library.addIcons(faPaste)
    library.addIcons(faSave)
  }
}
