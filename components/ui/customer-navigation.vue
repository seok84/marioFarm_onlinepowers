<template>
  <div class="tab_tit4">
    <ul class="nav nav-pills">
      <li class="nav-item">
        <a href="/notice" :class="getCalss('notice')">공지사항</a>
      </li>
      <li class="nav-item">
        <a href="/mypage/inquiry" :class="getCalss('inquiry')">1:1문의</a>
      </li>
      <li class="nav-item">
        <a href="/faq" :class="getCalss('faq')">FAQ</a>
      </li>
      <li class="nav-item">
        <a href="/mypage/inquiry-item" :class="getCalss('inquiry-item')">Q&amp;A</a>
      </li>
      <li class="nav-item">
        <a href="/mypage/review" :class="getCalss('review')">이용후기</a>
      </li>
      <li class="nav-item">
        <a href="/store/apply" :class="getCalss('store-apply')">입점문의</a>
      </li>
    </ul>
  </div>
</template>

<script>
module.exports = {
  props: {
    active: {
      type: String,
      default: function () {
        return 'notice';
      }
    }
  },
  methods: {
    getCalss(acitve) {

      let value = 'nav-link';

      if (this.active == acitve) {
        value += ' active';
      }

      return value;
    }
  }
}
</script>