import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Home } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { Alarmutkall } from '../pages/alarmutkall/alarmutkall';
import { Profil } from '../pages/profil/profil';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    Login,
    Home,
    Profil,
    Alarmutkall
    
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Login,
    Home,
    Profil,
    Alarmutkall

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
