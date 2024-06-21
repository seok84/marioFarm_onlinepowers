import Api from "@/modules/api/Api";

export default class OrderApi extends Api {
    constructor(context) {
        super(context);
    }

    getRecentOrderItem(param) {
        return this.get('/api/order/recent-order-item', param);
    }

    getSalesLedger(param) {
        return this.get('/api/order/sales-ledger', param);
    }

    getPaymentStep(){
        return this.post('/api/order/payment-step');
    }

    getSnsInfo(){
        return this.get("/api/auth/sns-info");
    }

    getOrderDetail(param){
        return this.get('/api/order/detail/'+param);
    }

    getDirectDeliveryInfo(post = '') {
        return this.get('/api/order/direct-delivery-info/'+post);
    }
}
