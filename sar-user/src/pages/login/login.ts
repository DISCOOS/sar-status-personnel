import { Component } from '@angular/core';
import { TabsPage } from '../tabs/tabs'
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { ExceptionService } from '../../services/exception.service';

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
      data => {
        if(data != false) {
          this.navCtrl.setRoot(Call);   
        }
      },
      error => {
        console.log(error);
        console.log("Funker dette faktisk?");
      });
  }

  ionViewDidLoad() {
    this.SARService.logout();
  }
}
