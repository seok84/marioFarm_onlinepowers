<template>
  <section class="contents inqury_item_contents">
    <h2 class="screen_out">Q&amp;A</h2>
    <div class="tit_wrap">
      <h3 class="tit">고객센터</h3>
    </div>
    <div class="customer_wrap">
      <div class="container">
        <customer-navigation active="inquiry-item"></customer-navigation>

        <div class="total_top">
          <p class="total">전체 <span>{{result.totalElements}}</span></p>

          <div class="search_form">
            <div class="row">
              <div class="col-12 col-md-4 search_input">
                <input type="hidden" placeholder="시작날짜" title="검색날짜 입력" class="form-control box" name="startDate" v-model="param.searchStartDate">
                <input type="hidden" placeholder="종료날짜" title="검색날짜 입력" class="form-control box" name="endDate" v-model="param.searchEndDate">
              </div>
              <div class="col-9">
                <select class="custom-select box searchDate">
                  <option value="">찾고자 하는 날짜를 설정해 주세요.</option>
                  <option value="week-1">1주일</option>
                  <option value="month-1">1개월</option>
                  <option value="month-3">3개월</option>
                  <option value="month-6">6개월</option>
                </select>
              </div>
              <div class="col-3">
                <button type="button" class="btn btn_m box btn_primary" @click="paging(1)">조회</button>
              </div>
            </div>
          </div>

        </div>

        <div class="list_wrap review_list">
          <template v-if="result.content != null && result.content.length > 0">
            <ul>
              <li v-for="(data, index) in result.content" :key="data.qnaId" class="list_area list_open" v-cloak>
                <div class="list_in" data-toggle="collapse" :data-target="'#qna'+index">
                  <div class="list_top">
                    <p class="state" v-if="data.answerCount > 0">답변완료</p>
                    <p class="state" v-else>답변대기</p>
                    <p class="date">{{ dateFormat(data.createdDate, 'date') }}</p>
                  </div>

                  <div class="review_item">
                    <div class="img_area">
                      <a href="javascript:void(0)" @click="viewDetails('/item/' + data.itemUserCode, 'paging', 'inquiry-item')">
                        <img class="img_full" :src="itemImage(data.itemImage)" :alt="data.itemName" @error="errorImage">
                      </a>
                    </div>
                    <div class="txt_area">
                      <p class="title">{{ data.itemName }}</p>
                    </div>
                  </div>
                  <!--                                    <div class="category">{{ data.question }}</div>-->
                  <p class="category">[{{ data.qnaGroupLabel }}]</p>
                  <div class="list_tit">{{ data.subject }}</div>
                  <div class="hide_area">
                    <div class="question"><span class="qa">Q.</span>{{ data.question }}</div>
                    <div class="answer" v-if="data.answerCount > 0"><span class="qa">A.</span>{{ data.qnaAnswer.answer }}</div>
                    <div class="answer" v-else></div>
                    <p class="answer_date" v-if="data.answerCount > 0">답변일 : <span>{{ dateFormat(data.qnaAnswer.answerDate,'date') }}</span></p>
                    <p class="answer_date" v-else></p>
                    <div class="btn_right">
                      <button type="button" class="btn btn_sm btn_outline_secondary"
                              @click="deleteItemQna(data.qnaId)">삭제</button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </template>
          <div class="common_none" v-else><p>조회 된 QnA가 없습니다.</p></div>
        </div>

        <pagination :current-page="result.currentPage" :total-pages="result.totalPages" @change="paging"></pagination>

      </div> <!-- container E -->
    </div> <!-- customer_wrap E -->
  </section>
</template>

<script>
import Pagination from "@/components/ui/pagination";
import CustomerNavigation from "@/components/ui/customer-navigation"

let $s, vm;

export default {
  middleware: 'auth',
  components: {Pagination, CustomerNavigation},
  head() {
    return {
      script: [],
      link: [
        { rel: 'stylesheet', href: '/static/css/customer.css' },
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
      // data
      param: {
        page: 1,
        itemsPerPage: 3,
        searchStartDate: '',
        searchEndDate: ''
      },
      result: {
        content: []
      }
    }
  },
  methods: {
    // custom methods..
    paging: function (page) {
      vm.param.page = page;

      vm.param.searchStartDate = $("input[name='startDate']").val();
      vm.param.searchEndDate = $("input[name='endDate']").val();

      vm.itemQna();
    },

    itemQna: function () {
      if ($("input[name='startDate']").val() != '') {
        vm.param.searchStartDate = $("input[name='startDate']").val();
      }
      if ($("input[name='endDate']").val() != '') {
        vm.param.searchEndDate = $("input[name='endDate']").val();
      }

      $s.api.getItemInquiries(vm.param,
          function (response) {
            vm.result = response;
          }
      );
    },

    deleteItemQna: function (id) {
      $s.confirm('문의를 삭제하시겠습니까?', function () {

        vm.param.qnaId = id;
        $s.api.delItemInquiry(vm.param,
            function (response) {
              if (response.status === "OK") {
                $s.alert("삭제되었습니다.", function () {
                  location.reload();
                });
              } else {
                $s.alert(response,"답변완료된 문의는 삭제할 수 없습니다.");
              }
            }
        );

      });
    },
  },
  mounted: function() {
    this.$nextTick(function () {


      vm.getHistory("paging", "inquiry-item");

      $s.DateEvent.set('.searchDate');

      // 페이지 로딩 후 실행
      vm.itemQna();

      initializeListEvent();
    });
  }
}
</script>
