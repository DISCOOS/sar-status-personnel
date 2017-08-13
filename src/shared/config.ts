import {environment} from "../environments/environment";

export let CONFIG = {
    sar: {
        status: {
          url: (environment.SAR_STATUS_API_HOST + '/api')
        }
    }
};
