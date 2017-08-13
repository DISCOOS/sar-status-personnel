import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CONFIG } from '../shared/config';


// TODO: Implement ConfigPage
@Injectable()
export class ConfigService {

    private config: any;

    constructor(private storage: Storage) {

    }

    public load() : Promise<any> {
      return this.storage.get('config').then((config) => {

          // Initialize with default if not exists
          this.config = config ? config : CONFIG;

          return this.storage.set('config', this.config).then(() => {
              return Promise.resolve(this.config)
          });

      });
    }

    public get(key: string) : any {
        let config = this.config;
        if(config) {
          let keys = key.split(".");
          keys.forEach((key) => {
            config = config && (key in config) ? config[key] : null;
          });
        }
        return config;
    }

}
