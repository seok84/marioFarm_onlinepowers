<template>
  <div v-if="item != null">
    <div class="img_area">
      <a href="javascript:;" @click="redirectByItem(item)">
        <img class="img_full" :src="itemImage(item.itemImage)"
             :alt="unescapeHtml(item.itemName)" @error="errorImage">
      </a>
    </div>
    <div class="txt_area mobile" v-if="displayMobileFlag">
      <p class="brand">{{item.brand}}</p>
      <p class="title">{{unescapeHtml(item.itemName)}}</p>
      <div class="price_area">
        <p class="before" v-if="item.totalDiscountAmount > 0 && item.discountRate > 0">
          <span>{{formatNumber(item.salePrice)}}</span>원</p>
        <p class="price"><span>{{formatNumber(item.presentPrice)}}</span>원</p>
      </div>
    </div>
    <div class="hover_area">
      <a href="javascript:;" @click="redirectByItem(item)" class="hover_link"></a>
      <div class="hover_txt">
        <p class="brand">{{item.brand}}</p>
        <p class="title">
          <a href="javascript:;" @click="redirectByItem(item)">
            {{unescapeHtml(item.itemName)}}
          </a>
        </p>
        <div class="hover_price" @click="redirectByItem(item)">
          <p class="before" v-if="item.totalDiscountAmount > 0 && item.discountRate > 0">
            <span>{{formatNumber(item.salePrice)}}</span>원</p>
          <p class="price">
                    <span class="sale"
                          v-if="item.discountRate > 0"><span>{{item.discountRate}}</span>%</span>
            <span class="after"><span>{{formatNumber(item.presentPrice)}}</span>원</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let $s;

module.exports = {
  props: {
    item: {
      default: function () {
        return null;
      }
    },
    displayMobileFlag: {
      type: Boolean,
      default: function () {
        return true;
      }
    }
  },
  methods: {
    redirectByItem: function (item) {
      this.$emit('redirect', item);
    },
  },
  mounted: function () {
    this.$nextTick(function () {
      $s = this.$saleson;
    });

  }
};
</script>