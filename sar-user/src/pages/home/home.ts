import { Component } from '@angular/core';
import { SARService } from '../../services/sar.service';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {
  isAvailable: boolean;
  

  constructor(
    public navCtrl: NavController,
    public SARService: SARService
    
  ) {

  }
  getUser(){
        return JSON.parse(localStorage.getItem('currentUser'));
    }

  setAvailable() {

      let user = this.getUser();
      
      this.SARService.setAvailability(this.isAvailable)
      .subscribe (
      error => {
        console.log(error)
      });
    
  }

}
