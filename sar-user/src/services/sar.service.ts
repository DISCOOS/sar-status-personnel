import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';
import { Http, Response, RequestOptions } from '@angular/http';
import { URLSearchParams } from "@angular/http";
import { Headers } from '@angular/http';
import { Mission } from '../models/models';

let baseUrl = "http://localhost:3000/api";

@Injectable()
export class SARService {
    loggedIn: boolean;
    token: string;
    available: string;
    id: any;
    missions: Mission[];
    // Other components can subscribe to this 
    public isLoggedIn: Subject<boolean> = new Subject();

    constructor(
        private http: Http
    ) {

    }

    private _configureOptions(options: RequestOptions) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		options.headers = headers;
	}

    public login(username: string, password: string) {
        let data = new URLSearchParams();
        
        console.log(username)
        console.log(password)

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
                    this.isLoggedIn.next(this.loggedIn);
                }
            })

        //  .catch(this.handleError)

    }

    getUser(){
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    public setAvailability(isAvailable:boolean) {
        
        let user = this.getUser();
        let url = "http://0.0.0.0:3000/api/SARUsers/"+this.getUser().id;

        let options = new RequestOptions({ withCredentials: true })
        
        // console.log("user.id: "+ user.id);
        // console.log("paramter fra home.ts: "+isAvailable);
        // console.log(" localstorage user.isAvailable: " +this.getUser().isAvailable);
        // console.log(url);
        // console.log(JSON.parse(user.isAvailable));
        this.available = '{"isAvailable:"'+isAvailable+';}';
        console.log(this.available);

        return this.http
            .put(url, this.available);
        
           

        //.catch(this.handleError)

    }

    /*
    *   Gets a list of all missions
    *   @param limit - the maximum number of missions the method should fetch.
    */

    public getMissions(limit?: number) {
        let options = new RequestOptions({ withCredentials: true })
		this._configureOptions(options);
		let url = baseUrl + 'missions';
		let returnMissions: any;

		return this.http.get(url, options)
			.map((response: Response) => <Mission[]>response.json())
			.catch(this.handleError)
    }

    private handleError(error: Response) {
		let msg = `Status ${error.status}, url: ${error.url}`;
		console.error(msg);
		return Observable.throw(msg || 'Server error');
    }
} 