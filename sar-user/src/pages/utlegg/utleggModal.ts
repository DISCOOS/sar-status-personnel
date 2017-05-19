import { Component } from '@angular/core';
import { SARService } from '../../services/sar.service';
import { NavController } from 'ionic-angular';
import { ModalController, NavParams } from 'ionic-angular';


@Component({
    selector: 'page-utleggModal',
    templateUrl: 'utleggModal.html',
    entryComponents: [
        ModalController
    ]
})

export class UtleggModal {

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController) {

    }


    public openModal() {
        let utleggmodal = this.modalCtrl.create(UtleggModal, {
            buttons: [{
                text: 'avbryt',
                role: 'cancel', // will always sort to be on the bottom

                handler: () => {
                    console.log('Cancel clicked');
                }
            }]
        });


        utleggmodal.present();
    }

    public closeModal()
    {
        this.navCtrl.pop();
    }


}