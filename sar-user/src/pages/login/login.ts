import { Component } from '@angular/core';
import { Home } from '../home/home';
import { TabsPage } from '../tabs/tabs'
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { SplashScreen } from '@ionic-native/splash-screen';

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
    private splashScreen: SplashScreen
  ) {

  }

  login() {

    
    this.SARService.login(this.username, this.password)
      .subscribe(
      data => {
        //this.router.navigate([this.returnUrl]);
        //this.navCtrl.setRoot(TabsPage);
        this.splashScreen.show();
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
