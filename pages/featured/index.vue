<template>
  <section class="contents feautred_list_contents">
    <div class="tit_wrap">
      <h2 class="tit">기획전</h2>
    </div>

    <div class="feautred_contents">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-6 list_area" v-for="data in eventList">
            <div class="list">
              <a href="javascript:;" @click="redirect(data.pageLink)"><img
                  :src="itemImage(data.featuredImageSrc)" :alt="data.featuredName" @error="errorImage"></a>
              <span class="event_label" v-show="data.featuredClass === 2">Event</span>
            </div>
            <div class="txt">
              <a href="javascript:;" @click="redirect(data.pageLink)">
                <p>{{data.featuredName}}</p>
              </a>
              <span v-if="data.startDate.length > 0 || data.endDate.length > 0">{{dateFormat(data.startDate, 'date')}} ~ {{dateFormat(data.endDate, 'date')}}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section> <!-- // contents E -->
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
  data: function(){
    return {
      eventList: []
    }
  },
  beforeCreate: function() {
    $s = this.$saleson;
    vm = this;
  },
  methods: {
    getEvent: function () {
      let params = {
        page: 1,
        itemsPerPage: 20
      };

      $s.api.getEvent(params, function (data) {
        vm.eventList = data.content;
      }, function (error) {
        $s.error(error);
      });
    },

    redirect: function (link) {
      if (link.indexOf('http') > -1) {
        $s.redirect(link);
      } else {
        $s.redirect('/featured'+link);
      }
    },
  },
  mounted: function() {
    this.$nextTick(function () {



      $s.core.setState($s.const.GNB_MENU_TARGET,'featured');

      vm.getEvent();
    });
  }
}
</script>
