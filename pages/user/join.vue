<template>
    <section class="contents join_contents">
        <div class="tit_wrap">
            <h2 class="tit">회원가입</h2>
        </div>
        <div class="join_wrap">
            <div class="container" v-cloak>
                <div class="row no-gutters justify-content-center">
                    <div class="form_input col-12 col-md-6 col-lg-4">
                        <form class="needs-validation" @submit.prevent="submit">
                            <div class="join_area">
                                <div class="form_wrap_line">
                                    <fieldset>
                                        <legend>회원가입</legend>
                                        <div class="form-group">
                                            <input type="text" class="form-control line" placeholder="사용하실 아이디를 입력하세요"
                                                   title="사용하실 아이디를 입력하세요" v-model="param.loginId" maxlength="50" @change="valid($event, validate.id)" required>
                                            <div class="invalid-feedback">{{validate.idMessage}}</div>
                                        </div>
                                        <div class="form-group">
                                            <input type="password" class="form-control line"
                                                   placeholder="비밀번호를 8~20자 이내로 입력하세요" title="비밀번호를 8~20자 이내로 입력하세요" v-model="param.password" @change="valid($event, validate.password)" maxlength="20" required>
                                            <div class="invalid-feedback">{{validate.passwordMessage}}</div>
                                        </div>
                                        <div class="form-group">
                                            <input type="password" class="form-control line"
                                                   placeholder="비밀번호를 다시한번 입력하세요"
                                                   title="비밀번호를 다시한번 입력하세요" v-model="param.passwordConfirm" @change="validfeed($event, passwordConfirmFlag)" maxlength="20" required>
                                            <div class="invalid-feedback">{{validate.passwordConfirmMessage}}</div>
                                        </div>
                                        <div class="form-group">
                                            <input type="text" class="form-control line" placeholder="이름을 입력하세요"
                                                   title="이름을 입력하세요" v-model="param.userName" maxlength="20" required>
                                        </div>
                                        <div class="form-group">
                                            <input type="text" class="form-control line" placeholder="이메일을 입력하세요"
                                                   title="이메일을 입력하세요" v-model="param.email" maxlength="50" @change="valid($event, validate.email)" required>
                                            <div class="invalid-feedback">{{validate.emailMessage}}</div>
                                        </div>
                                        <div class="form-group certi_area">
                                            <input type="number" class="form-control line" placeholder="휴대폰 번호를 입력하세요"
                                                   title="휴대폰 번호를 입력하세요" v-model="param.phoneNumber" @change="valid($event, validate.numberOnly)" maxlength="11" :readonly="param.auth" required>
                                            <div class="invalid-feedback">{{validate.numberOnlyMessage}}</div>
                                            <div class="btn_area">
                                                <button type="button" class="btn btn_sm btn_outline_secondary" @click="sendAuthNumber()" v-if="!param.auth">인증요청</button>
                                            </div>
                                        </div>
                                        <div class="form-group certi_area" v-if="param.requestToken != ''">
                                            <input type="number" id="auth_number" placeholder="인증번호를 입력하세요" title="인증번호를 입력하세요" class="form-control line" v-model="param.authNumber" :readonly="param.auth" maxlength="8">
                                            <div class="invalid-feedback">인증번호를 다시 확인해주세요.</div>
                                            <div class="btn_area">
                                                <button type="button" class="btn btn_sm btn_outline_secondary" @click="checkAuthNumber()" v-if="!param.auth">인증하기</button>
                                                <p class="success" v-else>인증성공</p>
                                            </div>
                                        </div>
                                        <div class="radio_wrap">
                                            <div class="radio_area">
                                                <input type="radio" id="woman" name="gender" value="F" v-model="param.gender" required>
                                                <label for="woman">여성</label>
                                            </div>
                                            <div class="radio_area">
                                                <input type="radio" id="man" name="gender" value="M" v-model="param.gender" required>
                                                <label for="man">남성</label>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            <div class="join_area">
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col-4">
                                            <select class="custom-select line" title="년" v-model="param.birthdayYear" required>
                                                <option v-for="(n, i) in 100" :value="param.years-i">{{param.years - i}}년</option>
                                            </select>
                                        </div>
                                        <div class="col-4">
                                            <select class="custom-select line" title="월" v-model="param.birthdayMonth" required>
                                                <option v-for="i in 12" :value="i">{{i}}월</option>
                                            </select>
                                        </div>
                                        <div class="col-4">
                                            <select class="custom-select line" title="일" v-model="param.birthdayDay" required>
                                                <option v-for="i in 31" :value="i">{{i}}일</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div></div>
<!--                                <div class="radio_wrap">-->
<!--                                    <div class="radio_area">-->
<!--                                        <input type="radio" id="birth" name="date_birth" value="1" v-model="param.birthdayType" required>-->
<!--                                        <label for="birth">양력</label>-->
<!--                                    </div>-->
<!--                                    <div class="radio_area">-->
<!--                                        <input type="radio" id="lunar" name="date_birth" value="2" v-model="param.birthdayType" required>-->
<!--                                        <label for="lunar">음력</label>-->
<!--                                    </div>-->
<!--                                </div>-->
                            </div>
                            <div class="join_area">
                                <div class="form_wrap_line">
                                    <div class="form-group address_area">
                                        <div class="input" v-html="param.addressInfo"></div>
                                        <span id="address_placeholder" class="placeholder">우편번호 찾기</span>
                                        <button type="button" class="btn_address" @click="openDaumPostcode()"><img class="img-fluid" src="/static/images/icon/btn_address.png" alt="주소찾기"></button>
                                    </div>
                                    <div class="from-group">
                                        <input type="text" class="form-control line" placeholder="상세주소" title="상세주소" v-model="param.addressDetail" maxlength="150" required>
                                    </div>
                                </div>
                            </div>
                            <div class="join_area">
                                <h3 class="info_tit">SMS 수신동의</h3>
                                <div class="txt_area">
                                    <p>수신동의시 쇼핑몰에서 제공하는 이벤트 및 다양한 정보를 SMS/E-mail로 받아볼 수 있습니다.</p>
                                    <p>(단, 회원가입, 거래정보-결제/배송/교환/환불 등과 같은 운영정보는 수신동의 여부와 관계없이 발송됩니다.)</p>
                                </div>
                                <div class="radio_wrap">
                                    <div class="radio_area">
                                        <input type="radio" id="reception1" name="reception" value="Y" v-model="param.receiveSms" required>
                                        <label for="reception1">수신</label>
                                    </div>
                                    <div class="radio_area">
                                        <input type="radio" id="reception2" name="reception" value="N" v-model="param.receiveSms" required>
                                        <label for="reception2">수신안함</label>
                                    </div>
                                </div>
                            </div>
                            <div class="join_area">
                                <h3 class="info_tit">E-mail 수신동의</h3>
                                <div class="txt_area">
                                    <p>수신동의시 쇼핑몰에서 제공하는 이벤트 및 다양한 정보를 SMS/E-mail로 받아볼 수 있습니다.</p>
                                    <p>(단, 회원가입, 거래정보-결제/배송/교환/환불 등과 같은 운영정보는 수신동의 여부와 관계없이 발송됩니다.)</p>
                                </div>
                                <div class="radio_wrap">
                                    <div class="radio_area">
                                        <input type="radio" id="reception2-1" name="reception2" value="Y" v-model="param.receiveEmail" required>
                                        <label for="reception2-1">수신</label>
                                    </div>
                                    <div class="radio_area">
                                        <input type="radio" id="reception2-2" name="reception2" value="N" v-model="param.receiveEmail" required>
                                        <label for="reception2-2">수신안함</label>
                                    </div>
                                </div>
                            </div>
                            <div class="agree_wrap">
                                <div class="all_check">
                                    <div class="check_area">
                                        <input type="checkbox" id="all_check" title="선택" @click="allCheck($event)">
                                        <label for="all_check">모든 약관 동의</label>
                                    </div>
                                </div>
                                <div class="agree_check">
                                    <div class="check_area">
                                        <input type="checkbox" id="agree_check1"  title="선택" name="agreedPolicyTypes" value="POLICY_TYPE_MARKETING_AGREEMENT" v-model="param.agreedPolicyTypes">
                                        <label for="agree_check1">마케팅이용약관 동의(선택)</label>
                                    </div>
                                    <a href="javascript:void(0);" class="terms_link" @click.prevent="showTermsModal('POLICY_TYPE_MARKETING_AGREEMENT')">약관보기</a>
                                </div>
                                <div class="agree_check">
                                    <div class="check_area">
                                        <input type="checkbox" id="agree_check2" title="선택" name="agreedPolicyTypes" value="POLICY_TYPE_AGREEMENT" v-model="param.agreedPolicyTypes">
                                        <label for="agree_check2">이용약관에 동의(필수)</label>
                                    </div>
                                    <a href="javascript:void(0);" class="terms_link" @click.prevent="showTermsModal('POLICY_TYPE_AGREEMENT')">약관보기</a>
                                </div>
                                <div class="agree_check">
                                    <div class="check_area">
                                        <input type="checkbox" id="agree_check3" title="선택" name="agreedPolicyTypes" value="POLICY_TYPE_PROTECT_POLICY" v-model="param.agreedPolicyTypes">
                                        <label for="agree_check3">개인정보의 수집·이용목적 및 항목에 동의(필수)</label>
                                    </div>
                                    <a href="javascript:void(0);" class="terms_link" @click.prevent="showTermsModal('POLICY_TYPE_PROTECT_POLICY')">약관보기</a>
                                </div>
                                <div class="btn-group">
                                    <button type="submit" class="btn btn_lg btn_primary">가입하기</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <address-layer></address-layer>

    </section>
</template>

<script>
import AddressLayer from "@/components/ui/daum/address-layer";

let $s, vm;

export default {
    components: {AddressLayer},
    head() {
        return {
            script: [
                { src:'https://spi.maps.daum.net/imap/map_js_init/postcode.v2.js'},
            ],
            link: [
                {rel: 'stylesheet', href: '/static/css/users.css'}
            ]
        }
    },
    async asyncData ({$salesonApi}){
        const response = await $salesonApi().policy.getPolicies();

        return {
            policies : response.data.policies //약관내용
        }
    },
    beforeCreate: function () {
        $s = this.$saleson;
        vm = this;
    },
    data: function () {
        return {
            param: {
                loginId: "",
                password: "",
                passwordConfirm: "",
                userName: "",
                email: "",
                phoneNumber: "",
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
                requestToken: "",
                authNumber: "",

                years: 0,
                auth: false,
                agreedPolicyTypes: []
            },
            authParam: {
                phoneNumber: "",
                duplicateCheck: true
            },
            validate: {
                id: $s.validator.patterns.id,
                email: $s.validator.patterns.email,
                password: $s.validator.patterns.password,
                numberOnly: $s.validator.patterns.number_only,

                idMessage: $s.validator.messages.id,
                emailMessage: $s.validator.messages.email,
                passwordMessage: $s.validator.messages.password,
                passwordConfirmMessage: $s.validator.messages.password_confirm,
                numberOnlyMessage: $s.validator.messages.number_only
            },
            modalInfo: {
                modalShow: false,
                modalText: '',
                modalTitle: ''
            },
            JoinTerms: {
                required: [
                    'POLICY_TYPE_AGREEMENT',
                    'POLICY_TYPE_PROTECT_POLICY'
                ],
                option: [
                    'POLICY_TYPE_MARKETING_AGREEMENT'
                ]
            }
        }
    },
    methods: {
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
        allCheck: function (event) {
            if (event.target.checked) {
                vm.param.agreedPolicyTypes = vm.JoinTerms.required.concat(vm.JoinTerms.option);
            } else {
                vm.param.agreedPolicyTypes = [];
            }
        },
        sendAuthNumber: function () {
            if (vm.param.userName === "" || vm.param.userName == undefined) {
                $s.alert("이름을 입력하세요.");
                return false;
            }

            if (vm.param.phoneNumber === "" || vm.param.phoneNumber == undefined) {
                $s.alert("휴대폰 번호를 입력하세요.");
                return false;
            }

            vm.param.phoneNumber = vm.param.phoneNumber.replace("-", "");
            vm.authParam.userName = vm.param.userName;
            vm.authParam.phoneNumber = vm.param.phoneNumber;

            $s.api.sendAuthNumber(vm.authParam, function(response) {
                vm.param.requestToken = response.requestToken;
            }, function (error) {
                $s.alert(error.response.data.description);
            });
        },
        checkAuthNumber: function() {
            if (vm.param.authNumber === "" || vm.param.authNumber == undefined) {
                $s.alert("인증번호를 입력하세요.");
                return false;
            }

            var element = document.getElementById("auth_number");
            element.className = element.className.replace(/ is-invalid/g, '');

            $s.api.checkAuthNumber(vm.param, function(response) {
                if (response.status === "OK") {
                    vm.param.auth = true;
                }
            }, function (error) {
                element.className = element.className + ' is-invalid';
            });
        },
        /**
         * policyType에 따른 모달 띄우기
         * @param policyType
         */
        showTermsModal(policyType) {
            this.modalInfo.modalShow = true;
            for (let policy of this.policies) {
                if (policy.policyType == policyType) {
                    this.modalInfo.modalText = policy.content;
                    this.modalInfo.modalTitle = policy.title;
                    break;
                }
            }
        },
        submit: function () {

            if (!vm.checkfeed('.form_input')) {
                return false;
            }

            if (vm.param.password != vm.param.passwordConfirm) {
                $s.alert("비밀번호를 입력해주세요.");
                return false;
            }

            if (vm.param.post === '' || vm.param.newPost === '' || vm.param.address === '') {
                $s.alert("주소를 입력해주세요.");
                return false;
            }

            if (
                vm.param.agreedPolicyTypes.length == 0
                || !vm.JoinTerms.required.every(term => vm.param.agreedPolicyTypes.includes(term))
            ) {
                $s.alert("필수 이용약관에 동의해주세요.");
                return false;
            }

            $s.api.joinMember(vm.param,
                function (response) {
                    if (response.status === "OK") {
                        $s.ev.log.joinUser(response.userId);
                        $s.redirect($s.pages.JOIN_COMPLETE);
                    }
                }, function (error) {
                    $s.alert(error.response.data.description);
                }
            );
        }
    },
    computed: {
        passwordConfirmFlag: function () {
            return this.param.password === this.param.passwordConfirm;
        }
    },
    mounted: function() {
        this.$nextTick(function () {

            console.log(this.policies, 'policies');

            var date = new Date();
            vm.param.years = date.getFullYear();
            vm.param.birthdayYear = vm.param.years;

        });
    }
}

</script>
