<template>
  <section class="contents join_complete_contents">
    <div class="tit_wrap">
      <h2 class="tit">회원가입</h2>
      <p class="sub_tit">세일즈온 회원이 되신 것을 환영합니다!</p>
    </div>
    <div class="container">
      <div class="row no-gutters justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
          <p class="join_info">등록한 회원정보의 변경을 원하시면 <br><span>마이페이지>내정보관리</span> 에서 <br>언제든 수정하실 수 있습니다.</p>
          <div class="btn-group">
            <a href="/" class="btn btn_lg btn_primary">쇼핑하러가기</a>
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
    return {}
  },
  methods: {
  },
  mounted: function() {
    this.$nextTick(function () {

    });
  }
}
</script>