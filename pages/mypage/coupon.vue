<template>
  <section class="contents coupon_contents">
    <div class="tit_wrap">
      <h2 class="tit">쿠폰</h2>
    </div>
    <div class="coupon_wrap">
      <div class="container">
        <div class="tab_tit2">
          <ul class="nav nav-pills nav-justified">
            <li class="nav-item">
              <a href="#online_coupon" class="nav-link active" data-toggle="tab" @click="couponList(1)"><span>온라인쿠폰</span></a>
            </li>
            <li class="nav-item">
              <a href="#ship_coupon" class="nav-link" data-toggle="tab" @click="getShippingCoupon(1, 'EARN_COUPON')"><span>배송비쿠폰</span></a>
            </li>
          </ul>
        </div>
        <div class="tab-content">
          <!-- 온라인쿠폰 -->
          <div id="online_coupon" class="tab-pane fade show active">
            <div class="tab_tit">
              <ul class="nav nav-pills nav-justified">
                <li class="nav-item">
                  <a href="#available_tab" class="nav-link active" data-toggle="tab" @click="couponList(1)">사용가능</a>
                </li>
                <li class="nav-item">
                  <a href="#complete_tab" class="nav-link" data-toggle="tab" @click="completeCouponList(1)">사용완료</a>
                </li>
              </ul>
            </div>
            <div class="tab-content">
              <div id="available_tab" class="tab-pane fade show active">
                <div class="offline_coupon_area">
                  <div class="offline_coupon_wrap">
                    <button type="button" class="btn_coupon_get" @click="getDownloadCouponList(1)" data-toggle="modal" data-target=".pop_down_coupon"><span>쿠폰 다운로드</span></button>
                    <button type="button" class="offline_collapse" data-toggle="collapse" data-target=".offline_area">쿠폰 등록하기</button>
                  </div>
                  <div class="collapse offline_area">
                    <input type="text" class="form-control box" placeholder="'-'없이 발급받은 쿠폰번호를 입력해주세요." title="'-'없이 발급받은 쿠폰번호를 입력해주세요." v-model="param.offlineCode">
                    <div class="row no-gutters btn-group right">
                      <div class="col col-md-2"><button type="button" class="btn btn_lg btn_light" data-toggle="collapse" data-target=".offline_area" @click="offlineCouponCancel">취소</button></div>
                      <div class="col col-md-2"><button type="button" class="btn btn_lg btn_primary" @click="addOfflineCoupon()">등록</button></div>
                    </div>
                  </div>
                </div>
                <div class="coupon_list">
                  <template v-if="result.content != null && result.content.length > 0">
                    <div class="list_area" v-for="data in result.content">
                      <div class="tit_area">
                        <p class="tit">{{data.couponName}}</p>
                      </div>
                      <p class="explain">{{data.couponComment}}</p>
                      <div class="info">
                        <p v-if="data.couponApplyType == 0">제한없음</p>
                        <p v-else>{{dateFormat(data.couponApplyStartDate)}} ~ {{dateFormat(data.couponApplyEndDate)}}</p>
                        <p v-if="data.couponPayRestriction > 0">{{formatNumber(data.couponPayRestriction)}} 원 이상 구매 시 사용 가능</p>
                        <p v-else>제한없음</p>
                      </div>
                      <div class="etc_area" v-if="data.couponTargetItemType == '2'">
                        <a href="" class="link_product" data-toggle="modal" data-target=".pop_appli_product" @click="getAppliesTo(data.couponId)">적용상품보기</a>
                      </div>
                      <div class="etc_area" v-else>
                        전체상품
                      </div>
                    </div>
                  </template>
                  <div class="common_none" v-else><p>조회 된 쿠폰정보가 없습니다.</p></div>
                </div>
                <pagination :current-page="result.currentPage" :total-pages="result.totalPages" @change="couponList"></pagination>
              </div>
              <div id="complete_tab" class="tab-pane fade">
                <div class="coupon_list">
                  <template v-if="completeResult.content != null && completeResult.content.length > 0">
                    <div class="list_area" v-for="data in completeResult.content">
                      <div class="tit_area">
                        <p class="tit">{{data.couponName}}</p>
                      </div>
                      <p class="explain">{{data.couponComment}}</p>
                      <div class="info">
                        <p v-if="data.couponApplyType == 0">제한없음</p>
                        <p v-else>{{dateFormat(data.couponApplyStartDate)}} ~ {{dateFormat(data.couponApplyEndDate)}}</p>
                        <p v-if="data.couponPayRestriction > 0">{{formatNumber(data.couponPayRestriction)}} 원 이상 구매 시 사용 가능</p>
                        <p v-else>제한없음</p>
                      </div>
                      <div class="day_area">
                        <dl>
                          <dt>사용일</dt>
                          <dd v-if="data.couponUseDate != null">{{dateFormat(data.couponUseDate, 'date')}}</dd>
                          <dd v-else>만료</dd>
                        </dl>
                      </div>
                    </div>
                  </template>
                  <div class="common_none" v-else><p>조회 된 쿠폰정보가 없습니다.</p></div>
                </div>
                <pagination :current-page="completeResult.currentPage" :total-pages="completeResult.totalPages" @change="completeCouponList"></pagination>
              </div>
            </div>
          </div>

          <!-- 배송비쿠폰 -->
          <div id="ship_coupon" class="tab-pane fade">
            <div class="tab_tit">
              <ul class="nav nav-pills nav-justified">
                <li class="nav-item">
                  <a href="#available_tab2" class="nav-link active" data-toggle="tab" @click="getShippingCoupon(1)">적립내역</a>
                </li>
                <li class="nav-item">
                  <a href="#complete_tab2" class="nav-link" data-toggle="tab" @click="getShippingCompleCoupon(1)">사용완료</a>
                </li>
              </ul>
            </div>
            <div class="tab-content">
              <div id="available_tab2" class="tab-pane fade show active">
                <!--<div class="search_form">
                    <div class="row">
                        <div class="col-9">
                            <select class="custom-select box">
                                <option value="">찾고자 하는 날짜를 설정해 주세요.</option>
                            </select>
                        </div>
                        <div class="col-3">
                            <button type="button" class="btn btn_m box btn_primary">조회</button>
                        </div>
                    </div>
                </div>-->
                <div class="coupon_list">
                  <template v-if="shippingResult.content != null && shippingResult.content.length > 0">
                    <div class="list_area" v-for="data in shippingResult.content">
                      <div class="tit_area">
                        <p class="tit">{{data.reason}}</p>
                        <p class="amount">+{{data.savedPoint}}장</p>
                      </div>
                      <p class="explain"></p>
                      <div class="day_area">
                        <dl>
                          <dt>적립일</dt>
                          <dd>{{dateFormat(data.createdDate)}}</dd>
                        </dl>
                        <dl>
                          <dt>소멸예정일</dt>
                          <dd>{{dateFormat(data.expirationDate, 'date')}}</dd>
                        </dl>
                      </div>
                    </div>
                  </template>
                  <div class="common_none" v-else><p>조회 된 쿠폰정보가 없습니다.</p></div>
                </div>
                <pagination :current-page="shippingResult.currentPage" :total-pages="shippingResult.totalPages" @change="getShippingCoupon"></pagination>
              </div>
              <div id="complete_tab2" class="tab-pane fade">
                <!--<div class="search_form">
                    <div class="row">
                        <div class="col-9">
                            <select class="custom-select box">
                                <option value="">찾고자 하는 날짜를 설정해 주세요.</option>
                            </select>
                        </div>
                        <div class="col-3">
                            <button type="button" class="btn btn_m box btn_primary">조회</button>
                        </div>
                    </div>
                </div>-->
                <div class="coupon_list">
                  <template v-if="shippingResult.content != null && shippingResult.content.length > 0">
                    <div class="list_area" v-for="data in shippingResult.content">
                      <div class="tit_area">
                        <p class="tit">{{data.details}}</p>
                        <p class="amount">+{{data.point}}장</p>
                      </div>
                      <p class="explain"></p>
                      <div class="day_area">
                        <dl>
                          <dt>사용일</dt>
                          <dd>{{dateFormat(data.createdDate, 'date')}}</dd>
                        </dl>
                      </div>
                    </div>
                  </template>
                  <div class="common_none" v-else><p>조회 된 쿠폰정보가 없습니다.</p></div>
                </div>
                <pagination :current-page="shippingResult.currentPage" :total-pages="shippingResult.totalPages" @change="getShippingCompleCoupon"></pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 적용상품보기 레이어 -->
    <div class="modal fade modal_full pop_appli_product">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal_tit">적용가능상품 보기</h3>
          </div>
          <div class="modal-body">
            <!--<p class="coupon_guide">쿠폰으로 구입 가능한 제품 <strong>1,000</strong>개 입니다.</p>-->
            <div class="item_list thumb">
              <div class="row">
                <div class="col-6 col-md-4 list_area" v-for="data in appliesToResult.coupon.items">
                  <div class="img_area">
                    <a :href="'/item/' + data.itemUserCode">
                      <img :src="itemImage(data.itemImage)" alt="썸네일">
                    </a>
                  </div>
                  <div class="txt_area">
                    <p class="title">{{unescapeHtml(data.itemName)}}</p>
                    <div class="price_area">
                      <p class="before"><span>{{formatNumber(data.itemPrice)}}</span>원</p>
                      <div class="sale_area">
                        <p class="price"><span>{{formatNumber(data.salePrice)}}</span>원</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button type="button" class="modal_close" data-dismiss="modal">
            <span class="screen_out">적용상품보기 닫기</span>
          </button>
        </div>
      </div>
    </div>

    <div class="modal fade modal_full pop_down_coupon">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal_tit">다운로드 가능쿠폰</h3>
          </div>
          <div class="modal-body">

            <template v-if="downCouponResult.content != undefined && downCouponResult.content.length > 0">
              <button type="button" class="btn btn_lg btn_down_coupon" @click="downloadAllCoupon()">
                <span>다운로드 가능쿠폰 모두받기</span>
              </button>
              <div class="coupon_list">
                <div class="list_area" v-for="(coupon,index) in downCouponResult.content">
                  <div class="tit_area">
                    <p class="tit">{{coupon.couponName}}</p>
                  </div>
                  <p class="explain">{{formatNumber(coupon.couponPay)}}{{coupon.couponPayType == '1' ? '원': '%'}} 할인</p>
                  <div class="info">
                    <p>
                      <template v-if="coupon.couponApplyType == '0'">
                        제한없음
                      </template>
                      <template v-else-if="coupon.couponApplyType == '2'">
                        다운로드 시점부터 <strong>{{coupon.couponApplyDay}}일</strong> 후까지
                      </template>
                      <template v-else>
                        {{dateFormat(coupon.couponApplyStartDate, 'date')}} ~
                        {{dateFormat(coupon.couponApplyEndDate, 'date')}}
                      </template>
                    </p>
                    <p v-if="coupon.couponPayRestriction > 0">
                      {{formatNumber(coupon.couponPayRestriction)}}원 이상 구매시 사용가능</p>
                  </div>
                  <div class="etc_area">
                    <button type="button" class="btn_coupon_get"
                            @click="downloadCoupon(coupon.couponId)"><span>쿠폰받기</span></button>
                  </div>
                </div>
              </div>
              <download-pagination :current-page="downCouponResult.currentPage"
                                   :total-pages="downCouponResult.totalPages" :page-target="'coupon'"
                                   @change="getDownloadCouponList" v-if="downCouponResult.content.length > 0"></download-pagination>
            </template>
            <template v-else>
              <div class="common_none">
                <p>현재 다운로드 가능한 쿠폰이 없습니다.</p>
              </div>
            </template>
          </div>
          <button type="button" class="modal_close" data-dismiss="modal">
            <span class="screen_out">다운로드가능쿠폰 닫기</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Pagination from "@/components/ui/pagination";
import DownloadPagination from "@/components/ui/pagination";

let $s, vm;

export default {
  components: {Pagination, DownloadPagination},
  middleware: 'auth',
  head() {
    return {
      script: [],
      link: [
        { rel: 'stylesheet', href: '/static/css/mypage.css' },
      ]
    }
  },
  beforeCreate: function() {
    // 기존 Vue로 작성된 스크립트 실행시 적용
    $s = this.$saleson;
    vm = this;
  },
  data: function () {
    return {
      param : {},
      result : {},
      completeResult : {},
      shippingResult : {},
      appliesToResult : {
        coupon : {
          items : []
        }
      },
      downCouponResult : {}
    }
  },
  methods: {
    couponList : function(page){
      vm.param.page = page;
      vm.param.complete = false;
      $s.api.getCoupon(vm.param,
          function (response) {
            vm.result = response;
          }
      );
    },
    completeCouponList : function(page){
      vm.param.page = page;
      vm.param.complete = true;
      $s.api.getCoupon(vm.param,
          function (response) {
            vm.completeResult = response;
          }
      );
    },

    getShippingCoupon : function(page, conditionType){
      vm.param.page = page;
      vm.param.conditionType = 'EARN_COUPON';
      $s.api.getShippingCoupon(vm.param,
          function (response) {
            vm.shippingResult = response;
          }
      );
    },

    getShippingCompleCoupon : function(page, conditionType){
      vm.param.page = page;
      vm.param.conditionType = '';
      $s.api.getShippingCoupon(vm.param,
          function (response) {
            vm.shippingResult = response;
          }
      );
    },

    getAppliesTo : function(couponId){
      vm.param.couponId = couponId;
      vm.param.page = 1;  // 적용상품용 페이지
      $s.api.getAppliesTo(vm.param,
          function (response) {
            vm.appliesToResult = response.couponItems;
          }
      );
    },

    getDownloadCouponList : function(page){

      let param = {page: page,
        itemsPerPage: 5,
        size: 5};

      $s.api.downloadCouponList(param,
          function (response) {
            vm.downCouponResult = response;
          }
      );
    },

    downloadCoupon : function(couponId){
      let param = {couponId : couponId};
      $s.api.couponDownload(param,
          function (response) {
            if(response.status==="OK"){
              $s.alert('쿠폰받기가 완료 되었습니다.');
              vm.getDownloadCouponList(1);
              vm.init(1);
            } else {
              $s.error(response.status);
            }
          }
      );
    },

    downloadAllCoupon : function(){
      $s.api.downloadAllCoupons({},
          function (response) {
            if(response.status==="OK"){
              $s.alert('쿠폰받기가 완료 되었습니다.');
              vm.getDownloadCouponList(1);
              vm.init(1);
            } else {
              $s.error(response.status);
            }
          }
      );
    },

    offlineCouponCancel : function(){
      vm.param.offlineCode = '';
    },

    addOfflineCoupon : function(){
      if(vm.param.offlineCode == '' || vm.param.offlineCode == undefined){
        $s.alert("쿠폰번호를 입력해주세요.");
        return false;
      }

      $s.api.offlineCouponExchange(vm.param,
          function (response) {
            if(response.status==="OK"){
              $s.alert("쿠폰이 등록되었습니다");
              location.reload();
            } else {
              $s.alert("쿠폰 정보를 확인해주세요.");
            }
          }
      );
    },

    init: function (page) {
      vm.couponList(page);
    }
  },
  mounted: function() {
    this.$nextTick(function () {



      vm.init(1);
    });
  }
}

</script>
