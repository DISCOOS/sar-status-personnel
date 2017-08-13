import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import { Http, Response, RequestOptions } from '@angular/http';
import { URLSearchParams } from "@angular/http";
import { Headers } from '@angular/http';
import { Mission, Tracking, MissionResponse, Alarm, SARUser, Expence } from '../models/models';
import { ExceptionService } from './exception.service';
import { SpinnerService } from '../blocks/spinner/spinner';
import { ConfigService } from "./config.service";

@Injectable()
export class SARService {

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
    baseUrl: string;

    constructor(
        private http: Http,
        public ExceptionService: ExceptionService,
        private spinnerService: SpinnerService,
        private configService: ConfigService
    ) {

      this.baseUrl = configService.get("sar.status.url");
    }


    private getApiUrl(uri: string) {
        return this.baseUrl + uri;
    }


    savePushtokenOnUser(token: string, userId: number) {

        const url = this.getApiUrl('sarusers/' + userId);
        const options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);

        const body = {
            "deviceToken": token
        };
        console.log("SARSERVICE savepushtokneonsuser _--");
        console.log(url);
        console.log(body);

        return this.http.patch(url, JSON.stringify(body), options)
            .map(res => {
                console.log(res.json());
                return res.json();
            })

    }

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
        let url = this.getApiUrl("/sarusers/" + id);
        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);
        return this.http.get(url, options)
            .map((res) => {
                this.user = res.json();
                return this.user;
            })
            .catch(this.ExceptionService.catchBadResponse);
    }

    /**
     * Logs user in to the app. Stores currentUser in localStorage.
     */

    public login(username: string, password: string) {

        let data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);
        let options = new RequestOptions();

        this.spinnerService.show();

        let url = this.getApiUrl('/sarusers/login');

        return this.http
            .post(url, data, options)
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
            .finally(() => this.spinnerService.hide())
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
            "isAvailable": isAvailable
        };

        let url = this.getApiUrl("/sarusers/" + this.getUser().id);
        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);

        this.spinnerService.show();
        return this.http.patch(url, JSON.stringify(postBody), options)
            .map(res => {
                console.log("Set available to " + isAvailable + " in db");
                return res.json();
            })
            .catch(this.ExceptionService.catchBadResponse)
            .finally(() => this.spinnerService.hide())
    }

    /**
     * Method to persist SARUser-variable isTrackable to database.
     * @param isTrackable boolean value to persist.
     */

    public setTrackable(isTrackable: boolean) {
        let postBody = {
            "isTrackable": isTrackable
        };

        let url = this.getApiUrl("/sarusers/" + this.getUser().id);
        let options = new RequestOptions({ withCredentials: true });
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
        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);
        let url = this.getApiUrl('/missions/' + missionId + '?filter[include][alarms]');
        this.spinnerService.show();
        return this.http
            .get(url, options)
            .map(response => {
                this.mission = response.json();
                return this.mission;
            })
            .catch(this.ExceptionService.catchBadResponse)
            .finally(() => this.spinnerService.hide())
    }

    /**
    *   Gets a list of all/latests missions
    *   @param limit - the maximum number of missions the method should fetch.
    *   @return Observable with array of latest Missions
    */

    public getMissions(limit?: number) {
        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);
        let url = this.getApiUrl('/missions');

        this.spinnerService.show();
        return this.http.get(url, options)
            .map((response) => {
                this.missions = response.json();
                return this.missions;
            })
            .catch(this.ExceptionService.catchBadResponse)
            .finally(() => this.spinnerService.hide())
    }

    /**
     * Method fetches all Missions with an alarm connected to a user id from DAO.
     * @param userId SARUser id
     */

    public getUserAlarms(userId: number) {
        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);
        let url = this.getApiUrl('/attendants?filter[include][mission]&filter[where][sarUserId]=' + userId);

        this.spinnerService.show();

        return this.http.get(url, options)
            .map(response => { return response.json(); })
            .catch(this.ExceptionService.catchBadResponse)
            .finally(() => this.spinnerService.hide())
    }

    public userHasAnsweredMission(userId: number, missionId: number) {
        console.log("SARservice check if user has answered mission");

        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);
        let url = this.getApiUrl('/attendants?filter[where][sarUserId]='
          + userId + '&filter[where][missionId]=' + missionId);
        let userExist: boolean;
        return this.http.get(url, options)
            .map(response => {
                let res = response.json();
                userExist = res[0] && res[0].id;
                console.log("User has answered mission before " + userExist);
                return userExist

            })
            .catch(this.ExceptionService.catchBadResponse)


    }


    /**
     * Send a persist MissionResponse to the database.
     * @param missionResponse MissionResponse-object with user input.
     */

    public postMissionResponse(missionResponse: MissionResponse) {
        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);
        let url = this.getApiUrl('/missionResponses');

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
        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);
        let url = this.getApiUrl('/alarms/' + alarmId);

        return this.http.get(url, options)
            .map((response) => {
                this.alarm = response.json();
                return this.alarm;
            })
            .catch(this.ExceptionService.catchBadResponse)
    }

    /**
     * Fetch all alarms of one mission
     * @param missionId
     */

    public getAlarms(missionId: number) {
        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);
        let url = this.getApiUrl('/missions/' + missionId + '/alarms');

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
        let user = this.getUser();
        let url = this.getApiUrl("/Expences");
        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);

        let postBody = {
            "title": "Brukerutgift for " + user.name,
            "description": expense.description,
            "amount": expense.amount,
            "mission": expense.missionId,
            "person": expense.sARUserId
        };

        return this.http.post(url, JSON.stringify(postBody), options)
            .map(res => {
                console.log(res.json());
                return res.json()
            })
            .catch(this.ExceptionService.catchBadResponse)
    }

    /**
     * Method to persist a new Tracking-object to the database.
     * @param Tracking object to be persisted
     */

    public setTracking(lat: number, lng: number, missionResponseId: number) {
        console.log("-----set tracking---------");
        let tracking = {
            "date": new Date(),
            "geopoint": {
                "lat": lat,
                "lng": lng
            },
            "missionResponseId": missionResponseId
        };

        console.log("posting initial " + JSON.stringify(tracking));

        let url = this.getApiUrl('/missionresponses/' + missionResponseId + '/tracking');
        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);

        return this.http.post(url, JSON.stringify(tracking), options)
            .map(res => { return res.json(); })
            .catch(this.ExceptionService.catchBadResponse)
    }

    /**
     * Method to update an excisting Tracking-object
     * @param Tracking object to be persisted. Id, geopoint and date required
     */

    public updateTracking(latitude: number, longitude: number, id: number, missionResponseId: number) {
        let postBody = {
            "date": new Date(),
            "geopoint": {
                "lat": latitude,
                "lng": longitude
            },
            "id": id,
            "missionResponseId": missionResponseId
        };

        console.log("posting updated tracking" + JSON.stringify(postBody));

        let url = this.getApiUrl("/Trackings/" + id);
        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);

        return this.http.patch(url, JSON.stringify(postBody), options)
            .map((res) => { console.log(res.json()); return res.json(); })
            .do(() => console.log("sendte object"))
    }
}
