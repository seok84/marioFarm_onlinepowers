import Api from "@/modules/api/Api";

export default class SearchApi extends Api {
    constructor(context) {
        super(context);
    }

    getResult(params) {
        if (params !== null && params.query !== null && params.query !== '') {
            params.query = decodeURIComponent(params.query);
            params.query = encodeURIComponent(params.query);
        }
        return this.get('/api/search/result', params);
    }

    /**
     * 관리자가 지정한 인기검색어 목록 (10개)
     */
    getPopularKeywordsSpecifiedByManager() {
        return this.get('/api/search/popular-keyword');
    }

    getInfo() {
        return this.get('/api/search/info')
    }
}
