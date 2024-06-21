<template>
  <section class="contents best_contents">
    <h2 class="screen_out">베스트</h2>
    <div class="tit_wrap">
      <h2 class="tit">BEST</h2>
    </div>
    <div class="best_top">
      <item-list :item-list="topItemList"
                 :thumb-class="'col-12 col-md-4 list_area'"
                 :list-name="'배스트'"
                 :index-flag="true"
                 @redirect="redirectByItem"></item-list>
    </div>
    <div class="best_content">
      <item-list :item-list="contentItemList"
                 :thumb-class="'col-6 col-md-3 list_area'"
                 :list-name="'베스트'"
                 :index-flag="true"
                 :start-index="3"
                 @redirect="redirectByItem"></item-list>
    </div>
  </section>
</template>

<script>
  import ItemList from '@/components/ui/item/list';

  let $s, vm;

  export default {
    components: {ItemList},
    head() {
      return {
        script: [],
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
          arrayRequiredItems: []
        },
        result: {
          list: []
        }
      }
    },
    methods: {
      getBestItems: function () {
        let params = {
          'viewTarget': 'WEB',
          'limit': 100
        }

        $s.api.getBestItems(params, function (response) {
          vm.result = response;

          vm.googleAnalyticsImpression(response.list, '베스트');
        });
      },

      redirectByItem: function (item) {
        this.viewDetails('/item/'+item.itemUserCode, 'paging', 'best');
      },
    },
    mounted: function() {
      this.$nextTick(function () {



        vm.getBestItems();

        $s.core.setState($s.const.GNB_MENU_TARGET,'best');
      });
    },
    computed: {
      topItemList: function () {
        let list = [],
            itemList = this.result.list,
            displayCount = 3;

        if (typeof itemList !='undefined' && itemList.length > 0) {
          for (let i=0; i < displayCount; i++) {
            list.push(itemList[i]);
          }
        }

        return list;
      },
      contentItemList : function () {
        let list = [],
            itemList = this.result.list,
            startCount = 4;

        if (typeof itemList !='undefined' && itemList.length >= startCount) {
          for (let i = (startCount -1) ; i<itemList.length; i++) {
            list.push(itemList[i]);
          }
        }

        return list;
      }
    }
  }
</script>
