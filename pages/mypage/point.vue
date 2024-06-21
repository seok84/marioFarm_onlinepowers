<template>
  <section class="contents point_contents">
    <div class="tit_wrap">
      <h2 class="tit">포인트</h2>
    </div>
    <div class="coupon_wrap">
      <div class="container">
        <div class="tab-content">
          <div id="point_tab" class="tab-pane fade show active">
            <div class="tab_tit">
              <ul class="nav nav-pills nav-justified">
                <li class="nav-item">
                  <a href="#accumu_tab" class="nav-link active" data-toggle="tab" @click="init('1')">적립</a>
                </li>
                <li class="nav-item">
                  <a href="#complete_tab" class="nav-link" data-toggle="tab" @click="getCompletePoint('1')">사용완료</a>
                </li>
              </ul>
            </div>
            <div class="tab-content">
              <div id="accumu_tab" class="tab-pane fade show active">
                <div class="point_retention_area" v-if="result.pointInfo != null">
                  <p>회원님의 보유포인트 <strong>{{formatNumber(result.pointInfo.userPoint)}}</strong>점</p>
                </div>
                <div class="search_form">
                  <div class="row">
                    <div class="col-9">
                      <input type="hidden" name="startDate" v-model="param.searchStartDate">
                      <input type="hidden" name="endDate" v-model="param.searchEndDate">
                      <select class="custom-select box searchDate">
                        <option value="">조회 기간을 설정하세요</option>
                        <option value="month-1">1개월</option>
                        <option value="month-3">3개월</option>
                        <option value="month-6">6개월</option>
                        <option value="year-1">1년</option>
                      </select>
                    </div>
                    <div class="col-3">
                      <button type="button" class="btn btn_m box btn_primary" @click="init(1)">조회</button>
                    </div>
                  </div>
                </div>
                <div class="coupon_list">
                  <template v-if="result.content != null && result.content.length > 0">
                    <div class="list_area" v-for="data in result.content">
                      <div class="tit_area">
                        <p class="tit">{{data.reason}}</p>
                        <p class="amount">{{formatNumber(data.savedPoint)}}P</p>
                      </div>
                      <div class="day_area">
                        <dl>
                          <dt>잔여포인트</dt>
                          <dd>{{formatNumber(data.point)}}P</dd>
                        </dl>
                        <dl>
                          <dt>적립일</dt>
                          <dd>{{dateFormat(data.createdDate, 'date')}}</dd>
                        </dl>
                        <dl>
                          <dt>소멸예정일</dt>
                          <dd>{{dateFormat(data.expirationDate, 'date')}}</dd>
                        </dl>
                      </div>
                    </div>
                  </template>
                  <div class="common_none" v-else><p>조회 된 포인트가 없습니다.</p></div>
                </div>
                <pagination :current-page="result.currentPage" :total-pages="result.totalPages" @change="getPoint"></pagination>
              </div>
              <div id="complete_tab" class="tab-pane fade">
                <div class="point_retention_area" v-if="complete.pointInfo != null">
                  <p>회원님의 보유포인트 <strong>{{formatNumber(complete.pointInfo.userPoint)}}</strong>점</p>
                </div>
                <div class="search_form">
                  <div class="row">
                    <div class="col-9">
                      <input type="hidden" name="cpStartDate" v-model="param.searchStartDate">
                      <input type="hidden" name="cpEndDate" v-model="param.searchEndDate">
                      <select class="custom-select box cpSearchDate">
                        <option value="">조회 기간을 설정하세요</option>
                        <option value="month-1">1개월</option>
                        <option value="month-3">3개월</option>
                        <option value="month-6">6개월</option>
                        <option value="year-1">1년</option>
                      </select>
                    </div>
                    <div class="col-3">
                      <button type="button" class="btn btn_m box btn_primary" @click="getCompletePoint(1)">조회</button>
                    </div>
                  </div>
                </div>
                <div class="coupon_list">
                  <template v-if="complete.content != null && complete.content.length > 0">
                    <div class="list_area" v-for="data in complete.content">
                      <div class="tit_area">
                        <p class="tit">{{data.details}}</p>
                        <p class="amount">{{formatNumber(data.point)}}P</p>
                      </div>
                      <div class="day_area">
                        <dl>
                          <dt>사용일</dt>
                          <dd>{{dateFormat(data.createdDate, 'date')}}</dd>
                        </dl>
                      </div>
                    </div>
                  </template>
                  <div class="common_none" v-else><p>조회 된 포인트가 없습니다.</p></div>
                </div>
                <pagination :current-page="complete.currentPage" :total-pages="complete.totalPages" @change="getCompletePoint"></pagination>
              </div>
            </div>
          </div>
          <div id="cash_tab" class="tab-pane fade">
            <div class="tab_tit">
              <ul class="nav nav-pills nav-justified">
                <li class="nav-item">
                  <a href="#accumu_tab2" class="nav-link active" data-toggle="tab">적립</a>
                </li>
                <li class="nav-item">
                  <a href="#complete_tab2" class="nav-link" data-toggle="tab">사용완료</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Pagination from "@/components/ui/pagination";

let $s, vm;

export default {
  middleware: 'auth',
  components: {Pagination},
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
      param : {},
      result : {},
      complete : {}
    }
  },
  methods: {
    getPoint : function(page){
      vm.param.page = page;
      $s.api.getPoints(vm.param,
          function (response) {
            vm.result = response;
          }
      );
    },
    getCompletePoint : function(page){
      $s.DateEvent.set('.cpSearchDate', '', 'input[name="cpStartDate"]', 'input[name="cpEndDate"]');

      vm.param.page = page;
      vm.param.conditionType = "";
      vm.param.searchStartDate = $("input[name='cpStartDate']").val();
      vm.param.searchEndDate = $("input[name='cpEndDate']").val();
      $s.api.getPoints(vm.param,
          function (response) {
            vm.complete = response;
          }
      );
    },
    init: function (page) {
      vm.param.page = page;
      vm.param.conditionType = "EARN_POINT";
      vm.param.searchStartDate = $("input[name='startDate']").val();
      vm.param.searchEndDate = $("input[name='endDate']").val();
      vm.getPoint();
    }
  },
  mounted: function() {
    this.$nextTick(function () {

      $s.init({loginPage:true});

      vm.init(1);
      $s.DateEvent.set('.searchDate');
    });
  }
}
</script>
