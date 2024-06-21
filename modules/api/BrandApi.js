import Api from "@/modules/api/Api";

export default class BrandApi extends Api {
    constructor(context) {
        super(context);
    }

    getMainBrands() {
        return this.get('/api/brand/main');
    }

    getBrand(id) {
        return this.get('/api/brand/'+id);
    }

    getBrandItems(id, params) {
        return this.get(`/api/brand/${id}/items`, params);
    }
}
