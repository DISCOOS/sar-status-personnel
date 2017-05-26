import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { Subject } from 'rxjs/Subject';
import { Http, Response, RequestOptions } from '@angular/http';
import { URLSearchParams } from "@angular/http";
import { Headers } from '@angular/http';
import { Mission, MissionResponse, Alarm, SARUser, Expence } from '../models/models';
import { CONFIG } from '../shared/config';

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
    // Other components can subscribe to this 
    public isLoggedIn: Subject<boolean> = new Subject();

    constructor(private http: Http) {}

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
                return this.user;
            });
    }

    /**
     * Logs user in to the app. stores currentUser in localStorage and sets the loggedIn variable to true. 
     */

    public login(username: string, password: string) {
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
                    this.loggedIn = true;
                    this.isLoggedIn.next(this.loggedIn);
                } else {
                    return Observable.throw(new Error("error"));
                }
            })
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
    }

    /**
     * Method to persist SARUser-variable isTrackable to database.
     * @param isTrackable wanted boolean value for the user.
     */

    public setTrackable(isTrackable: boolean) {
        let user = this.getUser();
        user.isTrackable = isTrackable;
        let postBody = JSON.stringify(user, this._replacer);

        let url = baseUrl + "/sarusers/" + this.getUser().id;
        let options = new RequestOptions({ withCredentials: true });
        this._configureOptions(options);
        
        return this.http.patch(url, postBody, options)
            .map((res) => {
                return res.json();
            })
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