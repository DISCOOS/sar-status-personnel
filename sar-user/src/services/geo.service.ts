import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { SARService } from '../services/sar.service';

import { Tracking, MissionResponse } from '../models/models';
import 'rxjs/add/operator/filter';

const config: BackgroundGeolocationConfig = {
            desiredAccuracy: 10,
            stationaryRadius: 50,
            distanceFilter: 30,
            debug: true, //  enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: false, // enable this to clear background location settings when the app terminates
            interval: 3000,
};

@Injectable()
export class GeoService {
    public watch: any;    
    public lat: number = 0;
    public lng: number = 0;
    public date: number = 0;
    private tracking: Tracking;

    constructor(
        public geolocation: Geolocation,
        public zone: NgZone,
        private backgroundGeolocation: BackgroundGeolocation,
    ) {}
    
    startTracking(missionResponse: MissionResponse) {
        this.tracking = new Tracking(missionResponse, null, null, null);
        
        this.backgroundGeolocation.configure(config)
            .subscribe((location) => {          
                console.log('BackgroundGeolocation:  ' + location.latitude + ', ' + location.longitude);
                // Run update inside of Angular's zone
                this.zone.run(() => {
                    this.lat = location.latitude;
                    this.lng = location.longitude;
                });
                this.backgroundGeolocation.finish();
             }, (err) => { console.log(err); });

        this.backgroundGeolocation.start();

        let options = {
            frequency: 3000, 
            enableHighAccuracy: true,
        };
 
        this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
            console.log(position);
 
            // Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.date = position.timestamp;
            });

            this.tracking.positionLat = this.lat.toString();
            this.tracking.positionLong = this.lng.toString();
            this.tracking.date = this.date;
            console.log(this.lat)
            console.log(this.lng)
            console.log(this.date)
        });
    }

    stopTracking() {
        console.log('stopTracking');
        this.backgroundGeolocation.stop();
        this.watch.unsubscribe();        
    }
}







