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

import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';


const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '0c6efcdf'
  },
  'push': {
    'sender_id': '906828526894',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

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
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)   
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
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    ExceptionService,
    SARService,
    GeoService,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}