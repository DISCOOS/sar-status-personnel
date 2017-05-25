import { Component } from '@angular/core';

import { Alarms } from '../alarms/alarms';
import { Profile } from '../profile/profile';
import { Home } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = Home;
  tab2Root = Profile;
  tab3Root = Alarms;

  constructor() {

  }
}
