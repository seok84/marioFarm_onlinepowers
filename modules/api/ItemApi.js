import Api from "@/modules/api/Api";

export default class ItemApi extends Api {
    constructor(context) {
        super(context);
    }

    getItems(params) {
        return this.get('/api/item', params);
    }

    /**
     * 상품 정보 조회
     * @param itemUserCode
     * @returns {Promise<any>}
     */
    getItem(itemUserCode) {
        return this.get(`/api/item/${itemUserCode}`);
    }

    /**
     * 체험단 리뷰 조회
     * @param params
     * @returns {Promise<*>}
     */
    getExperienceTeamReviews(params) {
        return this.get('/api/item/experience-team-reviews', params);
    }

    /**
     * 리뷰 조회
     * @param params
     * @returns {Promise<*>}
     */
    getItemReviews(params) {
        return this.get('/api/item/reviews', params);
    }

    addExperienceTeamReviewLike(id= 0) {
        return this.post(`/api/item/experience-team-reviews/add-like/${id}`);
    }
}
