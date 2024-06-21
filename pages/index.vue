
<template>
  <section class="contents main_contents">
    <div class="main_banner">
      <template v-if="topBanners.length > 0">
        <swiper ref="awesomeMainSwiper" class="main_slider" :options="swiperOption.mainSlider">
          <swiper-slide v-for="(data, index) in topBanners" :key="'topBanners_' + index" v-if="data.displayImage != ''"
                        @click="redirect(data.displayUrl)">
            <img :src="itemImage(data.displayImageSrc)" alt="베너이미지">
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </template>
    </div>
    <div class="container">
      <div class="section md_section">
        <div class="main_tit main_inner">
          <h2 class="tit">MD 추천</h2>
        </div>
        <template v-if="mdItems.length > 0">
          <swiper ref="awesomeMdSwiper" class="md_slider main_inner" :options="swiperOption.mdSlider">
            <swiper-slide v-for="(data, index) in mdItems" :key="'mdItems_' + index">
              <div class="img_area" @click="redirectByMdItem(data)">
                <img class="img_full" :src="itemImage(data.itemImage)"
                     :alt="unescapeHtml(data.itemName)" @error="errorImage" >
              </div>
              <div class="txt_area">
                <a href="javascript:;" @click="redirectByMdItem(data)">
                  <p class="title">{{unescapeHtml(data.itemName)}}</p>
                  <p class="sale" v-show="data.discountRate > 0">
                    <span>{{data.discountRate}}</span>%
                  </p>
                </a>
              </div>
            </swiper-slide>
            <div class="tablet swiper-button-next" slot="button-next"></div>
            <div class="tablet swiper-button-prev" slot="button-prev"></div>
          </swiper>
        </template>
      </div>
      <div class="section new_section">
        <div class="main_tit main_inner">
          <h2 class="tit">신상품</h2>
          <a href="/event/new" class="link_more">전체보기</a>
        </div>
        <template v-if="newItems.length > 0">
          <swiper ref="awesomeNewSwiper" class="new_slider main_item_list main_inner" :options="swiperOption.newSlider">
            <swiper-slide v-for="(data, index) in newItems" :key="'newItems_' + index" class="list_area">
              <main-item :item="data" @redirect="redirectByNewItem"></main-item>
            </swiper-slide>
          </swiper>
        </template>
      </div>
    </div>
    <div class="container">
      <div class="section best_section">
        <div class="main_tit main_inner">
          <h2 class="tit">베스트</h2>
          <a href="/event" class="link_more">전체보기</a>
        </div>
        <template v-if="category.groups.length > 0">
          <swiper ref="awesomeBestCategorySwiper" class="best_category main_inner" :options="swiperOption.bestSlider">
            <swiper-slide v-for="(group, index) in category.groups" :key="group.url" :data-group-url="group.url">
              <a href="javascript:void(0);" class="best-item-group">{{group.name}}</a>
            </swiper-slide>
          </swiper>
          <div class="best_tab main_item_list main_inner" v-for="(group, groupIndex) in groupBestItems"
               :key="group.url" :id="'best_tab-'+group.url">
            <div class="tab_area" v-show="firstGroupBestUrl == group.url">
              <div class="row no-gutters">
                <div class="col-12 col-md-6 list_area" v-for="(data, index) in group.items" v-if="index == 0"
                     :key="'groupBestItems_'+ groupIndex +'_'+ index">

                  <main-item :item="data" :display-mobile-flag="false" @redirect="redirectByBestItem"></main-item>

                </div>
                <div class="col-12 col-md-6 conts_area">
                  <div class="row no-gutters">
                    <div class="col-6 list_area" v-for="(data, index) in group.items" v-if="index > 0"
                         :key="'groupBestItems_'+ groupIndex +'_'+ index">

                      <main-item :item="data" :display-mobile-flag="false" @redirect="redirectByBestItem"></main-item>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

      </div>
      <div class="section">
        <div class="main_tit main_inner">
          <h2 class="tit">기획전</h2>
          <a href="/featured" class="link_more">전체보기</a>
        </div>
        <div class="feautred_contents">
          <div class="row">
            <template v-if="featured.displayImageList.length > 0">
              <div class="col-12 col-md-6 list_area" v-for="(data, index) in featured.displayImageList" :key="'featured_' + index">
                <div class="list">
                  <a href="javascript:void(0)" @click="redirectByFeatured(data.displayUrl)">
                    <img class="img_full" :src="itemImage(data.displayImageSrc)" :alt="data.displayContent" @error="errorImage">
                  </a>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>


    <div id="look_section" class="section look_section">
      <div class="look_bg">
        <div class="top_area">
          <span><img src="/static/images/look_txt_t.png" alt="lookbook"></span>
          <span><img src="/static/images/look_txt_t.png" alt="lookbook"></span>
          <span><img src="/static/images/look_txt_t.png" alt="lookbook"></span>
          <span><img src="/static/images/look_txt_t.png" alt="lookbook"></span>
          <span><img src="/static/images/look_txt_t.png" alt="lookbook"></span>
        </div>
        <div class="bot_area">
          <span><img src="/static/images/look_txt_b.png" alt="lookbook"></span>
          <span><img src="/static/images/look_txt_b.png" alt="lookbook"></span>
          <span><img src="/static/images/look_txt_b.png" alt="lookbook"></span>
          <span><img src="/static/images/look_txt_b.png" alt="lookbook"></span>
          <span><img src="/static/images/look_txt_b.png" alt="lookbook"></span>
        </div>
      </div>
      <div class="container">
        <div class="tit_area">
          <p class="sub_tit">스타일의 자신감을 확인해보세요</p>
          <p class="tit">LOOK BOOK</p>
          <a href="event/stylebook" class="link_more">VIEWMORE</a>
        </div>
        <div class="img_area">
          <ul class="img_inner">
            <li>
              <a :href="displayStyleBook1.url">
                <p><img class="img_full" :src="itemImage(displayStyleBook1.imageSrc)" @error="errorImage"></p>
              </a>
            </li>
            <li>
              <a :href="displayStyleBook2.url">
                <p><img class="img_full" :src="itemImage(displayStyleBook2.imageSrc)" @error="errorImage"></p>
              </a>
            </li>
            <li>
              <a :href="displayStyleBook3.url">
                <p><img class="img_full" :src="itemImage(displayStyleBook3.imageSrc)" @error="errorImage"></p>
              </a>
            </li>
            <li>
              <a :href="displayStyleBook4.url">
                <p><img class="img_full" :src="itemImage(displayStyleBook4.imageSrc)" @error="errorImage"></p>
              </a>
            </li>
            <li>
              <a :href="displayStyleBook5.url">
                <p><img class="img_full" :src="itemImage(displayStyleBook5.imageSrc)" @error="errorImage"></p>
              </a>
            </li>
            <li>
              <a :href="displayStyleBook6.url">
                <p><img class="img_full" :src="itemImage(displayStyleBook6.imageSrc)" @error="errorImage"></p>
              </a>
            </li>
            <li>
              <a :href="displayStyleBook7.url">
                <p><img class="img_full" :src="itemImage(displayStyleBook7.imageSrc)" @error="errorImage"></p>
              </a>
            </li>
          </ul>
        </div>
        <!--<ul class="sns_area">
          <li><a :href="facebookUrl()">Facebook</a></li>
          <li><a :href="instagramUrl()">Instagram</a></li>
        </ul>-->
      </div>
    </div>

    <layout-popup></layout-popup>
  </section>
</template>

<script>
  import MainItem from '@/components/ui/item/main';
  import LayoutPopup from '@/components/ui/popup-layer';

  let $s, vm;

  export default {
    components: {MainItem, LayoutPopup},
    async asyncData({ $axios,$seo, route}) {

      try {

        const seo = await $seo(route.path, $axios);
        return {
          seo: seo
        };

      } catch (e) {
        console.error(e);
      }

    },
    head() {
      return {
        /*title: this.seo.title,
        meta: this.seo.meta,*/
        script: [
          { src: '/static/js/main.js', body: true},
        ],
        link: [
          { rel: 'stylesheet', href: '/static/css/main.css' },
          { rel: 'stylesheet', href: '/static/css/event.css' }
        ]
      }
    },
    beforeCreate: function() {
      $s = this.$saleson;
      vm = this;
    },
    data: function(){
      return {
        category: {
          groups: []
        },
        param: {
          arrayRequiredItems: []
        },
        promotion: {
          displayImageList: []
        },
        featured: {
          displayImageList: []
        },
        mdItems: [],
        newItems: [],
        groupBestItems: [],
        firstGroupBestUrl :'',
        event: [],
        styleBooks: [],
        swiperOption: {
          mainSlider:{
            loop: true,
            pagination: {
              el: '.main_banner .swiper-pagination'
            },
            grabCursor: true
          },
          mdSlider: {
            slidesPerView: 4,
            spaceBetween: 30,
            centerSlides: true,
            navigation: {
              nextEl: '.md_section .swiper-button-next',
              prevEl: '.md_section .swiper-button-prev',
            },
            breakpoints: {
              767: {
                slidesPerView: 2,
                spaceBetween: 16
              }
            },
            grabCursor: true
          },
          newSlider: {
            slidesPerView: 'auto',
            centerSlides: true
          },
          bestSlider: {
            slidesPerView: 'auto',
            resistance: true,
            resistanceRatio: 0,
            freeMode: true
          }
        }
      }
    },
    methods: {
      getPromotion: function () {
        $s.api.getPromotion(function (data) {
          vm.promotion = data.promotion;
          vm.featured = data.featured;
        });
      },
      getMdItems: function () {

        let params = {
          limit: 10
        }

        $s.api.getMdItems(params, function (data) {
          vm.mdItems = data.list;

          vm.googleAnalyticsImpression(data.list, '메인 MD');
        });
      },
      getNewItems: function () {
        let params = {
          limit: 6
        };

        $s.api.getNewItems(params, function (data) {
          vm.newItems = data.content;
          vm.googleAnalyticsImpression(data.content, '메인 신상품');
        });
      },
      getGroupBestItems: function () {
        let params = {
          limit: 10
        }

        $s.api.getGroupBestItems(params, function (data) {

          let tempList = [];

          for (let i=0; i<data.list.length; i++) {
            let bestItem = data.list[i];

            if (i == 0) {
              vm.firstGroupBestUrl = bestItem.url;
            }

            bestItem.items.splice(5);
            tempList.push(bestItem);

            vm.googleAnalyticsImpression(bestItem, '메인 베스트');
          }

          vm.groupBestItems = tempList;
        });
      },
      getEvent: function () {

        let params = {
          page: 1,
          itemsPerPage: 4
        }

        $s.api.getEvent(params, function (data) {
          vm.event = data.content;
        });

      },
      getPopups: function() {
        $s.api.getPopups(function (data) {
          $s.api.popup.makePopup(data.list, vm);
        }, function (error) {
          $s.alert(error.response.data.message);
        });
      },
      redirectByBestItem: function (item) {
        this.redirectByItem(item.itemUserCode, item, '메인 베스트');
      },
      redirectByNewItem: function (item) {
        this.redirectByItem(item.itemUserCode, item, '메인 신상품');
      },
      redirectByMdItem: function (item) {
        this.redirectByItem(item.itemUserCode, item, '메인 MD');
      },
      redirectByItem: function (itemUserCode, item, listName) {
        this.googleAnalyticsSelect(item, listName);
        $s.redirect('/item/' + itemUserCode);
      },

      redirectByFeatured: function (featuredUrl) {
        $s.redirect('/featured' + featuredUrl);
      },
      getDisplayStyleBooks: function () {
        $s.api.getDisplayStyleBooks(function (response) {
          vm.styleBooks = response.list;
        });
      },
      getStyleBookData: function (styleBooks, code) {

        let data = {
          'url': $s.pages.INDEX,
          'imageSrc': $s.const.noImage
        };

        try {
          for (let i = 0; i < styleBooks.length; i++) {
            let s = styleBooks[i];
            if (s.displayGroupCode == code) {
              data.url = s.displayUrl;
              data.imageSrc = s.displayImageSrc;
              break;
            }
          }
        } catch (e) {
        }

        return data;
      },

    },
    computed: {
      topBanners: function () {

        return this.promotion.displayImageList;
      },

      displayStyleBook1: function () {
        return this.getStyleBookData(this.styleBooks, 'style-book-1');
      },
      displayStyleBook2: function () {
        return this.getStyleBookData(this.styleBooks, 'style-book-2');
      },
      displayStyleBook3: function () {
        return this.getStyleBookData(this.styleBooks, 'style-book-3');
      },
      displayStyleBook4: function () {
        return this.getStyleBookData(this.styleBooks, 'style-book-4');
      },
      displayStyleBook5: function () {
        return this.getStyleBookData(this.styleBooks, 'style-book-5');
      },
      displayStyleBook6: function () {
        return this.getStyleBookData(this.styleBooks, 'style-book-6');
      },
      displayStyleBook7: function () {
        return this.getStyleBookData(this.styleBooks, 'style-book-7');
      },
      newSwiper: function() {

        let swiper = this.$refs.awesomeNewSwiper;

        if (typeof swiper != 'undefined' && swiper != null) {
          return swiper.$swiper
        }

        return false;

      }

    },
    mounted: function() {
      this.$nextTick(function () {



        this.categoryInfo(this);
        /*this.getPromotion();
        this.getMdItems();
        this.getNewItems();

        this.getGroupBestItems();

        this.getEvent();

        this.makeOpenGraphTag(
            $s.requestContext.href,
            document.title,
            '',
            this.getMetaTagContent('description')
        );

        this.getDisplayStyleBooks();

        this.getPopups();

        if (window.innerWidth >= 768) {
          if (this.newSwiper) {
            this.newSwiper.destroy();
          }
        }

        initializeMainEvent();*/

      });
    }
  }

</script>

