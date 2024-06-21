<template>
  <div id="saleson" v-cloak>
    <div class="p_admin_win">
      <div class="p_header">
        <h3 class="p_header_tit">{{result.subject}}</h3>
      </div>
      <div class="p_body">
        <div v-if="result.popupImage != '' && result.popupImage != null
                            && result.imageLink != '' && result.imageLink != null" class="p_content">
          <a :href="result.imageLink" target="_blank">
            <img :src="result.popupImageSrc" border="0" />
          </a>
        </div>
        <div v-else-if="result.popupImage != '' && result.lpopupImage != null" class="p_content">
          <img :src="result.popupImageSrc" border="0" />
        </div>
        <div v-else v-html="unescapeHtml(nl2br(result.content))" class="p_content"></div>
      </div>
      <div class="check_area">
        <input type="checkbox" :id="'check' + result.popupId" title="오늘 하루 이 창을 열지 않음" @click="setCookie(result.popupId)">
        <label :for="'check' + result.popupId">오늘 하루 이 창을 열지 않음</label>
      </div>
      <a href="javascript:void(0);" v-if="mobileFlag" class="p_admin_win_close" @click="popupClose(result.popupId)">
        <span class="screen_out">닫기</span>
      </a>
    </div>
  </div>
</template>

<script>
let $s, vm;

export default {
  head() {
    return {
      script: [],
      link: [
        {rel: 'stylesheet', href: '/static/css/main.css'},
        {rel: 'stylesheet', href: '/static/css/event.css'}
      ]
    }
  },
  async asyncData({params}) {
    const popupId = params.id;
    return {popupId}
  },
  beforeCreate: function () {
    $s = this.$saleson;
    vm = this;
  },
  data: function (){
    return {
      result: {},
      param: {
        id: 0
      },
      mobileFlag : false
    }
  },
  methods: {
    setCookie: function(popupId) {
      $s.api.popup.setCookie('1', popupId);
    },
    popupClose: function(popupId) {
      $s.api.popup.popupClose('1', popupId);
    }
  },
  mounted: function() {
    this.$nextTick(function () {


      vm.param.id = this.popupId;

      $s.api.getPopupById(vm.param, function (data) {
        vm.result = data.content;
      }, function (error) {
        $s.alert(error.response.data.message);
      });

      this.mobileFlag = $s.isMobile();
    });

  }
}
</script>
