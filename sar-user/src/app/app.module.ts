import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Home } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { Alarms } from '../pages/alarms/alarms';
import { Profile } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { Expense } from '../pages/utlegg/expense';
import { Call } from '../pages/call/call';

import { SARService } from '../services/sar.service';

import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { ModalController } from 'ionic-angular';


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    Login,
    Home,
    Profile,
    Alarms,
    Expense,
    Call,
    
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
    Expense,
    Call
   
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
   
    SARService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
