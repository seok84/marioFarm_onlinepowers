<template>
  <section class="contents item_contents item_contents2 item_wrap">
    <div class="bg_dim"></div>
    <h2 class="screen_out">상품리스트</h2>

    <div class="container filter_open_pc">
      <!-- ======= 모바일일 때            -->
      <div class="mobile_item d-block d-lg-none">
        <div class="item_head_m">
          <div class="container">
            <ul class="item_head_list">
              <li><a href="">홈</a></li>
              <li class="filter_select">
                <div class="dropdown" v-for="(currentCate, index) in currentCategories"
                     v-if="currentCate.codes !== 'undefined' && currentCate.codes.length > 0 && index == 0">
                  <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {{currentCate.title}}
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                    <a class="dropdown-item" href="#" v-for="codes in currentCate.codes"
                       @click="link(codes.url, index)">
                      {{codes.name}}
                    </a>
                  </div>
                </div>
              </li>
            </ul>
            <div class="head_tit">
              <label for="select1" class="screen_out"></label>
              <select name="" id="select1" class="filter_tit" v-for="(currentCate, index) in currentCategories"
                      v-if="currentCate.codes !== 'undefined' && currentCate.codes.length > 0 && index == 1" @change="mSelLink">
                <option :value="codes.url" v-for="codes in currentCate.codes">
                  {{codes.name}}
                </option>
              </select>
              <button type="button" class="btn_filter d-block d-lg-none">
                <span class="screen_out">조건필터</span>
              </button>
            </div>
            <div class="item_category" v-if="index == 2 && data.codes.length > 0" v-for="(data, index) in currentCategories">
              <div class="swiper-container item_category_m">
                <ul class="swiper-wrapper" v-for="(currentCate, index) in currentCategories"
                    v-if="currentCate.codes !== 'undefined' && currentCate.codes.length > 0 && index == 2">
                  <li :class="'전체' === current.category2Name ? 'swiper-slide on':'swiper-slide'">
                    <a href="javascript:void(0)" @click="mSelLink(current.category1Url)">ALL</a>
                  </li>
                  <li :class="param.categoryCode === codes.url ? 'swiper-slide on':'swiper-slide'" v-for="codes in currentCate.codes">
                    <a href="javascript:void(0)" @click="mSelLink(codes.url)">{{codes.name}}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="filter_select">
          <!-- ======= 3차 카테고리 선택 시 3차 해당 페이지로 이동 ======= -->
          <div class="select_depth3">
            <label for="select2" class="screen_out"></label>
            <select name="" id="select2" v-for="(currentCate, index) in currentCategories"
                    v-if="currentCate.codes !== 'undefined' && currentCate.codes.length > 0 && index == 3"
                    @change="mSelLink">
              <option :value="subCodes.url" v-for="subCodes in currentCate.codes">{{subCodes.name}}</option>
            </select>
          </div>
          <!-- ======= 4차 카테고리 선택 시 4차 해당 페이지로 이동 ======= -->
          <div class="select_depth4">
            <label for="select3" class="screen_out"></label>
            <select name="" id="select3" v-for="(data, index) in currentCategories" v-if="index === 4 && data.codes.length > 0" @change="mSelLink">
              <option value="all">전체</option>
              <option :value="subData.url" v-for="(subData, subIndex) in data.codes">
                {{subData.name}}
              </option>
            </select>
          </div>
        </div>
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
            <button type="button" class="btn_filter d-none d-lg-block">
              <span>조건필터</span>
            </button>
          </div>
        </div>
      </div>

      <div class="pc_item d-none d-lg-block">
        <div class="item_head">
          <div class="container">
            <ul class="item_head_list">
              <li><a href="">홈</a></li>
              <li class="filter_select">
                <div class="dropdown" v-for="(currentCate, index) in currentCategories"
                     v-if="currentCate.codes !== 'undefined' && currentCate.codes.length > 0 && index == 0">
                  <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {{currentCate.title}}
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                    <a class="dropdown-item" href="#" v-for="codes in currentCate.codes"
                       @click="link(codes.url, index)">
                      {{codes.name}}
                    </a>
                  </div>
                </div>
              </li>
            </ul>
            <h2 class="tit">{{current.category1Name}}</h2>
            <div class="depth_select">
              <!-- ======= 존재하는 경우에만 보임 ======= -->
              <div class="select_depth3">
                <label for="select5"></label>
                <select name="" id="select5" v-for="(data, index) in currentCategories" v-if="index === 3 && data.codes.length > 0" @change="mSelLink">
                  <option value="all">전체</option>
                  <option :value="subData.url" v-for="(subData, subIndex) in data.codes" :selected="subData.url === current.category3Url">
                    {{subData.name}}
                  </option>
                </select>
              </div>
              <div class="select_depth4">
                <label for="select6"></label>
                <select name="" id="select6" @change="mSelLink" v-if="lastCategories != null && lastCategories.length > 0">
                  <option value="all">전체</option>
                  <option :value="data.url" v-for="(data, index) in lastCategories">
                    {{data.name}}
                  </option>
                </select>
              </div>
            </div>

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
                <button type="button" class="btn_filter d-none d-lg-block">
                  <span>조건필터</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item_filter_wrap">
        <div class="filter_wrap">
          <div class="filter_trans">
            <form @submit.prevent="submit">
              <div class="item_menu d-none d-lg-block">
                <ul class="menu_depth1" v-for="(currentCate, index) in currentCategories"
                    v-if="currentCate.codes !== 'undefined' && currentCate.codes.length > 0 && index == 1">
                  <li v-for="codes in currentCate.codes">
                    <a href="javascript:void(0)" :class="currentCate.title === codes.name ? 'now' : ''" v-if="codes.childCategories.length > 0">{{codes.name}}</a>
                    <a href="javascript:void(0)" :class="currentCate.title === codes.name ? 'now' : ''" @click="link(codes.url, index)" v-else>{{codes.name}}</a>
                    <ul class="menu_depth2" v-if="codes.childCategories.length > 0">
                      <li>
                        <a href="javascript:void(0)" @click="link(codes.url, 0)" :class="('전체' === current.category2Name) && (codes.name === current.category1Name) ? 'now' : ''">ALL</a>
                      </li>
                      <li v-if="codes.childCategories !== 'undefined' && codes.childCategories.length > 0" v-for="(subCodes, index) in codes.childCategories">
                        <a href="javascript:void(0)" :class="current.category2Url === subCodes.url ? 'now' : ''" @click="link(subCodes.url, index)">{{subCodes.name}}</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="filter_container">
                <button class="btn_filter_reset" @click="filterReset" type="button">필터 초기화</button>
                <ul class="filter_content">
                  <li class="title">
                    <a href="">가격대</a>
                    <ul class="filter_lists" name="priceFilter">
                      <li v-for="data in priceAreaList" @click="priceFilter" :class="param.minPrice === data.beginSalePrice && param.maxPrice === data.endSalePrice ? 'on' : ''">
                        <a href="javascript:void(0)" v-if="data.beginSalePrice == 0" :price="data.beginSalePrice + '_' + data.endSalePrice">{{formatNumber(data.endSalePrice)}}원 이하</a>
                        <a href="javascript:void(0)" v-if="data.beginSalePrice != 0 && data.endSalePrice != 0" :price="data.beginSalePrice + '_' + data.endSalePrice">{{formatNumber(data.beginSalePrice)}}원 ~ {{formatNumber(data.endSalePrice)}}원</a>
                        <a href="javascript:void(0)" v-if="data.endSalePrice == 0" :price="data.beginSalePrice + '_' + data.endSalePrice">{{formatNumber(data.beginSalePrice)}}원 이상</a>
                      </li>
                    </ul>
                  </li>
                </ul>
                <ul class="filter_content" v-for="group in categoryFilter">
                  <li class="title">
                    <a href="javascript:void(0)">{{group.label}}</a>
                    <!-- 색상 -->
                    <div class="filter_lists" v-if="group.filterType === 'COLOR'">
                      <div class="colors">
                        <div class="panel" v-for="(codes, index) in group.codeList">
                          <a href="javascript:void(0)" :name="group.id+'_'+codes.id" @click="filterLink(group.id, codes.id)"
                             :style="{border:'1px solid #d8d8d8', background:codes.labelCode}" :class="param.fcIds.indexOf(codes.id) > -1 ? 'on' : ''"></a>
                          <span class="txt">{{codes.label}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="filter_lists" v-if="group.filterType === 'IMAGE'">
                      <div class="types">
                        <div class="panel" v-for="(codes, index) in group.codeList">
                          <a href="javascript:void(0)" :name="group.id+'_'+codes.id" @click="filterLink(group.id, codes.id)"
                             :class="param.fcIds.indexOf(codes.id) > -1 ? 'on' : ''">
                            <img :src="itemImage(codes.imageSrc)" :alt="unescapeHtml(codes.label)">
                            <span class="txt">{{codes.label}}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <ul class="filter_lists" v-if="group.filterType != 'COLOR' && group.filterType != 'IMAGE'">
                      <li v-for="codes in group.codeList" :name="group.id+'_'+codes.id" :class="param.fcIds.indexOf(codes.id) > -1 ? 'on' : ''">
                        <a href="javascript:void(0)" @click="filterLink(group.id, codes.id)">{{codes.label}}</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </div>
        <div class="item_list_wrap" v-if="result.content.length > 0">

          <item-list
              :item-list="result.content"
              :list-name="categoryPath"
              :list-type="param.listType"
              :category="categoryTitle"
              @redirect="redirectByItem"
          ></item-list>
          <pagination :current-page="result.currentPage" :total-pages="result.totalPages" @change="paging"></pagination>



        </div>
        <div class="item_list_wrap" v-else>
          <div class="common_none">
            <p>상품이 없습니다. </p>
          </div>
        </div>
      </div>
    </div>
  </section> <!-- // contents E -->
</template>

<script>

import Pagination from '@/components/ui/pagination';
import ItemList from '@/components/ui/item/list';

let $s, vm;

export default {
  props: {
    categoryCode: {
      type: String,
      required :  false
    }
  },
  components: {Pagination, ItemList},

  beforeCreate: function() {
    $s = this.$saleson;
    vm = this;
  },

  data: function () {
    return {
      newCartQuantity: 0,
      newLatelyItemCount: 0,
      newWishlistCount : 0,
      isActive : true,
      param: {
        categoryCode: '',
        orderBy: 'ORDERING',
        sort: 'ASC',
        page: 1,
        itemsPerPage: 20,
        listType: 'a',
        arrayRequiredItems: [],
        fcIds: ''
      },
      result: {
        content: [],
        first: true,
        last: true,
        number: 0,
        nemberOfElement: 20,
        size: 20,
        totalElements: 0,
        totalPages: 1
      },
      category: {
        groups: []
      },
      categoryFilter : [],
      priceAreaList : [],
      currentCategories: [],
      lastCategories : [],
      currentChildForMobile: [],
      current: {
        categoryLevel: '',
        groupUrl: '',
        groupName: '',
        category1Url: '',
        category1Name: '',
        category2Url: '',
        category2Name: '',
        category3Url: '',
        category3Name: '',
      },
      breadcrumbs: []
    }
  },
  methods: {
    submit: function (initFlag) {
      $s.api.getItems(vm.param,
          function (response) {
            vm.result = response;
            vm.itemContentDepth();

            if (!initFlag) {
              vm.itemImpression();
            }
          }
      );
    },

    getCurrentCategories: function () {

      function validIndexId(id) {
        return id != null && id !="";
      }

      let categoryCode = vm.param.categoryCode;
      let params = {
        'categoryCode': categoryCode
      }
      $s.api.getCurrentCategories(params, function (response) {
        let breadcrumbs = response.list[0];

        vm.breadcrumbs = breadcrumbs;
        vm.current.groupUrl = breadcrumbs.groupUrl;
        vm.current.groupName = breadcrumbs.groupName;
        vm.current.category1Url = breadcrumbs.breadcrumbCategories[0].categoryUrl;
        vm.current.category1Name = breadcrumbs.breadcrumbCategories[0].categoryName;
        if(validIndexId(breadcrumbs.breadcrumbCategories[0].indexId)){
          vm.current.indexId = breadcrumbs.breadcrumbCategories[0].indexId;
        }

        vm.current.categoryLevel = "1";

        if (breadcrumbs.breadcrumbCategories[1] !== undefined) {
          vm.current.category2Url = breadcrumbs.breadcrumbCategories[1].categoryUrl;
          vm.current.category2Name = breadcrumbs.breadcrumbCategories[1].categoryName;
          if(validIndexId(breadcrumbs.breadcrumbCategories[1].indexId)){
            vm.current.indexId = breadcrumbs.breadcrumbCategories[1].indexId;
          }

          vm.current.categoryLevel = "2";
        } else {
          vm.current.category2Name = "전체";
        }

        if (breadcrumbs.breadcrumbCategories[2] !== undefined) {
          vm.current.category3Url = breadcrumbs.breadcrumbCategories[2].categoryUrl;
          vm.current.category3Name = breadcrumbs.breadcrumbCategories[2].categoryName;
          if(validIndexId(breadcrumbs.breadcrumbCategories[2].indexId)){
            vm.current.indexId = breadcrumbs.breadcrumbCategories[2].indexId;
          }

          vm.current.categoryLevel = "3";
        } else {
          vm.current.category3Name = "전체";
        }

        let currentCategories = [];

        currentCategories.push({
          'title': vm.current.groupName,
          'codes': vm.category.groups
        });

        currentCategories.push({
          'title': vm.current.category1Name,
          'codes': vm.childCategories(vm.current.groupUrl)
        });

        currentCategories.push({
          'title': vm.current.category2Name,
          'codes': vm.childCategories(vm.current.groupUrl, vm.current.category1Url)
        });

        if (vm.current.categoryLevel === '2' || vm.current.categoryLevel === '3') {
          currentCategories.push({
            'title': vm.current.category3Name,
            'codes': vm.childCategories(vm.current.groupUrl, vm.current.category1Url, vm.current.category2Url)
          });
        }

        let childCategories = vm.childCategories(breadcrumbs.groupUrl, breadcrumbs.categoryUrl1, breadcrumbs.categoryUrl2);
        vm.currentCategories = currentCategories;

        let categoryName = vm.currentCategories[vm.current.categoryLevel].title;
        let categories = vm.currentCategories[vm.current.categoryLevel].codes
        let currentChildForMobile = {
          categoryName: categoryName,
          categoryCode: categoryCode,
          categories: categories,
          childCategories: childCategories
        }
        vm.currentChildForMobile = currentChildForMobile;

        // 카테고리 조회 후 해당 카테고리 index 에 맞는 필터 조회
        vm.getFilterList();

        // 카테고리 상품 금액 영역
        vm.getPriceAreaList();

        // 3,4차 카테고리 확인
        vm.subCategoryCheck();
      });
    },

    // 3, 4차 카테고리 확인
    subCategoryCheck : function(){
      // 3차 카테고리가 존재한다면
      if(vm.currentCategories[3]!=null){
        $.each(vm.currentCategories[3].codes, function(i){
          // 현재 카테고리가 일치하면
          if(vm.param.categoryCode == vm.currentCategories[3].codes[i].url){
            // 4차 카테고리 구성
            vm.lastCategories = vm.currentCategories[3].codes[i].childCategories;
          } else if(vm.currentCategories[3].codes[i].childCategories != null && vm.currentCategories[3].codes[i].childCategories.length > 0){
            vm.lastCategories = vm.currentCategories[3].codes[i].childCategories;
          }
        });
      }
    },

    priceFilter : function(i){
      if ($(i.target.parentElement).hasClass("on")) {
        $("ul[name='priceFilter'] >").removeClass('on');
      } else {
        $("ul[name='priceFilter'] >").removeClass('on');
        $(i.target.parentElement).toggleClass('on');
      }
      let startPrice = new Array();
      let endPrice = new Array();
      if($("ul[name='priceFilter'] >").hasClass("on")){
        $.each($("ul[name='priceFilter'] >"), function(i){
          if($("ul[name='priceFilter'] >:eq("+i+")").hasClass("on")){
            startPrice.push($("ul[name='priceFilter'] >:eq("+i+") >").attr("price").split("_")[0]);
            endPrice.push($("ul[name='priceFilter'] >:eq("+i+") >").attr("price").split("_")[1]);
          }
        });
        vm.param.minPrice = Math.min.apply(null, startPrice);
        vm.param.maxPrice = Math.max.apply(null, endPrice);
      } else {
        vm.param.minPrice = 0;
        vm.param.maxPrice = 0;
      }
      vm.paging(1);
    },

    getPriceAreaList : function(){
      let params = {
        'categoryId': vm.current.indexId
      }
      $s.api.getPriceAreaList(params, function (response) {
        if(response != null && response.list.length > 0){
          vm.priceAreaList = response.list;
        }
      });
    },

    getFilterList : function(){
      let params = {
        'categoryId': vm.current.indexId
      };
      $s.api.getCurrentCategoriesFilter(params, function (response) {
        if (response != null && response.list.length > 0) {
          vm.categoryFilter = response.list;
        }
      });
    },

    paging: function (page) {
      vm.param.page = page;
      vm.submit();
    },

    sorting: function (event) {
      let value = event.target.value.split("__");
      vm.param.orderBy = value[0];
      vm.param.sort = value[1];
      vm.submit();
      vm.paging(1);
    },

    itemListType: function (type) {
      if (type === 'a') {
        type = 'b';
      } else {
        type = 'a';
      }
      vm.param.listType = type;
      vm.submit();
    },

    filterReset : function(){
      $("li[class='on']").removeClass();
      vm.param.fcIds = '';
      vm.param.minPrice = 0;
      vm.param.maxPrice = 0;
      vm.paging(1);
    },

    filterLink : function(groupId, filterCode) {
      let $filter = $(".filter_lists [name='"+groupId+'_'+filterCode+"']");
      if ($filter.hasClass("on")) {
        $filter.removeClass('on');
      } else if (!$filter.hasClass("on")) {
        $filter.addClass('on');
      }

      if (vm.param.fcIds.indexOf(filterCode) > -1) {
        let tempArray = vm.param.fcIds.split(filterCode + "N");
        vm.param.fcIds = tempArray.join('');
      } else {
        vm.param.fcIds += filterCode + "N";
      }

      vm.paging(1);
    },

    mSelLink : function(op){
      let categoryCode = "";
      if(op.target != null){
        let i = this.childCategories(op.target.value);
        if(op.target.value == "all"){
          categoryCode = $s.core.getParameter("code");
        } else {
          if(i.length > 0){
            categoryCode = i[0].url;
          } else {
            categoryCode = op.target.value;
          }
        }
      } else {
        categoryCode = op;
      }
      vm.param.categoryCode = categoryCode;
      vm.getCurrentCategories();
      vm.paging(1);
    },

    link: function (url, index) {
      let i = this.childCategories(url);
      if (index === 0 && i.length > 0) {
        $s.redirect('/category/' + i[0].url);
      } else {
        $s.redirect('/category/' + url);
      }
    },
    redirectByItem: function(item) {
      this.viewDetails('/item/'+item.itemUserCode, 'paging', 'category')
    },
    itemImpression: function () {

      this.googleAnalyticsImpression(
          vm.result.content,
          vm.categoryPath,
          vm.categoryTitle
      );
    },

    itemContentDepth : function(){
      $('.item_contents .menu_depth2').parent().find('> a').addClass('off');
      // 현재 페이지의 2차메뉴는 '-' & 펼침상태
      if ($(".item_contents .menu_depth1 > li > a.now").parent().find(".menu_depth2").length > 0) {
        $(".item_contents .menu_depth1 > li > a.now").addClass("on");
        $(".item_contents .menu_depth1 > li > a.now").parent().find(".menu_depth2").stop().slideDown();
      }
    }
  },
  mounted: function() {
    this.$nextTick(function () {

      vm.getHistory("paging", "category");
      vm.param.categoryCode = this.categoryCode;

      initializeItemsEvent();

      vm.categoryInfo(this, function(category) {
        vm.category = category;
        vm.getCurrentCategories();

        setTimeout(function() {
          vm.itemImpression();
        }, 500);

      });

      vm.submit(true);

    });
  },
  computed: {
    categoryPath: function() {

      let path = '';

      path += vm.current.groupName + '/';

      if ('전체' != vm.current.category1Name) {
        path += vm.current.category1Name + '/';
      }

      if ('전체' != vm.current.category2Name) {
        path += vm.current.category2Name + '/';
      }

      if ('전체' != vm.current.category3Name) {
        path += vm.current.category3Name + '/';
      }

      path = path.substr(0, path.length-1);

      return path;

    },
    categoryTitle: function () {

      try {
        return vm.currentCategories[vm.current.categoryLevel].title;
      } catch (e) {}

      return '';
    }
  }
}
</script>