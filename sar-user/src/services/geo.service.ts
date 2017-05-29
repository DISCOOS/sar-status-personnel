import { Geolocation } from '@ionic-native/geolocation';

export class GeoService {

    constructor(
        private geolocation: Geolocation,

    ) {

    }
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

}