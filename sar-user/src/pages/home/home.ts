import { Component } from '@angular/core';
import { SARService } from '../../services/sar.service';
import { ExceptionService } from '../../services/exception.service';
import { NavController } from 'ionic-angular';
import { SARUser } from '../../models/models';
import { Login } from '../login/login';

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

  ngOnInit() {
    this.user = this.SARService.getUser();
    if(!this.user) {
      this.navCtrl.setRoot(Login);
    } else if (this.user.isAvailable == null || this.user.isTrackable == null) {
      this.user.isAvailable = true;
      this.user.isTrackable = false;
      localStorage.setItem('currentUser', JSON.stringify(this.user));      
    }   
    this.available = this.user.isAvailable;
    this.trackable = this.user.isTrackable;
	}
}
