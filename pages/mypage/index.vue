<template>
  <section class="contents mypage_contents">
    <h2 class="screen_out">마이페이지</h2>
    <div class="container">
      <div class="mypage_header">
        <div class="name_area">
          <p class="name"><span>{{result.userName}}</span>님</p>
          <p class="email">{{result.loginId}}</p>
        </div>
        <div class="row no-gutters conts_area">
          <div class="col-12 col-lg-4 grade_area">
            <dl>
              <dt>나의 회원등급</dt>
              <dd>{{result.userLevel}}</dd>
            </dl>
            <a href="/mypage/grade" class="link_grade">등급혜택보기</a>
          </div>
          <div class="col-6 col-lg-4 coupon_area">
            <dl>
              <dt>사용가능 쿠폰</dt>
              <dd>
                <a href="/mypage/coupon">
                  {{couponCount}}
                </a>
              </dd>
            </dl>
          </div>
          <div class="col-6 col-lg-4 point_area">
            <dl>
              <dt>보유 포인트</dt>
              <dd>
                <a href="/mypage/point">
                  {{formatNumber(point)}}
                </a>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="mypage_container">
        <div class="row no-gutters">
          <div class="col-12 col-lg-2">
            <div class="mypage_lnb">
              <div class="row">
                <dl class="col-12 col-md-6 col-lg-12">
                  <dt>쇼핑정보</dt>
                  <dd><a href="/mypage/order">주문/배송 조회</a></dd>
                  <dd><a href="/mypage/order-cancel">취소/반품/교환 신청</a></dd>
                  <dd><a href="/mypage/delivery">배송 주소록 관리</a></dd>
                  <dd><a href="/mypage/wishlist">관심상품</a></dd>
                  <dd><a href="/mypage/recent-view">최근 본 상품</a></dd>
                </dl>
                <dl class="col-12 col-md-6 col-lg-12">
                  <dt>쇼핑혜택</dt>
                  <dd><a href="/mypage/coupon">쿠폰</a></dd>
                  <dd><a href="/mypage/point">포인트</a></dd>
                </dl>
                <dl class="col-12 col-md-6 col-lg-12">
                  <dt>마이세일즈온</dt>
                  <dd><a href="/mypage/grade">나의 등급/혜택</a></dd>
                  <dd><a href="/user/modify">내 정보 관리</a></dd>
                  <dd><a href="/user/change-password">비밀번호 변경</a></dd>
                </dl>
                <dl class="col-12 col-md-6 col-lg-12">
                  <dt>고객센터</dt>
                  <dd><a href="/mypage/inquiry-item">상품 Q&amp;A 내역</a></dd>
                  <dd><a href="/mypage/review">이용후기</a></dd>
                  <dd><a href="/notice/list">공지사항</a></dd>
                  <dd><a href="/faq/list">FAQ</a></dd>
                  <dd><a href="/mypage/inquiry">1:1 문의</a></dd>
                  <dd><a href="/store/apply">입점문의</a></dd>
                </dl>
              </div>
            </div>
          </div>
          <div class="col-lg-9 offset-lg-1 pc">
            <ul class="mypage_conts">
              <li v-if="result.orderList.length > 0">
                <h3 class="sub_tit">최근 주문내역</h3>
                <div class="conts_area">
                  <div class="item_list basic">
                    <div class="list_area">
                      <div class="img_area">
                        <a :href="'/item/' + result.orderList[0].items[0].itemUserCode">
                          <img :src="itemImage(result.orderList[0].items[0].imageSrc)" alt="썸네일">
                        </a>
                      </div>
                      <div class="txt_area">
                        <p class="brand"></p>
                        <p class="title">{{result.orderList[0].items[0].itemName}}</p>
                        <div class="price_area">
                          <!--<p class="before"><span>299,000</span>원</p>-->
                          <div class="sale_area">
                            <p class="price total"><span>{{formatNumber(result.orderList[0].items[0].itemAmount)}}</span>원</p>
                          </div>
                        </div>
                        <p class="date">{{dateFormat(result.orderList[0].createdDate, 'date')}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li v-else>
                <h3 class="sub_tit">최근 주문내역</h3>
                <div class="conts_area">
                  <div class="common_none">
                    <p>최근 주문 상품이 없습니다. 세일즈온에서 맘에 드는 상품을 구입해보세요.</p>
                  </div>
                </div>
              </li>
              <li v-if="result.wishlist.length > 0">
                <h3 class="sub_tit">관심상품</h3>
                <div class="conts_area">
                  <ul class="interest_area">
                    <li v-for="data in result.wishlist">
                      <a :href="'/item/' + data.item.itemUserCode">
                        <img class="img_full" :src="itemImage(data.item.itemImage)" alt="관심상품">
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li v-else>
                <h3 class="sub_tit">관심상품</h3>
                <div class="conts_area">
                  <div class="common_none">
                    <p>관심상품 내역이 없습니다.</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  let $s, vm;
  export default {
    middleware: 'auth',
    head() {
      return {
        script: [],
        link: [
          { rel: 'stylesheet', href: '/static/css/item.css' },
          { rel: 'stylesheet', href: '/static/css/order.css' },
          { rel: 'stylesheet', href: '/static/css/mypage.css' },
          { rel: 'stylesheet', href: '/static/css/member.css' },
          { rel: 'stylesheet', href: '/static/css/customer.css' },
          { rel: 'stylesheet', href: '/static/css/etc.css' }
        ]
      }
    },
    async asyncData({store}) {
        return {
            couponCount: store.getters.couponCount,
            point: store.getters.point,
            shippingCouponCount: store.getters.shippingCouponCount
        }
    },
    beforeCreate: function() {
      $s = this.$saleson;
      vm = this;
    },
    data: function () {
      return {
        param: {},
        result: {
          couponList : [],
          orderList : [],
          wishlist : [],
          orderShippingCount : [],
          loginId : "",
          userCouponCount : 0,
          userLevel : "",
          userName : "",
          userPoint : 0,
          userShippingCount : 0
        },
        categories: {},
        couponCount: 0,
        point: 0,
        shippingCouponCount: 0
      }
    },
    methods: {
      submit() {
          // $s.api.getMypage(
          //     function (response) {
          //         vm.result = response.data;
          //     }
          // );
      },

      callbackCart(message) {
        //alert('전달받은 메시지 : ' + message);
      },

      paging(page) {
        // vm.param.page = page;
        // vm.submit();
      },

      sorting(event) {
        // let value = event.target.value.split("__");
        // vm.param.orderBy = value[0];
        // vm.param.sort = value[1];
        // vm.submit();
      },

      itemListType(type) {
        // vm.param.listType = type;
        // vm.submit();
      }
    },
    mounted() {
        this.$nextTick(() => {
            $s.api.getMypage(function (response) {
                vm.result = response.data;
            });
        });
    }
  }
</script>
