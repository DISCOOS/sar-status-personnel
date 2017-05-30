import { Geolocation } from '@ionic-native/geolocation';
import { CONFIG } from '../shared/config';
import { Response } from '@angular/http';
import { Tracking } from '../models/models';
import { Http, RequestOptions } from '@angular/http';
import { Injectable} from '@angular/core';

let baseUrl = CONFIG.urls.baseUrl;
let token = CONFIG.headers.token;

@Injectable()
export class GeoService {
    timer = 5000;
    tracking: Tracking;

    constructor(
        private http: Http,
        public geolocation: Geolocation, 
    ) { }
    
    /**
     * @Returns current posisition of device
     */

    getLocation() {
        
        return this.geolocation.getCurrentPosition().then((resp) => {
            resp.coords.latitude
            resp.coords.longitude
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    /**
     * Watch the current device’s position. 
     * Clear the watch by unsubscribing from Observable changes.
     * subscription.unsubscribe();
     */

    watchPos() {
        let watch = this.geolocation.watchPosition();
        let url = baseUrl + "Trackings"
        console.log("watchPos fired");
        if (true) {
            // Dette er ikke nødvendig. Du trenger ikke subscribe her vel? Og all kommunikasjon med server burde ligge i SARService
            watch.subscribe((data) => {
                this.tracking.positionLat = data.coords.latitude.toString();
                this.tracking.positionLong = data.coords.longitude.toString();
                return this.http.patch(url, this.tracking) 
                    .map(res => {
                        return res.json()
                    })
            });
        } 
    }
}







