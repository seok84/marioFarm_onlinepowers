<template>
  <section class="contents notice_contents">
    <h2 class="screen_out">공지사항</h2>
    <div class="tit_wrap">
      <h3 class="tit">고객센터</h3>
    </div>
    <div class="customer_wrap">
      <div class="container">

        <customer-navigation active="notice"></customer-navigation>

        <div class="notice_list">
          <ul>
            <li class="list_area" v-for="(data, index) in result.content" :key="data.noticeId">
              <div class="list_in">
                <div class="tit_area" :data-target="'#notice'+index">
                  <p class="title">
                    <span class="badge badge_notice" v-show="data.noticeFlag == 'Y'">공지</span>
                    {{ data.subject }}
                  </p>
                  <p class="date">{{ data.createdDate }}</p>
                </div>
                <div :id="'notice'+index" class="hide_area" v-html="appendCdnDomain(unescapeHtml(data.content))">
                </div>
              </div>
            </li>
          </ul>
        </div>
        <pagination :current-page="result.currentPage" :total-pages="result.totalPages" @change="paging"></pagination>
      </div>
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
      script: [
        {src: '/static/js/customer.js', body: true},
      ],
      link: [
        {rel: 'stylesheet', href: '/static/css/customer.css'},
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
        page: 1,
        itemsPerPage: 10
      },
      result: {},
      test : ''
    }
  },
  methods: {
    submit: function () {

      $s.api.getNotice(vm.param,
          function (response) {
            vm.result = response;
          }
      );
    },
    paging: function (page) {
      vm.param.page = page;
      vm.submit();
    }
  },
  mounted: function() {
    this.$nextTick(function () {



      vm.paging(1);

      initializeCustomerEvent();
    });
  }
}
</script>
