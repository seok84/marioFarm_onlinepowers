<template>
  <section class="contents time_sale_contents">
    <div class="tit_wrap">
      <h2 class="tit">TIME SALE</h2>
    </div>
    <div class="best_top">
      <div class="item_time_sale">
        <form @submit.prevent="submit">
          <div class="container">
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
                <a href="javascript:void(0)" class="btn_list01 active d-none"></a>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-md-6 col-lg-4" v-for="data in result.content">
                <div class="time_sale">
                  <div class="time_txt">
                    <p class="timesale">
                      <span>TIME</span>
                      <span>SALE</span>
                    </p>
                  </div>
                  <div class="time_term">
                    <p class="time">
                      {{formatTime(data.spotStartTime)}}~{{formatTime(data.spotEndTime)}}</p>
                    <p class="date">
                                            <span v-for="weekDays in data.spotWeekDayList"
                                                  v-if="weekDays.detail === '1'">{{weekDays.label.substr(0,1)}}</span>
                    </p>
                  </div>
                </div>
                <div class="img_shadow">
                  <div class="img_area">
                    <a href="javascript:void(0)" @click="redirectByItem(data)">
                      <img :src="itemImage(data.imageSrc)"
                           :alt="unescapeHtml(data.itemName)" @error="errorImage">
                    </a>
                  </div>
                  <div class="txt_area">
                    <p class="brand">{{data.brand}}</p>
                    <p class="title"><a href="javascript:void(0)" @click="redirectByItem(data)">{{unescapeHtml(data.itemName)}}</a>
                    </p>
                    <div class="sale_area">
                      <div class="price">
                        <span>{{formatNumber(data.salePrice)}}원</span>
                        <p>{{formatNumber(data.presentPrice)}}원</p>
                      </div>
                      <div class="percent">
                        <p>{{data.discountRate}}<span>%</span></p>
                      </div>
                      <div class="icon_d_day">
                        <p v-if="data.spotEndDDay === 0">D-<span>DAY</span></p>
                        <p v-else>D-<span>{{data.spotEndDDay}}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
let $s, vm;

export default {
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
  data: function() {
    return {
      param: {
        orderBy: 'ORDERING',
        sort: 'ASC'
      },
      result: []
    }
  },
  methods: {
    submit: function () {
      $s.api.getSpotItems(vm.param, function (response) {
        vm.result = response;

        vm.googleAnalyticsImpression(response.content, '타임세일');
      });
    },

    sorting: function (event) {
      let value = event.target.value.split("__");
      vm.param.orderBy = value[0];
      vm.param.sort = value[1];
      vm.submit();
    },
    redirectByItem: function(item) {
      this.viewDetails('/item/'+item.itemUserCode, 'paging', 'spot');
      this.googleAnalyticsSelect(item, '타임세일');
    }
  },
  mounted: function() {
    this.$nextTick(function () {

      vm.getHistory("paging", "spot");
      vm.submit();

      $s.core.setState($s.const.GNB_MENU_TARGET,'spot');
    });
  }
}
</script>
