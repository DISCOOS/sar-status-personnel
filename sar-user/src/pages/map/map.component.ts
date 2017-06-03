import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { Component, Input } from '@angular/core';
import { Mission } from "../../models/models";


@Component({
  selector: 'map',
  templateUrl: 'map.component.html',
  providers: [
    GoogleMaps,
  ]
})

export class MapPage {

  @Input() mission: Mission;

  constructor(private googleMaps: GoogleMaps) { }

  // Load map only after view is initialized
  ngAfterViewInit() {
    setTimeout(() => {
      this.loadMap();
    }, 4000)

  }

  loadMap() {

    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    let map: GoogleMap = this.googleMaps.create(element);

    // listen to MAP_READY event
    // You must wait for this event to fire before adding something to the map or modifying it in anyway
    map.one(GoogleMapsEvent.MAP_READY).then(
      () => {
        console.log('Map is ready!');
        // Now you can add elements to the map like the marker
      }
    );

    // create LatLng object


    const markerPos: LatLng = new LatLng(this.mission.meetingPoint.lat, this.mission.meetingPoint.lng);

    // create CameraPosition
    let position: CameraPosition = {
      target: markerPos,
      zoom: 11,
      tilt: 30
    };

    // move the map's camera to position
    map.moveCamera(position);

    // create new marker
    let markerOptions: MarkerOptions = {
      position: markerPos,
      title: this.mission.meetingPointNicename
    };

    map.addMarker(markerOptions)
      .then((marker: Marker) => {
        marker.showInfoWindow();
      });
  }
}