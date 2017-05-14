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
      console.log("isavailable fra før if: " + user.isAvailable);
      if(user.isAvailable == false){
        user.isAvailable = true;
        
      }else if (user.isAvailable == true){
        user.isAvailable = false;
        console.log("isavailable fra else if: " + user.isAvailable);
        
      }
      console.log("bruker.available fra home.ts etter if: "+user.isAvailable);
      this.SARService.setAvailability(user.isAvailable)
    
  }

}
