import Api from "@/modules/api/Api";

export default class AuthApi extends Api {
    constructor(context) {
        super(context);
    }

    /**
     * sns 정보 가져오기
     * @returns {*}
     */
    getSnsInfo() {
        return this.get("/api/auth/sns-info");
    }
}
