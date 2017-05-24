import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Login } from '../pages/login/login';

@Injectable()
export class ExceptionService {
    constructor(public navCtrl: NavController) { }

    public userError(type: number) {
        if(type == 1) {
            console.log("You are not logged in, please log in again.");
            localStorage.setItem('currentUser', null);
            this.navCtrl.setRoot(Login);
        }    
    }    
}