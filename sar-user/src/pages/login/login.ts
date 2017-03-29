import { Component } from '@angular/core';
import { Home } from '../home/home';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {
	username: string;
	password: string;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    
  }

  login() {
  	if(this.username == 'test'
  	&& this.password == 'test'
  	) {
  		this.navCtrl.setRoot(Home);
  	} else {
  		this.wrongCredentialsAlert();
  	}
  }

  wrongCredentialsAlert() {
    let alert = this.alertCtrl.create({
      title: 'Feil',
      subTitle: 'Brukernavnet og/eller passordet er feil.',
      buttons: ['Prøv igjen']
    });
    alert.present();
  }

}
