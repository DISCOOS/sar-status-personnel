import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { Http, Response, RequestOptions } from '@angular/http';
import { URLSearchParams } from "@angular/http";

@Injectable()
export class SARService {
    loggedIn: boolean;
    token: string;
    available: string;
    id: any;
    // Other components can subscribe to this 
    public isLoggedIn: Subject<boolean> = new Subject();

    constructor(
        private http: Http
    ) {

    }

    public login(username: string, password: string) {
        let data = new URLSearchParams();
        
        console.log(username)
        console.log(password)

        data.append('username', username);
        data.append('password', password);


        let options = new RequestOptions({ withCredentials: true })
        return this.http
            .post('http://0.0.0.0:3000' + '/api/SARUsers/login', data, options)
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
} 