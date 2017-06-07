import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Home } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { Alarms } from '../pages/alarms/alarms';
import { Profile } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { Expense } from '../pages/expense/expense';
import { Call } from '../pages/call/call';
import { CallFeedback } from '../pages/callFeedback/callFeedback';
import { GeoService } from '../services/geo.service';
import { SARService } from '../services/sar.service';
import { ExceptionService } from '../services/exception.service';
import { AuthService } from '../services/auth.service';
import { MissionSinglePage } from "../pages/mission-single/mission-single";

import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';


import { SpinnerService, SpinnerModule } from '../blocks/spinner/spinner';

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
    CallFeedback,
    MissionSinglePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    HttpModule,
    SpinnerModule
  ],
  exports: [
    SpinnerModule
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
    Call,
    CallFeedback,
    MissionSinglePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BackgroundGeolocation,
    Geolocation,
    ExceptionService,
    SARService,
    GeoService,
    AuthService,
    SpinnerService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})

export class AppModule { }