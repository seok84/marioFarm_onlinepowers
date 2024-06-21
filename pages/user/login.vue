<template>
    <section class="contents login_contents">
        <div class="tit_wrap">
            <h2 class="tit">로그인</h2>
        </div>
        <div class="container">
            <div class="row no-gutters justify-content-center">
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="form_wrap_line">
                        <form @submit.prevent="submit">
                            <fieldset>
                                <legend>로그인</legend>
                                <div class="form-group">
                                    <input type="text" id="id" v-model="loginRequest.loginId" class="form-control line"
                                           placeholder="아이디" title="아이디" required>
                                </div>
                                <div class="form-group">
                                    <input type="password" id="pw" ref="pap" v-model="loginRequest.password"
                                           class="form-control line" placeholder="비밀번호" title="비밀번호" required>
                                </div>
                                <div class="login_utile">
                                    <div class="check_area">
                                        <input type="checkbox" id="id_save" v-model="saveId">
                                        <label for="id_save">아이디 저장</label>
                                    </div>
                                    <div class="find_area">
                                        <a href="javascript:$s.redirect($s.pages.FIND_ID_PW);">아이디/비밀번호 찾기</a>
                                    </div>
                                </div>
                                <div class="btn-group">
                                    <button type="submit" class="btn btn_lg btn_primary">로그인</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div class="login_sns">
                        <ul>
                            <li class="facebook"><a href="javascript:void(0);" @click="connectSns('facebook')">페이스북 로그인</a></li>
                            <li id="naver_id_login" class="naver">
                                <a href="javascript:void(0);" @click="connectSns('naver')">네이버 로그인</a>
                                <div id="naverIdLogin" data-page-type="login" style="display:none;"></div>
                            </li>
                            <li class="kakao"><a href="javascript:void(0);" @click="connectSns('kakao')">카카오톡 로그인</a></li>
                            <li style="display:none" class="apple"><a href="javascript:void(0);" @click="connectSns('apple')">애플 로그인</a></li>
                        </ul>
                    </div>

                    <div class="login_nomem">
                        <p class="join_link">회원이 아니신가요?<a href="/user/join">회원가입</a></p>
                        <template v-if="true">
                            <form @submit.prevent="guestSearchOrder">
                                <button type="button" class="btn_nomem_order collapsed" data-toggle="collapse"
                                        data-target=".nomem_area"><span>비회원 주문조회</span></button>
                                <div class="collapse nomem_area">
                                    <div class="nomem_info">
                                        <p>주문시 인증한 휴대폰번호로 인증을 통해 <br>확인하실 수 있습니다.</p>
                                    </div>
                                    <div class="form_wrap_line">
                                        <div class="form-group certi_area">
                                            <input type="type" v-model="guestRequest.userName"
                                                   class="form-control line" placeholder="이름을 입력하세요"
                                                   title="휴대폰 번호를 입력하세요" required>
                                        </div>
                                        <div class="form-group certi_area">
                                            <input type="number" v-model="guestRequest.phoneNumber"
                                                   class="form-control line" placeholder="휴대폰 번호를 입력하세요"
                                                   title="휴대폰 번호를 입력하세요" required>
                                            <div class="btn_area">
                                                <button type="button" @click="sendAuthNumber"
                                                        class="btn btn_sm btn_outline_secondary">인증요청
                                                </button>
                                            </div>
                                        </div>
                                        <div class="form-group" v-if="showAuthNumber">
                                            <input type="password" v-model="guestRequest.authNumber"
                                                   class="form-control line" placeholder="인증 번호를 입력하세요"
                                                   title="인증 번호를 입력하세요" required>
                                            <div class="invalid-feedback">인증 번호를 입력하세요</div>
                                        </div>
                                    </div>
                                    <div class="btn-group">
                                        <button type="submit" class="btn btn_lg btn_primary">조회하기</button>
                                    </div>
                                </div>
                            </form>
                        </template>
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
    layout: 'client',
    head() {
        return {
            script: [
                { src: '//developers.kakao.com/sdk/js/kakao.min.js'},
                { src: 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js'},
                { src: 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'}
            ],
            link: [
                { rel: 'stylesheet', href: '/static/css/users.css' }
            ]
        }
    },
    beforeCreate: function() {
        $s = this.$saleson;
        vm = this;
    },
    data: function () {
        return {
            loginRequest: {
                loginType: 'ROLE_USER',
                loginId: '',
                password: '',
            },
            guestRequest: {
                userName: '',
                phoneNumber: '',
                requestToken: '',
                authNumber: ''
            },
            snsRequest : {
                snsType : '',
                snsId : '',
                email : '',
                snsName : ''
            },
            saveId: false,
            target: $s.pages.INDEX,
        }
    },
    methods: {
        submit: function () {

            // 인증
            $s.api.getAuthToken(vm.loginRequest, function () {

                let savedLoginId = vm.saveId ? vm.loginRequest.loginId : '';
                $s.core.setState($s.const.SAVED_LOGIN_ID, savedLoginId);

                let order = $s.core.getState($s.const.BUY_ORDER);

                if (order != null && order != '') {
                    $s.core.setState($s.const.BUY_ORDER, '');

                    vm.order = JSON.parse(order);
                    vm.order.noMemberLogin = true;

                    $s.api.buyOrder(vm.order, function () {}
                        , function(error) {
                            console.error(error);	// 실패시 이전 주문정보 조회 (redirect 진행)
                        });
                }

                $s.redirect(vm.target);

            }, function (error) {

                let message = '아이디/비밀번호를 정확히 입력해 주세요.';
                if ('UNAUTHORIZED_LOCK' == error.response.data.code) {
                    message = error.response.data.message;
                }

                $s.alert(message, function () {
                    vm.loginRequest.loginId = '';
                    vm.loginRequest.password = '';
                    $s.closeAlert();
                });

            });
        },
        sendAuthNumber: function () {

            let param = {};

            param['phoneNumber'] = this.guestRequest.phoneNumber;

            $s.api.sendAuthNumber(param, function (response) {

                vm.guestRequest.requestToken = response.requestToken;

            }, function (error) {
                $s.alert('인증번호 발송에 실패 했습니다.');
            });
        },
        guestSearchOrder: function () {
            if (!vm.showAuthNumber) {
                $s.alert("인증요청을 진행해주세요.");
                return false;
            }

            $s.api.getAuthGuestToken(this.guestRequest, function (response) {
                $s.redirect($s.pages.MYPAGE_ORDER);
            }, function (error) {
                $s.alert(error.response.data.message);
            });
        },
        connectSns: function (snsType) {
            Sns.connectSns(snsType, 0, "login");
        },
    },
    computed: {
        showAuthNumber: function () {
            return this.guestRequest.requestToken != '';
        },
    },
    mounted: function() {
        this.$nextTick(function () {
            Sns.initSns($s);

            let savedLoginId = $s.core.getState($s.const.SAVED_LOGIN_ID);
            let target = $s.core.getParameter("target");

            if (savedLoginId != null && savedLoginId != "") {
                vm.saveId = true;
                vm.loginRequest.loginId = savedLoginId;
            }

            if (target != null && target != '') {
                vm.target = decodeURIComponent(target);
            }
        });
    }
}
</script>
