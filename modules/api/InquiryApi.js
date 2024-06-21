import Api from "@/modules/api/Api";

export default class InquiryApi extends Api {
    constructor(context) {
        super(context);
    }

    getQnaGroups() {
        return this.get("/api/qna/qna-groups");
    }

    getQnaInquiries(params) {
        return this.get("/api/qna/inquiry", params);
    }

    getItemInquiries(params) {
        return this.get("/api/qna/item-inquiry", params);
    }

    writeItemInquiry(params) {
        return this.post("/api/qna/item-inquiry", params);
    }

    getDownloadFile(id, params) {
        return this.downloadFile(`/api/qna/inquiry/${id}/download-file`, params,'blob');
    }
}