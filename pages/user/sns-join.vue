<template>
    <section class="contents join_complete_contents">
        <div class="tit_wrap">
            <h2 class="tit">SNS회원가입</h2>
            <p class="sub_tit">원하시는 회원가입 방법을 선택해주세요.
                세일즈온 회원이 되시면 쿠폰 등 다양한 혜택을 받으실 수 있습니다.</p>
        </div>
        <div class="sns-join_wrap">
            <div class="container" v-cloak>
                <div class="row no-gutters justify-content-center">
                    <div class="form_input col-12 col-md-6 col-lg-4">
                        <form class="needs-validation" @submit.prevent="submit">
                            <div class="agree_wrap">
                                <div class="all_check">
                                    <div class="check_area">
                                        <input type="checkbox" id="all_check" title="선택" @click="allCheck($event)">
                                        <label for="all_check">모든 약관 동의</label>
                                    </div>
                                </div>
                                <div class="agree_check">
                                    <div class="check_area">
                                        <input type="checkbox" id="agree_check1"  title="선택" name="marketing" value="1" v-model="param.marketing">
                                        <label for="agree_check1">마케팅이용약관 동의(선택)</label>
                                    </div>
                                    <a href="javascript:void(0);" class="terms_link" data-toggle="modal" data-target="#terms1">약관보기</a>
                                </div>
                                <div class="agree_check">
                                    <div class="check_area">
                                        <input type="checkbox" id="agree_check2" title="선택" name="terms" value="1" v-model="param.terms">
                                        <label for="agree_check2">이용약관에 동의(필수)</label>
                                    </div>
                                    <a href="javascript:void(0);" class="terms_link" data-toggle="modal" data-target="#terms2">약관보기</a>
                                </div>
                                <div class="agree_check">
                                    <div class="check_area">
                                        <input type="checkbox" id="agree_check3" title="선택" name="privacy" value="1" v-model="param.privacy">
                                        <label for="agree_check3">개인정보의 수집·이용목적 및 항목에 동의(필수)</label>
                                    </div>
                                    <a href="javascript:void(0);" class="terms_link" data-toggle="modal" data-target="#terms3">약관보기</a>
                                </div>
                            </div>
                            <div class="login_sns">
                                <ul>
                                    <li class="facebook"><a href="javascript:void(0);" @click="connectSns('facebook')">페이스북 회원가입</a></li>
                                    <li id="naver_id_login" class="naver">
                                        <a href="javascript:void(0);" @click="connectSns('naver')">네이버 회원가입</a>
                                        <div id="naverIdLogin" data-page-type="login" style="display:none;"></div>
                                    </li>
                                    <li class="kakao"><a href="javascript:void(0);" @click="connectSns('kakao')">카카오톡 회원가입</a></li>
                                    <li style="display:none" class="apple"><a href="javascript:void(0);" @click="connectSns('apple')">애플 회원가입</a></li>
                                </ul>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </section>
</template>
<script>
import Sns from '@/modules/op.sns.js';
let $s, vm;

export default {
    head() {
        return {
            script: [],
            link: [
                { rel: 'stylesheet', href: '/static/css/users.css' }
            ]
        }
    },
    beforeCreate: function() {
        // 기존 Vue로 작성된 스크립트 실행시 적용
        $s = this.$saleson;
        vm = this;
    },
    data: function () {
        return {
            param: {
                receiveSms: "Y",
                receiveEmail: "Y",

                years: 0,
                privacy:0,
                marketing:0,
                terms:0,
                //check1: false,
                //check2: false,
                //check3: false,
                auth: false
            },
            policy: {},
            privacy: {},
            marketing: {}
        }
    },
    methods: {
        allCheck: function (event) {
            vm.param.marketing = event.target.checked;
            vm.param.terms = event.target.checked;
            vm.param.privacy = event.target.checked;
        }
    },
    mounted: function() {
        this.$nextTick(function () {

        });
    }
}
</script>