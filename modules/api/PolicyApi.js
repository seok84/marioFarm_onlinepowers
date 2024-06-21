import Api from "@/modules/api/Api";

export default class PolicyApi extends Api {
    constructor(context) {
        super(context);
    }
    getPolicy(param) {
        const { policyType } = param;
        return this.get("/api/policy/" + policyType);
    }

    getPolicies() {
        return this.get("/api/policy/policies");
    }
}