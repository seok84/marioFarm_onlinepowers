<template>
    <section class="contents nomem_terms_contents">
        <div class="tit_wrap">
            <h2 class="tit">비회원 약관동의</h2>
        </div>
        <div class="nomem_terms_wrap">
            <div class="container">
                <div class="row no-gutters justify-content-center">
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="link_area">
                            <p>비회원으로 구매하시면 세일즈온에서 드리는 쿠폰할인 및 포인트 적립 혜택을 받으실수 없습니다.</p>
                            <p>또한 비회원 주문시에는 포인트가 지급되지 않습니다.</p>
                            <div class="btn_wrap">
                                <a href="javascript:void(0);" type="button" class="btn btn_sm btn_primary" @click="login">로그인</a>
                                <a href="/user/join" class="btn btn_sm btn_outline_secondary">회원가입</a>
                            </div>
                        </div>
                        <div class="agree_wrap">
                            <div class="all_check">
                                <div class="check_area">
                                    <input type="checkbox" id="all_check" title="선택" @click="allArrgeCheck">
                                    <label for="all_check">모든 약관 동의</label>
                                </div>
                            </div>
                            <div class="agree_check">
                                <div class="check_area">
                                    <input type="checkbox" id="agree_check1" title="선택" value="check1" v-model="arrgeChecks">
                                    <label for="agree_check1">이용약관에 동의(필수)</label>
                                </div>
                                <button class="terms_link" data-toggle="modal" data-target=".pop_policy_use">약관보기</button>
                            </div>
                            <div class="agree_check">
                                <div class="check_area">
                                    <input type="checkbox" id="agree_check2" title="선택" value="check2" v-model="arrgeChecks">
                                    <label for="agree_check2">개인정보의 수집·이용목적 및 항목에 동의(필수)</label>
                                </div>
                                <button class="terms_link" data-toggle="modal" data-target=".pop_privacy_use">약관보기</button>
                            </div>
                            <div class="btn-group">
                                <button class="btn btn_lg btn_primary" @click="buyOrder">결제하러가기</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade modal_full pop_policy_use">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal_tit">{{ policy.title }}</h3>
                    </div>
                    <div class="modal-body">
                        <div class="terms_wrap" v-html="policy.content"></div>
                    </div>
                    <button type="button" class="modal_close" data-dismiss="modal">
                        <span class="screen_out">닫기</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="modal fade modal_full pop_privacy_use">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal_tit">{{ privacy.title }}</h3>
                    </div>
                    <div class="modal-body">
                        <div class="terms_wrap" v-html="privacy.content"></div>
                    </div>
                    <button type="button" class="modal_close" data-dismiss="modal">
                        <span class="screen_out">닫기</span>
                    </button>
                </div>
            </div>
        </div>

    </section>
</template>

<script>
let $s, vm;

export default {
    head() {
        return {
            script: [],
            link: [
                { rel: 'stylesheet', href: '/static/css/order.css' }
            ]
        }
    },
    async asyncData ({$salesonApi}){
        const policy = await $salesonApi().policy.getPolicy({policyType: 'POLICY_TYPE_AGREEMENT'});
        const protect = await $salesonApi().policy.getPolicy({policyType: 'POLICY_TYPE_PROTECT_POLICY'});
        return {
            policy: policy.data.policy,
            protect: protect.data.policy
        }
    },
    beforeCreate: function() {
        $s = this.$saleson;
        vm = this;
    },
    data: function () {
        return {
            arrgeAllChecks: ['check1','check2'],
            arrgeChecks: [],
            policy: {},
            privacy: {}
        }
    },
    methods: {
        allArrgeCheck: function() {
            let list = this.arrgeChecks;
            let allArray = this.arrgeAllChecks;

            if (list.length != allArray.length) {
                this.arrgeChecks = allArray;
            } else {
                this.arrgeChecks = [];
            }
        },
        buyOrder: function() {
            if (!this.isCheckValid) {
                $s.alert('약관 동의후 진행부탁 드립니다.');
                return;
            }

            $s.redirect('/order/step1');
        },
        login: function() {
            $s.redirect('/user/login?target=' + encodeURIComponent('/order/step1'));
        }
    },
    computed: {
        isCheckValid: function() {
            return this.arrgeAllChecks.length == this.arrgeChecks.length;
        }
    },
    mounted: function() {
        this.$nextTick(function () {

        });
    }
}
</script>
