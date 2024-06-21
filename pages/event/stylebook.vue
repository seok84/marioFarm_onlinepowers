
<template>
  <section class="contents style_contents">

    <div class="look_wrap">
      <div class="container" v-cloak>
        <div class="look_top">
          <h2 class="look_tit">LOOK BOOK</h2>
          <div class="pc txt">
            <p>스타일들을 직접 확인해보시고 나만의 패션을 완성해보세요.</p>
          </div>
        </div>
        <div class="look_img">
          <ul id="img_grid" class="img_inner" v-masonry transition-duration="0.5s" item-selector=".img_area">
            <li v-masonry-tile class="img_area" v-for="(data, index) in books" :key="'book_'+index">
              <div class="thumb">
                <img class="img_full" :src="itemImage(data.image)" :alt="unescapeHtml(data.title)">
              </div>
              <div class="hover_area">
                <a href=".pop_style_book" class="btn_sns" data-toggle="modal" @click="viewDetail(index)"><span>스타일<br>확인하기</span></a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 스타일북 상세페이지 팝업 -->
    <div class="modal fade pop_style_book">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="style_list">
              <div class="look_img">
                <img class="img_full" :src="itemImage(detail.image)" :alt="unescapeHtml(detail.title)" @error="errorImage">
              </div>
              <div class="style_conts">
                <div class="txt_top">
                  <a href=".layer_sns" class="link_share" data-toggle="modal">
                    <span class="screen_out">공유하기</span>
                  </a>
                  <p class="title">{{unescapeHtml(detail.title)}}</p>
                  <div class="conts">
                    {{unescapeHtml(detail.content)}}
                  </div>
                </div>

                <div class="txt_bot" v-if="detail.items.length > 0">
                  <p class="relate_tit">관련상품보기</p>
                  <div class="item_list thumb">
                    <div class="row">
                      <div class="col-6 list_area" v-for="(data, index) in detail.items" :key="'item_'+index">
                        <div class="img_area">
                          <a :href="'/items' + data.itemUserCode">
                            <img :src="itemImage(data.itemImage)" :alt="unescapeHtml(data.itemName)">
                          </a>
                          <div class="sale_per" v-if="data.discountRate > 0">{{data.discountRate}}<span>%</span></div>
                        </div>
                        <div class="txt_area">
                          <p class="brand">{{unescapeHtml(data.brand)}}</p>
                          <p class="title">{{unescapeHtml(data.itemName)}}</p>
                          <div class="price_area">
                            <p class="before" v-if="data.salePrice > data.presentPrice"><span>{{formatNumber(data.salePrice)}}</span>원</p>
                            <div class="sale_area">
                              <p class="price"><span>{{formatNumber(data.presentPrice)}}</span>원</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <button type="button" class="modal_close" data-dismiss="modal">
            <span class="screen_out">닫기</span>
          </button>
        </div>
      </div>
    </div>

    <!-- sns공유 레이어 -->
    <div class="modal fade layer_sns">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal_tit">공유하기</h3>
          </div>
          <div class="modal-body">
            <div class="sns_pop">
              <a href="javascript:;" class="sns_fb" @click="snsShare('facebook')">
                <img src="/static/images/icon/btn_facebook.png" alt="페이스북">
              </a>
              <a href="javascript:;" class="sns_tw" @click="snsShare('twitter')">
                <img src="/static/images/icon/btn_twitter.png" alt="트위터">
              </a>
              <a href="javascript:;" class="sns_ka" @click="snsShare('kakao')">
                <img src="/static/images/icon/btn_kakao.png" alt="카카오톡">
              </a>
              <a href="javascript:;" class="sns_url" @click="snsShare('urlCopy')">
                <img src="/static/images/icon/btn_url.png" alt="url">
              </a>
            </div>
          </div>
          <button type="button" class="modal_close" data-dismiss="modal">
            <span class="screen_out">sns공유 닫기</span>
          </button>
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
      script: [
        { src: '//developers.kakao.com/sdk/js/kakao.min.js'},
        { src: '/static/js/sns/facebook.js'}
      ],
      link: [
        {rel: 'stylesheet', href: '/static/css/event.css'}
      ]
    }
  },
  beforeCreate: function () {
    $s = this.$saleson;
    vm = this;
  },
  data: function() {
    return {
      detail: {
        id: 0,
        title: "",
        content: "",
        image: "",
        items: []
      },
      result: {
        list: [],
        last: false
      },
      page: 1,
      books : [],
      updateFlag : true,
      category : []
    }
  },
  methods: {
    handleScroll: function () {

      let updatePercentage = 80;

      if (getCurrentScrollPercentage() > updatePercentage) {
        this.getStyleBooks();
      }

      function getCurrentScrollPercentage() {
        let _scrollTop = window.scrollY || document.documentElement.scrollTop;
        let value = ((_scrollTop + window.innerHeight) / document.body.clientHeight) * 100;
        return Math.ceil(value);
      }
    },
    getStyleBooks: function () {

      if (!this.lastFlag && this.updateFlag) {

        this.updateFlag = false;
        $s.api.getStyleBooks(this.page, function (response) {

          vm.result = response;
          let list = vm.result.list;
          vm.addBooks(list);

          vm.page++;
          vm.updateFlag = true;
        });
      }
    },

    initializeViewDetail: function () {
      let id = $s.core.getParameter("id");

      if (typeof id != "undefined" && id != '' && id > 0) {
        console.log('id', id);
        let self = this;
        $s.api.getStyleBookById(id, function (data) {

          let detail = data.detail;

          self.detail.id = detail.id;
          self.detail.title = detail.title;
          self.detail.content = detail.content;
          self.detail.image = detail.image;
          self.detail.items = detail.items;

          let $modal = $('.pop_style_book');
          $modal.modal('show');

        }, function (error) {
          $s.error(error);
        });
      }
    },

    addBooks: function (list) {
      if (typeof list != 'undefined' && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          this.books.push(list[i]);
        }
      }
    },
    viewDetail: function (index) {

      let data = this.books[index];

      vm.detail.id = data.id;
      vm.detail.title = data.title;
      vm.detail.content = data.content;
      vm.detail.image = data.image;
      vm.detail.items = data.items;
    },
    snsShare: function (target) {
      let detail = this.detail;
      let title = detail.title;
      let description = detail.content;
      let imageUrl = this.itemImage(detail.image);
      let link = $s.requestContext.href;

      link = link.replace($s.requestContext.search, '');

      link += '?id=' + detail.id;

      if (target == 'facebook') {
        $s.api.social.facebook(title, description, imageUrl, link);
      } else if (target == 'twitter') {
        $s.api.social.twitter(title, description, imageUrl, link);
      } else if (target == 'kakao') {
        $s.api.social.kakao(title, description, imageUrl, link);
      } else if (target == 'urlCopy') {
        let temp = document.createElement('input');
        temp.classList.add('on');
        temp.value = link;

        document.getElementById('saleson').appendChild(temp);
        temp.select();
        document.execCommand('copy');

        $s.alert('링크가 복사되었습니다.');
      } else {
        $s.alert(target + '는 추가작업이 필요합니다.');
      }
    },
    link: function (url, index) {
      let i = this.childCategories(url);
      if (i.length > 0) {
        $s.redirect('/category?code=' + i[0].url);
      } else {
        $s.redirect('/category?code=' + url);
      }
    }
  },
  computed: {
    lastFlag: function () {
      return this.result.last;
    }
  },
  updated: function () {
    this.$nextTick(function () {

    });
  },
  mounted: function () {
    this.$nextTick(function () {



      vm.getStyleBooks();
      vm.initializeViewDetail();

      this.categoryInfo(this);

      document.addEventListener('scroll', this.handleScroll);
    });
  }
}

</script>
