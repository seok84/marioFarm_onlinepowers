<template>
  <section class="contents recent_contents">
    <div class="tit_wrap">
      <h2 class="tit">최근 본 상품</h2>
    </div>
    <div class="recent_wrap">
      <div class="container">
        <template v-if="latelyItemList != null && latelyItemList.length > 0">
          <item-list
              :item-list="latelyItemList"
              :list-type="'b'"
              @redirect="redirectByItem"
          ></item-list>
        </template>
        <div class="common_none" v-else>
          <p>상품이 없습니다.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ItemList from "@/components/ui/item/list";

let $s, vm;

export default {
  components: {ItemList},
  head() {
    return {
      script: [],
      link: [
        {rel: 'stylesheet', href: '/static/css/mypage.css'},
      ]
    }
  },
  beforeCreate: function() {
    $s = this.$saleson;
    vm = this;
  },
  data: function () {
    return {
      latelyItemList: []
    }
  },
  methods: {
    getLatelyItems: function () {

      let self = this;

      let param = {
        ids: this.latelyItems.toString(),
        limit: 10
      }

      $s.api.getLatelyItems(param,
          function (response) {
            let list = response.list;
            self.latelyItemList = list;
          },
          function (error) {
            $s.error(error);
          });
    },
    redirectByItem: function (item) {
      $s.redirect('/item/' + item.itemUserCode);
    },
  },
  mounted: function() {
    this.$nextTick(function () {



      this.latelyItemInfo(this);

      this.getLatelyItems();
    });
  }
}
</script>
