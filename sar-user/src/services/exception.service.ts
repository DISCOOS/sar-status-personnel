import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Login } from '../pages/login/login';
import { Response } from '@angular/http';

@Injectable()
export class ExceptionService {
    emsg: string;

    constructor(public navCtrl: NavController) { }

    public userError(type: number) {
        this.emsg = "En ukjent feil har oppstått";
        if(type == 1) {
            console.log("You are not logged in, please log in again.");
            this.emsg = "You are not logged in, please log in again."
            localStorage.setItem('currentUser', null);
        }
        return this.emsg;     
    }

    public responseError(errorResponse: any) {
        let res = <Response>errorResponse;
        console.log(res);

        let err = res.json();
        let statusCode = "";

        if (err && err.status) {
            statusCode = err.status;
        } else {
            statusCode = err ?
                (err.error ? err.error.statusCode : '') : '';
        }

        if (statusCode == '401') {
            this.emsg = 'Ingen tilgang. Forsøk å logge inn på nytt'
        }
        else if (statusCode == '404') {
            this.emsg = 'Denne ressursen finnes ikke'
        }
        else if (statusCode == '500') {
            this.emsg = 'Intern serverfeil i SAR-API '
        } else {
            this.emsg = ""
        }

        return this.emsg;
    }   
}