import Api from "@/modules/api/Api";

export default class WishlistApi extends Api {
    constructor(context) {
        super(context);
    }

    /**
     * 관심상품 목록 조회
     * @param params
     * @returns {*}
     */
    getWishlist(params) {
        return this.get("/api/wishlist/wishlist", params);
    }
}