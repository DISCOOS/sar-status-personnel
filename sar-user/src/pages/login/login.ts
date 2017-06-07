import { Component } from '@angular/core';
import { TabsPage } from '../tabs/tabs'
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { ExceptionService } from '../../services/exception.service';
import {Home} from '../home/home';
import { Call } from '../call/call';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class Login {
  username: string;
  password: string;

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
    this.SARService.login(this.username, this.password)
      .subscribe(
      data => { this.navCtrl.setRoot(TabsPage); },
      error => { 
        console.log(error);
        this.navCtrl.setRoot(Login); 
      });
  }

  ionViewWillEnter() {
    this.SARService.logout();
  }

  ionViewDidLoad() {
    this.SARService.logout();
  }
}
