import Api from "@/modules/api/Api";

export default class DisplayApi extends Api {
    constructor(context) {
        super(context);
    }

    getVisible() {
        return this.get('/api/display/visible');
    }

    getPromotion() {
        return this.get('/api/display/promotion');
    }


    getNewItems(params) {
        return this.get('/api/display/new', params);
    }

    getBestItems(params) {
        return this.get('/api/display/best', params);
    }

    getMainCntsPicks() {
        return this.get('/api/display/cnts-picks/main');
    }

    getBrand() {
        return this.get('/api/display/brand');
    }
}
