import { Geolocation } from '@ionic-native/geolocation';
import { CONFIG } from '../shared/config';
import { SARService } from 'sar.service';
import { Response } from '@angular/http';
import { Tracking } from '../models/models';
import { Http, RequestOptions } from '@angular/http';
import { Injectable} from '@angular/core';

let baseUrl = CONFIG.urls.baseUrl;
let token = CONFIG.headers.token;
let watch = this.geolocation.watchPosition();
let timer = 5000;

@Injectable()
export class GeoService {

    tracking: Tracking;
    constructor(
        private geolocation: Geolocation,
        private http, Http
    ) {

    }
    user = SARService.getUser();

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
        let url = baseUrl + "Trackings"
        console.log("watchPos fired");
        if (this.user.isTrackable) {
            watch.subscribe((data) => {
                this.tracking.positionLat = data.coords.latitude;
                this.tracking.positionLong = data.coords.longitude;
                return this.http.patch(this.tracking)
                    .map(res => {
                        return res.json()
                    })
            });
        }
    }
}







