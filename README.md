# sar-status-personnel
Hybrid-app in Ionic / Cordova for SAR personnel

## Requirements


You need to have following assets available on `PATH` to build this app

* Node 7+, [install Node](https://nodejs.org/en/)
* Ionic 2, [install Ionic](https://ionicframework.com/docs/intro/installation/)
* Gradle 4, [install Gradle](https://gradle.org/install/)
* Java JRE or SDK 8, [install Java](https://java.com/en/download/) 
* Android SDK Platform 25, [install Android Studio](https://developer.android.com/studio/index.html)
* Xcode, [install Xcode](https://developer.apple.com/xcode/)
* ios-deploy, [install ios-deploy](https://www.npmjs.com/browse/keyword/ios-deploy) (use npm)
* CocoaPods, [install CocoaPods](https://guides.cocoapods.org/using/getting-started.html)


After installing Ionic2, use the following command to check requirements

```
$ cordova requirements
```

This should produce an output similar to this
```
Requirements check results for android:
Java JDK: installed 1.8.0
Android SDK: installed true
Android target: installed android-25,android-24,android-23
Gradle: installed /path/to/gradle

Requirements check results for ios:
Apple OS X: installed darwin
Xcode: installed 8.3.3
ios-deploy: installed 1.9.1
CocoaPods: installed

```  
 
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

Before every release remember to increace build number in `config.xml`

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
