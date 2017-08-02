# sar-status-personnel
Hybrid-app in Ionic / Cordova for SAR personnel

## Android

### Running in emulator

In order to test app on Android run following commands.
```sh
$ yarn
$ ionic cordova platform add
$ ionic cordova run android
```

### Release to Google Play

Since this repo is public you need to fist get PRIVATE signing keys `release-signing.properties`, `sar-status-personnel.jks` and place them into `platforms/android/`. Once done you can release the app with following command.

```sh
$ ionic cordova build android --prod --release
```