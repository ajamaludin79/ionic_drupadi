import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PersonPage } from '../pages/person/person';
import { InsertPage } from '../pages/insert/insert';
import { UpdatePage } from '../pages/update/update';
import { Datamembers } from '../providers/datamembers';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PersonPage,
    InsertPage,
    UpdatePage
  ],
  imports: [
    BrowserModule,
	HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PersonPage,
    InsertPage,
    UpdatePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
	Datamembers
  ]
})
export class AppModule {}
