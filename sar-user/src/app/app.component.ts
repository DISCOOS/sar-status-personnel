import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Login } from '../pages/login/login';
import { Home } from '../pages/home/home';
import { Alarms } from '../pages/alarms/alarms';
import { Profile } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { Expense } from '../pages/utlegg/expense';
import { Call } from '../pages/call/call';
import { CallFeedback } from '../pages/callFeedback/callFeedback';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = Login;
  //rootPage: any = CallFeedback;
  rootPage: any = Call;
  //rootPage: any = TabsPage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {


      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
   
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
