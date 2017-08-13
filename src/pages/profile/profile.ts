import { Component } from '@angular/core';
import { SARUser } from '../../models/models';
import { SARService } from '../../services/sar.service';
import { Login } from '../login/login';
import { AlertController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { App } from 'ionic-angular';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class Profile {

  user: SARUser;

  constructor(
    public app: App,
    public SARService: SARService,
    public alertCtrl: AlertController,
    public AuthService: AuthService,
  ) {}

  ngOnInit() {
    this.user = this.SARService.getUser();
    if(this.user == undefined) {
      let alert = this.alertCtrl.create ({
        title: 'En feil har oppstått',
        subTitle: 'Sesjonen er utløpt. Vennligst logg inn på nytt.',
        buttons: ['Ok']
      });
      alert.present();
      this._popToLogin();
    }
  }

  ionViewCanEnter() {
      return this.AuthService.isLoggedIn();
  }

  logout() {
      this.SARService.logout();
      this._popToLogin();
      return true;
  }

  private _popToLogin() {
      this.app.getRootNav().popToRoot();
      this.app.getRootNav().setRoot(Login);
  }

}
