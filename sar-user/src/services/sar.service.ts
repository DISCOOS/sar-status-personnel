import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Subject } from 'rxjs/Subject';
import { Http, Response, RequestOptions } from '@angular/http';
import { URLSearchParams } from "@angular/http";
import { Headers } from '@angular/http';
import { Mission, Tracking, MissionResponse, Alarm, SARUser, Expence } from '../models/models';
import { CONFIG } from '../shared/config';
import { Push, PushToken } from '@ionic/cloud-angular';
import { ExceptionService } from '../services/exception.service';
import { Geolocation } from '@ionic-native/geolocation';

let baseUrl = CONFIG.urls.baseUrl;
let token = CONFIG.headers.token;

@Injectable()
export class SARService {
    loggedIn: boolean;
    token: string;
    available: string;
    id: any;
    missions: Observable<Mission[]>;
    mission: Mission;
    alarm: Alarm;
    user: SARUser;
    tracking: Tracking;
    longitude: number;
    latitude: number;
    // Other components can subscribe to this 
    public isLoggedIn: Subject<boolean> = new Subject();

    constructor(
        private http: Http,
        public push: Push,
        public ExceptionService: ExceptionService,
        private geolocation: Geolocation
    ) { }




    /**
     * Configures options with token and header for http-operations on server.
     */

    private _configureOptions(options: RequestOptions) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem("currentUser")).access_token);
        headers.append('Content-Type', 'application/json');
        options.headers = headers;
    }
        getPos() {
        console.log("getPos() fired");
       //let user = this.getUser();
        let tracking 
        let url = baseUrl + "/SARUsers/Tracking";
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);

        //if (this.user.isTrackable == true) {
            this.geolocation.getCurrentPosition().then((resp) => {

               
                this.tracking.positionLat = resp.coords.latitude.toString();
                this.tracking.positionLong = resp.coords.longitude.toString();
                console.log(this.tracking.positionLat);
                let postBody = JSON.stringify(this.tracking, this._replacer);
                console.log(postBody);
                return this.http.post(url, postBody)
                    .map(res => {
                        return res.json()
                    })

            }).catch((error) => {
                console.log('Error getting location', error);
            });
            
            console.log(this.longitude);
       // }


    }

    /**
	 * Filter out ID from JSON-object. 
	 * @param key 
	 * @param value 
	 */

    private _replacer(key, value) {
        if (key == "id") return undefined;
        else return value;
    }

    /**
     * Returns SARUser-object with active user from localStorage.
     * @return Object from JSON-string
     */

    getUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    /**
     * Fetches user from database
     * @param id of wanted user
     * @return SARUser object
     */

    getUserFromDAO(id: number) {
        let url = baseUrl + "/SARUsers/" + id;
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);
        return this.http.get(url, options)
            .map((res) => {
                this.user = res.json();
                return this.user;
            });
    }

    /**
     * Logs user in to the app. Stores currentUser in localStorage.
     */

    public login(username: string, password: string) {
        //this.getPos();

        let data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);
        let options = new RequestOptions();
        return this.http
            .post(baseUrl + '/SARUsers/login', data, options)
            .map((response: Response) => {

                // login successful if there's a token in the response
                let res = response.json();
                if (res.user && res.user.access_token) {
                    // store user details and token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(res.user));
                } else {
                    return Observable.throw(new Error("Login error"));
                }
            })
            .catch(this.ExceptionService.catchBadResponse)
    }

    /**
     * Logs the user out of the app. Also unregisters from push notifications.
     */

    public logout() {
        localStorage.removeItem('currentUser');
        //this.push.unregister();
    }

    /**
     * Method to register token for reciving push notifications from the app
     */

    private pushRegister() {

    }

    /**
     * Method to persist user availability to the server.
     * @param isAvailable new status of user.
     */

    public setAvailability(isAvailable: boolean) {
        let user = this.getUser();
        user.isAvailable = isAvailable;
        let postBody = JSON.stringify(user, this._replacer);

        let url = baseUrl + "/SARUsers/" + this.getUser().id;
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);
        return this.http.patch(url, postBody, options)
            .map(res => {
                return res.json()
            })
            .catch(this.ExceptionService.catchBadResponse)
    }



    /**
     * Method to persist SARUser-variable isTrackable to database.
     * @param isTrackable boolean value to persist.
     */

    public setTrackable(isTrackable: boolean) {
        let url = baseUrl + "/sarusers/" + this.getUser().id;
        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);

        let user = this.getUser();
        user.isTrackable = isTrackable;
        let postBody = JSON.stringify(user, this._replacer);

        return this.http.patch(url, postBody, options)
            .map((res) => {
                return res.json();
            })
            .catch(this.ExceptionService.catchBadResponse)
    }

    /**
     * Returns a spesific Mission from database.
     * @param missionId Id of wanted Mission.
     * @return Mission-object
     */

    public getMission(missionId?: number) {
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

    /**
     * Method fetches all alarms connected to a user id from DAO.
     * @param userId SARUser id
     */

    public getUserAlarms(userId) {

    }


    /**
     * Send a persist MissionResponse to the database.
     * @param missionResponse MissionResponse-object with user input.
     */

    public postMissionResponse(missionResponse: MissionResponse) {
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);
        let url = baseUrl + '/missionResponses';
        console.log("hit");
        let postBody = JSON.stringify(missionResponse, this._replacer);
        console.log(postBody);
        return this.http.post(url, missionResponse, options)
            .map(res => {
                return res.json();
            })
    }

    /**
     * Fetch alarm from database by id.
     * @param alarmId id of wanted alarm
     */

    public getAlarm(alarmId: number) {
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);
        let url = baseUrl + '/alarms/' + alarmId;

        return this.http.get(url, options)
            .map((response) => {
                this.alarm = response.json();
                return this.alarm;
            })
    }

    private handleError(error: Response) {
        let msg = `Status ${error.status}, url: ${error.url}`;
        console.error(msg);
        return Observable.throw(msg || 'Server error');
    }

    /**
     * Method to persist user expense
     * @param amount of the expense
     * @param description of the expense
     */

    public addExpense(amount: number, description: string, missionId: number) {
        let user = this.getUser();

        let url = baseUrl + "/SARUsers/Expences";
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);

        this.getMission(missionId).subscribe(res => {
            this.mission = res;
            let expense = new Expence(null, null, description, amount, this.mission, user.id);
            let postBody = JSON.stringify(expense, this._replacer);
            return this.http.post(url, postBody, options)
                .map(res => {
                    //console.log(res.json())
                    return res.json()
                })
        }),
            (error) => {
                return error;
            }
    }


}