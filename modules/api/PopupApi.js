import Api from "@/modules/api/Api";

export default class PopupApi extends Api {
    constructor(context) {
        super(context);
    }

    /**
     * 게시 기간에 포함된 팝업 목록 조회
     * @returns {*}
     */
    getPopupList() {
        return this.get('/api/popup/list');
    }
}
