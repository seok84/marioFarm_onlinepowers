import Api from "@/modules/api/Api";

export default class CouponApi extends Api {
    constructor(context) {
        super(context);
    }

    /**
     * 마이페이지 - 쿠폰 목록 조회 (다운로드 한 쿠폰 목록)
     * @param params
     * @returns {*}
     */
    getCoupons(params) {
        return this.get("/api/coupon", params);
    }


    /**
     * 마이페이지 - 배송비 쿠폰 목록 (사용 가능)
     * @param params
     * @returns {*}
     */
    getShippingCoupons(params) {
        return this.get("/api/coupon/shipping-coupons", params);
    }
}
