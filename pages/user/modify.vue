<template>
    <section class="contents myinfo_contents">
        <div class="tit_wrap">
            <h2 class="tit">내 정보 관리</h2>
        </div>
        <div class="info_wrap">
            <div class="container">
                <div class="row no-gutters justify-content-center" v-cloak>
                    <div class="col-12 col-md-6 col-lg-4">
                        <form class="needs-validation" @submit.prevent="login" v-if="param.modifyResult === ''">
                            <div class="tab-content">
                                <div id="general_member" class="tab-pane fade show active">
                                    <div class="info_txt">
                                        <p>개인정보를 안전하게 보호하기 위해 <br>비밀번호를 다시 한번 입력해주세요</p>
                                    </div>
                                    <div class="form_wrap_line">
                                        <div class="form-group">
                                            <input type="password" id="password_confirm" class="form-control line" placeholder="비밀번호를 입력해주세요" title="비밀번호를 입력해주세요" required>
                                        </div>
                                    </div>
                                    <div class="btn-group">
                                        <button type="submit" class="btn btn_lg btn_primary">확인</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="form_input" v-else-if="param.modifyResult === '1'">
                            <form class="needs-validation" @submit.prevent="submit">
                                <fieldset>
                                    <legend>회원정보 수정</legend>
                                    <div class="myinfo_area">
                                        <div class="form_wrap_line">
                                            <div class="form-group">
                                                <input type="text" class="form-control line" placeholder="이름" title="이름" v-model="param.userName" required>
                                            </div>
                                            <div class="radio_wrap">
                                                <div class="radio_area">
                                                    <input type="radio" id="woman" name="gender" value="F" v-model="param.gender">
                                                    <label for="woman">여성</label>
                                                </div>
                                                <div class="radio_area">
                                                    <input type="radio" id="man" name="gender" value="M" v-model="param.gender">
                                                    <label for="man">남성</label>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <input type="text" class="form-control line" placeholder="아이디" title="아이디" v-model="param.loginId" :readonly="!param.sns" required>
                                            </div>
                                            <div class="form-group">
                                                <input type="text" class="form-control line" placeholder="이메일" title="이메일" v-model="param.email" maxlength="50" @change="valid($event, validate.email)" required>
                                                <div class="invalid-feedback">{{validate.emailMessage}}</div>
                                            </div>
                                            <div class="form-group">
                                                <div class="row">
                                                    <div class="col-4">
                                                        <select class="custom-select line" title="년" v-model="param.birthdayYear">
                                                            <option v-for="(n, i) in 100" :value="param.years-i">{{param.years - i}}년</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-4">
                                                        <select class="custom-select line" title="월" v-model="param.birthdayMonth">
                                                            <option v-for="i in 12" :value="i" required>{{i}}월</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-4">
                                                        <select class="custom-select line" title="일" v-model="param.birthdayDay">
                                                            <option v-for="i in 31" :value="i">{{i}}일</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div></div>
                                            <!--                      <div class="radio_wrap">-->
                                            <!--                        <div class="radio_area">-->
                                            <!--                          <input type="radio" id="birth" name="date_birth" value="1" v-model="param.birthdayType">-->
                                            <!--                          <label for="birth">양력</label>-->
                                            <!--                        </div>-->
                                            <!--                        <div class="radio_area">-->
                                            <!--                          <input type="radio" id="lunar" name="date_birth" value="2" v-model="param.birthdayType">-->
                                            <!--                          <label for="lunar">음력</label>-->
                                            <!--                        </div>-->
                                            <!--                      </div>-->
                                            <div class="sns_wrap" v-if="!param.sns">
                                                <ul class="row no-gutters">
                                                    <li class="col-4">
                                                        <div id="naver_id_login">
                                                            <a href="javascript:void(0);" id="naver" class="naver" :class="{'on' : ( snsInfo?.naver?.createdDate )}" @click="connectSns('naver', snsInfo?.naver?.snsUserId)"> <!-- 연동시 class="on" 추가 -->
                                                                <span class="screen_out">네이버</span>
                                                            </a>
                                                            <div id="naverIdLogin" data-page-type="mypage" style="display:none;"></div>
                                                        </div>
                                                    </li>

<!--                                                    <li class="col-4">-->
<!--                                                        <a href="javascript:void(0);" id="facebook" class="facebook" :class="{'on' : (snsInfo.facebook > 0)}" @click="connectSns('facebook', snsInfo.facebook)"> &lt;!&ndash; 연동시 class="on" 추가 &ndash;&gt;-->
<!--                                                            <span class="screen_out">페이스북</span>-->
<!--                                                        </a>-->
<!--                                                    </li>-->
                                                    <li class="col-4">
                                                        <a href="javascript:void(0);" id="kakao" class="kakao" :class="{'on' : ( snsInfo?.kakao?.createdDate )}" @click="connectSns('kakao', snsInfo?.kakao?.snsUserId)"> <!-- 연동시 class="on" 추가 -->
                                                            <span class="screen_out">카카오</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="myinfo_area">
                                        <div class="form_wrap_line">
                                            <div class="form-group phone_area">
                                                <div class="row no-gutters">
                                                    <div class="col-4 col-md-2">
                                                        <select class="custom-select line" v-model="param.frontPhoneNumber">
                                                            <option v-for="data in param.phoneCodes" :value="data.detail">{{data.label}}</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-8 col-md-10">
                                                        <input type="number" class="form-control line" placeholder="'-'없이 숫자만 입력" title="휴대폰번호" v-model="param.backPhoneNumber" @change="valid($event, validate.numberOnly)" maxlength="8" required>
                                                        <div class="invalid-feedback">{{validate.numberOnlyMessage}}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group address_area">
                                                <div class="input" v-html="param.addressInfo"></div>
                                                <span id="address_placeholder" class="placeholder">우편번호 찾기</span>
                                                <button type="button" class="btn_address" @click="openDaumPostcode()"><img class="img-fluid" src="/static/images/icon/btn_address.png" alt="주소찾기"></button>
                                            </div>
                                            <div class="form-group">
                                                <input type="text" class="form-control line" placeholder="상세주소" title="상세주소" v-model="param.addressDetail" maxlength="150" required>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="myinfo_area">
                                        <h3 class="info_tit">SMS 수신동의</h3>
                                        <div class="txt_area">
                                            <p>수신동의시 쇼핑몰에서 제공하는 이벤트 및 다양한 정보를 SMS/E-mail로 받아볼 수 있습니다.</p>
                                            <p>(단, 회원가입, 거래정보-결제/배송/교환/환불 등과 같은 운영정보는 수신동의 여부와 관계없이 발송됩니다.)</p>
                                        </div>
                                        <div class="radio_wrap">
                                            <div class="radio_area">
                                                <input type="radio" id="reception1" value="Y" v-model="param.receiveSms">
                                                <label for="reception1">수신</label>
                                            </div>
                                            <div class="radio_area">
                                                <input type="radio" id="reception2" value="N" v-model="param.receiveSms">
                                                <label for="reception2">수신안함</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="myinfo_area">
                                        <h3 class="info_tit">E-mail 수신동의</h3>
                                        <div class="txt_area">
                                            <p>수신동의시 쇼핑몰에서 제공하는 이벤트 및 다양한 정보를 SMS/E-mail로 받아볼 수 있습니다.</p>
                                            <p>(단, 회원가입, 거래정보-결제/배송/교환/환불 등과 같은 운영정보는 수신동의 여부와 관계없이 발송됩니다.)</p>
                                        </div>
                                        <div class="radio_wrap">
                                            <div class="radio_area">
                                                <input type="radio" id="reception2-1" value="Y" v-model="param.receiveEmail">
                                                <label for="reception2-1">수신</label>
                                            </div>
                                            <div class="radio_area">
                                                <input type="radio" id="reception2-2" value="N" v-model="param.receiveEmail">
                                                <label for="reception2-2">수신안함</label>
                                            </div>
                                        </div>
                                        <div class="row no-gutters btn-group">
                                            <div class="col-6">
                                                <button type="submit" class="btn btn_lg btn_primary">수정완료</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="link_secession">
                                        <a href="/user/secede">회원탈퇴</a>
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div> <!--// col-12 E -->
            </div>
        </div>
        <address-layer></address-layer>
    </section> <!--// contents E -->
</template>

<script>
import Sns from '@/modules/op.sns.js';
import AddressLayer from "@/components/ui/daum/address-layer";

let $s, vm;

export default {
    components: {AddressLayer},
    middleware: 'auth',
    async asyncData({ $salesonApi, error }) {
        try {
            const { data } = await $salesonApi().auth.getSnsInfo();
            console.dir(data);
            return {
                snsInfo: {
                    kakao: {
                        snsUserId: data?.info?.kakao?.snsUserId,
                        createdDate: data.info?.kakao?.createdDate
                    },
                    naver: {
                        snsUserId: data?.info?.naver?.snsUserId,
                        createdDate: data.info?.naver?.createdDate
                    }
                }
            }
        } catch (e) {
            error(e.response.data)
        }
    },
    head() {
        return {
            script: [
                {src: 'https://developers.kakao.com/sdk/js/kakao.min.js', body: true},
                { src:'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js', body: true},
            ],
            link: [
                { rel: 'stylesheet', href: '/static/css/item.css' },
                { rel: 'stylesheet', href: '/static/css/order.css' },
                { rel: 'stylesheet', href: '/static/css/mypage.css' },
                { rel: 'stylesheet', href: '/static/css/customer.css' }
            ]
        }
    },
    beforeCreate: function() {
        $s = this.$saleson;
        vm = this;
    },
    data: function () {
        return {
            param: {
                sns: false,
                modifyResult: "",
                userName: "",
                email: "",
                phoneNumber: "",
                frontPhoneNumber: "",
                backPhoneNumber: "",
                gender: "F",
                birthdayYear: "",
                birthdayMonth: "1",
                birthdayDay: "1",
                birthdayType: "1",
                post: "",
                newPost: "",
                address: "",
                addressDetail: "",
                addressInfo: "",
                receiveSms: "Y",
                receiveEmail: "Y",
                years: 0
            },
            snsInfo: {
                kakao: {
                    snsUserId : 0,
                    createdDate : ""
                },
                apple: {
                    snsUserId : 0,
                    createdDate : ""
                },
                naver: {
                    snsUserId : 0,
                    createdDate : ""
                }
            },
            validate: {
                email: this.$saleson.validator.patterns.email,
                numberOnly: this.$saleson.validator.patterns.number_only,

                emailMessage: this.$saleson.validator.messages.email,
                numberOnlyMessage: this.$saleson.validator.messages.number_only
            }
        }
    },
    methods: {
        checkPassword: function() {
            $s.api.checkPassword(vm.param,
                function (response) {
                    if (response.status === "OK") {
                        vm.param.modifyResult = "1";
                        vm.getMember(false);
                    }
                }, function (error) {
                    $s.alert(error.response.data.description);
                }
            );
        },
        login: function() {
            vm.param.password = $("#password_confirm").val();
            if (vm.param.password === "") {
                $s.alert("비밀번호를 입력해주세요.");
                return false;
            }

            vm.checkPassword();
        },
        getMember: function(isSns) {
            $s.api.getMember(
                function (response) {
                    vm.param = response.info;
                    vm.param.modifyResult = "1";
                    vm.param.sns = isSns;

                    if (isSns) {
                        vm.param.loginId = vm.param.email;
                    }

                    if (vm.param.address != "" && vm.param.address != undefined) {
                        document.getElementById("address_placeholder").textContent = "";
                    }

                    var date = new Date();
                    vm.param.years = date.getFullYear();
                }
            );
        },
        openDaumPostcode: function () {
            var child = this.getChild("address-layer");
            if (child != null) {
                child.openDaumAddress(function(response) {
                    vm.param.post = response.zipcode;
                    vm.param.newPost = response.newZipcode;
                    vm.param.address = response.jibunAddress;

                    vm.param.addressInfo = "[" + response.newZipcode + "] " + response.jibunAddress;

                    document.getElementById("address_placeholder").textContent = "";
                });
            }
        },
        submit: function () {
            if (!vm.checkfeed('.form_input')) {
                return false;
            }

            if (vm.param.frontPhoneNumber != "" && vm.param.frontPhoneNumber != undefined
                && vm.param.backPhoneNumber != "" && vm.param.backPhoneNumber != undefined) {
                vm.param.phoneNumber = vm.param.frontPhoneNumber + vm.param.backPhoneNumber;
            }

            $s.api.updateMember(vm.param,
                function (response) {
                    if (response.status === "OK") {
                        $s.alert('수정되었습니다.', function () {
                            $s.redirect($s.pages.INDEX);
                        });
                    }
                }, function (error) {
                    $s.alert(error.response.data.description);
                }
            );
        },
        connectSns: function (snsType, snsUserId) {
            Sns.connectSns(snsType, snsUserId, $s.config.snsPageType.MYPAGE);
        }
    },
    computed: {

    },
    mounted: function() {
        this.$nextTick(function () {

            Sns.initSns($s);

            $s.api.getSnsInfo(
                function (response) {
                    vm.snsInfo = response.info;
                    if (response.sns) {
                        vm.param.modifyResult = "1";
                        vm.getMember(true);
                    }
                }
            );
        });
    }
}
</script>
