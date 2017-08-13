import {extend} from 'lodash';
import {config} from './environment.config';

export const environment = extend(config, {
    production: false
});