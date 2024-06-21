import Api from "@/modules/api/Api";

export default class ReviewApi extends Api {



    /**
     * 이용후기 리뷰 get
     * @param params
     * @returns {*}
     */
    getItemReviews(param) {
        return this.get('/api/mypage/reviews',param);
    }

    /**
     * 이용후기 리뷰 삭제
     * @param params
     * @returns {*}
     */
    deleteReview(reviewId) {
        return this.post(`/api/mypage/delete-review/${reviewId}`);
    }

    /**
     * 이용후기 좋아요
     * @param reviewId
     * @returns {*}
     */
    addLikeCount(reviewId){
        return this.post(`/api/item/review/add-like/${reviewId}`);
    }

}