import Api from "@/modules/api/Api";

export default class OutletApi extends Api {
    constructor(context) {
        super(context);
    }

    /**
     * 임박몰 상품 정보 조회
     * @returns {*}
     */
    getOutlet() {
        return this.get('/api/outlet');
    }
}