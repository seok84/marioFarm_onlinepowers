<template>
  <section class="contents faq_contents">
    <h2 class="screen_out">FAQ</h2>
    <div class="tit_wrap">
      <h3 class="tit">고객센터</h3>
    </div>
    <div class="customer_wrap">
      <div class="container">

        <customer-navigation active="faq"></customer-navigation>

        <div class="total_top">
          <p class="total">전체 <span v-cloak>{{formatNumber(result.totalElements)}}</span></p>
          <div class="search_form">
            <div class="row">
              <div class="col-9">
                <select class="custom-select box" v-model="param.faqType">
                  <option value="">전체</option>
                  <option v-for="data in types" :value="data.code">{{data.title}}</option>
                </select>
              </div>
              <div class="col-3">
                <button type="button" class="btn btn_m box btn_primary" @click="search()">조회</button>
              </div>
            </div>
          </div>
        </div>
        <div class="list_wrap faq_list">
          <ul>
            <li class="list_area list_open" v-for="data in result.content" v-cloak>
              <div class="list_in">
                <p class="category">[{{getFaqTypeName(data.faqType)}}]</p>
                <div class="question"><span class="qa">Q.</span>{{data.title}}</div>
                <div class="hide_area">
                  <div class="answer"><span class="qa">A.</span><span v-html="data.content"></span></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <pagination :current-page="result.number + 1" :total-pages="result.totalPages" @change="paging"></pagination>
    </div>
  </section>
</template>

<script>
import Pagination from "@/components/ui/pagination";
import CustomerNavigation from "@/components/ui/customer-navigation";

let $s, vm;

export default {
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
      param: {
        page: 1,
        itemsPerPage: 10,
        faqType: ""
      },
      types: {},
      result: {}
    }
  },
  methods: {
    submit: function () {
      $s.api.getFaq(vm.param,
          function (response) {
            vm.types = response.types;
            vm.result = response.content;
          }
      )
    },
    paging: function (page) {
      vm.param.page = page;
      vm.submit();
    },
    search: function () {
      vm.paging(1);
    },
    getFaqTypeName: function (faqType) {
      for (var i=0; i<vm.types.length; i++) {
        if (faqType === vm.types[i].code) {
          return vm.types[i].title;
        }
      }
    }
  },
  mounted: function() {
    this.$nextTick(function () {


      vm.paging(1);
      initializeListEvent();
    });
  }
}
</script>
