import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

import { Tracking } from '../models/models';
import 'rxjs/add/operator/filter';

@Injectable()
export class GeoService {
    public watch: any;    
    public lat: number = 0;
    public lng: number = 0

    constructor(
        public geolocation: Geolocation,
        public zone: NgZone,
        public backgroundGeolocation: BackgroundGeolocation,
    ) {}
    
    startTracking() {
        let config = {
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30, 
            debug: true, //  enable this hear sounds for background-geolocation life-cycle.
            interval: 2000,
            stopOnTerminate: false, // enable this to clear background location settings when the app terminates
        };

        this.backgroundGeolocation.configure(config)
            .subscribe((location) => {          
                console.log('BackgroundGeolocation:  ' + location.latitude + ', ' + location.longitude);
                // Run update inside of Angular's zone
                this.zone.run(() => {
                    this.lat = location.latitude;
                    this.lng = location.longitude;
                });
             }, (err) => { console.log(err); });

        this.backgroundGeolocation.start();

        let options = {
            frequency: 3000, 
            enableHighAccuracy: true
        };
 
        this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
            console.log(position);
 
            // Run update inside of Angular's zone
            this.zone.run(() => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            });
        });
    }

    stopTracking() {
        console.log('stopTracking');
        this.backgroundGeolocation.finish();
        this.watch.unsubscribe();        
    }
}







