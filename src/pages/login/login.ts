import { Component } from '@angular/core';
import { TabsPage } from '../tabs/tabs'
import { NavController, Platform, AlertController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { ExceptionService } from '../../services/exception.service';
import { Firebase } from '@ionic-native/firebase';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class Login {
  username: string;
  password: string;
  loading: boolean;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public SARService: SARService,
    public ExceptionService: ExceptionService,
    public platform: Platform,
    private firebase: Firebase
  ) {}


  login() {
    this.SARService.login(this.username, this.password)
      .subscribe(
      user => {

        this.savePushtoken();
        this.navCtrl.setRoot(TabsPage);
      },
      error => {
        console.log(error);
        this.navCtrl.setRoot(Login);
      },
      () => {

      });
  }

  savePushtoken() {

    const id = JSON.parse(localStorage.getItem("currentUser")).id;
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }


    // Get token from firebase
    this.firebase.getToken()
      .then((token) => {
        console.log(`The token is ${token}`)
        this._saveTokenToDB(token, id);
      })
      .catch(error => console.error('Error getting token from firebase', error));


    this.firebase.onTokenRefresh()
      .subscribe((token: string) => {
        console.log(`Got a new token ${token}`)
        this._saveTokenToDB(token, id);
      });


  }

  _saveTokenToDB(token: string, id: number) {
    // save token to db
    this.SARService.savePushtokenOnUser(token, id)
      .subscribe(
      res => {
        console.log("saved devicetoken in db")
      },
      error => {
        console.log("SAR-AI error; didnt save devicetoken")
      }
      )
  }

  ionViewWillEnter() {
    this.SARService.logout();
  }

  ionViewDidLoad() {
    this.loading = false;
    this.SARService.logout();
  }
}
