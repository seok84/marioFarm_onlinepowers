<template>
  <section class="contents search_contents">
    <div class="container">
      <h2 class="screen_out">검색결과</h2>
      <div class="tit_wrap">
        <h2 class="tit"><span>'{{decodeURIComponent(param.query)}}'</span> 검색결과</h2>
      </div>
      <div v-if="typeof result.content !== 'undefined' && result.content.length > 0">
        <div class="sort_area">
          <div class="sort_total">
            총 <span class="num">{{result.totalElements}}</span>개 상품
          </div>
          <div class="sort_type">
            <select class="btn_sort" @change="sorting($event)">
              <option value="ORDERING__ASC" :selected="param.orderBy + '__' + param.sort === 'ORDERING__ASC'">최신순</option>
              <option value="HITS__DESC" :selected="param.orderBy + '__' + param.sort === 'HITS__DESC'">인기순</option>
              <option value="SALE_PRICE__DESC" :selected="param.orderBy + '__' + param.sort === 'SALE_PRICE__DESC'">높은 가격순</option>
              <option value="SALE_PRICE__ASC" :selected="param.orderBy + '__' + param.sort === 'SALE_PRICE__ASC'">낮은 가격순</option>
            </select>
            <a href="javascript:" :class="param.listType === 'a' ? 'btn_list02' : 'btn_list01'"
               @click="itemListType(param.listType)"></a>
          </div>
        </div>

        <item-list
            :item-list="result.content"
            list-name="검색결과"
            :list-type="param.listType"
            @redirect="redirectByItem"
        ></item-list>
        <pagination :current-page="result.currentPage" :total-pages="result.totalPages"
                    @change="paging"></pagination>

      </div>

      <div v-else>
        <div class="search_txt">
          <p>검색 결과가 없습니다.</p>
          <div class="title_wrap">
            <div class="info_dot">
              <p>검색어가 올바르게 입력되었는지 확인 해주세요.</p>
              <p>두 단어 이상의 검색어인 경우, 띄어쓰기를 확인해 주세요.(예: 일회용속옷 → 일회용 속옷)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Pagination from '@/components/ui/pagination';
  import ItemList from "@/components/ui/item/list";

  let $s, vm;

  export default {
    components: {Pagination, ItemList},
    head() {
      return {
        link: [
          { rel: 'stylesheet', href: '/static/css/item.css' },
        ]
      }
    },

    beforeCreate: function() {
      $s = this.$saleson;
      vm = this;
    },
    data: function(){
      return {
        param: {
          page: 1,
          itemsPerPage: 20,
          listType: 'a',
          orderBy: 'ORDERING',
          sort: 'ASC',
          query: '',
          arrayRequiredItems: []
        },
        result: {
          itemParam: [],
        }
      }
    },
    methods: {
      submit: function () {
        $s.api.getSearchResult(vm.param,
            function (response) {
              vm.result = response;
              vm.googleAnalyticsImpression(response.content, '검색결과');
            }
        );
      },

      paging: function (page) {
        vm.param.page = page;
        vm.submit();
      },

      sorting: function (event) {
        let value = event.target.value.split("__");
        vm.param.orderBy = value[0];
        vm.param.sort = value[1];
        vm.param.page = 1;
        vm.submit();
      },

      itemListType: function (type) {
        if (type === 'a') {
          type = 'b';
        } else {
          type = 'a';
        }
        vm.param.listType = type;
        vm.param.page = 1;
        vm.submit();
      },

      addToCart: function (itemId, orderMinQuantity) {
        let quantity = Number(orderMinQuantity) > 1 ? Number(orderMinQuantity) : 1;
        vm.param.arrayRequiredItems.push(itemId + '||' + quantity + '||');

        $s.api.addToCart(vm.param, function () {
          let arrayRequiredItems = vm.param.arrayRequiredItems;
          arrayRequiredItems.splice(0, arrayRequiredItems.length);
          document.getElementById('cart_' + itemId).className = 'btn_cart on';
          $s.toast("해당 상품이 장바구니에 담겼습니다.");
        });
      },

      addToWishList: function (itemId) {
        $s.api.addToWishList(itemId, function () {
          document.getElementById('wish_' + itemId).className = 'btn_wish on';
          $s.toast("해당 상품이 관심상품에 담겼습니다.");
        });
      },

      redirectByItem: function(item) {
        this.googleAnalyticsSelect(item, '검색결과');
        this.viewDetails('/item/' + item.itemUserCode, 'paging', 'search');
      }
    },
    mounted: function() {
      this.$nextTick(function () {


        vm.getHistory("paging", "search");

        vm.param.query = $s.core.getParameter('query');
        vm.submit();
      });
    }
  }
</script>

