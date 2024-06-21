<template>
  <section class="contents new_contents">
    <h2 class="screen_out">신상품</h2>
    <div class="tit_wrap">
      <h2 class="tit">신상품</h2>
    </div>

    <form @submit.prevent="submit">
      <div class="container">
        <div class="sort_area">
          <div class="sort_total">
            총 <span class="num">{{result.displaySubCodeCount}}</span>개 카테고리 / 전체 <span class="num">{{result.totalElements}}</span>개
          </div>
          <div class="sort_type">
            <select class="btn_sort" @change="sorting($event)">
              <option value="ORDERING__ASC" :selected="param.orderBy + '__' + param.sort === 'ORDERING__ASC'">최신순</option>
              <option value="HITS__DESC" :selected="param.orderBy + '__' + param.sort === 'HITS__DESC'">인기순</option>
              <option value="SALE_PRICE__DESC" :selected="param.orderBy + '__' + param.sort === 'SALE_PRICE__DESC'">높은 가격순</option>
              <option value="SALE_PRICE__ASC" :selected="param.orderBy + '__' + param.sort === 'SALE_PRICE__ASC'">낮은 가격순</option>
            </select>
            <a href="javascript:" :class="param.listType === 'a' ? 'btn_list02' : 'btn_list01'" @click="itemListType(param.listType)"></a>
          </div>
        </div> <!-- // sort_area -->

        <div v-if="result.content.length > 0">
          <item-list :item-list="result.content"
                     :thumb-class="'col-6 col-md-4 col-lg-3 list_area'"
                     :list-name="'신상품'"
                     :list-type="param.listType"
                     @redirect="redirectByItem"></item-list>
          <pagination :current-page="result.currentPage" :total-pages="result.totalPages"
                      @change="paging"></pagination>

        </div>

        <div class="common_none" v-else>
          <p>상품이 없습니다.</p>
        </div>

      </div>
    </form>
  </section>
</template>

<script>
import Pagination from '@/components/ui/pagination';
import ItemList from '@/components/ui/item/list';

let $s, vm;

export default {
  components: {Pagination, ItemList},
  head() {
    return {
      script: [
        { src: '/static/js/event.js', body: true}
      ],
      link: [
        { rel: 'stylesheet', href: '/static/css/event.css' }
      ]
    }
  },
  beforeCreate: function() {
    $s = this.$saleson;
    vm = this;
  },
  data: function () {
    return {
      param: {
        page: 1,
        itemsPerPage: 20,
        listType: 'a',
        orderBy: 'ORDERING',
        sort: 'ASC',
        arrayRequiredItems: []

      },
      result: {
        content: [],
        totalPages: 0,
        totalElements: 0,
        displaySubCodeCount: 0
      },
    }
  },
  methods: {
    redirectByItem: function (item) {
      this.viewDetails('/item/'+item.itemUserCode, 'paging', 'new');
    },
    submit: function () {
      $s.api.getNewItems(vm.param, function (data) {
        vm.result = data;

        vm.googleAnalyticsImpression(data.content, '신상품');
      }, function (error) {
        $s.error(error.response.data.description);
      });
    },

    paging: function (page) {
      vm.param.page = page;
      vm.submit();
    },

    sorting: function (event) {
      let value = event.target.value.split("__");
      vm.param.orderBy = value[0];
      vm.param.sort = value[1];
      vm.submit();
    },

    itemListType: function (type) {
      if (type === 'a') {
        type = 'b';
      } else {
        type = 'a';
      }
      vm.param.listType = type;
      vm.submit();
    },
  },
  mounted: function() {
    this.$nextTick(function () {


      vm.getHistory("paging", "new");

      $s.core.setState($s.const.GNB_MENU_TARGET,'new');

      vm.submit();
    });
  }
}

</script>
