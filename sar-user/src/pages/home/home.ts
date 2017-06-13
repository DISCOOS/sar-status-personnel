import { Component } from '@angular/core';
import { SARService } from '../../services/sar.service';
import { ExceptionService } from '../../services/exception.service';
import { GeoService } from '../../services/geo.service';
import { AuthService } from '../../services/auth.service';
import { NavController } from 'ionic-angular';
import { SARUser } from '../../models/models';
import { Login } from '../login/login';
import { AlertController, Platform } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';

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
    public firebase: Firebase,
    public GeoService: GeoService,

  ) {

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
        this.subscribeToAvailable();
      }
      );
  }

  // Subscribes to available topic if available is true
  subscribeToAvailable() {
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
        if (this.trackable) {
          let alert = this.alertCtrl.create({
            title: 'OBS',
            subTitle: 'Du vil nå bli sporet neste gang du deltar i en aksjon.',
            buttons: ['Ok']
          });
          alert.present();
        }
      },
      error => { this.navCtrl.setRoot(Login); },
      () => { localStorage.setItem('currentUser', JSON.stringify(this.user)) }
      );
  }

  ionViewDidLoad() {
    //this.user = this.SARService.getUser();
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.available = this.user.isAvailable;
    this.trackable = this.user.isTrackable;

  }

  ionViewCanEnter() {
    return this.AuthService.isLoggedIn();
  }
}
