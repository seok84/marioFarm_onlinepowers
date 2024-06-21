<template>
  <section class="contents featured_detail_contents">
    <div class="featured_top">
      <div class="tit_wrap">
        <h2 class="tit">{{featured.featuredName}}</h2>
      </div>
      <div class="item_banner">
        <div class="container">
          <img :src="bannerImage" alt="banner" @error="errorImage">
        </div>
      </div>
      <div class="feautred_select"
           v-if="(featured.prodState === '2' || featured.prodState === '3') && itemTypeList.length > 1">
        <div class="container">
          <select class="custom-select box" @change="categoryChange($event)">
            <option value="all">전체</option>
            <option :value="itemType.ITEM_TYPE_ID" v-for="itemType in itemTypeList">
              {{itemType[itemTypeNameKey]}}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="item_list thumb">
      <div class="container">
        <div v-html="appendCdnDomain(unescapeHtml(featured.featuredContent))"></div>
        <item-list
            :item-list="itemList"
            :list-name="featured.featuredName"
            thumb-class="col-6 col-md-4 col-lg-3 list_area"
            @redirect="redirectByItem"
        ></item-list>
      </div>
    </div>

    <div class="container" v-show="featured.replyUsedFlag === 'Y'">
      <div class="item_qna">
        <div class="total_top">
          <div class="total_area">
            <p class="total">전체 <span>{{resultReply.totalElements}}</span></p>
            <button type="button" class="btn_inquiry">댓글쓰기</button>
          </div>
          <div class="inquiry_write">
            <div class="form_wrap_box">
              <div class="form-group">
                <div class="row no-gutters">
                  <div class="col-12">
                                        <textarea class="form-control" cols="30" rows="10"
                                                  placeholder="내용을 입력해주세요" id="replyContent"></textarea>
                  </div>
                </div>
              </div>
              <div class="row no-gutters btn-group right">
                <div class="col col-md-2">
                  <button type="button" class="btn btn_lg btn_light btn_cancel">취소</button>
                </div>
                <div class="col col-md-2">
                  <button type="button" class="btn btn_lg btn_primary" @click="replySubmit">
                    등록
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="list_wrap faq_list"
             v-if="typeof resultReply.content !== 'undefined' && resultReply.content.length > 0">
          <ul>
            <li class="list_area" v-for="reply in resultReply.content">
              <div class="list_in">
                <div class="list_top">
                  <div class="id_date">
                    <p class="id">{{reply.userName}}</p>
                    <p class="date">{{dateFormat(reply.created, 'time')}}</p>
                  </div>
                </div>
                <p class="txt">{{reply.replyContent}}</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="review_none" v-else>
          <p>등록된 댓글이 없습니다.</p>
        </div>

        <pagination :current-page="resultReply.currentPage" :total-pages="resultReply.totalPages"
                    @change="paging"
                    v-if="typeof resultReply.content !== 'undefined' && resultReply.content.length > 0"></pagination>
      </div>

    </div>
  </section>
</template>


<script>
import Pagination from '@/components/ui/pagination';
import ItemList from '@/components/ui/item/list';

let $s, vm;

export default {
  components: {Pagination, ItemList},
  head() {
    return {
      title: this.seo.title,
      meta: this.seo.meta,
      script: [],
      link: [
        {rel: 'stylesheet', href: '/static/css/event.css'}
      ]
    }
  },
  beforeCreate: function () {
    $s = this.$saleson;
    vm = this;
  },
  async asyncData({params, $axios, $seo, route}) {
    const pageLink = params.id;
    const seo = await $seo(route.path, $axios);

    return {
      pageLink: pageLink,
      seo : seo
    }
  },
  data: function () {
    return {
      pageLink:'',
      isMobile: false,
      param: {
        arrayRequiredItems: [],
        page: 1
      },
      itemTypeIdKey: '',
      itemTypeNameKey: '',
      featuredUrl: '',
      featured: [],
      itemListMap: [],
      itemTypeList: [],
      itemTypeId: 'all',
      resultReply: {}
    }
  },
  methods: {
    submit: function (page) {

      let pageUrl = $s.requestContext.href;

      $s.api.getEventDetail(this.pageLink, function (response) {

        let featured = response.featuredList.featured;

        vm.itemTypeIdKey = response.featuredList.itemTypeIdKey;
        vm.itemTypeNameKey = response.featuredList.itemTypeNameKey;
        vm.featuredUrl = response.featuredList.featuredUrl;
        vm.featured = featured;

        vm.itemListMap = response.featuredList.itemListMap;
        vm.itemTypeList = response.featuredList.itemTypeList;

        vm.getEventReply(page);

        try {
          let itemListMapKeys = Object.keys(vm.itemListMap);
          for (let i=0; i<itemListMapKeys.length; i++) {
            let items = vm.itemListMap[itemListMapKeys[i]];

            vm.googleAnalyticsImpression(items, featured.featuredName);

            if (typeof items != 'undefined' && items != null) {

              let itemUserCodes = [];
              for (let j=0; j < items.length; j++) {
                let item = items[j];

                itemUserCodes.push(item.itemUserCode);
              }
              $s.ev.log.featured(itemUserCodes);
            }
          }
        } catch (e) {}
      });
    },

    paging: function (page) {
      vm.param.page = page;
      vm.submit(page);
    },

    categoryChange: function (e) {
      vm.itemTypeId = e.target.value;
    },

    getEventReply: function (page) {
      let params = {
        'page': page,
        'featuredUrl': vm.featuredUrl,
        'featuredId': vm.featured.featuredId
      }

      $s.api.getEventReply(params, function (response) {
        vm.resultReply = response;
      });
    },

    replySubmit: function () {

      if (!$s.isLogin()) {
        $s.alert("로그인 후 작성 가능합니다.");
        return;
      }

      let replyContent = document.getElementById("replyContent").value.trim();

      if (replyContent === "") {
        $s.alert("댓글을 입력해주세요.");
        return false;
      }

      let params = {
        'replyContent': replyContent,
        'featuredUrl': vm.featuredUrl,
        'featuredId': vm.featured.featuredId
      };
      $s.api.createEventReply(params, function (response) {
        if (response.status === "OK") {
          $s.alert("등록되었습니다.");
          document.getElementById("replyContent").value = "";
        }

        vm.getEventReply(1);

      });
    },

    redirectByItem: function (item) {
      $s.redirect('/item/' + item.itemUserCode);
    },

  },
  computed: {
    bannerImage: function() {

      let imageSrc = $s.config.noImage;
      let featured = this.featured;

      if (typeof featured != 'undefined' && featured != null) {

        if (!process.server) {
          if (this.isMobile) {
            imageSrc = featured.featuredImageMobileSrc;
          } else {
            imageSrc = featured.featuredImageSrc;
          }
        }

        if (typeof imageSrc != 'undefined' && imageSrc != null && imageSrc != "") {
          imageSrc = this.itemImage(imageSrc);
        }
      }

      return imageSrc;
    },
    itemList: function () {
      try {
        const typeId = this.itemTypeId;
        const listMap = this.itemListMap;
        const typeList = this.itemTypeList;

        if (typeof listMap == 'undefined' || listMap == null || listMap.length == 0) {
          return [];
        }

        if (typeId == 'all') {
          let list = [];

          typeList.forEach( v =>{
            const id = v['ITEM_TYPE_ID'];
            listMap[id].forEach(l => list.push(l));
          });

          return list;

        } else {
          return listMap[typeId];
        }

      } catch (e) {}

      return [];
    }
  },
  mounted: function() {
    this.$nextTick(function () {



      this.isMobile = $s.isMobile();

      if ('' == this.pageLink) {
        $s.redirect('/featured');
        return;
      }

      vm.paging(1);
      initializeListEvent();

      $s.core.setState($s.const.GNB_MENU_TARGET,'featured');
    });
  }
}
</script>
