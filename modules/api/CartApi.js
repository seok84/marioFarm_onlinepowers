import Api from "@/modules/api/Api";

export default class CartApi extends Api {
    constructor(context) {
        super(context);
    }

    /**
     * 장바구니 상품 목록
     * @param params
     * @returns {*}
     */
    getCartItems(params) {
        return this.get("/api/cart", params);
    }

    getCartOrderPrice(params) {
        return this.post("/api/cart/price", params);
    }
}
