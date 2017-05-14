import { Component } from '@angular/core';
import { SARService } from '../../services/sar.service';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {
  
  

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
      if(user.isAvailable == false){
        user.isAvailable = true;
        console.log("false")
      }else if (user.isAvailable == true){
        user.isAvailable = false;
        console.log("true")
      }
      console.log(user.isAvailable)
      this.SARService.setAvailability(user.isAvailable)
    
  }

}
