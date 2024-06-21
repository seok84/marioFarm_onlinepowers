import Api from "@/modules/api/Api";

export default class AppVersionApi extends Api {
    constructor(context) {
        super(context);
    }

    getAppVersion() {
        return this.get('/api/app-version');
    }

}
