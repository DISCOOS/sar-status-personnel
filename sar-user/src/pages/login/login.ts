import { Component } from '@angular/core';
import { Home } from '../home/home';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';

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
    public SARService: SARService
  ) {

  }

  login() {

    
    this.SARService.login(this.username, this.password)
      .subscribe(
      data => {
        //this.router.navigate([this.returnUrl]);
        this.navCtrl.setRoot(Home);
      },
      error => {
        console.log(error)
        // this.toastService.activate("Innlogging mislyktes", false, false);
        // this.loading = false;
      });

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
