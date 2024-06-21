<template>
  <section class="contents pay_complete_contents">
    <div class="tit_wrap">
      <h2 class="tit">주문이 완료되었습니다.</h2>
      <p class="conts">세일즈온에서 주문해주셔서 감사합니다! <br>주문하신 내역을 확인해보세요.</p>
    </div>
    <div class="complete_wrap">
      <div class="container">
        <div class="row no-gutters justify-content-center">
          <div class="col-12 col-md-6 col-lg-4">
            <!-- 무통장입금 가이드 -->
            <div class="order_num_area">
              <p>주문번호 <strong>{{orderCode}}</strong></p>
            </div>
            <template v-for="list in result.paymentList" v-if="result.paymentList != null">
              <template v-if="list.approvalType === 'bank' || list.approvalType == 'vBank'">
                <div class="order_info_area">
                  <dl class="row no-gutters">
                    <dt class="col-3">계좌</dt>
                    <dd class="col-9">{{list.bankVirtualNo}}</dd>
                    <dt class="col-3">예금주</dt>
                    <dd class="col-9">(주)온라인파워스</dd>
                    <dt class="col-3">금액</dt>
                    <dd class="col-9">{{formatNumber(list.amount)}}원</dd>
                    <dt class="col-3">기한</dt>
                    <dd class="col-9">{{dateFormat(list.bankDate, 'date')}}일 까지</dd>
                  </dl>
                </div>
              </template>
            </template>
            <div class="row no-gutters btn-group">
              <div class="col">
                <button type="button" class="btn btn_lg btn_light"
                        @click="redirect(orderCode, orderSequence)">주문내역 확인
                </button>
              </div>
              <div class="col">
                <button type="button" class="btn btn_lg btn_primary" @click="redirect()">쇼핑 계속하기
                </button>
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
        { rel: 'stylesheet', href: '/static/css/order.css' }
      ]
    }
  },
  beforeCreate: function() {
    $s = this.$saleson;
    vm = this;
  },
  data: function () {
    return {
      isBank: false,
      orderSequence: '',
      orderCode: '',
      result: {
        paymentList : [],
      }
    }
  },
  methods: {
    redirect: function (orderCode, orderSequence) {
      if (orderCode === undefined) {
        $s.redirect($s.pages.INDEX);
      } else {
        $s.redirect('/mypage/order');
      }
    },
  },
  mounted: function() {
    this.$nextTick(function () {


      vm.orderSequence = $s.core.getParameter("orderSequence");
      vm.orderCode = $s.core.getParameter("orderCode");

      $s.api.getOrder(vm.orderCode,
          function (response) {
            vm.result = response.order;

            $s.ga.purchase(vm.orderCode, vm.orderSequence);

            var items = response.order.item;
            if (typeof items != 'undefined' && items != null) {

              var itemUserCodes = [];
              for (var j=0; j < items.length; j++) {
                var item = items[j];

                itemUserCodes.push(item.itemUserCode);
              }
              $s.ev.log.order(vm.orderCode, itemUserCodes);
            }
          }, function (error) {
            $s.alert(error.response.data.message);
          });
    });
  }
}

</script>
