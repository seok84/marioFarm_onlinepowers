<template>
  <section class="contents grade_contents">
    <div class="tit_wrap">
      <h2 class="tit">나의 등급/혜택</h2>
    </div>
    <div class="grade_wrap">
      <div class="container">
        <div class="grade_top" v-cloak>
          <dl>
            <dt>나의 회원등급</dt>
            <dd v-cloak>{{result.userLevel}}</dd>
          </dl>
        </div>
        <div class="grade_container">
          <h3 class="grade_tit">세일즈온 등급 혜택</h3>
          <div class="grade_conts">
            <div class="row no-gutters">
              <div v-for="data in result.userLevelList" class="col-12 col-lg-6 conts_area" v-cloak>
                <div class="tit_area">
                  <h4 class="sub_tit">{{data.levelName}}</h4>
                  <p class="info">{{data.levelName}}</p>
                </div>
                <div class="txt_area">
                  <p class="standard">등업일로부터 {{formatNumber(data.referencePeriod)}}개월 기준</p>
                  <p class="amount">구매금액 {{formatNumber(data.priceEnd)}}원 미만</p>
                  <dl>
                    <dt>적립혜택</dt>
                    <dd>{{formatNumber(data.pointRate)}}%</dd>
                    <dt>구매시할인</dt>
                    <dd>{{formatNumber(data.discountRate)}}%</dd>
                    <dt>배송쿠폰</dt>
                    <dd>{{formatNumber(data.shippingCouponCount)}}장</dd>
                  </dl>
                </div>
              </div>
              <div class="col-12 col-lg-6">
                <p class="info_tit">회원 등급 선정 기준 및 혜택 이용안내</p>
                <div class="info_dot">
                  <p>회원등급은 등급산정일로부터 6개월간의 구매확정 된 구매실적을 기준으로 산정됩니다.</p>
                  <p>구매실적은 쿠폰, 포인트 등을 할인적용한 후의 최종 결제 금액을 기준으로 산정됩니다.</p>
                  <p>적립은 '상품 적립', '등급 별 추가 적립'순으로 적립됩니다.</p>
                  <p>쿠폰은 등급 변경 후 매월 1일 00:00 시에 적립됩니다.</p>
                  <p>회원 등급, 쿠폰, 포인트 이용에 대한 궁금하신 사항은 고객센터의 FAQ를 참고해 주시기 바랍니다.</p>
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
        { rel: 'stylesheet', href: '/static/css/mypage.css' },
      ]
    }
  },
  beforeCreate: function() {
    $s = this.$saleson;
    vm = this;
  },
  data: function () {
    return {
      result: {}
    }
  },
  mounted: function() {
    this.$nextTick(function () {



      $s.api.getGrade(
          function (response) {
            vm.result = response.result;
          }
      );
    });
  }
}
</script>
