import { Component } from '@angular/core';
import { TabsPage } from '../tabs/tabs'
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { ExceptionService } from '../../services/exception.service';
<<<<<<< HEAD
import {Home} from '../home/home';
=======
import { MapPage } from '../map/map.component';

>>>>>>> origin/master
import { Call } from '../call/call';

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
    public ExceptionService: ExceptionService
  ) {}

  /**
   * Metode for å håndtere login-knapp. Setter ny root dersom innlogging gjennomføres. 
   */

  login() {
    this.loading = true;
    this.SARService.login(this.username, this.password)
      .subscribe(
<<<<<<< HEAD
      data => { this.navCtrl.setRoot(TabsPage); },
=======
      data => {
        this.loading = false; 
        this.navCtrl.setRoot(TabsPage); },
>>>>>>> origin/master
      error => { 
        this.loading = false;
        console.log("Error");
        console.log(error);
        this.navCtrl.setRoot(Login); 
      });
  }

  ionViewWillEnter() {
    this.SARService.logout();
  }

  ionViewDidLoad() {
    this.loading = false;
    this.SARService.logout();
  }
}
