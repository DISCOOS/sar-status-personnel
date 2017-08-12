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

Since this repo is public you need to fist get PRIVATE signing keys `release-signing.properties`, 
`sar-status-personnel.jks` and place them into `platforms/android/`. 
Once done you can release the app with following command.

Before every release remember to increace build number in `confix.xml`

```sh
$ ionic cordova build android --prod --release
```

Upload `platforms/android/build/outputs/apk` into Google Play.

## iOS

### Running on emulator

```sh
$ ionic cordova run ios
$ ionic cordova run ios --device
```

### Release to App Store

Follow this guide https://ionicframework.com/docs/intro/deploying/ .
```
$ ionic cordova platform add ios
$ ionic cordova build ios
 ```
