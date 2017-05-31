import { Component } from '@angular/core';
import { SARUser } from '../../models/models';
import { NavController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { Login } from '../login/login';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class Profile {
  user: SARUser;

  constructor(
    public navCtrl: NavController, 
    public SARService: SARService,
    public alertCtrl: AlertController  
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
      this.navCtrl.setRoot(Login); 
    }
  }
}
