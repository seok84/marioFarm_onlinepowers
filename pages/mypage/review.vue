<template>
  <section class="contents review_contents">
    <h2 class="screen_out">이용후기</h2>
    <div class="tit_wrap">
      <h3 class="tit">고객센터</h3>
    </div>
    <div class="customer_wrap">
      <div class="container">

        <customer-navigation active="review"></customer-navigation>

        <div class="list_wrap review_list">
          <template v-if="result.review.content != null && result.review.content.length > 0">
            <ul>
              <li v-for="(data, index) in result.review.content" :key="data.itemReviewId" class="list_area list_open">
                <div class="rv_prd_sec">
                  <div class="rv_prd">
                    <a :href="'/item/'+data.itemUserCode" class="img">
                      <img :src="itemImage(data.itemImageSrc)" :alt="unescapeHtml(data.itemName)" @error="errorImage">
                    </a>
                    <div class="tit">
                      <a :href="'/item/'+data.itemUserCode">{{unescapeHtml(data.itemName)}}</a>
                    </div>
                  </div><!--// rv_prd -->
                </div><!--// rv_prd_sec -->
                <div class="list_in">
                  <div class="review_open">
                    <div class="list_top">
                      <div class="mp_rv_top">
                        <div class="rating_star">
                          <span :class="data.starFlags[0] ? 'on' : ''"></span>
                          <span :class="data.starFlags[1] ? 'on' : ''"></span>
                          <span :class="data.starFlags[2] ? 'on' : ''"></span>
                          <span :class="data.starFlags[3] ? 'on' : ''"></span>
                          <span :class="data.starFlags[4] ? 'on' : ''"></span>
                        </div>
                        <p class="good_count">
                          도움됐어요<span>{{formatNumber(data.likeCount)}}</span>
                        </p>
                      </div>
                      <div class="id_date">
                        <p class="date">{{ dateFormat(data.createdDate, 'date') }}</p>
                      </div>
                    </div>
                    <ul class="rv_my_info" v-if="isDisplayReviewInfo(index)">
                      <li v-for="(reviewFilter, filterIndex) in data.filters" v-if="validFilter(reviewFilter.group, reviewFilter.code)">
                        <span class="cate">{{getFilterGroupName(reviewFilter.group)}}</span>
                        {{getFilterCodeName(reviewFilter.group, reviewFilter.code)}}
                      </li>
                      <li v-if="data.displayOptionsFlag && data.options != '' && data.options != null">
                        <span class="cate">선택한 옵션</span>
                        <p>
                          <span v-html="nl2br(data.options)"></span>
                        </p>
                      </li>
                    </ul><!--// rv_my_info -->
                    <div class="review_origin">
                      <div class="txt_area">
                        <p class="title" v-html="nl2br(data.content)"></p>
                      </div>
                      <div class="img_area" v-if="data.photoReview">
                        <img :src="itemImage(data.thumbnailSrc)" alt="썸네일" class="img_full"  @error="errorImage">
                        <div class="img_more" v-if="data.itemReviewImages.length > 0"><span>{{data.itemReviewImages.length}}</span></div>
                      </div>
                    </div>
                  </div>

                  <div class="review_img" v-if="data.photoReview">
                    <div class="row">
                      <div class="col-12 col-md-3" v-for="image in data.itemReviewImages">
                        <div class="img_area">
                          <a href="javascript:;">
                            <img :src="itemImage(image.imageSrc)" class="img_full" alt="썸네일" @error="errorImage">
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <dl class="rv_btm">
                    <dt>&nbsp;</dt>
                  </dl><!--// rv_btm -->
                  <dl class="rv_comment" v-if="data.adminComment !=''">
                    <dt>드루관리자</dt>
                    <dd v-html="nl2br(data.adminComment)"></dd>
                  </dl><!--// rv_comment -->
                  <div class="btn_right">
                    <div class="btn_right">
                      <button type="button" class="btn btn_sm btn_outline_secondary" @click="deleteReview(data.itemReviewId)">삭제</button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </template>
          <div class="common_none" v-else><p>조회 된 이용후기가 없습니다.</p></div>
        </div>
        <pagination :current-page="result.review.currentPage" :total-pages="result.review.totalPages" :page-target="'content'" @change="paging"></pagination>
      </div>
    </div> <!-- customer wrap E -->
  </section>
</template>

<script>
import Pagination from "@/components/ui/pagination";
import CustomerNavigation from "@/components/ui/customer-navigation";

let $s, vm;

export default {
  middleware: 'auth',
  components: {Pagination, CustomerNavigation},
  head() {
    return {
      script: [
        {src: '/static/js/customer.js', body: true},
      ],
      link: [
        {rel: 'stylesheet', href: '/static/css/customer.css'},
      ]
    }
  },
  beforeCreate: function () {
    // 기존 Vue로 작성된 스크립트 실행시 적용
    $s = this.$saleson;
    vm = this;
  },
  data: function () {
    return {
      // data
      param: {
        review:{
          page: 1,
          itemsPerPage: 3,
          conditionType: 'FRONT_MYPAGE',
          itemReviewId : ''
        }
      },
      result:{
        // 등록된 이용후기
        review : {
          currentPage: 1,
          totalPages: 0,
          totalElements: 0,
          content:[],
        },

      },
      reviewFilters: []
    }
  },
  methods: {
    // custom methods..
    paging: function (page) {
      this.param.review.page = page;
      vm.getItemReviews();

      vm.param.page = page;
    },


    deleteReview : function(id){
      $s.confirm('후기를 삭제하시겠습니까?', function() {

        $s.api.deleteReview(id,
            function (response) {
              if (response.status === "OK") {
                $s.alert("삭제되었습니다.", function() {
                  location.reload();
                });
              } else {
                $s.alert(response);
              }
            }
        );

      });
    },

    getItemReviews:function () {
      $s.api.getItemReviews(vm.param.review,
          function (response) {
            vm.result.review = response;
          }
      );
    },
    isDisplayReviewInfo: function(index) {
      let review = vm.result.review.content[index];

      return review.filters.length > 0 || (review.displayOptionsFlag  && review.options.length > 0);
    },

    validFilter: function (groupId, codeId) {
      let group = this.getFilterGroup(groupId);

      if (group == null) {
        return false;
      }

      let code = this.getFilterCode(groupId, codeId);

      if (code == null) {
        return false;
      }

      return true;
    },

    getFilterGroup: function (groupId) {

      let groups = vm.result.review.reviewFilters;

      if (groups != null && groups.length > 0) {

        for (let i=0; i<groups.length; i++) {

          if (groupId == groups[i].id) {
            return groups[i];
          }

        }
      }

      return null;
    },

    getFilterCode: function (groupId, codeId) {

      let group = this.getFilterGroup(groupId);

      if (group == null) {
        return null;
      }

      let codes = group.codes;

      if (codes != null && codes.length > 0) {

        for (let i=0; i<codes.length; i++) {

          if (codeId == codes[i].id) {
            return codes[i];
          }

        }
      }

      return null
    },

    getFilterGroupName: function(groupId) {

      let group = this.getFilterGroup(groupId);

      if (group != null) {
        return this.unescapeHtml(group.label);
      }

      return '';
    },
    getFilterCodeName: function(groupId, codeId) {

      let code = this.getFilterCode(groupId, codeId);

      if (code != null) {
        return this.unescapeHtml(code.label);
      }

      return '';
    }
  },
  updated: function() {
    this.$nextTick(function () {
      initializeCustomerEvent();
    });
  },
  mounted: function() {
    this.$nextTick(function () {



      vm.paging(1);

      initializeCustomerEvent();
    });
  }
}
</script>
