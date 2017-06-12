import { Component } from '@angular/core';
import { SARService } from '../../services/sar.service';
import { ExceptionService } from '../../services/exception.service';
import { GeoService } from '../../services/geo.service';
import { AuthService } from '../../services/auth.service';
import { NavController } from 'ionic-angular';
import { SARUser } from '../../models/models';
import { Login } from '../login/login';
import { Call } from '../call/call';
import { AlertController, Platform } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
import { MissionSinglePage } from '../mission-single/mission-single';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class Home {

  available: boolean;
  trackable: boolean;
  user: SARUser;

  constructor(
    public navCtrl: NavController,
    public SARService: SARService,
    public ExceptionService: ExceptionService,
    public AuthService: AuthService,
    public alertCtrl: AlertController,
    private firebase: Firebase,
    public platform: Platform,
    public GeoService: GeoService,
  ) {
    if (this.platform.is('cordova')) {
      this._initNotifications();
    }
  }

  /**
   *    - If a notification is opened, go to respective mission
   *    - We also subscribe to emergency topic to receive emergency alarms
   */
  _initNotifications() {

    this.firebase.onNotificationOpen()
      .subscribe(
      res => {
        console.log("Opened notit, missionID " + res.missionId)
        if (res.missionId) {
          console.log(res)
          if (this.AuthService.isLoggedIn()) {
            this._alertNewAlarm(res.missionId);
          }

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

    this._subscribeToAvailable();

  }

  _alertNewAlarm(missionId: number) {
    let alert = this.alertCtrl.create({
      title: 'Ny varsling',
      message: 'Åpne denne aksjonen?',
      buttons: [
        {
          text: 'Nei',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Ja',
          handler: () => {
            this.navCtrl
              .push(MissionSinglePage, { id: missionId })
              .catch(error => { console.log(error) });
          }
        }
      ]
    });
    alert.present();

  }

  _openMissionOrCallPage(missionId: number) {
    console.log("open mission or callpage")
    // Go directly to mission if answered before
    this.SARService.userHasAnsweredMission(this.user.id, missionId).subscribe(
      (hasAnswered) => {
        console.log(hasAnswered)
        if (hasAnswered) {
          this.navCtrl
            .push(MissionSinglePage, { id: missionId })
            .catch(error => { console.log(error) });

        } else {
          this.navCtrl
            .push(Call, { missionId: missionId })
            .catch(error => { console.log(error) });
        }
      },
      (err) => { console.log("error " + err) }
    )
  }


  // Subscribes to available topic if available is true
  _subscribeToAvailable() {
    console.log("Inside subscribe method with isAvailable = " + this.available)
    if (this.available) {
      this.firebase.subscribe("available").then(() => {
        console.log("subscribed to available topic")
      })
    } else {
      this.firebase.unsubscribe("available").then(() => {
        console.log("unsubscribed from available topic")
      })
    }
  }

  /**
   * Method to set isAvailible of the user-object both in localStorage and DAO based on toggle-element. The method will fire once if the value is set to true on init. 
   */

  setAvailable() {
    console.log("IsAvailable is now " + this.available)
    this.SARService.setAvailability(this.available)
      .subscribe(
      res => {
        this.user.isAvailable = this.available;
        localStorage.setItem('currentUser', JSON.stringify(this.user))

      },
      error => { this.navCtrl.setRoot(Login); },
      () => {
        if (this.platform.is('cordova')) {
          this._subscribeToAvailable();
        }
      }
      );
  }

  /**
   * Method to set isTrackable of the user-object both in localStorage and DAO based on toggle-element. The method will fire once if the value is set to true on init. 
   */

  setTrackable() {
    if (!this.trackable) {
      this.GeoService.stopTracking();
    }
    this.SARService.setTrackable(this.trackable)
      .subscribe(
      res => {
        this.user.isTrackable = this.trackable;
        localStorage.setItem('currentUser', JSON.stringify(this.user))
        if (this.trackable) {
          let alert = this.alertCtrl.create({
            title: 'OBS',
            subTitle: 'Du vil nå bli sporet neste gang du deltar i en aksjon.',
            buttons: ['Ok']
          });
          alert.present();
        }
      },
      error => { this.navCtrl.setRoot(Login); }
      );
  }

  ionViewDidLoad() {
    this.user = this.SARService.getUser();
    try {
      this.available = this.user.isAvailable;
      this.trackable = this.user.isTrackable;
    } catch (error) {
      let msg: string;
      if (error instanceof TypeError) {
        msg = 'Sesjonen er utløpt. Vennligst logg inn på nytt.';
      } else {
        console.log(error);
        msg = 'Ukjent feil. Logg inn på nytt.';
      }
      let alert = this.alertCtrl.create({
        title: 'En feil har oppstått',
        subTitle: msg,
        buttons: ['Ok']
      });
      alert.present();
      this.navCtrl.setRoot(Login);
    }
  }

  ionViewCanEnter() {
    return this.AuthService.isLoggedIn();
  }
}
