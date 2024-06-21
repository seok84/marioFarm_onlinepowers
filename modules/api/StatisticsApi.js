import Api from "@/modules/api/Api";

export default class StatisticsApi extends Api {
    constructor(context) {
        super(context);
    }


    getReceiveNameStatistics(params) {
        return this.get("/api/statistics/receive-name", params);
    }
}