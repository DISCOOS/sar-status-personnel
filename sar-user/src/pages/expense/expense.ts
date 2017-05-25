import { Component } from '@angular/core';
import { SARService } from '../../services/sar.service';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs'


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
    this.SARService.addExpense(this.amount, this.description)
      .subscribe(
      data => {       
        this.navCtrl.setRoot(TabsPage);
      },
      error => {
        console.log(error)
        // this.toastService.activate("Innlogging mislyktes", false, false);
        // this.loading = false;
      });
  }
}
