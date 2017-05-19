import { Component } from '@angular/core';
import { SARService } from '../../services/sar.service';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs'


@Component({
  selector: 'page-expense',
  templateUrl: 'expense.html',
  entryComponents: [

  ]
})

//Leike itj nokka butikk eller bank, vi driv itj utlegg

export class Expense {
  amount: number;
  description: string;
  constructor(
    public navCtrl: NavController,
    public SARService : SARService
  ) { }

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
