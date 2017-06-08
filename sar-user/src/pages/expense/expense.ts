import { Component } from '@angular/core';
import { SARService } from '../../services/sar.service';
import { AuthService } from '../../services/auth.service';
import { ExceptionService } from '../../services/exception.service';
import { Expence, Mission } from '../../models/models'
import { NavController, NavParams } from 'ionic-angular';
import { Alarms } from '../alarms/alarms';
import { Login } from '../login/login';

@Component({
  selector: 'page-expense',
  templateUrl: 'expense.html',
})

export class Expense {
  amount: number;
  description: string;
  mission: Mission;
  loading: boolean; 

  constructor(
    public navCtrl: NavController,
    public SARService : SARService,
    private AuthService : AuthService,
    private ExceptionService : ExceptionService,
    public params: NavParams,
  ) { }

  addExpense(){
    this.loading = true;
    console.log("This: " + this.description + this.amount)
    if(this.description && this.amount) {
      let expense = new Expence(undefined, undefined, this.description, this.amount, this.mission.id, this.SARService.getUser().id);
      this.SARService.addExpense(expense)
        .subscribe(
          (data) => { 
            this.loading = false;
            this.navCtrl.push(Alarms).catch(error => {
              console.log(error);
							this.ExceptionService.expiredSessionError();
							this.navCtrl.push(Login);	 
            })},
          (error) => {
            console.log(error);
            this.loading = false;
          }
        );
    } else {
      this.loading = false;
      this.ExceptionService.expenseError();
    }
  }

  ionViewDidLoad() {
    this.loading = false;
    let missionId = this.params.get("missionId");
    console.log(missionId);
    this.SARService.getMission(missionId)
      .subscribe(
        (data) => { this.mission = data; console.log("Hentet mission"); },
        (error) => { this.navCtrl.pop(); });
  }

  ionViewCanEnter() {
    return this.AuthService.isLoggedIn();
  }
  cancel(){
    this.navCtrl.push(Alarms);
  }
}
