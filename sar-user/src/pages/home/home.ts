import { Component } from '@angular/core';
import { SARService } from '../../services/sar.service';
import { ExceptionService } from '../../services/exception.service';
import { AuthService } from '../../services/auth.service';
import { NavController } from 'ionic-angular';
import { SARUser } from '../../models/models';
import { Login } from '../login/login';
import { AlertController } from 'ionic-angular';

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
  ) {}
  
  /**
   * Method to set isAvailible of the user-object both in localStorage and DAO based on toggle-element. The method will fire once if the value is set to true on init. 
   */

  setAvailable() {
    this.SARService.setAvailability(this.available)
      .subscribe(
        res => { localStorage.setItem('currentUser', JSON.stringify(res));
        });
  }

  /**
   * Method to set isTrackable of the user-object both in localStorage and DAO based on toggle-element. The method will fire once if the value is set to true on init. 
   */

  setTrackable() {
    this.SARService.setTrackable(this.trackable)
      .subscribe(
        res => {
          localStorage.setItem('currentUser', JSON.stringify(res));
        });
  }

  ionViewDidLoad() {
    this.user = this.SARService.getUser();
    try {
      this.available = this.user.isAvailable;
      this.trackable = this.user.isTrackable;
    } catch(error) {
      let msg: string;
      if(error instanceof TypeError) {
        msg = 'Sesjonen er utløpt. Vennligst logg inn på nytt.';  
      } else {
        console.log(error);
        msg = 'Ukjent feil. Logg inn på nytt.';
      }
      let alert = this.alertCtrl.create ({
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
