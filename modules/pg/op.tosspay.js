var TossPay = {
    TOSS_PAYMENTS : {},
    data : {
        CLIENT_KEY : "test_ck_D4yKeq5bgrpe7o6J9NX8GX0lzW6Y",
        TOSS_URL : "https://js.tosspayments.com/v1/payment",
        PAYMENT_TYPE : ["CARD","TOSSPAY","VIRTUAL_ACCOUNT","TRANSFER","MOBILE_PHONE","CULTURE_GIFT_CERTIFICATE","BOOK_GIFT_CERTIFICATE","GAME_GIFT_CERTIFICATE"],
        EASY_PAY : ["NAVERPAY", "KAKAOPAY"],
        CHECKED_EASY_PAY : '',
        CHECKED_TYPE : '',   // 선택 된 결제방법 ex) CARD
        ADD_SUC_PARAM : '',
        USE_ESCROW : false  // 에스크로
    },
    urlInit : () => {
        let script = document.createElement('script');
        script.src = TossPay.data.TOSS_URL;
        document.body.appendChild(script);
    },
    module : () => {
        function validObject(data){
            return typeof data != 'undefined' && data != null;
        }
        function validPaymentType(type){
            switch(type) {
                case 'vbank':
                    TossPay.data.CHECKED_TYPE = 'VIRTUAL_ACCOUNT';
                    break;
                case 'hp':
                    TossPay.data.CHECKED_TYPE = 'MOBILE_PHONE';
                    break;
                case 'realtimebank':
                    TossPay.data.CHECKED_TYPE = 'TRANSFER';
                    break;
                case 'naver':
                    TossPay.data.CHECKED_TYPE = 'CARD';
                    TossPay.data.CHECKED_EASY_PAY = 'NAVERPAY';
                    break;
                case 'kakao':
                    TossPay.data.CHECKED_TYPE = 'CARD';
                    TossPay.data.CHECKED_EASY_PAY = 'KAKAOPAY';
                    break;
                default:
            }
            if(!TossPay.data.PAYMENT_TYPE.includes(TossPay.data.CHECKED_TYPE.toUpperCase())
                && !TossPay.data.EASY_PAY.includes(TossPay.data.CHECKED_EASY_PAY.toUpperCase())){
                alert("결제방법을 확인해주세요.");
                return false;
            }
            return true;
        }
        return {
            tossObject : (pgData) => {
                if(validObject(pgData)){
                    TossPay.data.USE_ESCROW = pgData.USE_ESCROW;
                    return TossPay.module().payTypeObject({
                        amount : pgData.AMOUNT,
                        orderId : pgData.ORDER_CODE,
                        orderName : pgData.LGD_PRODUCTINFO,
                        customerName : pgData.CUSTOMER_NAME,
                        customerEmail : pgData.CUSTOMER_EMAIL,
                        successUrl : pgData.SUCCESS_URL+TossPay.data.ADD_SUC_PARAM,
                        failUrl : pgData.FAIL_URL
                    })
                }
            },
            payTypeObject : (obj) => {
                let payTypeObj = new Object();
                if(TossPay.data.CHECKED_TYPE == "VIRTUAL_ACCOUNT"){
                    // 가상계좌타입
                    payTypeObj = {
                        ...obj
                        , validHours : 24
                        , cashReceipt : {
                            type: '소득공제'
                        }
                    };
                    // 에스크로 사용인 경우만 설정
                    if(TossPay.data.USE_ESCROW){
                        payTypeObj['useEscrow'] = TossPay.data.USE_ESCROW;
                    }
                } else if(TossPay.data.EASY_PAY.includes(TossPay.data.CHECKED_EASY_PAY)){
                    // 간편결제타입
                    payTypeObj = {
                        ...obj
                        , flowMode: 'DIRECT'
                        , easyPay : TossPay.data.CHECKED_EASY_PAY
                    };
                } else {
                    payTypeObj = obj;
                }
                return payTypeObj;
            },
            pay : (data) => {
                if(validPaymentType(TossPay.data.CHECKED_TYPE)){
                    let to = TossPay.module().tossObject(data);
                    TossPay.TOSS_PAYMENTS.requestPayment(TossPay.data.CHECKED_TYPE, to)
                        .catch(TossPay.module().error);
                }
            },
            error : (data) => {
                vm.submitCheck = false;
                if(data.code == 'USER_CANCEL'){
                    // 결제 고객이 결제창을 닫았을 때 에러 처리
                    alert(data.message);
                } else if(data.code == 'INVALID_CARD_COMPANY'){
                    // 유효하지 않은 카드 코드에 대한 에러 처리
                    alert(data.message);
                } else if(data.code == 'INVALID_REQUEST'){
                    // 필수 파라미터 누락
                    alert(data.message);
                }
            }
        }
    },
};
// toss 설정
TossPay.urlInit();
window.onload = () => {
    TossPay.TOSS_PAYMENTS = TossPayments(TossPay.data.CLIENT_KEY);
}