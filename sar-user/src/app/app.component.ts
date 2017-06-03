import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushToken } from '@ionic/cloud-angular';

import { Login } from '../pages/login/login';
import { Home } from '../pages/home/home';
import { Alarms } from '../pages/alarms/alarms';
import { Profile } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { Expense } from '../pages/expense/expense';
import { Call } from '../pages/call/call';
import { CallFeedback } from '../pages/callFeedback/callFeedback';
import { SARService } from '../services/sar.service';
import { MapPage } from '../pages/map/map.component';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Login;
  //rootPage: any = CallFeedback;
  //rootPage: any = Call;
  //rootPage: any = TabsPage;
  //rootPage: any = SingleMission; 
  //rootPage : any = MapPage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public push: Push) {
    this.initializeApp();

    this.push.register().then((t: PushToken) => {
        return this.push.saveToken(t);
    }).then((t: PushToken) => {
  console.log('Token saved:', t.token);

  this.push.rx.notification()
  .subscribe((msg) => {
    alert(msg.title + ': ' + msg.text);
  });


});



  }

  initializeApp() {
      this.platform.ready().then(() => {
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
