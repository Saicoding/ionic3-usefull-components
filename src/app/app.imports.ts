// Ionic native providers
import { Camera } from '@ionic-native/camera';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Providers
import { CameraProvider } from '../providers/util/camera.provider';

// Modules
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

export const MODULES = [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot({
        name: 'myImgs',
        driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
]

export const PROVIDERS =[
    CameraProvider,

    // Ionic native specific providers
    StatusBar,
    SplashScreen,
    Camera
]