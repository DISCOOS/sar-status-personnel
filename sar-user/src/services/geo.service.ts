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
            debug: true, //  enable this hear sounds for background-geolocation life-cycle.
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
    ) { }

    startTracking(missionResponseId: number) {
        console.log("Starting tracking for: " + missionResponseId);
        this.missResId = missionResponseId;
        this.lastUpdate = new Date();    

        this.backgroundGeolocation.configure(config)
            .subscribe((location) => {          
                console.log('BackgroundGeolocation:  ' + location.latitude + ', ' + location.longitude);
                console.log(this.readyUpdate())
                if(this.readyUpdate()) {
                    this.lati = location.latitude;
                    this.long = location.longitude;
                    this.sendUpdate(this.lati, this.long);
                }
             }, (err) => { console.log(err); });

        this.backgroundGeolocation.start()
            .catch(error => console.log(error));

        let options = {
            enableHighAccuracy: true,
        };
 
        this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
            console.log(position);
            console.log(this.readyUpdate())
            if(this.readyUpdate()) {
                    console.log(this.tracking)                
                    this.sendUpdate(position.coords.latitude, position.coords.longitude)
            }
        });
    }

    sendUpdate(lat: number, lng: number) {
        console.log("E vi her hver gang?"); 
        if(this.first) {
            this.first = false;
            this.SARService.setTracking(lat, lng, this.missResId)
                .subscribe( 
                    data => { this.tracking = data; },
                    error => { console.log("Error creating tracking object") }
                );
        } else {
            console.log()
            this.SARService.updateTracking(lat, lng, this.tracking.id, this.tracking.missionResponseId)
                .subscribe(
                    (data) => {console.log("Fyrte av")},
                    (error) => {console.log("Error")});
        }
    }

    stopTracking() {
        console.log('stopTracking');
        this.backgroundGeolocation.stop();
        this.watch.unsubscribe();        
    }

    private readyUpdate() {
        let minFrequency = 60000; // Frequency controller for how often the database should be updated in milliseconds
        var now = new Date();
        if(this.lastUpdate && now.getTime() - this.lastUpdate.getTime() < minFrequency) {
            console.log("Ignoring updated geodata");
            return false;
        } 
        this.lastUpdate = now;
        return true;
    }
}







