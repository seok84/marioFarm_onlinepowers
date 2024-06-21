<template>

  <div class="item_list thumb" v-if="listType === 'a'">
    <div class="row">
      <div :class="thumbClass" v-for="(item, index) in itemList" :id="item.itemId">
        <div class="img_area">
          <a href="javascript:void(0)" @click="redirectByItem(item)">
            <img :src="itemImage(item.itemImage)" :alt="unescapeHtml(item.itemName)" @error="errorImage">
          </a>
          <div class="sale_per" v-show="indexFlag">{{ startIndex + index + 1 }}</div>
          <div class="sale_per" v-show="!indexFlag && item.discountRate > 0">
            {{item.discountRate}}<span>%</span>
          </div>
          <div class="over_btn"
               v-if="(item.stockFlag === 'N' || (item.stockFlag === 'Y' && item.stockQuantity > 0)) && item.itemSoldOutFlag === 'N'">
            <a href="javascript:void(0)" @click="redirectByItem(item)" class="over_link"></a>
            <a href="javascript:" class="btn_cart" title="장바구니 담기"
               v-if="item.itemOptionFlag !== 'Y' && item.itemType !== '3'"
               :id="'cart_' + item.itemId"
               @click.prevent="addToCart(item.itemId, item.orderMinQuantity)"></a>
            <a href="javascript:" class="btn_wish" title="관심상품 담기"
               :id="'wish_' + item.itemId" @click.prevent="addToWishList(item.itemId)"></a>
          </div>
          <div class="sold_out" v-if="item.itemSoldOutFlag === 'Y'">
            <p>품절</p>
          </div>
        </div>
        <div class="txt_area">
          <p class="brand">{{ item.brand }}</p>
          <p class="title">
            <a href="javascript:void(0)" @click="redirectByItem(item)">{{ unescapeHtml(item.itemName) }}</a>
          </p>
          <div class="price_area">
            <p class="before" v-if="Number(item.itemPrice) > Number(item.presentPrice)">
              <span>{{formatNumber(item.itemPrice)}}</span>원</p>
            <div class="sale_area">
              <p class="price"><span>{{formatNumber(item.presentPrice)}}</span>원</p>
            </div>
          </div>
          <div class="badge-wrap">
            <span class="badge badge-new badge_txt" v-if="item.itemLabel === '2'"><em>NEW</em></span>
            <span class="badge badge_txt" v-if="item.itemLabel === '3'"><em>SALE</em></span>
            <span class="badge badge_txt" v-if="item.itemType1 === '1'"><em>인기상품</em></span>
            <span class="badge badge_txt" v-if="item.itemType2 === '1'"><em>BEST상품</em></span>
            <span class="badge badge_txt" v-if="item.itemType4 === '1'"><em>추천상품</em></span>
            <span class="badge badge_txt" v-if="item.itemType5 === '1'"><em>기본상품</em></span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="item_list basic_wide" v-else>
    <div class="row no-gutters">
      <div :class="wideClass" v-for="item in itemList" :id="item.itemId">

        <div class="row no-gutters">
          <div class="col-5 col-md-6 col-lg-5">
            <div class="img_area">
              <a href="javascript:;" @click="redirectByItem(item)">
                <img :src="itemImage(item.itemImage)"
                     :alt="unescapeHtml(item.itemName)" @error="errorImage">
              </a>
              <div class="sale_per size" v-if="Number(item.itemPrice) > item.presentPrice">
                {{discountRate(item.itemPrice, item.presentPrice)}}<span>%</span>
              </div>
              <div class="over_btn"
                   v-if="(item.stockFlag === 'N' || (item.stockFlag === 'Y' && item.stockQuantity > 0)) && item.itemSoldOutFlag === 'N'">
                <a href="javascript:void(0)" @click="viewDetails('/item/' + item.itemUserCode, 'paging', 'category')"></a>
                <a href="javascript:" class="btn_cart" title="장바구니 담기"
                   v-if="item.itemOptionFlag !== 'Y' && item.itemType !== '3'"
                   :id="'cart_' + item.itemId"
                   @click.prevent="addToCart(item.itemId, item.orderMinQuantity)"></a>
                <a href="javascript:" class="btn_wish" title="관심상품 담기"
                   :id="'wish_' + item.itemId"
                   @click.prevent="addToWishList(item.itemId)"></a>
              </div>
              <div class="sold_out" v-if="item.itemSoldOutFlag === 'Y'">
                <p>품절</p>
              </div>
            </div>
          </div>
          <div class="col-7 col-md-6 col-lg-7">
            <div class="txt_area">
              <p class="brand">{{ item.brand }}</p>
              <p class="title">
                <a href="javascript:;" @click="redirectByItem(item)">{{ unescapeHtml(item.itemName) }}</a>
              </p>
              <div class="price_area">
                <p class="before"
                   v-if="Number(item.itemPrice) > Number(item.presentPrice)"><span>{{formatNumber(item.itemPrice)}}</span>원
                </p>
                <div class="sale_area">
                  <p class="price"><span>{{formatNumber(item.presentPrice)}}</span>원
                  </p>
                </div>
              </div>
              <div class="badge-wrap">
                <span class="badge badge-new badge_txt" v-if="item.itemLabel === '2'"><em>NEW</em></span>
                <span class="badge badge_txt" v-if="item.itemLabel === '3'"><em>SALE</em></span>
                <span class="badge badge_txt" v-if="item.itemType1 === '1'"><em>인기상품</em></span>
                <span class="badge badge_txt" v-if="item.itemType2 === '1'"><em>BEST상품</em></span>
                <span class="badge badge_txt" v-if="item.itemType4 === '1'"><em>추천상품</em></span>
                <span class="badge badge_txt" v-if="item.itemType5 === '1'"><em>기본상품</em></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let $s;

module.exports = {
  props: {
    thumbClass: {
      type: String,
      default: function () {
        return 'col-6 col-lg-6 col-xl-4 list_area';
      }
    },
    wideClass: {
      type: String,
      default: function () {
        return 'col-12 col-md-6 list_area';
      }
    },
    itemList: {
      default: function () {
        return [];
      }
    },
    listType: {
      type: String,
      default: function () {
        return 'a';
      }
    },
    listName: {
      type: String,
      default: function () {
        return 'SalesOn Item';
      }
    },
    category: {
      type: String,
      default: function () {
        return '';
      }
    },
    indexFlag: {
      type: Boolean,
      default: function () {
        return false;
      }
    },
    startIndex: {
      type: Number,
      default: function () {
        return 0;
      }
    }
  },
  data: function () {
    return {
      param: {
        arrayRequiredItems: []
      }
    }
  },

  methods: {
    addToCart: function (itemId, orderMinQuantity) {
      const self = this;
      const quantity = Number(orderMinQuantity) > 1 ? Number(orderMinQuantity) : 1;

      self.param.arrayRequiredItems.push(itemId + '||' + quantity + '||');

      $s.api.addToCart(this.param, function () {
        self.param.arrayRequiredItems.splice(0, self.param.arrayRequiredItems.length);
        document.getElementById('cart_' + itemId).className = 'btn_cart on';

        $s.api.getCartInfo(function (response) {
          self.updateDisplayCartQuantity(self, response.cartQuantity);
        });

        $s.toast("해당 상품이 장바구니에 담겼습니다.");

        self.param.arrayRequiredItems = [];
      });
    },

    addToWishList: function (itemId) {

      const self = this;

      $s.api.addToWishList(itemId, function () {
        document.getElementById('wish_' + itemId).className = 'btn_wish on';

        $s.api.getQuickInfo(function (data) {
          self.updateDisplayWishlistCount(self, data.wishlistCount);
        });

        $s.toast("해당 상품이 관심상품에 담겼습니다.");
      });
    },

    redirectByItem: function (item) {
      this.googleAnalyticsSelect(item, this.listName, this.category);
      this.$emit('redirect', item);
    },
  },
  mounted: function () {

    this.$nextTick(function () {
      $s = this.$saleson;
    });

  },
  computed: {},
  updated: function () {

  }
};
</script>