<template>
  <section class="contents secede_contents">
    <div class="tit_wrap">
      <h2 class="tit">회원탈퇴</h2>
    </div>
    <div class="secede_wrap">
      <div class="container">
        <div class="row no-gutters justify-content-center">
          <div class="col-12 col-md-6 col-lg-4">
            <ul class="secede_info">
              <li>회원탈퇴시 회원 서비스를 모두 이용할 수 없습니다.</li>
              <li>상품 구매내역, 쿠폰 및 포인트 등 모든 정보가 삭제가 됩 니다.</li>
              <li>탈퇴 시 재등록이 불가능 하오니 신중히 탈퇴를 진행해주시기 바랍니다.</li>
            </ul>
            <div class="form_wrap_line">
              <div class="form-group">
                <input type="text" class="form-control line" placeholder="아이디를 입력해주세요" title="아이디를 입력해주세요" v-model="param.loginId" maxlength="50" required>
              </div>
              <div class="form-group">
                <input type="password" class="form-control line" placeholder="비밀번호를 입력해주세요" title="비밀번호를 입력해주세요" v-model="param.password" maxlength="20" required>
              </div>
            </div>
            <div class="secede_area">
              <h3 class="secede_tit">탈퇴 이유</h3>
              <div class="txt_area">
                <p>그동안 SalesOn을 이용해 주셔서 감사합니다.</p>
                <p>더 나은 운영을 위한 설문조사이므로 솔직한 답변 부탁드립니다.</p>
              </div>
              <div class="radio_wrap">
                <div class="radio_area">
                  <input type="radio" id="secede1" v-model="param.leaveReasonLabel" value="상품설명이 알기 어렵기 때문에">
                  <label for="secede1">상품설명이 알기 어렵기 때문에</label>
                </div>
                <div class="radio_area">
                  <input type="radio" id="secede2" v-model="param.leaveReasonLabel" value="주문 및 문의시 직원의 대응이 만족스럽지 않아서">
                  <label for="secede2">주문 및 문의시 직원의 대응이 만족스럽지 않아서</label>
                </div>
                <div class="radio_area">
                  <input type="radio" id="secede3" v-model="param.leaveReasonLabel" value="상품의 상태가 좋지 않아서">
                  <label for="secede3">상품의 상태가 좋지 않아서</label>
                </div>
                <div class="radio_area">
                  <input type="radio" id="secede4" v-model="param.leaveReasonLabel" value="상품의 가격이 높아서">
                  <label for="secede4">상품의 가격이 높아서</label>
                </div>
                <div class="radio_area">
                  <input type="radio" id="secede5" v-model="param.leaveReasonLabel" value="원하는 상품이 없어서">
                  <label for="secede5">원하는 상품이 없어서</label>
                </div>
              </div>
              <textarea class="form-control" cols="30" rows="10" placeholder="기타사유가 있다면 입력해주세요" title="기타사유가 있다면 입력해주세요" v-model="param.leaveReasonEtc"></textarea>
              <div class="row no-gutters btn-group">
                <div class="col-6">
                  <button type="button" class="btn btn_lg btn_primary" @click="submit()">탈퇴하기</button>
                </div>
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
        {rel: 'stylesheet', href: '/static/css/mypage.css'}
      ]
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
        leaveReason: "",
        leaveReasonEtc: "",
        leaveReasonLabel: "상품설명이 알기 어렵기 때문에"
      }
    }
  },
  methods: {
    submit: function () {
      if (vm.param.loginId === "" || vm.param.loginId === undefined) {
        $s.alert("아이디를 입력해주세요.");
        return false;
      }

      if (vm.param.password === "" || vm.param.password === undefined) {
        $s.alert("비밀번호를 입력해주세요.");
        return false;
      }

      vm.param.leaveReason = vm.param.leaveReasonLabel;
      if (vm.param.leaveReasonEtc != "" && vm.param.leaveReasonEtc != undefined) {
        vm.param.leaveReason += "/" + vm.param.leaveReasonEtc;
      }

      $s.api.secedeMember(vm.param,
          function (response) {
            if (response.status === "OK") {
              $s.alert("탈퇴되었습니다.", function () {
                $s.redirect($s.pages.LOGIN);
              });
            }
          }, function (error) {
            $s.alert(error.response.data.description);
          }
      );
    }
  },
  mounted: function() {
    this.$nextTick(function () {
      // 페이지 로딩 후 실행

    });
  }
}
</script>
