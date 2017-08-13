import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Login } from '../pages/login/login';
import { Firebase } from '@ionic-native/firebase';
import { MissionSinglePage } from '../pages/mission-single/mission-single';
import { ConfigService } from "../services/config.service";


@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private firebase: Firebase,
    public alertCtrl: AlertController,
    private config: ConfigService
  ) {

    this.initializeApp();

    if (this.platform.is('cordova')) {
      this._initNotifications();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {

      // Configure app
      this.statusBar.styleDefault();

      // Load config
      this.config.load().then((config) => {
          this.rootPage = Login;
          this.splashScreen.hide();
          console.log('Config loaded = ' + JSON.stringify(config));
      }).catch((error) => {
          this.rootPage = Login;
          this.splashScreen.hide();
          console.log('Config not loaded: ' + error);
      });

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


  _initNotifications() {
    console.log("----Initing notifications-------")
    this.firebase.onNotificationOpen()
      .subscribe(
      res => {
        console.log("Opened notit, missionID " + res.missionId)
        if (res.missionId) {
          console.log(res);

          this._alertNewAlarm(res.missionId, res.title, res.body);
        }

      },
      error => {
        console.log("Error: Couldnt open notification ")
      }
      )

    this.firebase.subscribe("emergency").then(() => {
      console.log("subscriped to emergency")
    })
      .catch(() => console.log("error subscribing to emergency missions"))
  }


  _alertNewAlarm(missionId: number, title: string, body: string) {
    let alert;

    if (this.nav.getActive().name === 'Login') {
      alert = this._nonLoggedInAlert();
    } else {
      alert = this._gotoMissionAlert(missionId, title, body);
    }
    alert.present();
  }

  // Alert to show if user is not logged in
  _nonLoggedInAlert() {
    return this.alertCtrl.create({
      title: 'Ny varsling',
      message: 'Vennligst logg inn for å gå til aksjonen.',
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
  }


  // Alert to show if user is logged in
  _gotoMissionAlert(missionId: number, title: string, body: string) {
    return this.alertCtrl.create({
      title: title,
      message: body,
      buttons: [
        {
          text: 'Avbryt',
          role: 'cancel'
        },
        {
          text: 'Åpne aksjon',
          handler: () => {

            this.nav
              .push(MissionSinglePage, { id: missionId })
              .catch(error => { console.log(error) });

          }
        }
      ]
    });
  }



}
