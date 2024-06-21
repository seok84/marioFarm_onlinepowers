import Api from "@/modules/api/Api";

export default class CommonApi extends Api {
    constructor(context) {
        super(context);
    }

    /**
     * 회사 정보 조회
     * @param params
     * @returns {*}
     */
    getCompanyInfo() {
        return this.get("/api/common/about-us");
    }

    getQuickInfo() {
        return this.get('/api/common/quick-info');
    }

    getSessionTimeout() {
        return this.get('/api/auth/session-timeout');
    }
}
