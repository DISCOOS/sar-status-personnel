import { Component } from '@angular/core';
import { SARService } from '../../services/sar.service';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs'
import { Alarms } from '../alarms/alarms';


@Component({
  selector: 'page-expense',
  templateUrl: 'expense.html',
  entryComponents: [

  ]
})

export class Expense {
  amount: number;
  description: string;
  missionId: number;

  constructor(
    public navCtrl: NavController,
    public SARService : SARService,
    public params:NavParams,
  ) { 
    this.missionId = params.get("missionId");
  }

  addExpense(){
    if(this.description.length == 0 && this.description == null ) {
    } else if (this.amount == null ) {
    } else {
      this.SARService.addExpense(this.amount, this.description, this.missionId);
      this.navCtrl.setRoot(Alarms);
    }
  }
}
