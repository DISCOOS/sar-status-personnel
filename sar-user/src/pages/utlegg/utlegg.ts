import { Component } from '@angular/core';
import { SARService } from '../../services/sar.service';
import { NavController } from 'ionic-angular';
import { ModalController, NavParams } from 'ionic-angular';
import { UtleggModal} from '../../pages/utlegg/utleggModal';

@Component({
  selector: 'page-utlegg',
  templateUrl: 'utlegg.html',
  entryComponents: [
    ModalController
  ]
})

//Leike itj nokka butikk eller bank, vi driv itj utlegg

export class Utlegg {
  
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController
    ) {
      
  }
  
 

  public openModal() {
    //UtleggModal.openModal();
    console.log("openModal()")
  }

  closeModal() {
    //UtleggModal.closeModal();
    console.log("closeModal();")
  }


}
