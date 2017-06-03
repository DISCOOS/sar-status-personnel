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
            interval: 30000,
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
        public SARService: SARService,
    ) {}
    
    startTracking(missionResponseId: number) {
        console.log(missionResponseId);
        this.SARService.setTracking(missionResponseId)
            .subscribe( 
                data => { this.tracking = data; },
                error => { console.log("Error creating tracking object") }
            );
        
        this.backgroundGeolocation.configure(config)
            .subscribe((location) => {          
                console.log('BackgroundGeolocation:  ' + location.latitude + ', ' + location.longitude);
                // Run update inside of Angular's zone
                this.zone.run(() => {
                    this.lat = location.latitude;
                    this.lng = location.longitude;
                });

                if(this.tracking) {
                    this.tracking.geopoint = {
                        "lat" : this.lat,
                        "lng" : this.lng
                    } 
                    this.tracking.date = new Date();
                    this.SARService.updateTracking(this.tracking);
                }
                this.backgroundGeolocation.finish();
             }, (err) => { console.log(err); });

        this.backgroundGeolocation.start();

        let options = {
            enableHighAccuracy: true,
        };
 
        this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
            console.log(position);
            if(this.tracking) {
                console.log(this.tracking)                
                this.tracking.geopoint = {
                        "lat" : position.coords.latitude,
                        "lng" : position.coords.longitude
                }
                console.log(this.tracking.geopoint)                       
                this.tracking.date = new Date();
                console.log("E vi her hver gang?"); 
                this.SARService.updateTracking(this.tracking);
            }
        });
    }

    stopTracking() {
        console.log('stopTracking');
        this.backgroundGeolocation.stop();
        this.watch.unsubscribe();        
    }

    getPosision() {
        return this.geolocation.getCurrentPosition();
    }
}







