import { Component } from '@angular/core';

import { Alarms } from '../alarms/alarms';
import { Profile } from '../profile/profile';
import { Home } from '../home/home';
import { Expense } from '../utlegg/expense';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = Home;
  tab2Root = Profile;
  tab3Root = Alarms;
  tab4Root = Expense;

  constructor() {

  }
}
