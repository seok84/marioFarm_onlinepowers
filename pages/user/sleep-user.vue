<template>
  <section class="contents sleep_user_contents">
    <div class="tit_wrap">
      <h2 class="tit">휴면회원 해제</h2>
    </div>
    <div class="sleep_wrap">
      <div class="container">
        <div class="row no-gutters justify-content-center">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="sleep_info">
              <p>회원님의 계정은 개인정보보호를 위해 1년 이상 세일즈온 서비스를 이용하지 않은 계정에 속하여 정보통신망 이용 촉진 및 정보보호 등에 관한 법률에 따라 휴면 계정으로 전환되었습니다.</p>
              <p><em>세일즈온을 다시 이용하시려면, <br>하단의 "계속 이용하기" 버튼을 클릭해주세요.</em></p>
            </div>
            <div class="row no-gutters btn-group">
              <div class="col">
                <button type="button" class="btn btn_lg btn_default" @click="logout()">휴면계정 유지</button>
              </div>
              <div class="col">
                <button type="button" class="btn btn_lg btn_primary" @click="submit()">계속 이용하기</button>
              </div>
            </div>
            <div class="info_dot">
              <p>휴면계정시 제한사항</p>
              <ul>
                <li>- 회원의 개인 정보는 별도 분리 하여 보관</li>
                <li>- 메일 수신 중지</li>
              </ul>
              <p>일반회원 전환시 변경사항</p>
              <ul>
                <li>- 개인메일 복원 및 메일수신 복원</li>
              </ul>
              <p>세일즈온 이용 약관</p>
              <ul>
                <li>회원이 12개월(365일)이상 로그인을 하지 않는 경우 해당 회원의 아이디는 휴면아이디가 되어 회원 로그인을 비롯한 모든 서비스에 대한 이용이 정지되고, 회사는 휴면 아이디의 개인 정보를 다른 아이디로 별도로 관리한다.</li>
              </ul>
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
        {rel: 'stylesheet', href: '/static/css/mypage.css'}
      ]
    }
  },
  beforeCreate: function () {
    $s = this.$saleson;
    vm = this;
  },
  data: function () {
    return {}
  },
  methods: {
    submit: function() {
      $s.api.recovery(
          function (response) {
            if (response.status === "OK") {
              $s.alert("고객님의 계정이 휴면해제 되었습니다.\n원활한 서비스 이용을 위하여 재 로그인 해주십시오.", function () {
                  $s.logout();
              });
            }
          }, function (error) {
            $s.alert(error.response.data.message);
          }
      );
    },
    logout: function () {
      $s.logout();
    }
  },
  mounted: function() {
    this.$nextTick(function () {

    });
  }
}
</script>