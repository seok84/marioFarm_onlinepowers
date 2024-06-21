import Api from "@/modules/api/Api";

export default class SellerApi extends Api {
    constructor(context) {
        super(context);
    }


    getSellerBusinessNumberList(params) {
        return this.get("/api/seller/business-numbers", params);
    }
}