import { Injectable } from '@angular/core';
import { Login } from '../pages/login/login';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';

@Injectable()
export class ExceptionService {
    emsg: string;

    constructor(
        public alertCtrl: AlertController
    ) {}

    expiredSessionError() {
        let alert = this.alertCtrl.create ({
            title: 'En feil har oppstått',
            subTitle: 'Ingen tilgang. Forsøk å logge inn på nytt.',
            buttons: ['Ok']
        });
        alert.present();    
    }

    expenseError() {
        let alert = this.alertCtrl.create ({
            title: 'Mangelfull info',
            subTitle: 'Du må fylle ut begge feltene. Prøv på nytt!',
            buttons: ['Ok']
        });
        alert.present();     
    }

    catchBadResponse: (errorResponse: any) => Observable<any> = (errorResponse: any) => {
        console.log(errorResponse)

        let res = <Response>errorResponse;
        let err = res.json();

        let emsg = err ?
            (err.error ? err.error.message : JSON.stringify(err)) :
            (res.statusText || 'Ukjent feil');
        let statusCode;
        if (err && err.status) {
            statusCode = err.status;
        } else {
            statusCode = err ?
                (err.error ? err.error.statusCode : '') : '';
        }

        if (statusCode == '401') {
            this.emsg = 'Ingen tilgang. Forsøk å logge inn på nytt.'
        } else if(statusCode == '400') {
            this.emsg = 'Brukernavn og passord må fylles inn. Prøv på nytt!'
        } else if (statusCode == '404') {
            this.emsg = 'Denne ressursen finnes ikke.'
        } else if (statusCode == '500') {
            this.emsg = 'Tjenesten er utilgjengelig. Prøv igjen senere.'
        } else {
            this.emsg = 'Ukjent feil. Prøv igjen senere.'
        }

        let alert = this.alertCtrl.create ({
            title: 'En feil har oppstått',
            subTitle: this.emsg,
            buttons: ['Ok']
        });
        alert.present();    

        return Observable.throw(new Error("Error"));
    }   
}