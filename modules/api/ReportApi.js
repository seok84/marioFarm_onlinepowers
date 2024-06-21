import Api from "@/modules/api/Api";

export default class ReportApi extends Api {
    constructor(context) {
        super(context);
    }

    getInit() {
        return this.get('/api/common/report/init');
    }

    writeReport(param) {
        return this.post('/api/common/report', param);
    }

    block(param) {
        return this.post('/api/common/block',param);
    }

    unblock(param) {
        return this.post('/api/common/unblock',param);
    }

}
