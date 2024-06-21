<template>
  <section class="contents find_id_contents">
    <div class="tit_wrap">
      <h2 class="tit">아이디/비밀번호 찾기</h2>
    </div>
    <div class="find_wrap">
      <div class="container">
        <div class="row no-gutters justify-content-center">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="tab_tit">
              <ul class="nav nav-pills nav-justified">
                <li class="nav-item">
                  <a href="javascript:;" class="nav-link" :class="idTabFlag ? 'active' : ''"
                     data-toggle="tab" @click="swapTab('id')">아이디</a>
                </li>
                <li class="nav-item">
                  <a href="javascript:;" class="nav-link" :class="passwordTabFlag ? 'active' : ''"
                     data-toggle="tab" @click="swapTab('password')">비밀번호</a>
                </li>
              </ul>
            </div>
            <div class="tab-content">
              <div id="tab1" class="tab-pane fade" :class="tabIdClass">
                <template v-if="!showResult">
                  <form class="needs-validation" @submit.prevent="findId">
                    <fieldset>
                      <div class="form_wrap_line">
                        <div class="form-group">
                          <input type="text" v-model="id.param.userName"
                                 :readonly="readpnlyFlag" class="form-control line"
                                 placeholder="이름을 입력하세요" title="이름을 입력하세요" required>
                          <div class="invalid-feedback">이름을 입력하세요</div>
                        </div>
                        <div class="form-group certi_area">
                          <input type="number" v-model="id.param.phoneNumber"
                                 :readonly="readpnlyFlag" class="form-control line"
                                 placeholder="휴대폰 번호를 입력하세요" title="휴대폰 번호를 입력하세요" required>
                          <div class="invalid-feedback">휴대폰 번호를 입력하세요</div>
                          <div class="btn_area">
                            <button type="button" @click="sendAuthNumber"
                                    class="btn btn_sm btn_outline_secondary">인증요청
                            </button>
                          </div>
                        </div>
                        <div class="form-group" v-if="showAuthNumber">
                          <input type="password" v-model="id.param.authNumber"
                                 class="form-control line" placeholder="인증 번호를 입력하세요"
                                 title="인증 번호를 입력하세요" required>
                        </div>
                        <div class="btn-group">
                          <button type="submit" class="btn btn_lg btn_primary">확인</button>
                        </div>
                      </div>
                    </fieldset>
                  </form>
                </template>

                <!-- 아이디찾기 결과 -->
                <template v-if="showResult">
                  <div class="find_result">
                    <p><strong>{{id.param.userName}}</strong> 회원님의 아이디는<br><strong>{{id.result.loginId}}</strong>
                      입니다.</p>
                    <div class="row no-gutters btn-group">
                      <div class="col">
                        <button type="button" @click="redirect('/user/login')"
                                class="btn btn_lg btn_light">닫기
                        </button>
                      </div>
                      <div class="col">
                        <button type="button" @click="swapTab('password')"
                                class="btn btn_lg btn_primary">비밀번호 찾기
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <div id="tab2" class="tab-pane fade" :class="tabPasswordClass">
                <template v-if="showPasswordStep1">
                  <form class="needs-validation" @submit.prevent="findPasswordStep1">
                    <fieldset>
                      <div class="form_wrap_line">
                        <div class="form-group">
                          <input type="text" v-model="password.param.loginId"
                                 :readonly="readpnlyFlag" class="form-control line"
                                 placeholder="아이디를 입력하세요" title="아이디를 입력하세요" required>
                          <div class="invalid-feedback">아이디를 입력하세요</div>
                        </div>
                        <div class="form-group">
                          <input type="text" v-model="password.param.userName"
                                 :readonly="readpnlyFlag" class="form-control line"
                                 placeholder="이름을 입력하세요" title="이름을 입력하세요" required>
                          <div class="invalid-feedback">이름을 입력하세요</div>
                        </div>
                        <div class="form-group certi_area">
                          <input type="number" v-model="password.param.phoneNumber"
                                 :readonly="readpnlyFlag" class="form-control line"
                                 placeholder="휴대폰 번호를 입력하세요" title="휴대폰 번호를 입력하세요" required>
                          <div class="invalid-feedback">휴대폰 번호를 입력하세요</div>
                          <div class="btn_area">
                            <button type="button" @click="sendAuthNumber"
                                    class="btn btn_sm btn_outline_secondary">인증요청
                            </button>
                          </div>
                        </div>
                        <div class="form-group" v-if="showAuthNumber">
                          <input type="password" v-model="password.param.authNumber"
                                 class="form-control line" placeholder="인증 번호를 입력하세요"
                                 title="인증 번호를 입력하세요" required>
                          <div class="invalid-feedback">인증 번호를 입력하세요</div>
                        </div>
                        <div class="btn-group">
                          <button type="submit" class="btn btn_lg btn_primary">비밀번호 변경
                          </button>
                        </div>
                      </div>
                    </fieldset>
                  </form>
                </template>
                <!-- 비밀번호찾기 재설정 -->

                <template v-if="showResult">
                  <div class="find_result">
                    <p><strong>비밀번호가 변경 되었습니다.</strong></p>
                    <div class="btn-group">
                      <div class="col">
                        <button type="button" @click="redirect('/user/login')"
                                class="btn btn_lg btn_primary">로그인 하기
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
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
        {rel: 'stylesheet', href: '/static/css/users.css'}
      ]
    }
  },
  beforeCreate: function () {
    $s = this.$saleson;
    vm = this;
  },
  data: function () {
    return {
      tab: 'id',
      id: {
        param: {
          userName: '',
          phoneNumber: '',
          requestToken: '',
          authNumber: ''
        },
        result: {
          sucessFlag: false,
          loginId: ''
        }
      },
      password: {
        param: {
          loginId: '',
          userName: '',
          phoneNumber: '',
          requestToken: '',
          authNumber: ''
        },
        result: {
          sucessFlag: false
        },
        change: {
          password: '',
          corfirmPassword: '',
          requestToken: '',
          authToken: ''
        }
      },
      validate: {
        password: this.$saleson.validator.patterns.password
      }
    }
  },
  methods: {
    swapTab: function (tab) {
      this.init();
      this.tab = tab;
    },

    init: function () {

      this.id.param.userName = '';
      this.id.param.phoneNumber = '';
      this.id.param.requestToken = '';
      this.id.param.authNumber = '';

      this.id.result.sucessFlag = false;
      this.id.result.loginId = '';

      this.password.param.loginId = '';
      this.password.param.userName = '';
      this.password.param.phoneNumber = '';
      this.password.param.requestToken = '';
      this.password.param.authNumber = '';

      this.password.result.sucessFlag = false;


    },
    sendAuthNumber: function () {

      var param = {};

      if (this.idTabFlag) {

        param['phoneNumber'] = this.id.param.phoneNumber;

      } else if (this.passwordTabFlag) {
        param['loginId'] = this.password.param.loginId;
        param['phoneNumber'] = this.password.param.phoneNumber;
      }

      $s.api.sendAuthNumber(param, function (response) {

        var token = response.requestToken;

        if (vm.idTabFlag) {
          vm.id.param.requestToken = response.requestToken;
        } else if (vm.passwordTabFlag) {
          vm.password.param.requestToken = response.requestToken;
        }

      }, function (error) {
        $s.alert('인증번호 발송에 실패 했습니다.');
      });
    },

    findId: function () {

      if (!this.showAuthNumber) {
        $s.alert("인증요청을 진행해 주세요.");
        return;
      }

      if (this.idTabFlag) {
        $s.api.findId(this.id.param, function (response) {
          vm.id.result.loginId = response.loginId;
          vm.id.result.sucessFlag = "OK" == response.status.toUpperCase();
        }, function (error) {
          if (error.response) {
            $s.alert(error.response.data.description);
          }
        });
      }
    },

    findPasswordStep1: function () {

      if (!this.showAuthNumber) {
        $s.alert("인증요청을 진행해 주세요.");
        return;
      }

      if (this.passwordTabFlag) {
        $s.api.findPasswordStep1(this.password.param, function (response) {
          vm.password.result.sucessFlag = "OK" == response.status.toUpperCase();
        }, function (error) {
          if (error.response) {
            $s.alert(error.response.data.description);
          }
        });
      }
    }
  },
  computed: {

    idTabFlag: function () {
      return this.tab == 'id';
    },

    passwordTabFlag: function () {
      return this.tab == 'password';
    },

    readpnlyFlag: function () {
      return this.showAuthNumber;
    },

    showResult: function () {

      if (this.idTabFlag) {
        return this.id.result.sucessFlag;
      }

      if (this.passwordTabFlag) {
        return this.password.result.sucessFlag;
      }

      return false;
    },

    showPasswordStep1: function () {
      return !this.showResult;
    },

    showAuthNumber: function () {

      if (this.idTabFlag) {
        return this.id.param.requestToken != '';
      }

      if (this.passwordTabFlag) {
        return this.password.param.requestToken != '';
        ;
      }

      return false;
    },

    tabIdClass: function () {
      return this.idTabFlag ? 'show active' : '';
    },
    tabPasswordClass: function () {
      return this.passwordTabFlag ? 'show active' : '';
    },

    corfirmPasswordFlag: function () {
      return this.password.change.password == this.password.change.corfirmPassword
    }
  },
  mounted: function() {
    this.$nextTick(function () {

    });
  }
}
</script>
