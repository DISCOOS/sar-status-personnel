import { Component } from '@angular/core';
import { SARService } from '../../services/sar.service';
import { NavController } from 'ionic-angular';
import { SARUser } from '../../models/models';
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class Home {
  available: boolean;
  isTrackable: boolean;
  user: SARUser;
  user2: Observable<SARUser>;
  

  constructor(
    public navCtrl: NavController,
    public SARService: SARService   
  ) {}
  
  setAvailable() {

  }

  setTrackable() {
    console.log("hit " + this.isTrackable);

  }

  ngOnInit() {
    this.user = this.SARService.getUser();
    this.user2 = this.SARService.getUserFromDAO(this.user.id);
    console.log("This user: " + this.user.id + this.user.name + this.user.isAvailable + this.user.isTrackable);
    console.log("This user2: " + this.user2);
    console.log("Starting value: " + this.user.isAvailable);
		this.available = this.user.isAvailable;
    this.isTrackable = this.user.isTrackable;
	}

}
