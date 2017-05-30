import { Component } from '@angular/core';
import { SARUser } from '../../models/models';
import { NavController } from 'ionic-angular';
import { SARService } from '../../services/sar.service';
import { ExceptionService } from '../../services/exception.service';
import { Login } from '../login/login';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class Profile {
  user: SARUser;

  constructor(public navCtrl: NavController, public SARService: SARService, public ExceptionService: ExceptionService ) {}
  
  ngOnInit() {
    this.user = this.SARService.getUser();
    if(this.user == null) {
      //this.ExceptionService.userError(1);
      this.navCtrl.setRoot(Login);
    }
  }

}
