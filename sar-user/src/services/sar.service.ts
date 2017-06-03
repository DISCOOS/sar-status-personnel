import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Subject } from 'rxjs/Subject';
import { Http, Response, RequestOptions } from '@angular/http';
import { URLSearchParams } from "@angular/http";
import { Headers } from '@angular/http';
import { Mission, Tracking, MissionResponse, Alarm, SARUser, Expence, AlarmResponse } from '../models/models';
import { CONFIG } from '../shared/config';
import { ExceptionService } from '../services/exception.service';

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
    alarms: Observable<Alarm[]>;
    user: SARUser;
    tracking: Tracking;
    longitude: number;
    latitude: number;
    lastUpdate: Date;
    // Other components can subscribe to this 
    public isLoggedIn: Subject<boolean> = new Subject();

    constructor(
        private http: Http,
        public ExceptionService: ExceptionService,
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
                return this.user; })
            .catch(this.ExceptionService.catchBadResponse);
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
    }

    /**
     * Method to persist user availability to the server.
     * @param isAvailable new status of user.
     */

    public setAvailability(isAvailable: boolean) {
        let postBody = { 
            "isAvailable" : isAvailable
        }

        let url = baseUrl + "/sarusers/" + this.getUser().id;
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);

        return this.http.patch(url, JSON.stringify(postBody), options)
            .map(res => { 
                return res.json();
            })
            .catch(this.ExceptionService.catchBadResponse)
    }
    
    /**
     * Method to persist SARUser-variable isTrackable to database.
     * @param isTrackable boolean value to persist.
     */

    public setTrackable(isTrackable: boolean) {
        let postBody = { 
            "isTrackable" : isTrackable
        }

        let url = baseUrl + "/sarusers/" + this.getUser().id;
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);

        return this.http.patch(url, JSON.stringify(postBody), options)
            .map(res => { 
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
        return this.http
            .get(url, options)
            .map(response => {  
                this.mission = response.json();
                return this.mission; })
            .catch(this.ExceptionService.catchBadResponse);
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
                return this.missions; })
            .catch(this.ExceptionService.catchBadResponse);
    }

    /**
     * Method fetches all alarms connected to a user id from DAO.
     * @param userId SARUser id
     */

    public getUserAlarms(userId: number) {
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);
        let url = baseUrl + '/attendants?filter[include][mission]&filter[where][sarUserId]=' + userId;

        return this.http.get(url, options)
            .map(response => { return response.json() })
            .catch(this.ExceptionService.catchBadResponse)
    }


    /**
     * Send a persist MissionResponse to the database.
     * @param missionResponse MissionResponse-object with user input.
     */

    public postMissionResponse(missionResponse: MissionResponse) {
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);
        let url = baseUrl + '/missionResponses';

        let postBody = JSON.stringify(missionResponse, this._replacer);
        console.log(postBody);
        return this.http.post(url, missionResponse, options)
            .map(res => { return res.json(); })
            .catch(this.ExceptionService.catchBadResponse)
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
                return this.alarm; })
            .catch(this.ExceptionService.catchBadResponse)
    }

    /**
     * Fetch all alarms of one mission
     * @param missionId
     */

    public getAlarms(missionId: number) {
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);
        let url = baseUrl + '/missions/' + missionId + '/alarms';  

        return this.http.get(url, options)
            .map((res) => { return res.json(); })
            .catch(this.ExceptionService.catchBadResponse)    
    }

    /**
     * Method to persist user expense
     * @param amount of the expense
     * @param description of the expense
     */

    public addExpense(expense: Expence) {
        let user =  this.getUser();
        let url = baseUrl + "/Expences";
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);

        let postBody = {
            "title" : "Brukerutgift for " + user.name,
            "description" : expense.description,
            "amount" : expense.amount,
            "mission": expense.missionId,
            "person" : expense.sARUserId
        }

        return this.http.post(url, JSON.stringify(postBody), options)
            .map(res => {
                    console.log(res.json())
                    return res.json() })
            .catch(this.ExceptionService.catchBadResponse)
    }

    /**
     * Method to persist a new Tracking-object to the database.
     * @param Tracking object to be persisted
     */

    public setTracking(missionResponseId: number) {
        let geopoint = {
            "lat": 60.38917550000001,
            "lng": 5.3132653
        }
        let tracking = new Tracking(null, missionResponseId, geopoint, new Date());

        let url = baseUrl + "/Trackings";
        let options = new RequestOptions({ withCredentials: true })
        this._configureOptions(options);

        return this.http.post(url, JSON.stringify(tracking), options)
            .map(res => { console.log("Opprettet tracking i db"); return res.json(); })
            .catch(this.ExceptionService.catchBadResponse)
    }

    public updateTracking(track: Tracking) {
        let minFrequency = 60000; // Frequency controller for how often the database should be utdated in milliseconds
        var now = new Date();
        let url = baseUrl + "/Trackings";
        let options = new RequestOptions({ withCredentials: true })
        
        if(this.lastUpdate && now.getTime() - this.lastUpdate.getTime() < minFrequency) {
            console.log("Ignoring updated geodata");
            return;
        } 

        this.lastUpdate = now;
        this._configureOptions(options);
        console.log(JSON.stringify(track));

        return this.http.patch(url, JSON.stringify(track), options)
            .map(res => { console.log(res.json()); return res.json(); })
            .catch(this.ExceptionService.catchBadResponse)    
    }
}