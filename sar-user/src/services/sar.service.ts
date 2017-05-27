import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';
import { Http, Response, RequestOptions } from '@angular/http';
import { URLSearchParams } from "@angular/http";
import { Headers } from '@angular/http';
import { Mission } from '../models/models';


let baseUrl = "http://0.0.0.0:3000/api";

@Injectable()
export class SARService {
    loggedIn: boolean;
    token: string;
    available: string;
    trackable: string;
    id: any;
    missions: Observable<Mission[]>;
    mission: Mission;
    // Other components can subscribe to this 
    //public isLoggedIn: Subject<boolean> = new Subject();

    constructor(
        private http: Http,
        


    ) {

    }

    private _configureOptions(options: RequestOptions) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem("currentUser")).access_token);
        headers.append('Content-Type', 'application/£json');
        options.headers = headers;
    }

    public login(username: string, password: string) {
        let data = new URLSearchParams();

        data.append('username', username);
        data.append('password', password);


        let options = new RequestOptions({ withCredentials: true })
        return this.http
            .post('http://localhost:3000' + '/api/SARUsers/login', data, options)
            .map((response: Response) => {

                // login successful if there's a token in the response
                let res = response.json();

                if (res.user.user && res.user.access_token) {
                    // store user details and token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(res.user.user));
                    this.loggedIn = true;
                    //this.isLoggedIn.next(this.loggedIn);
                } else {
                    return Observable.throw(new Error("error"));
                }
            })

        // .catch(this.exceptionService.catchBadResponse)

    }

    /**
    * Returns SARUser-object with active user.
    * @return Object from JSON-string
    */
    
    getUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    public setAvailability(isAvailable: boolean) {

        let user = this.getUser();
        let url = baseUrl + "/SARUsers/" + this.getUser().id;

        let options = new RequestOptions({ withCredentials: true })

        //Hack å bare sette hele bodyen sånn, men ellers settes alt annet til null
        let body = {
            "kovaId": user.kovaId,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "isAvailable": isAvailable,
            "isTrackable": user.isTrackable,
            "isAdmin": user.isAdmin,
            "id": user.id,
            "expenceId": user.expenceId
        };

        return this.http
            .patch(url, body, options)
            .map(res => {
                console.log(res.json())
                return res.json()
            })

        //.catch(this.handleError)

    }

    public setTrackable(isTrackable: boolean) {

        let user = this.getUser();
        let url = baseUrl + "/SARUsers/" + this.getUser().id;

        let options = new RequestOptions({ withCredentials: true })

        //Hack å bare sette hele bodyen sånn, men ellers settes alt annet til null
        let body = {
            "kovaId": user.kovaId,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "isAvailable": user.isAvailable,
            "isTrackable": isTrackable,
            "isAdmin": user.isAdmin,
            "id": user.id,
            "expenceId": user.expenceId
        };

        return this.http
            .patch(url, body, options)
            .map(res => {
                console.log(res.json())
                return res.json()
            })

        //.catch(this.handleError)

    }

    /**
     * Returns a spesific Mission from database.
     * @param missionId Id of wanted Mission.
     * @return Mission-object
     */

    public getMission(missionId? : number) {
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);
        let url = baseUrl + '/missions/' + missionId;
        return this.http.get(url, options)
            .map((response) => {
                this.mission = response.json();
                return this.mission; 
        })
    }

    /**
    *   Gets a list of all/latests missions
    *   @param limit - the maximum number of missions the method should fetch.
    *   @return Observable with array of latest Missions
    */

    public getMissions(limit?: number) {
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);
        let url = baseUrl + '/missions';
        let returnMissions: any;

        return this.http.get(url, options)
            .map((response) => {
                this.missions = response.json();
                return this.missions
            })
    }

    private handleError(error: Response) {
        let msg = `Status ${error.status}, url: ${error.url}`;
        console.error(msg);
        return Observable.throw(msg || 'Server error');
    }

    public addExpense(amount: number, title: string) {
        let user = this.getUser();

        let url = baseUrl + "/SARUsers/Expence" + this.getUser().id;


        let options = new RequestOptions({ withCredentials: true })


        let body = {

            "title": title,
            "amount": amount,
            "missionId": this.getUser().missionId,
            "sARUserId": this.getUser().sARUserId
        };

        return this.http
            .post(url, body, options)
            .map(res => {
                console.log(res.json())
                return res.json()
            })
    }
} 