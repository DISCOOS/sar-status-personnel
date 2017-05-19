import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Home } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { Alarms } from '../pages/alarms/alarms';
import { Profile } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { Utlegg } from '../pages/utlegg/utlegg';
import { UtleggModal } from '../pages/utlegg/utleggModal';

import { SARService } from '../services/sar.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ModalController } from 'ionic-angular';


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    Login,
    Home,
    Profile,
    Alarms,
    Utlegg,
    UtleggModal
    
    
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Login,
    Home,
    Profile,
    Alarms,
    TabsPage,
    Utlegg,
    UtleggModal
    

  ],
  providers: [
    StatusBar,
    SplashScreen,
    SARService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
