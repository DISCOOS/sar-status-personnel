import { Injectable } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { SARService } from '../services/sar.service';

import { Tracking, MissionResponse } from '../models/models';
import 'rxjs/add/operator/filter';

const config: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 50,
    distanceFilter: 30,
    debug: false, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    interval: 3000
};

@Injectable()
export class GeoService {
    public watch: any;
    public date: number = 0;
    private tracking: Tracking;
    private lastUpdate: Date;
    private lati: number;
    private long: number;
    private first: boolean;
    private missResId: number;
    private backTracking: any;

    constructor(
        public geolocation: Geolocation,
        private backgroundGeolocation: BackgroundGeolocation,
        public SARService: SARService,
    ) {
        this.first = true;
    }

    startTracking(missionResponseId: number) {
        this.geolocation.getCurrentPosition().then((resp) => {
            let lat = resp.coords.latitude;
            let lng = resp.coords.longitude;
            console.log("GOT POSITION " + lat + " " + lng)
            
            // POST tracking to api
            this.SARService.setTracking(lat, lng, missionResponseId)
                .subscribe(
                data => { this.tracking = data; },
                error => { console.log("Error persisting tracking object") }
                );

        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }


    stopTracking() {
        console.log('stopTracking');
        if (this.backgroundGeolocation && this.watch) {
            this.backgroundGeolocation.stop();
            this.watch.unsubscribe();
        }
    }

}







