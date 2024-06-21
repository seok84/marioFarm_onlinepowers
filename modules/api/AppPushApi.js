import Api from "@/modules/api/Api";

export default class AppPushApi extends Api {
    constructor(context) {
        super(context);
    }

    setPushToken(token) {
        return this.post('/api/app-push/token',{token:token});
    }

    getSetting(params) {
        return this.get('/api/app-push/setting',params);
    }

    saveLog(params) {
        return this.post('/api/app-push/save-log',params);
    }

    getReceiveFlag(params) {
        return this.get('/api/app-push/receive-flag',params);
    }
}
