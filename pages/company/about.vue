<template>
  <section class="contents about_contents">

    <div class="tit_wrap">
      <h2 class="tit">회사소개</h2>
    </div>

    <div class="container">
      <div class="info_table">
        <table>
          <caption>회사소개</caption>
          <colgroup>
            <col style="width: 29%;">
            <col style="width: auto;">
          </colgroup>
          <tbody>
          <tr>
            <th>회사명</th>
            <td>{{unescapeHtml(result.companyName)}}</td>
          </tr>
          <tr>
            <th>대표자</th>
            <td>{{result.bossName}}</td>
          </tr>
          <tr>
            <th>법인설립</th>
            <td>2012년 4월 2일</td>
          </tr>
          <tr>
            <th>자본금</th>
            <td>25억 6천만원</td>
          </tr>
          <tr>
            <th>주소</th>
            <td>{{result.address}} {{result.addressDetail}}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="map_area">map</div>
      <div class="about_info">
        <p class="info_tit">찾아오시는 방법</p>
        <div class="info_dot">
          <p>지하철 이용시 : 7호선 청담역 3번 출구 도보 10분</p>
          <p>버스 이용시 : 143, 240, 362, 3219, 6010번 프리마호텔 하차 후 도보 1분</p>
        </div>
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
      link: []
    }
  },
  beforeCreate: function () {
    $s = this.$saleson;
    vm = this;
  },
  data: function () {
    return {
      // data
      result:{},
    }
  },
  methods: {
    // custom methods..
    submit: function () {
      $s.api.getAbout(vm.param,
          function (response) {
            vm.result = response.about;
          }
      );
    },
  },
  mounted: function() {
    this.$nextTick(function () {



      vm.submit();
    });
  }
}
</script>
