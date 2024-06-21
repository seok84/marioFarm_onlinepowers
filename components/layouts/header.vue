<template>
	<header id="header" class="fixed-top header2">
		<div class="header_top">
			<div class="container">
				<div class="row no-gutters top_area">
					<div class="col-6">
						<h1 class="logo">
							<a href="/"><img src="/static/images/logo.png" alt="logo"></a>
						</h1>
					</div>
					<div class="col-6">
						<div class="utile_menu">
							<a href="javascript:void(0);" @click="getMyPage()" class="btn_mypage d-none d-md-block">
								<img src="/static/images/icon/btn_mypage.png" alt="마이페이지로 이동">
							</a>
							<a href="/cart" class="btn_cart">
								<img src="/static/images/icon/btn_cart.png" alt="장바구니로 이동">
								<span class="badge badge_cart">{{displayCartQuantites}}</span>
							</a>
							<div class="header_search">
								<a href="javascript:void(0);" class="btn_search">
									<span class="screen_out">검색창 열기</span>
								</a>
								<div class="search_area">
									<div class="row no-gutters search_inner">
										<div class="col-12 col-md-10 col-lg-8 col-xl-5">
											<div class="search_top">
												<form @submit.prevent="searchSubmit">
													<input type="text" v-model="searchWord" class="form-control"
													       placeholder="검색어를 입력하세요">
												</form>
											</div>
											<div class="search_list">
												<div class="row no-gutters">
													<dl class="col-12 col-md-6 lately">
														<dt>최근검색어</dt>
														<dd v-for="lately in latelySearch" :key="lately">
															<a href="javascript:;"
															   @click="search(lately)">{{lately}}</a>
															<button type="button" class="btn_del"
															        @click="removeLately(lately)">
																<span class="screen_out">검색어 지우기</span>
															</button>
														</dd>
													</dl>
													<dl class="col-12 col-md-6">
														<dt>인기검색어</dt>
														<dd v-for="word in bestSearchWord" :key="word.keyword">
															<a href="javascript:;" @click="search(word.keyword)">{{word.keyword}}</a>
														</dd>
													</dl>
												</div>
											</div>
											<button type="button" class="search_close">취소</button>
										</div>
									</div>
								</div>
							</div>
							<a href="#" class="btn_logout d-none d-md-block" v-if="!showLogin" @click.prevent="logout">
								<img src="/static/images/icon/btn_logout.png" alt="로그아웃 하기">
							</a>
							<a href="/user/login" class="btn_login d-none d-md-block" v-else-if="showLogin">
								<img src="/static/images/icon/btn_login.png" alt="로그인페이지로 이동">
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<nav class="gnb">
			<div class="container">
				<div class="gnb_slider_m">
          <div class="swiper-contents">
            <div class="swiper-container">
              <ul class="swiper-wrapper">
                <li class="swiper-slide" :class="showGnbTargetFlag('new') ? 'on' : ''"><a href="/event/new">신상품</a></li>
                <li class="swiper-slide" :class="showGnbTargetFlag('best') ? 'on' : ''"><a href="/event/best">베스트</a></li>
                <li class="swiper-slide" :class="showGnbTargetFlag('spot') ? 'on' : ''"><a href="/event/spot">타임세일</a></li>
                <li class="swiper-slide" :class="showGnbTargetFlag('featured') ? 'on' : ''"><a href="/featured">기획전</a></li>
                <li class="swiper-slide" :class="showGnbTargetFlag('stylebook') ? 'on' : ''"><a href="/event/stylebook">룩북</a></li>
              </ul>
              <!--<div class="swiper-button-next"></div>
              <div class="swiper-button-prev"></div>-->
            </div>
          </div>
				</div>


				<div class="gnb_slider_pc tablet">
					<div class="swiper-contents">

            <template v-if="category.groups.length > 0">
              <swiper ref="awesomeGnbSwiper" class="gnb-pc" :options="gnbSwiperOption">
                <!-- slides -->
                <swiper-slide v-for="group in category.groups" :key="group.url">
                  <a href="javascript:void(0);" class="gnb_tit">{{group.name}}</a>
                </swiper-slide>

                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div>
              </swiper>
            </template>

					</div>
				</div>
			</div>
			<div class="depth_wrap tablet">
				<!-- ======= 태블릿일 때 닫기 버튼(btn_close)를 눌러도 닫혀야 하고 팀/그룹을 눌러도 닫혀야 합니다 ======= -->
				<div class="gnb_depth" v-for="group in category.groups" :key="group.url">
					<div class="container">
						<h2 class="tit_team">{{group.name}}</h2> <!-- 팀/그룹 -->
						<div class="gnb_inner">
							<dl v-for="category1 in group.categories" :key="category1.url">
								<dt>{{category1.name}}</dt>

								<dd class="depth2_area" v-for="category2 in category1.childCategories"
									:key="category2.categoryId">

									<a href="javascript:void(0);"
									   @click="link(category2.url, category2.childCategories)" class="depth2_tit">{{category2.name}}</a>

									<template v-if="category2.childCategories.length > 0">

										<ul class="depth3">
											<li class="depth3_area" v-for="category3 in category2.childCategories"
												:key="category3.categoryId">

												<a href="javascript:void(0);"
												   @click="link(category3.url, category3.childCategories)"
												   class="depth3_tit">{{category3.name}}</a>

												<template v-if="category3.childCategories.length > 0">
													<ul class="depth4">
														<li v-for="category4 in category3.childCategories"
															:key="category4.categoryId">
															<a href="javascript:void(0);"
															   @click="link(category4.url, category4.childCategories)">{{category4.name}}</a>
														</li>
													</ul>
												</template>

											</li>
										</ul>

									</template>
								</dd>
							</dl>
						</div>
					</div>
					<a href="#" class="btn_close"></a>
				</div>
			</div>
		</nav>
	</header>
</template>


<script>

  let $s;

	module.exports = {
		props: {
			newCartQuantity: 0,
			gnbMenuTarget: {
				type: String,
				default: function() {
					return '';
				}
			}
		},
    data: function() {
			return {
				cartQuantity:0,
				isLogin: false,
				isGuestLogin: false,
				category: {
					groups: []
				},
				searchWord: '',
				latelySearch: [],
				bestSearchWord: null,
				latelyItems: [],
        gnbSwiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 40,
          navigation: {
            nextEl: '.swiper-contents .swiper-button-next',
            prevEl: '.swiper-contents .swiper-button-prev',
          },
          sliderMove:1,
          on: {
            init: function () {
              if ($(".gnb_slider_pc .swiper-button-prev").is(".swiper-button-disabled")) {
                $(".gnb_slider_pc .swiper-wrapper").removeClass("prv_v");
              } else {
                $(".gnb_slider_pc .swiper-wrapper").addClass("prv_v");
              }
              if ($(".gnb_slider_pc .swiper-button-next").is(".swiper-button-disabled")) {
                $(".gnb_slider_pc .swiper-wrapper").removeClass("nxt_v");
              } else {
                $(".gnb_slider_pc .swiper-wrapper").addClass("nxt_v");
              }
            },
          },
        }
			}
		},
    created() {
      let self = this;
      this.$nuxt.$on('updateHeaderCartQuantity', (quantity = 0) => {
        self.cartQuantity = quantity;
      });
    },
		methods: {
      getMyPage: function () {
        this.isLogin = $s.isLogin();

        if (this.isLogin) {
          location.href = "/mypage";
        } else {
          this.redirect($s.pages.LOGIN + "?target=" + "/mypage");
        }
      },
			getCartInfo: function () {
				let self = this;
				$s.api.getCartInfo(function (response) {
					self.cartQuantity = response.cartQuantity;
				});
			},
			logout: function () {
				$s.logout();
			},
			link: function (url, childCategories) {

				let flag = typeof childCategories != 'undefined'
					&& childCategories != null
					&& childCategories.length > 0;

				if (!flag) {
					$s.redirect('/category/'+ url);
				}
			},
			search: function (word) {

				let lately = this.latelySearch;

				if (lately == null) {
					lately = [];
				}

				if (lately.indexOf(word) < 0) {
					lately.unshift(word);
				}

				$s.core.setState($s.const.LATELY_SEARCH, JSON.stringify(lately));
				this.latelySearch = lately;

				word = encodeURIComponent(word);
				$s.redirect("/item/result?where=ITEM_NAME&query=" + word);

			},
			removeLately: function (word) {

				let lately = this.latelySearch;
				let index = lately.indexOf(word);

				lately.splice(index, 1);

				$s.core.setState($s.const.LATELY_SEARCH, JSON.stringify(lately));
				this.latelySearch = lately;
			},
			searchSubmit: function () {
				let word = this.searchWord;

				if (word != '') {
					this.search(word);
				}
			},
      async setSearchInfo() {
        try {
          const {data} = await this.$salesonApi().search.getInfo();
          this.bestSearchWord = data.keywords;
        } catch (e) {}
      },
			showGnbTargetFlag: function (target) {
				return this.gnbMenuTarget == target;
			},
			saveVisitData: function() {

        return false;

				let today = new Date().getTime();
				let visit = $s.core.getState($s.const.VISIT);
				let visitExpireDate = $s.core.getState($s.const.VISIT_EXPIRE_DATE);

				if (visit == null || visit === '' || today > visitExpireDate) {
					let agent = navigator.userAgent;
					let referrer = document.referrer;
					let domain = $nuxt.findDomain(referrer);
					let self = this;

          self.$axios
						.get("https://checkip.amazonaws.com", {}, {})
						.then(function (response) {
							let param = {
								'agent': agent,
								'referer': referrer,
								'browser': self.getBrowser(agent),
								'os': self.getOs(agent),
								'domain': domain,
								'domainName': self.getDomainName(domain),
								'remoteAddr': response.data,
								'language': navigator.language
							};

							$s.api.saveVisitData(param, function (response) {
								if (response.status === 'OK') {
									$s.core.setState($s.const.VISIT, '1');

									let expireDate = today + 1 * 1000 * 60 * 60 * 24;
									$s.core.setState($s.const.VISIT_EXPIRE_DATE, expireDate);
								}
							});
						})
				}
			}
		},
		mounted: function() {

			this.$nextTick(function () {

        $s = this.$saleson;

				this.isLogin = $s.isLogin();
				this.isGuestLogin = $s.isGuestLogin();

        this.getCartInfo();
        this.setSearchInfo();
        this.categoryInfo(this);
        this.latelyInfo(this);
        this.latelyItemInfo(this);
        this.saveVisitData();
			});

      initializeHeaderEvent();
		},
		computed: {
			displayCartQuantites: function() {
				return this.newCartQuantity > this.cartQuantity ? this.newCartQuantity :   this.cartQuantity;
			},
			showLogin: function () {
				return !(this.isLogin || this.isGuestLogin);
			}
		}
	};
</script>
