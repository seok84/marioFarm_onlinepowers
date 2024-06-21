<template>
  <section class="contents wishlist_contents">
    <div class="tit_wrap">
      <h2 class="tit">관심상품</h2>
    </div>
    <div class="wishlist_wrap">
      <div class="container">
        <div class="cart_top">
          <div class="check_area">
            <input type="checkbox" id="checkAll" @click="checkAll()">
            <label for="checkAll">전체선택</label>
          </div>
          <p class="total">총 <span>{{result.totalElements}}</span>건</p>
        </div>
        <div class="item_list check del">
          <template v-if="typeof result.content !== 'undefined' && result.content.length > 0">
            <div class="list_area" v-for="data in result.content">
              <div class="item_top">
                <div class="check_area">
                  <input type="checkbox" :id="data.wishlistId" title="선택">
                  <label :for="data.wishlistId"></label>
                </div>
                <button type="button" class="btn_item_del" @click="checkItemDelete(data.wishlistId)">
                  <span class="screen_out">상품 지우기</span>
                </button>
              </div>
              <div class="img_area">
                <a href="javascript:void(0)" @click="viewDetails('/item/' + data.item.itemUserCode, 'paging', 'wishlist')">
                  <img :src="itemImage(data.item.itemImage)" :alt="unescapeHtml(data.item.itemName)">
                </a>
              </div>
              <div class="txt_area">
                <p class="brand"></p>
                <p class="title">{{data.item.itemName}}</p>
                <p class="option">{{data.itemOption}}</p>
                <div class="price_area">
                  <p class="before" v-if="data.item.listPrice != 0"><span>{{data.item.listPrice}}</span>원</p>
                  <div class="sale_area">
                    <!--<p class="sale"><span>30</span>%</p>-->
                    <p class="price total"><span>{{formatNumber(data.item.presentPrice)}}</span>원</p>
                  </div>
                </div>
              </div>
              <div class="stock_area">
                <p class="sub_tit">상품재고</p>
                <p class="txt" v-if="data.item.itemSoldOutFlag === 'N'">재고 있음</p>
                <p class="txt" v-else>재고 없음</p>
              </div>
            </div>
          </template>
          <div class="common_none" v-else><p>조회 된 관심상품이 없습니다.</p></div>
        </div>
        <div class="btn_left">
          <button type="button" class="btn btn_m btn_default" @click="deleteAll()">선택 상품 삭제</button>
        </div>
        <pagination :current-page="result.currentPage" :total-pages="result.totalPages" @change="paging"></pagination>
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
        {rel: 'stylesheet', href: '/static/css/mypage.css'},
      ]
    }
  },
  beforeCreate: function () {
    // 기존 Vue로 작성된 스크립트 실행시 적용
    $s = this.$saleson;
    vm = this;
  },
  data: function () {
    return  {
      param : {
        page: 1
      },
      result : {}
    }
  },
  methods: {
    submit : function(){
      $s.api.getWishlist(vm.param,
          function (response) {
            vm.result = response;
          }
      );
    },

    delWishlist : function(){
      $s.api.delWishlist(vm.param,
          function (response) {
            if(response.status === "OK"){
              $s.alert("삭제되었습니다.");
              location.reload();
            } else {
              $s.alert(response);
            }
          }
      );
    },
    deleteAll : function(){
      if($('.item_list input[type=checkbox]:checked').length === 0){
        $s.alert("상품을 선택해주세요.");
        return false;
      }
      $s.confirm("해당 상품을 삭제하시겠습니까?", function(){
        let id = new Array();
        $(".list_area input[type='checkbox']:checked").each(function(e){
          id.push(this.id);
        });
        vm.param.id = id;
        vm.delWishlist();
      });

    },
    paging: function (page) {
      vm.param.page = page;
      vm.submit();
    },
    checkAll : function(){
      if($("#checkAll:checked").val()=="on"){
        $("input[type='checkbox']").prop("checked", true);
      } else {
        $("input[type='checkbox']").prop("checked", false);
      }
    },
    checkItemDelete : function(id){
      $s.confirm("해당 상품을 삭제하시겠습니까?", function(){
        let ids = new Array();
        ids.push(id);
        vm.param.id = ids;
        vm.delWishlist();
      });
    }
  },
  mounted: function() {
    this.$nextTick(function () {


      vm.getHistory("paging", "wishlist");

      vm.submit();
    });
  }
}
</script>
