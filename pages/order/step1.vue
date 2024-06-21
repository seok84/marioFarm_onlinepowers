<template>
  <section class="contents pay_contents">
    <h2 class="screen_out">주문결제</h2>
    <ol class="step_indicator">
      <li class="done">
        <div class="step">1</div>
        <div class="caption">장바구니</div>
      </li>
      <li class="active">
        <div class="step">2</div>
        <div class="caption">주문서</div>
      </li>
      <li>
        <div class="step">3</div>
        <div class="caption">결제</div>
      </li>
    </ol>
    <form id="buy" name="buy" @submit.prevent="submit">
      <fieldset>
        <input type="hidden" id="orderCode" name="orderCode"/>
        <div class="nicepay-input-area" v-if="isMobile === false">
          <!-- 결제방법 (CARD, BANK, VBANK, CELLPHONE, SSG_BANK) -->
          <input type="hidden" name="PayMethod"/>

          <!-- 할부개월 (00, 02, 03...) -->
          <input type="hidden" name="SelectQuota"/>

          <!-- 카드사 선택 (00, 01, 02, 03...) -->
          <input type="hidden" name="SelectCardCode"/>

          <input type="hidden" name="GoodsName"/>
          <input type="hidden" name="GoodsCnt" value="1"/>
          <input type="hidden" name="Amt"/>
          <input type="hidden" name="BuyerName"/>
          <input type="hidden" name="BuyerTel"/>
          <input type="hidden" name="Moid"/>
          <input type="hidden" name="MID"/>

          <!-- IP -->
          <input type="hidden" name="UserIP"/>                                        <!-- 회원사고객IP -->
          <input type="hidden" name="MallIP"/>                                        <!-- 상점서버IP -->

          <!-- 옵션 -->
          <input type="hidden" name="VbankExpDate" id="vExp"/>
          <!-- 가상계좌입금만료일 -->
          <input type="hidden" name="CharSet"/>                                       <!-- 인코딩 설정 -->
          <input type="hidden" name="BuyerEmail"/>                                    <!-- 구매자 이메일 -->
          <input type="hidden" name="SocketYN"/>                                      <!-- 소켓이용유무 -->
          <input type="hidden" name="GoodsCl" value="1"/>
          <!-- 상품구분(실물(1),컨텐츠(0)) -->
          <input type="hidden" name="TransType" value="0"/>
          <!-- 일반(0)/에스크로(1) -->

          <!-- 변경 불가능 -->
          <input type="hidden" name="EncodeParameters"/>                              <!-- 암호화대상항목 -->
          <input type="hidden" name="EdiDate"/>                                       <!-- 전문 생성일시 -->
          <input type="hidden" name="SignData"/>                                   <!-- 해쉬값 -->
          <input type="hidden" name="TrKey" value=""/>                                <!-- 필드만 필요 -->
          <input type="hidden" name="OptionList" value="no_receipt">                  <!-- 현금 영수증 발행 차단 -->
        </div>

        <div class="nicepay-input-area" v-else>
          <!-- 결제방법 (CARD, BANK, VBANK, CELLPHONE, SSG_BANK) -->
          <input type="hidden" name="PayMethod" />

          <!-- 할부개월 (00, 02, 03...) -->
          <input type="hidden" name="SelectQuota" />

          <!-- 카드사 선택 (00, 01, 02, 03...) -->
          <input type="hidden" name="SelectCardCode" />

          <input type="hidden" name="GoodsName" />
          <input type="hidden" name="GoodsCnt" value="1" />
          <input type="hidden" name="Amt" />
          <input type="hidden" name="BuyerName" />
          <input type="hidden" name="BuyerTel" />
          <input type="hidden" name="Moid" />
          <input type="hidden" name="MID" />

          <!-- IP -->
          <input type="hidden" name="MallIP" />                                        <!-- 상점서버IP -->

          <!-- 옵션 -->
          <input type="hidden" name="VbankExpDate" id="vExp" />                        <!-- 가상계좌입금만료일 -->
          <input type="hidden" name="BuyerEmail" />                                    <!-- 구매자 이메일 -->
          <input type="hidden" name="GoodsCl" value="1" />                             <!-- 상품구분(실물(1),컨텐츠(0)) -->
          <input type="hidden" name="CharSet" />                                       <!-- 인코딩 설정 -->
          <input type="hidden" name="ReturnURL" />                                     <!-- Return URL -->

          <!-- 변경 불가능 -->
          <input type="hidden" name="EdiDate" />                                       <!-- 전문 생성일시 -->
          <input type="hidden" name="EncryptData" />                                   <!-- 해쉬값 -->
          <input type="hidden" name="TrKey" value="" />                                <!-- 필드만 필요 -->
          <input type="hidden" name="AcsNoIframe" value="Y"/>						     <!-- 나이스페이 결제창 프레임 옵션 (변경불가) -->
          <input type="hidden" name="OptionList" value="no_receipt">                  <!-- 현금 영수증 발행 차단 -->
        </div>
        <div class="pay_wrap">
          <div class="container pay_top">
            <legend>주문결제</legend>
            <div class="pay_area">

              <!-- ======= [20/07/22] 오프라인 쿠폰 등록하기 추가 부분 입니다. -->
              <div class="offline_coupon_area">
                <button type="button" class="offline_collapse" data-toggle="collapse" data-target=".offline_area">쿠폰 등록하기</button>
                <div class="collapse offline_area">
                  <input type="text" class="form-control box"
                         placeholder="'-'없이 발급받은 쿠폰번호를 입력해주세요."
                         title="'-'없이 발급받은 쿠폰번호를 입력해주세요." v-model="offlineCode">
                  <div class="row no-gutters btn-group right">
                    <div class="col col-md-3 col-lg-2"><button type="button" class="btn btn_lg btn_light" data-toggle="collapse" data-target=".offline_area" @click="offlineCouponCancel">취소</button></div>
                    <div class="col col-md-3 col-lg-2"><button type="button" class="btn btn_lg btn_primary" @click="addOfflineCoupon">등록</button></div>
                  </div>
                </div>
              </div>

              <div class="tit_area" data-toggle="collapse" data-target="#order_item">
                <h3 class="pay_tit">주문상품 정보 (<span>{{buy.receivers[0].items.length}}</span>)</h3>
              </div>
              <!-- 문제있음 start -->
              <div id="order_item" class="collapse show pay_list_conts">
                <template v-for="(receiver,receiverIndex) in buy.receivers">
                  <template v-for="(shipping,deliveryIndex) in receiver.itemGroups">
                    <div class="pay_list" v-if="shipping.singleShipping">
                      <div class="item_list basic">
                        <div class="list_area">
                          <div class="img_area">
                            <a :href="'/item/' + shipping.buyItem.item.itemUserCode">
                              <img :src="itemImage(shipping.buyItem.item.imageSrc)" :alt="shipping.buyItem.item.imageName" @error="errorImage">
                            </a>
                          </div>
                          <div class="txt_area">
                            <p class="brand">{{unescapeHtml(shipping.buyItem.brand)}}</p>
                            <p class="title">{{unescapeHtml(shipping.buyItem.itemName)}}</p>
                            <p class="option" v-if="shipping.buyItem.options != ''" v-html="unescapeHtml(shipping.buyItem.options)"></p>
                            <p class="gifts" v-if="shipping.buyItem.freeGiftItemText !== null && buy.isLogin">{{unescapeHtml(shipping.buyItem.freeGiftItemText)}}</p>
                            <div class="product_discount_area">
                              <p>상품가 : <span>{{formatNumber(shipping.buyItem.itemPrice.itemSaleAmount)}}원</span></p>
                              <p v-show="(selectedCoupon[shipping.buyItem.itemSequence] != 'clear') || (shipping.buyItem.itemPrice.discountAmount > 0)">
                                할인 :
                                <span>
                                                                    {{formatNumber(shipping.buyItem.itemPrice.discountAmount
                                    + (selectedCoupon[shipping.buyItem.itemSequence] != 'clear' ? selectedCoupon[shipping.buyItem.itemSequence].discountAmount : 0))}}원
                                                                </span>
                                <span class="use" v-show="selectedCoupon[shipping.buyItem.itemSequence] != 'clear'">쿠폰사용</span>
                              </p>
                            </div>
                            <p class="coupon"><span>할인적용가 <span>
                                                            {{selectedCoupon[shipping.buyItem.itemSequence] != 'clear' ? formatNumber(selectedCoupon[shipping.buyItem.itemSequence].couponApplyAmount) : formatNumber(shipping.buyItem.itemPrice.saleAmount)}}원
                                                        </span></span></p>
                          </div>

                          <div class="coupon_amt_area" v-if="buy.isLogin">
                            <div class="amt_area">
                              <p class="amt">수량 : <span>{{shipping.buyItem.itemPrice.quantity}}개</span></p>
                              <button type="button" :class="[shipping.buyItem.itemCoupons !== null ? 'btn_item_coupon' : '', 'btn btn_sm']"
                                      data-toggle="collapse" :data-target="getDataTarget('item',shipping.buyItem.itemSequence)">
                                상품쿠폰적용
                              </button>
                            </div>
                            <div :id="getId('item',shipping.buyItem.itemSequence)" class="collapse coupon_area" v-if="shipping.buyItem.itemCoupons !== null">
                              <dl>
                                <dt><label :for="getId('coupon1',shipping.buyItem.itemSequence)">상품쿠폰</label></dt>
                                <dd>
                                  <select :id="getId('coupon1',shipping.buyItem.itemSequence)" class="custom-select box op-item-coupon">
                                    <option value="clear">쿠폰을 선택해주세요.</option>
                                    <option v-for="coupon in shipping.buyItem.itemCoupons">
                                      {{coupon.couponUserId}}. {{coupon.couponName}}
                                      - {{formatNumber(coupon.discountAmount)}}원 할인
                                      <template v-if="coupon.couponConcurrently == '1'">
                                        [1개 수량만 적용]
                                      </template>
                                      <template v-else>
                                        [구매 수량 할인]
                                      </template>
                                    </option>
                                  </select>
                                </dd>
                              </dl>
                              <div class="btn_wrap">
                                <button type="button" class="btn btn_sm btn_primary" @click="couponSelect(shipping.buyItem.itemSequence)">적용</button>
                                <button type="button" class="btn btn_sm btn_outline_secondary" data-toggle="collapse" :data-target="getDataTarget('item',shipping.buyItem.itemSequence)" @click="couponCancel(shipping.buyItem.itemSequence)">취소</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <dl class="delv_ship">
                        <dt>배송비정보<button type="button" data-toggle="modal" v-if="hasShippingInfo(shipping)" @click.prevent="showShippingInfoLayer(shipping)">조건부 무료배송</button></dt>
                        <dd><b>{{getShippingInfo(receiverIndex,shipping.shippingSequence)}}</b>

                          <div class="check_area" v-if="canApplyShippingCoupon(shipping)">
                            <input type="checkbox" :id="'deli_check' + shipping.shippingSequence" v-model="shippingCouponSequences" :value="shipping.shippingSequence" @change.prevent="applyShippingCoupon(shipping)" title="선택">
                            <label :for="'deli_check' + shipping.shippingSequence">배송비 쿠폰</label>
                          </div>
                        </dd>
                      </dl><!--// delv_ship -->
                    </div>
                    <div class="pay_list" v-else>
                      <div class="item_list basic">
                        <div class="list_area" v-for="(data,index) in shipping.buyItems">
                          <div class="img_area">
                            <a :href="'/item/' + data.item.itemUserCode">
                              <img :src="itemImage(data.item.imageSrc)" alt="data.item.imageName" @error="errorImage">
                            </a>
                          </div>
                          <div class="txt_area">
                            <p class="brand">{{unescapeHtml(data.brand)}}</p>
                            <p class="title">{{unescapeHtml(data.itemName)}}</p>
                            <p class="option" v-if="data.options != ''" v-html="unescapeHtml(data.options)"></p>
                            <p class="gifts" v-if="data.freeGiftItemText !== null && buy.isLogin">{{unescapeHtml(data.freeGiftItemText)}}</p>
                            <div class="product_discount_area">
                              <p>상품가 : <span>{{formatNumber(data.itemPrice.itemSaleAmount)}}원</span></p>
                              <p v-show="selectedCoupon[data.itemSequence] != 'clear'">
                                할인 : <span>{{selectedCoupon[data.itemSequence].discountAmount}}</span>
                                <span class="use" v-show="selectedCoupon[data.itemSequence] != 'clear'">쿠폰사용</span>
                              </p>
                            </div>
                            <p class="coupon"><span>할인적용가 <span>
                                                            {{selectedCoupon[data.itemSequence] != 'clear' ? formatNumber(selectedCoupon[data.itemSequence].couponApplyAmount) : formatNumber(data.itemPrice.saleAmount)}}원
                                                        </span></span></p>
                          </div>
                          <div class="coupon_amt_area" v-if="buy.isLogin">
                            <div class="amt_area">
                              <p class="amt">수량 : <span>{{data.itemPrice.quantity}}개</span></p>
                              <button type="button" :class="[data.itemCoupons !== null ? 'btn_item_coupon' : '', 'btn btn_sm']"
                                      data-toggle="collapse" :data-target="getDataTarget('item',data.itemSequence)">
                                상품쿠폰적용
                              </button>
                            </div>
                            <div :id="getId('item',data.itemSequence)" class="collapse coupon_area" v-if="data.itemCoupons !== null">
                              <dl>
                                <dt><label :for="getId('coupon1',data.itemSequence)">상품쿠폰</label></dt>
                                <dd>
                                  <select :id="getId('coupon1',data.itemSequence)" class="custom-select box op-item-coupon">
                                    <option value="clear">쿠폰을 선택해주세요.</option>
                                    <option v-for="coupon in data.itemCoupons">
                                      {{coupon.couponUserId}}. {{coupon.couponName}}
                                      - {{formatNumber(coupon.discountAmount)}}원 할인
                                      <template v-if="coupon.couponConcurrently == '1'">
                                        [1개 수량만 적용]
                                      </template>
                                      <template v-else>
                                        [구매 수량 할인]
                                      </template>
                                    </option>
                                  </select>
                                </dd>
                              </dl>
                              <div class="btn_wrap">
                                <button type="button" class="btn btn_sm btn_primary" @click="couponSelect(data.itemSequence)">적용</button>
                                <button type="button" class="btn btn_sm btn_outline_secondary" data-toggle="collapse" :data-target="getDataTarget('item',data.itemSequence)" @click="couponCancel(data.itemSequence)">취소</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <dl class="delv_ship">
                        <dt>배송비정보<button type="button" data-toggle="modal" v-if="hasShippingInfo(shipping)" @click.prevent="showShippingInfoLayer(shipping)">조건부 무료배송</button></dt>
                        <dd><b>{{getShippingInfo(receiverIndex,shipping.shippingSequence)}}</b>

                          <div class="check_area" v-if="canApplyShippingCoupon(shipping)">
                            <input type="checkbox" :id="'deli_check' + shipping.shippingSequence" v-model="shippingCouponSequences" :value="shipping.shippingSequence" @change.prevent="applyShippingCoupon(shipping)" title="선택">
                            <label :for="'deli_check' + shipping.shippingSequence">배송비 쿠폰</label>
                          </div>
                        </dd>
                      </dl><!--// delv_ship -->
                    </div>
                  </template>
                </template>
              </div>
              <!-- 문제있음 end -->
            </div>
            <div class="pay_area">
              <div class="tit_area" data-toggle="collapse" data-target="#order_info">
                <h3 class="pay_tit">주문자 정보</h3>
              </div>
              <div id="order_info" class="collapse show pay_conts">
                <div class="form_wrap_line">
                  <div class="form-group">
                    <input type="text" class="form-control line required" placeholder="이름" title="이름" v-model="buy.buyer.userName" required>
                  </div>
                  <template v-if="buy.isLogin">
                    <div class="form-group address_area">
                      <div class="input" id="orderAddress" v-html="searchAddress.order.addressInfo"></div>
                      <span id="order_address_placeholder" class="placeholder"></span>
                      <button type="button" class="btn_address" @click="openDaumPostcode('order')"><img class="img-fluid" src="/static/images/icon/btn_address.png" alt="주소찾기"></button>
                    </div>
                    <div class="form-group">
                      <input type="text" class="form-control line" placeholder="상세주소" title="상세주소" v-model="buy.buyer.addressDetail" required>
                    </div>
                  </template>

                  <div class="form-group phone_area">
                    <div class="row no-gutters">
                      <div class="col-4 col-md-2">
                        <select class="custom-select line" v-model="buy.buyer.mobile1" @change="setMobile('order')" required>
                          <option v-for="code in phoneCodes" :value="code.detail">{{code.label}}</option>
                        </select>
                      </div>
                      <div class="col-8 col-md-10">
                        <input type="number" class="form-control line" placeholder="'-'없이 숫자만 입력" title="'-'없이 숫자만 입력" @change="setLastBuyerMobile($event)" v-model="searchAddress.order.mobile" required>
                        <div class="invalid-feedback">{{validate.lastPhoneMessage}}</div>
                      </div>
                    </div>
                  </div>
                  <!--<div class="form-group phone_area">
                      <div class="row no-gutters">
                          <div class="col-4 col-md-2">
                              <select class="custom-select line" v-model="buy.buyer.phone1" @change="setPhone('order')">
                                  <option v-for="code in telCodes" :value="code.detail">{{code.label}}</option>
                              </select>
                          </div>
                          <div class="col-8 col-md-10">
                              <input type="number" class="form-control line" placeholder="'-'없이 숫자만 입력" title="'-'없이 숫자만 입력" @change="valid($event, validate.lastPhone)" v-model="searchAddress.order.phone" @change="setPhone('order')">
                              <div class="invalid-feedback">{{validate.lastPhoneMessage}}</div>
                          </div>
                      </div>
                  </div>-->
                  <div class="form-group">
                    <input type="text" class="form-control line" placeholder="이메일" title="이메일" @change="valid($event, validate.email)" v-model="buy.buyer.email" required>
                    <div class="invalid-feedback">{{validate.emailMessage}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pay_area">
              <div class="tit_area" data-toggle="collapse" data-target="#ship_info">
                <h3 class="pay_tit">배송지 정보</h3>
              </div>
              <div id="ship_info" class="collapse show pay_conts">
                <div class="ship_new">
                  <!--<p class="info">최대 10곳까지 가능</p>
                  <div class="ship_top">
                      <div class="box_area">
                          <select class="custom-select box_s">
                              <option value="">1개</option>
                          </select>
                          <button type="button" class="btn btn_sm btn_light" data-toggle="modal" data-target=".pop_multi_destin">복수배송지 선택</button>
                      </div>
                  </div>-->
                  <div class="radio_wrap" v-if="buy.isLogin">
                    <div class="radio_area" v-show="buy.defaultUserDelivery != ''">
                      <input type="radio" id="ship_check1" name="ship_check" @click="copyDeliveryInfoCopy('default-0', $event)" checked="checked">
                      <label for="ship_check1">기본</label>
                    </div>
                    <div class="radio_area">
                      <input type="radio" id="ship_check2" name="ship_check" @click="copyDeliveryInfoCopy('clear-0', $event)">
                      <label for="ship_check2">새로운 배송지</label>
                    </div>
                    <div class="radio_area">
                      <input type="radio" id="ship_check3" name="ship_check" @click="copyDeliveryInfoCopy('copy-0', $event)">
                      <label for="ship_check3">주문자정보와 동일</label>
                    </div>
                  </div>
                  <div v-else>
                    <div class="check_area pay_check">
                      <input type="checkbox" id="order" @click="copyDeliveryInfoCopy('copy-0', $event)">
                      <label for="order">주문자와 동일</label>
                    </div>
                  </div>
                  <div class="form_wrap_line">
                    <ul>
                      <li class="form_area">
                        <div class="form-group">
                          <input type="text" class="form-control line" placeholder="받는사람 이름" title="받는사람 이름" v-model="buy.receivers[0].receiveName" required>
                        </div>
                        <div class="form-group address_area">
                          <div class="input" id="receiveAddress" v-html="searchAddress.receivers[0].addressInfo"></div>
                          <span id="receive0_address_placeholder" class="placeholder"></span>
                          <button type="button" class="btn_address" @click="openDaumPostcode('receive',0)" :disabled="isDisabled"><img class="img-fluid" src="/static/images/icon/btn_address.png" alt="주소찾기"></button>
                        </div>
                        <div class="form-group">
                          <input type="text" class="form-control line" placeholder="상세주소" title="상세주소" v-model="buy.receivers[0].receiveAddressDetail" :readonly="isReadOnly" required>
                        </div>
                        <div class="form-group phone_area">
                          <div class="row no-gutters">
                            <div class="col-4 col-md-2">
                              <select class="custom-select line" @change="setMobile('receive',0)" v-model="buy.receivers[0].receiveMobile1" required>
                                <option v-for="code in phoneCodes" :value="code.detail">{{code.label}}</option>
                              </select>
                            </div>
                            <div class="col-8 col-md-10">
                              <input type="number" class="form-control line" placeholder="'-'없이 숫자만 입력" title="'-'없이 숫자만 입력" @change="valid($event, validate.lastPhone)" v-model="searchAddress.receivers[0].mobile" @keyDown="setMobile('receive',0)" required>
                              <div class="invalid-feedback">{{validate.lastPhoneMessage}}</div>
                            </div>
                          </div>
                        </div>
                        <div class="form-group">
                          <input type="text" class="form-control line" placeholder="메시지 직접입력" title="메시지 직접입력" v-model="buy.receivers[0].content">
                        </div>
                        <div class="btn_right" v-if="buy.isLogin">
                          <button type="button" class="btn btn_sm btn_default" data-toggle="modal" data-target=".pop_deli_list">배송지 목록</button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="pay_area">
              <div class="tit_area" data-toggle="collapse" data-target="#pay_method">
                <h3 class="pay_tit">결제방법</h3>
              </div>
              <div id="pay_method" class="collapse show pay_conts">
                <div class="method_area">
                  <ul class="nav nav-pills">
                    <li class="nav-item" v-if="buy.buyPayments['bank'] != undefined" @click="payTypeSelect('bank')"><a href="#method1" :class="payType === 'bank' ? 'nav-link active' : 'nav-link'" data-toggle="pill"><span>무통장입금</span></a></li>
                    <li class="nav-item" v-if="buy.buyPayments['card'] != undefined" @click="payTypeSelect('card')"><a href="#method2" :class="payType === 'card' ? 'nav-link active' : 'nav-link'" data-toggle="pill"><span>신용카드</span></a></li>
                    <li class="nav-item" v-if="buy.buyPayments['vbank'] != undefined" @click="payTypeSelect('vbank')"><a href="#method3" :class="payType === 'vbank' ? 'nav-link active' : 'nav-link'" data-toggle="pill"><span>가상계좌</span></a></li>
                    <li class="nav-item" v-if="buy.buyPayments['hp'] != undefined" @click="payTypeSelect('hp')"><a href="#method4" :class="payType === 'hp' ? 'nav-link active' : 'nav-link'" data-toggle="pill"><span>휴대전화</span></a></li>
                    <li class="nav-item" v-if="buy.buyPayments['realtimebank'] != undefined" @click="payTypeSelect('realtimebank')"><a href="#method5" :class="payType === 'realtimebank' ? 'nav-link active' : 'nav-link'" data-toggle="pill"><span>실시간 <br class="mobile">계좌이체</span></a></li>
                    <li class="nav-item" v-if="buy.buyPayments['naverpay'] != undefined && this.isUseNpayPayment == true" @click="payTypeSelect('naverpay')"><a href="#method6" :class="payType === 'naverpay' ? 'nav-link active' : 'nav-link'" data-toggle="pill"><span>네이버페이</span></a></li>
                    <!--<li class="nav-item" v-if="buy.buyPayments['kakaopay'] != undefined" @click="payTypeSelect('kakaopay')"><a href="#method7" :class="payType === 'kakaopay' ? 'nav-link active' : 'nav-link'" data-toggle="pill"><span>카카오페이</span></a></li>-->
                  </ul>
                  <div class="tab-content">
                    <div id="method1" v-if="buy.buyPayments['bank'] != undefined" :class="payType === 'bank' ? 'tab-pane fade show active' : 'tab-pane fade'">
                      <div class="info_dot">
                        <p>무통장 입금시 발생하는 수수료는 손님 부담입니다.</p>
                        <p>인터넷 뱅킹 또는 은행창구 입금시 의뢰인(송금인)명은 ‘입금인 입력’란에 입금하신 성함과 동일하게 기재해 주시기 바랍니다. ( 만약 다를 경우 고객센터 1234-5678로 꼭 연락주시기 바랍니다.)</p>
                        <p>무통장 입금시 입금자와 입금 예정일을 입력해주세요.</p>
                        <p>현금영수증 미신청시 현금영수증 발급이 되지 않습니다.</p>
                      </div>
                      <div class="bank_deposit_area">
                        <dl>
                          <dt>입금은행</dt>
                          <dd>
                            <select class="custom-select box" v-model="buy.buyPayments['bank'].bankVirtualNo">
                              <option disabled value="">선택</option>
                              <option v-for="(list,index) in buy.buyPayments['bank'].accountNumbers">
                                {{list.bankName + ' 계좌번호: ' + list.accountNumber +'(' + list.accountHolder + ')'}}
                              </option>
                            </select>
                          </dd>
                        </dl>
                        <dl>
                          <dt>입금자명</dt>
                          <dd>
                            <input type="text" class="form-control line" placeholder="입금자명" title="입금자명" v-model="buy.buyPayments['bank'].bankInName">
                          </dd>
                        </dl>
                        <dl>
                          <dt>입금예정일</dt>
                          <dd>
                            <select class="custom-select box" v-model="buy.buyPayments['bank'].bankExpirationDate">
                              <option disabled value="">선택</option>
                              <option :value="date" v-for="date in buy.buyPayments['bank'].expirationDates">{{dateFormat(date, 'date')}}</option>
                            </select>
                          </dd>
                        </dl>
                        <dl v-show="useEscrow == 'Y' && (payType == 'vbank' || payType == 'card')">
                          <dt>에스크로 결제 여부</dt>
                          <dd>
                            <div class="radio_area">
                              <input type="radio" id="yes" name="yesno">
                              <label for="yes">예</label>
                            </div>
                            <div class="radio_area">
                              <input type="radio" id="no" name="yesno">
                              <label for="no">아니오</label>
                            </div>
                          </dd>
                        </dl>
                        <dl v-if="payType === 'bank'">
                          <dt>현금영수증 신청</dt>
                          <dd>
                            <div class="radio_area" v-for="(data,index) in cashbillTypes">
                              <input type="radio" :id="getId('cashbill',index)" name="cash_receipts" :value="data.code" :checked="data.code == 'NONE'" v-model="buy.cashbill.cashbillType">
                              <label :for="getId('cashbill',index)">{{data.title}}</label>
                            </div>
                            <div class="mt10 cashbill_number" v-if="buy.cashbill.cashbillType  !== 'NONE'">
                              <input type="number" class="form-control line" placeholder="휴대전화 또는 사업자등록번호를 숫자만 입력해주세요" title="휴대전화 또는 사업자등록번호를 숫자만 입력해주세요" v-model="buy.cashbill.cashbillCode" @change="valid($event, validate.numberOnly)">
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div id="method2" v-if="buy.buyPayments['card'] != undefined" :class="payType === 'card' ? 'tab-pane fade show active' : 'tab-pane fade'">
                      <div class="info_dot">
                        <p>MAC 환경에서도 신용카드 결제가 가능합니다.(ISP 결제 제외)</p>
                        <p>국내 모든 카드 사용이 가능하며 해외에서 발행된 카드는 이용하실수 없습니다. </p>
                        <p>금요일 오후 6시~ 일요일 주문은 결제 완료 후 취소 요청시 고객
                          센터 > 주문취소를 이용하시면 됩니다.</p>
                      </div>
                    </div>
                    <div id="method3" v-if="buy.buyPayments['vbank'] != undefined" :class="payType === 'vbank' ? 'tab-pane fade show active' : 'tab-pane fade'">
                      <div class="info_dot">
                        <p>가상계좌 입금시 발생하는 수수료는 손님 부담입니다.</p>
                        <p>인터넷 뱅킹 또는 은행창구 입금시 의뢰인(송금인)명은 ‘입금인 입력’란에 입금하신 성함과 동일하게 기재해 주시기 바랍니다. ( 만약 다를 경우 고객센터 1234-5678로 꼭 연락주시기 바랍니다.)</p>
                        <p>가상계좌 입금시 입금자와 입금 예정일을 입력해주세요.</p>
                        <p>현금영수증 미신청시 현금영수증 발급이 되지 않습니다.</p>
                      </div>
                      <div class="bank_deposit_area">
                        <dl v-if="payType === 'vbank' && autoCashReceipt == 'N'">
                          <dt>현금영수증 신청</dt>
                          <dd>
                            <div class="radio_area" v-for="(data,index) in cashbillTypes">
                              <input type="radio" :id="getId('cashbill',index)" name="cash_receipts" :value="data.code" :checked="data.code == 'NONE'" v-model="buy.cashbill.cashbillType">
                              <label :for="getId('cashbill',index)">{{data.title}}</label>
                            </div>
                            <div class="mt10 cashbill_number" v-if="buy.cashbill.cashbillType  !== 'NONE'">
                              <input type="number" class="form-control line" placeholder="휴대전화 또는 사업자등록번호를 숫자만 입력해주세요" title="휴대전화 또는 사업자등록번호를 숫자만 입력해주세요" v-model="buy.cashbill.cashbillCode" @change="valid($event, validate.numberOnly)">
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div id="method4" v-if="buy.buyPayments['hp'] != undefined" :class="payType === 'hp' ? 'tab-pane fade show active' : 'tab-pane fade'">
                      <div class="info_dot">
                        <p>휴대폰으로 결제하신 금액은 익월 휴대폰 요금에 함께 청구되며 별도의 수수료는 부과되지 않습니다.</p>
                        <p>휴대폰 소액결제로 구매하실 경우 현금영수증이 발급되지 않습니다.</p>
                        <p>다음의 경우에는 휴대폰 결제를 이용하실 수 없습니다.</p>
                        <ul>
                          <li>- 미납/체납 중인 휴대폰 요금이 있을 경우</li>
                          <li>- 이동통신사 가입기간(번호이동포함) 6개월 이하인 경우</li>
                          <li>- 외국인, 미성년자 요금제, 법인휴대폰, 선불요금제인 경우</li>
                          <li>- LGT 이용자 중 통신사로 [자동결제] 차단 신청하신 경우</li>
                        </ul>
                        <p>휴대폰으로 결제 가능한 최대 금액은 월 30만원 이며 개인별 한도 금액은 통신사 및 개인 설정에 따라 다를 수 있습니다.</p>
                        <p>휴대폰으로 결제하신 금액은 익월 휴대폰 요금에 함께 청구되며 별도의 수수료는 부과되지 않습니다.</p>
                        <ul>
                          <li>- 결제 당월 취소/반품/품절환불 : 휴대폰 이용요금에 부과예정이던 금액이 취소됩니다.</li>
                          <li>- 결제 당월 지난 후 취소/반품/품절환불 : 환불계좌 확인 후 무통장 계좌로</li>
                        </ul>
                        <p>휴대폰결제관련 문의사항은 LG유플러스전자결제 고객센터 1544-7772 또는 29CM 1644-0560으로 연락해주시기 바랍니다.</p>
                      </div>
                    </div>
                    <div id="method5" v-if="buy.buyPayments['realtimebank'] != undefined" :class="payType === 'realtimebank' ? 'tab-pane fade show active' : 'tab-pane fade'">
                      <div class="info_dot">
                        <p>실시간 이체 결제시 화면 아래 '결제하기'버튼을 클릭하시면 실시간 이체 결제 창이 나타납니다.</p>
                        <p>실시간 이체 결제 창을 통해 입력되는 고객님의 정보는 128bit로 안전하게 암호화되어 전송되며 승인 처리 후 정보는 승인 성공/ 실패 여부에 상관없이 자동 으로 폐기되므로, 안전합니다.</p>
                        <p>실시간 이체 결제 신청시 승인 진행에 다소 시간이 소요될 수 있으므로 '중지', '새로고침'을 누르지 마시고 결과 화면이 나타 날때까지 기다려 주십시오.</p>
                        <p>신용카드/ 실시간 이체는 결제 후, 무통장입금은 입금확인 후 배송이 이루어집니다.</p>
                        <p>금요일 오후 6시 ~ 일요일 주문은 결제완료 후 취소요청시, [고객센터]-[주문취소]를 이용하시면 됩니다. (상품출고는 토요일에도 정상적으로 이루어집니다.)</p>
                        <p>온라인 실시간 계좌 이체 서비스는 은행계좌만 있으면 누구나 이용하실 수 있는 서비스로, 별도의 신청없이 그 대금을 자신의 거래은행의 계좌로부터 바로 지불하는 서비스입니다.
                          <br>안전한 거래를 위해 결제시 공인인증서가 반드시 필요합니다.
                          <br>은행 이용가능 서비스 시간은 은행사정에 따라 다소 변동될수 있습니다.
                        </p>
                        <p>현금영수증 미신청시 현금영수증 발급이 되지 않습니다.</p>
                      </div>
                      <div class="bank_deposit_area">
                        <dl v-if="payType === 'realtimebank' && autoCashReceipt == 'N'">
                          <dt>현금영수증 신청</dt>
                          <dd>
                            <div class="radio_area" v-for="(data,index) in cashbillTypes">
                              <input type="radio" :id="getId('cashbill',index)" name="cash_receipts" :value="data.code" :checked="data.code == 'NONE'" v-model="buy.cashbill.cashbillType">
                              <label :for="getId('cashbill',index)">{{data.title}}</label>
                            </div>
                            <div class="mt10 cashbill_number" v-if="buy.cashbill.cashbillType  !== 'NONE'">
                              <input type="number" class="form-control line" placeholder="휴대전화 또는 사업자등록번호를 숫자만 입력해주세요" title="휴대전화 또는 사업자등록번호를 숫자만 입력해주세요" v-model="buy.cashbill.cashbillCode" @change="valid($event, validate.numberOnly)">
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div id="method6" v-if="buy.buyPayments['naverpay'] != undefined" :class="payType === 'naverpay' ? 'tab-pane fade show active' : 'tab-pane fade'">
                      <div class="info_dot">
                        <p>
                          · 주문 변경 시 카드사 혜택 및 할부 적용 여부는 해당 카드사 정책에 따라 변경될 수 있습니다.<br>
                          · 네이버페이는 네이버ID로 별도 앱 설치 없이 신용카드 또는 은행계좌 정보를 등록하여 네이버페이 비밀번호로 결제할 수 있는 간편결제 서비스입니다.<br>
                          · 결제 가능한 신용카드: 신한, 삼성, 현대, BC, 국민, 하나, 롯데, NH농협, 씨티, 카카오뱅크<br>
                          · 결제 가능한 은행: NH농협, 국민, 신한, 우리, 기업, SC제일, 부산, 경남, 수협, 우체국, 미래에셋대우, 광주, 대구, 전북, 새마을금고, 제주은행, 신협, 하나은행, 케이뱅크, 카카오뱅크, 삼성증권, KDB산업은행,씨티은행, SBI은행, 유안타증권<br>
                          · 네이버페이 카드 간편결제는 네이버페이에서 제공하는 카드사 별 무이자, 청구할인 혜택을 받을 수 있습니다.<br>
                        </p>
                      </div>
                    </div>
                    <!--                                        <div id="method7" v-if="buy.buyPayments['kakaopay'] != undefined" :class="payType === 'kakaopay' ? 'tab-pane fade show active' : 'tab-pane fade'">-->
                    <!--                                            <div class="info_dot">-->
                    <!--                                                <p>카카오페이 간편결제 혜택 및 할부 적용 여부는 해당 카드사 정책에 따라 변경될 수 있습니다.-->
                    <!--                                                    <br>자세한 내용은 카카오페이에서 제공하는 카드사별 정책을 확인해주세요.</p>-->
                    <!--                                            </div>-->
                    <!--                                        </div>-->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="container">
            <div class="pay_total">
              <div class="total_bg">
                <div class="top">
                  <span></span>
                </div>
                <div class="bot">
                  <span></span>
                </div>
              </div>
              <h3 class="total_tit">최종 결제 금액 <strong><span class="counter">{{formatNumber(order.buy.orderPayAmount)}}</span>원</strong></h3>
              <div class="price_area total">
                <dl class="row no-gutters">
                  <dt class="col-6"><span>총 상품금액</span></dt>
                  <dd class="col-6"><span id="op-total-item-sale-amount-text">{{formatNumber(order.buy.totalItemPrice)}}</span> 원</dd>
                </dl>
              </div>
              <div v-if="order.buy.totalSetDiscountAmount > 0" class="price_area">
                <dl class="row no-gutters">
                  <dt class="col-6"><span>세트할인</span></dt>
                  <dd class="col-6"><span>{{formatNumber(order.buy.totalSetDiscountAmount)}}</span> 원</dd>
                </dl>
              </div>
              <div class="price_area" v-if="order.buy.totalItemDiscountAmount > 0">
                <dl class="row no-gutters">
                  <dt class="col-6"><span>상품할인</span></dt>
                  <dd class="col-6"><span>{{formatNumber(order.buy.totalItemDiscountAmount)}}</span> 원</dd>
                </dl>
              </div>
              <div class="price_area" v-if="buy.isLogin">
                <dl class="row no-gutters">
                  <dt class="col-6"><span>회원할인</span></dt>
                  <dd class="col-6">
                    <p><span>{{formatNumber(order.buy.totalUserLevelDiscountAmount)}}</span> 원</p>
                  </dd>
                </dl>
              </div>
              <div class="price_area">
                <dl class="row no-gutters">
                  <dt class="col-6"><span>배송비</span></dt>
                  <dd class="col-6">
                    <p><span>{{formatNumber(order.buy.totalShippingAmount + order.buy.totalShippingCouponDiscountAmount)}}</span> 원</p>
                  </dd>
                </dl>
              </div>
              <div class="price_area" v-if="order.buy.totalShippingCouponDiscountAmount > 0">
                <dl class="row no-gutters">
                  <dt class="col-6"><span>배송비할인</span></dt>
                  <dd class="col-6"><span>{{formatNumber(order.buy.totalShippingCouponDiscountAmount)}}</span> 원</dd>
                </dl>
              </div>
              <div class="price_area point" v-if="buy.isLogin">
                <dl class="row no-gutters">
                  <dt class="col-6"><span>포인트</span>
                    <button type="button" class="btn btn_sm btn_outline_secondary" :disabled="buy.retentionPoint <= 0"  @click="useAllPoint">모두사용</button>
                  </dt>
                  <dd class="col-6">
                    <p><input type="text" class="form-control box " placeholder="0" v-model.number.lazy="usePoint" @change="valid($event, validate.number)"> 원</p>
                  </dd>
                </dl>
                <p class="explain">잔여 포인트 {{formatNumber(retentionPointText)}}원</p>
              </div>
              <div class="price_area" v-if="order.buy.totalItemCouponDiscountAmount > 0">
                <dl class="row no-gutters">
                  <dt class="col-6"><span>쿠폰할인</span></dt>
                  <dd class="col-6">
                    <p><span>{{formatNumber(order.buy.totalItemCouponDiscountAmount + order.buy.totalCartCouponDiscountAmount)}}</span> 원</p>
                  </dd>
                </dl>
              </div>
              <p class="info"><span>적립예정 포인트 {{formatNumber(order.buy.totalEarnPoint)}}</span> P</p>
            </div>
            <div class="pay_bot">
              <div class="check_area lg">
                <input type="checkbox" id="agree">
                <label for="agree">주문할 상품의 상품명, 상품가격, 배송 정보를 확인하였으며, 구매에 동의 하시겠습니까?</label>
              </div>
              <!--                            <div class="agree_area">-->
              <!--                                <button type="button" class="btn_agree">내용보기</button>-->
              <!--                            </div>-->
              <div class="row no-gutters btn-group">
                <div class="col-12 col-md-6 col-lg-4" v-if="payType != 'naverpay'">
                  <button type="submit" class="btn btn_lg btn_primary"><span>{{formatNumber(order.buy.orderPayAmount)}}</span>원 결제하기</button>
                </div>
                <div class="npay_type1 col-12 col-md-6 col-lg-5 col-xl-4" v-else>
                  <td class="npay_btn_item">
                    <button type="submit" id="naverPayBtn" class="npay_btn_link npay_btn_pay btn_green"
                            style="width: 100%;
                                                height: 50px !important;
                                                background-position: 50% -30px !important;">
                    </button>
                  </td>
                </div>
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </form>

    <!-- 복수배송지등록 레이어-->
    <div class="modal fade modal_full pop_multi_destin">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal_tit">복수배송지 등록</h3>
          </div>
          <div class="modal-body">
            <div class="multi_deli_list">
              <div class="deli_area">
                <p class="deli_tit">배송지 <span>1</span></p>
                <div class="item_list basic">
                  <div class="list_area">
                    <div class="img_area">
                      <a href="#">
                        <img src="/static/images/thumb.png" alt="썸네일">
                      </a>
                    </div>
                    <div class="txt_area">
                      <p class="brand">브랜드명</p>
                      <p class="title"><span>보브 하운드투스 체크 린넨 블렌드 자켓 체크 린넨 블렌드 자켓</span></p>
                      <p class="option">옵션이 노출되는 공간입니다</p>
                      <div class="sale_area">
                        <p class="price"><span>123,000</span> / <span>1</span>개</p>
                      </div>
                    </div>
                    <div class="btn_right">
                      <select class="custom-select box_s">
                        <option value="">1개</option>
                      </select>
                    </div>
                  </div>
                  <div class="list_area">
                    <div class="img_area">
                      <a href="#">
                        <img src="/static/images/thumb.png" alt="썸네일">
                      </a>
                    </div>
                    <div class="txt_area">
                      <p class="brand">브랜드명</p>
                      <p class="title"><span>보브 하운드투스 체크 린넨 블렌드 자켓 체크 린넨 블렌드 자켓</span></p>
                      <p class="option">옵션이 노출되는 공간입니다</p>
                      <div class="sale_area">
                        <p class="price"><span>123,000</span> / <span>1</span>개</p>
                      </div>
                    </div>
                    <div class="btn_right">
                      <select class="custom-select box_s">
                        <option value="">1개</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="radio_wrap">
                  <div class="radio_area">
                    <input type="radio" id="ship_check1-1" name="ship_check">
                    <label for="ship_check1-1">기본</label>
                  </div>
                  <div class="radio_area">
                    <input type="radio" id="ship_check1-2" name="ship_check">
                    <label for="ship_check1-2">새로운 배송지</label>
                  </div>
                  <div class="radio_area">
                    <input type="radio" id="ship_check1-3" name="ship_check">
                    <label for="ship_check1-3">주문자정보와 동일</label>
                  </div>
                </div>
                <div class="form_wrap_line">
                  <div class="form-group">
                    <input type="text" class="form-control line" placeholder="받는사람 이름" title="받는사람 이름">
                  </div>
                  <div class="form-group address_area">
                    <div class="input"></div>
                    <span class="placeholder">우편번호 찾기</span>
                    <button type="button" class="btn_address"><img class="img-fluid" src="/static/images/icon/btn_address.png" alt="주소찾기"></button>
                  </div>
                  <div class="form-group">
                    <input type="text" class="form-control line" placeholder="상세주소" title="상세주소">
                  </div>
                  <div class="form-group phone_area">
                    <div class="row no-gutters">
                      <div class="col-4 col-md-3">
                        <select class="custom-select line">
                          <option value="">010</option>
                        </select>
                      </div>
                      <div class="col-8 col-md-9">
                        <input type="number" class="form-control line" placeholder="'-'없이 숫자만 입력" title="'-'없이 숫자만 입력">
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <input type="text" class="form-control line" placeholder="배송 메모를 입력하세요" title="배송 메모를 입력하세요">
                  </div>
                  <div class="btn_right">
                    <button type="button" class="btn btn_sm btn_default">배송지 목록</button>
                  </div>
                </div>
              </div>
              <div class="deli_area">
                <p class="deli_tit">배송지 <span>2</span></p>
                <div class="item_list basic">
                  <div class="list_area">
                    <div class="img_area">
                      <a href="#">
                        <img src="/static/images/thumb.png" alt="썸네일">
                      </a>
                    </div>
                    <div class="txt_area">
                      <p class="brand">브랜드명</p>
                      <p class="title"><span>보브 하운드투스 체크 린넨 블렌드 자켓 체크 린넨 블렌드 자켓</span></p>
                      <p class="option">옵션이 노출되는 공간입니다</p>
                      <div class="sale_area">
                        <p class="price"><span>123,000</span> / <span>1</span>개</p>
                      </div>
                    </div>
                    <div class="btn_right">
                      <select class="custom-select box_s">
                        <option value="">1개</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="radio_wrap">
                  <div class="radio_area">
                    <input type="radio" id="ship_check2-1" name="ship_check">
                    <label for="ship_check2-1">기본</label>
                  </div>
                  <div class="radio_area">
                    <input type="radio" id="ship_check2-2" name="ship_check">
                    <label for="ship_check2-2">새로운 배송지</label>
                  </div>
                  <div class="radio_area">
                    <input type="radio" id="ship_check2-3" name="ship_check">
                    <label for="ship_check2-3">주문자정보와 동일</label>
                  </div>
                </div>
                <div class="form_wrap_line">
                  <div class="form-group">
                    <input type="text" class="form-control line" placeholder="받는사람 이름" title="받는사람 이름">
                  </div>
                  <div class="form-group address_area">
                    <div class="input"></div>
                    <span class="placeholder">우편번호 찾기</span>
                    <button type="button" class="btn_address"><img class="img-fluid" src="/static/images/icon/btn_address.png" alt="주소찾기"></button>
                  </div>
                  <div class="form-group">
                    <input type="text" class="form-control line" placeholder="상세주소" title="상세주소">
                  </div>
                  <div class="form-group phone_area">
                    <div class="row no-gutters">
                      <div class="col-4 col-md-3">
                        <select class="custom-select line">
                          <option value="">010</option>
                        </select>
                      </div>
                      <div class="col-8 col-md-9">
                        <input type="number" class="form-control line" placeholder="'-'없이 숫자만 입력" title="'-'없이 숫자만 입력">
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <input type="text" class="form-control line" placeholder="배송 메모를 입력하세요" title="배송 메모를 입력하세요">
                  </div>
                  <div class="btn_right">
                    <button type="button" class="btn btn_sm btn_default">배송지 목록</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="row no-gutters btn-group">
              <div class="col col-md-4">
                <button type="button" class="btn btn_lg btn_default">취소하기</button>
              </div>
              <div class="col col-md-4">
                <button type="button" class="btn btn_lg btn_primary">적용하기</button>
              </div>
            </div>
          </div>
          <button type="button" class="modal_close" data-dismiss="modal">
            <span class="screen_out">복수배송지등록 닫기</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 배송지목록 레이어 -->
    <div class="modal fade modal_full pop_deli_list">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal_tit">배송지목록</h3>
          </div>
          <div class="modal-body">
            <div class="delivery_list">
              <ul>
                <li v-for="(data,deliveryIndex) in userDeliveryList">
                  <div class="radio_area">
                    <input type="radio" name="deli_radio" :id="getId('shipCheck',deliveryIndex)" title="선택" :value="deliveryIndex" v-model="selectedDeliveryIndex">
                    <label :for="getId('shipCheck',deliveryIndex)"></label>
                  </div>
                  <div class="txt_area">
                    <p class="name">[<span>{{unescapeHtml(data.title)}}</span>] {{unescapeHtml(data.userName)}}</p>
                    <p class="address">{{unescapeHtml(data.address)}}
                      <br class="mobile">{{unescapeHtml(data.addressDetail)}}</p>
                    <p class="phone"><span>{{data.mobile}}</span></p>
                  </div>
                </li>
              </ul>
              <div class="row no-gutters btn-group">
                <!--                                <div class="col col-md-4">-->
                <!--                                    <button type="button" class="btn btn_lg btn_default">기본배송지 설정</button>-->
                <!--                                </div>-->
                <div class="col col-md-8">
                  <button type="button" id="select_delivery" class="btn btn_lg btn_primary" @click="setDelivery" data-dismiss="modal" disabled>배송지로 선택</button>
                </div>
              </div>
              <div class="link_deli_add">
                <a href="/mypage/delivery">배송지 추가</a>
              </div>
            </div>
          </div>
          <button type="button" class="modal_close" data-dismiss="modal">
            <span class="screen_out">배송지목록 닫기</span>
          </button>
        </div>
      </div>
    </div>

    <!--// 조건부무료배송 레이어팝업 -->
    <div id="op-shipping-info-layer" class="modal fade pop_condi_ship">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <dl class="condi_ship_txt">
              <dt>{{shippingTypeText(shippingInfo.shippingType)}} 조건부 무료배송</dt>
              <dd>{{deliveryText(shippingInfo.shippingType)}} 상품 {{formatNumber(shippingInfo.shippingFreeAmount)}}원 이상 구매 시 무료, 미만 구매시 {{formatNumber(shippingInfo.shipping)}}원 부과</dd>
              <dt v-if="shippingInfo.isExtraCharge">제주/도서산간</dt>
              <dd v-if="shippingInfo.shippingExtraCharge1 > 0">제주 {{formatNumber(shippingInfo.shippingExtraCharge1)}}원 추가</dd>
              <dd v-if="shippingInfo.shippingExtraCharge2 > 0">도서산간 {{formatNumber(shippingInfo.shippingExtraCharge2)}}원 추가</dd>
            </dl>
          </div>
          <button type="button" class="modal_close" data-dismiss="modal">
            <span class="screen_out">조건부무료배송 닫기</span>
          </button>
        </div>
      </div>
    </div>

    <address-layer></address-layer>
  </section>
</template>

<script>
import AddressLayer from "@/components/ui/daum/address-layer";

let $s, vm;
export default {
  components: {AddressLayer},
  head() {
    return {
      script: [
        { src:'https://spi.maps.daum.net/imap/map_js_init/postcode.v2.js'},
        { src: 'https://web.nicepay.co.kr/v3/webstd/js/nicepay-3.0.js', body: true, async: true },
        { src:'https://nsp.pay.naver.com/sdk/js/naverpay.min.js', body: true},
        { src: '/static/js/pg/nicepay.js', body: true},
      ],
      link: [
        { rel: 'stylesheet', href: '/static/css/order.css' }
      ]
    }
  },
  beforeCreate: function() {
    $s = this.$saleson;
    vm = this;
  },
  data: function () {
    return {
      // data
      isSns : false,
      isUseNpayPayment : false,
      includeTaxFreeItem : false,
      submitCheck : false,
      payType: '',
      isMobile: false,
      cashbillTypes: [],
      selectedDeliveryIndex: '',
      telCodes: '',
      phoneCodes: '',
      userDeliveryList: [],
      useCoupon: false,
      selectedCoupon: [],
      useEscrow: '',
      autoCashReceipt: '',
      buy: {
        receivers: [
          {
            items: []
          }
        ],
        buyPayments: {
          bank: {
            accountNumbers: []
          }
        },
        orderPrice: {
          orderPayAmountTotal: 0
        },
        buyer: {
          userName: '',
          address: '',
          addressDetail: '',
          email: '',
          mobile: '',
          phone: '',
          sido: '',
          sigungu: '',
          zipcode: '',
        },
        defaultUserDelivery:'',
        deviceType: '',
        failUrl: '',
        successUrl: '',
        campaignCode: null,
        defaultPaymentType: 'bank'
      },
      couponInfo: [],
      validate: {
        number: $s.validator.patterns.number,
        email: $s.validator.patterns.email,
        emailMessage: $s.validator.messages.email,
        lastPhone: $s.validator.patterns.last_phone,
        lastPhoneMessage: $s.validator.messages.last_phone
      },
      config: {},
      order: {
        buy: {
          orderPayAmount: 0
        },
        pgType: '',
        totalItemPriceByCoupon: 0,
        minimumPaymentAmount: 0,
        pointUseMin: 0,
        pointUseMax: 0,
        pointUseRatio : 0,
        orgReceivers: null,
        useItemCoupons: [],
        useAddItemCoupons: [],
        useCartCoupons: [],
        notMixPayType: [],
        saveReceiverHtml: '',
        orgZipcode: ''
      },
      pgType: '',
      searchAddress:{
        order: {
          zipcode: '',
          newZipcode: '',
          address: '',
          addressDetail: '',
          addressInfo: '',
          mobile: '',
          phone: '',
          email: '',
        },
        receivers:[{
          zipcode: '',
          newZipcode: '',
          address: '',
          addressDetail: '',
          addressInfo: '',
          mobile: '',
          phone: '',
          email: '',
        }]
      },
      checkoutSteps:[],
      offlineCode:'',
      encryptedString: '',

      // 배송비 정보 레이어 데이터
      shippingInfo: {
        shippingFreeAmount: 0,
        shipping: 0,
        isIsland: false,
        shippingExtraCharge1: 0,
        shippingExtraCharge2: 0,
      },

      // 배송비 쿠폰 사용 checkbox data (shippingSequence)
      shippingCouponSequences: [],
      isReadOnly: true,
      isDisabled: true
    }
  },
  computed: {
    retentionPointText: function () {
      return this.buy.retentionPoint - this.buy.orderPrice.totalPointDiscountAmount;
    },
    usePoint: {
      get() {
        return this.buy.orderPrice.totalPointDiscountAmount;
      },
      set(usePoint){
        this.pointUsed(usePoint);
      }
    }
  },
  watch : {
    selectedDeliveryIndex: function (newValue) {
      if (newValue != '' || newValue == 0) {
        document.getElementById('select_delivery').disabled = false;
      }
    }
  },
  methods: {
    payTypeSelect: function (payType) {
      this.payType = payType;
      let payAmount = this.buy.orderPrice.orderPayAmount

      for (let type in this.buy.buyPayments) {
        if (type == payType) {
          this.buy.buyPayments[type].amount = payAmount;
        } else if (type != 'point') {
          this.buy.buyPayments[type].amount = 0;
        }
      }
    },
    setDelivery: function () {
      let index = this.selectedDeliveryIndex;
      let userDelivery = this.userDeliveryList[index];
      let receiver = this.buy.receivers[0];

      if (userDelivery != undefined && userDelivery != '') {
        this.searchAddress.receivers[0].addressInfo = '[' + userDelivery.newZipcode + ']' + userDelivery.address;
        this.searchAddress.receivers[0].mobile = userDelivery.mobile2 + userDelivery.mobile3;
        receiver.receiveName = userDelivery.userName;
        receiver.receiveAddress = userDelivery.address;
        receiver.receiveAddressDetail = userDelivery.addressDetail;
        receiver.receiveSido = userDelivery.sido;
        receiver.receiveSigungu = userDelivery.sigungu;
        receiver.receiveEupmyeondong = userDelivery.eupmyeondong;
        receiver.receiveMobile = userDelivery.mobile;
        receiver.receiveMobile1 = userDelivery.mobile1;
        receiver.receiveMobile2 = userDelivery.mobile2;
        receiver.receiveMobile3 = userDelivery.mobile3;
        //receiver.receivePhone = userDelivery.phone;
        //receiver.receivePhone1 = userDelivery.phone1;
        //receiver.receivePhone2 = userDelivery.phone2;
        //receiver.receivePhone3 = userDelivery.phone3;
        receiver.receiveZipcode = userDelivery.zipcode;
        receiver.receiveNewZipcode = userDelivery.newZipcode;
        receiver.receiveFullMobile = userDelivery.fullMobile;
        receiver.receiveFullPhone = userDelivery.fullPhone;
        receiver.receiveFullZipcode = userDelivery.fullZipcode;
        $s.toast('해당 배송지로 설정되었습니다.');
      }
    },
    copyDeliveryInfoCopy: function (param, event) {
      let type = param.split('-')[0];
      let index = param.split('-')[1];
      let receivers = this.buy.receivers;
      let buyer = this.buy.buyer;


      if (type == 'copy' && event.target.checked == true) {
        this.searchAddress.receivers[index].addressInfo = this.searchAddress.order.addressInfo;
        this.searchAddress.receivers[index].mobile = this.searchAddress.order.mobile;
        receivers[index].receiveName = buyer.userName;

        if (vm.buy.isLogin) {
          receivers[index].receiveAddress = buyer.address;
          receivers[index].receiveAddressDetail = buyer.addressDetail;
          receivers[index].receiveSido = buyer.sido;
          receivers[index].receiveSigungu = buyer.sigungu;
          receivers[index].receiveEupmyeondong = buyer.eupmyeondong;
          receivers[index].receiveZipcode = buyer.zipcode;
          receivers[index].receiveNewZipcode = buyer.newZipcode;
          receivers[index].receiveFullMobile = buyer.fullMobile;
          receivers[index].receiveFullPhone = buyer.fullPhone;
          receivers[index].receiveFullZipcode = buyer.fullZipcode;
        }

        receivers[index].receiveMobile = buyer.mobile;
        receivers[index].receiveMobile1 = buyer.mobile1;
        receivers[index].receiveMobile2 = buyer.mobile2;
        receivers[index].receiveMobile3 = buyer.mobile3;

        /*receivers[index].receivePhone = buyer.phone;
                  receivers[index].receivePhone1 = buyer.phone1;
                  receivers[index].receivePhone2 = buyer.phone2;
                  receivers[index].receivePhone3 = buyer.phone3;*/

      } else if (type == 'default') {
        let userDelivery = this.userDeliveryList[0];
        if (userDelivery != undefined && userDelivery != '') {
          this.searchAddress.receivers[index].addressInfo = '[' + userDelivery.newZipcode + ']' + userDelivery.address;
          this.searchAddress.receivers[index].mobile = userDelivery.mobile2 + userDelivery.mobile3;
          receivers[index].receiveName = userDelivery.userName;
          receivers[index].receiveAddress = userDelivery.address;
          receivers[index].receiveAddressDetail = userDelivery.addressDetail;
          receivers[index].receiveSido = userDelivery.sido;
          receivers[index].receiveSigungu = userDelivery.sigungu;
          receivers[index].receiveEupmyeondong = userDelivery.eupmyeondong;
          receivers[index].receiveMobile = userDelivery.mobile;
          receivers[index].receiveMobile1 = userDelivery.mobile1;
          receivers[index].receiveMobile2 = userDelivery.mobile2;
          receivers[index].receiveMobile3 = userDelivery.mobile3;
          //receivers[index].receivePhone = userDelivery.phone;
          //receivers[index].receivePhone1 = userDelivery.phone1;
          //receivers[index].receivePhone2 = userDelivery.phone2;
          //receivers[index].receivePhone3 = userDelivery.phone3;
          receivers[index].receiveZipcode = userDelivery.zipcode;
          receivers[index].receiveNewZipcode = userDelivery.newZipcode;
          receivers[index].receiveFullMobile = userDelivery.fullMobile;
          receivers[index].receiveFullPhone = userDelivery.fullPhone;
          receivers[index].receiveFullZipcode = userDelivery.fullZipcode;
        }
      } else if (type == 'clear') {
        this.searchAddress.receivers[index].addressInfo = '';
        this.searchAddress.receivers[index].mobile = '';
        receivers[index].receiveName = '';
        receivers[index].receiveAddress = '';
        receivers[index].receiveAddressDetail = '';
        receivers[index].receiveSido = '';
        receivers[index].receiveSigungu = '';
        receivers[index].receiveEupmyeondong = '';
        receivers[index].receiveMobile = '';
        receivers[index].receiveMobile1 = '';
        receivers[index].receiveMobile2 = '';
        receivers[index].receiveMobile3 = '';
        receivers[index].receivePhone = '';
        receivers[index].receivePhone1 = '';
        receivers[index].receivePhone2 = '';
        receivers[index].receivePhone3 = '';
        receivers[index].receiveZipcode = '';
        receivers[index].receiveNewZipcode = '';
        receivers[index].receiveFullMobile = '';
        receivers[index].receiveFullPhone = '';
        receivers[index].receiveFullZipcode = '';
      }

      let params = {
        where: 'ZIPCODE',
        query: receivers[index].receiveZipcode
      };

      $s.api.getIslandType(params,
          function (data) {
            let islandType = '';

            if (data.pageContent.totalElements > 0) {
              islandType = data.pageContent.content[0].islandType;
            }

            let shippingList = vm.order.buy.receivers[index].shippingList;

            for (let i=0;i<shippingList.length;i++) {
              let shipping = shippingList[i];

              shipping.islandType = islandType;
            }

            // 배송비 재설정
            vm.setShippingAmount();
          }
      );

      vm.typeCheck(type, index);
    },
    setLastBuyerMobile: function (e) {
      this.valid(e, this.validate.lastPhone);

      this.setMobile('order');

    },
    setMobile: function(type,index) {
      if (type == 'order') {
        let mobile = this.searchAddress.order.mobile.toString();
        let mobile3 = mobile.substring(mobile.length-4, mobile.length);
        let mobile2 = '';

        if (mobile.length == 7) {
          mobile2 = mobile.substring(0,3);
        } else {
          mobile2 = mobile.substring(0,4);
        }

        this.buy.buyer.mobile2 = mobile2;
        this.buy.buyer.mobile3 = mobile3;
        this.buy.buyer.mobile = this.buy.buyer.mobile1 + '-' + mobile2 + '-' + mobile3;
      } else {
        let mobile = this.searchAddress.receivers[index].mobile.toString();
        let mobile3 = mobile.substring(mobile.length-4, mobile.length);
        let mobile2 = '';

        if (mobile.length == 7) {
          mobile2 = mobile.substring(0,3);
        } else {
          mobile2 = mobile.substring(0,4);
        }

        this.buy.receivers[index].receiveMobile2 = mobile2;
        this.buy.receivers[index].receiveMobile3 = mobile3;
        this.buy.receivers[index].receiveMobile = this.buy.receivers[index].receiveMobile1 + '-' + mobile2 + '-' + mobile3;
      }

    },
    setPhone: function(type,index) {
      if (type == 'order') {
        let phone = this.searchAddress.order.phone.toString();
        let phone3 = phone.substring(phone.length-4, phone.length);
        let phone2 = '';
        let phone1 = '';

        if (phone.length == 7) {
          phone2 = phone.substring(0,3);
        } else {
          phone2 = phone.substring(0,4);
        }

        if (this.buy.buyer.phone1 !== null) {
          phone1 = this.buy.buyer.phone1;
        }

        this.buy.buyer.phone1 = phone1;
        this.buy.buyer.phone2 = phone2;
        this.buy.buyer.phone3 = phone3;
        this.buy.buyer.phone = phone1 + '-' + phone2 + '-' + phone3;
      } else {
        let phone = this.searchAddress.receivers[index].phone.toString();
        let phone3 = phone.substring(phone.length-4, phone.length);
        let phone2 = '';
        let phone1 = '';

        if (phone.length == 7) {
          phone2 = phone.substring(0,3);
        } else {
          phone2 = phone.substring(0,4);
        }

        if (this.buy.receivers[index].receivePhone1 !== null) {
          phone1 = this.buy.receivers[index].receivePhone1;
        }

        this.buy.receivers[index].receivePhone1 = phone1;
        this.buy.receivers[index].receivePhone2 = phone2;
        this.buy.receivers[index].receivePhone3 = phone3;
        this.buy.receivers[index].receivePhone = phone1 + '-' + phone2 + '-' + phone3;
      }

    },
    openDaumPostcode: function (type,index) {
      let searchAddress = vm.searchAddress;
      let buyer = vm.buy.buyer;
      let child = this.getChild("address-layer");
      if (child != null) {
        child.openDaumAddress(function(response) {
          if (type == 'order') {
            searchAddress.order.zipcode = response.zipcode;
            searchAddress.order.newZipcode = response.newZipcode;
            searchAddress.order.address = response.jibunAddress;
            searchAddress.order.addressInfo = "[" + response.newZipcode + "] " + response.jibunAddress;

            buyer.zipcode1 = response.zipcode.split('-')[0];
            buyer.zipcode2 = response.zipcode.split('-')[1];
            buyer.zipcode = response.zipcode;
            buyer.newZipcode = response.newZipcode;
            buyer.address = response.jibunAddress;
            buyer.sido = response.sido;
            buyer.sigungu = response.sigungu;
            buyer.eupmyeondong = response.eupmyeondong;

            document.getElementById("order_address_placeholder").textContent = "";
          } else if (type == 'receive') {
            if (searchAddress.receivers.length == index) {
              let receive = {
                zipcode: response.zipcode,
                newZipcode: response.newZipcode,
                address: response.jibunAddress,
                addressInfo: "[" + response.newZipcode + "] " + response.jibunAddress
              };

              vm.searchAddress.receivers.push(receive);
            } else {
              searchAddress.receivers[index].zipcode = response.zipcode;
              searchAddress.receivers[index].newZipcode = response.newZipcode;
              searchAddress.receivers[index].address = response.jibunAddress;
              searchAddress.receivers[index].addressInfo = "[" + response.newZipcode + "] " + response.jibunAddress;

              document.getElementById("receive" + index + "_address_placeholder").textContent = "";
            }

            vm.buy.receivers[index].receiveAddress = response.jibunAddress;
            vm.buy.receivers[index].receiveSido = response.sido;
            vm.buy.receivers[index].receiveSigungu = response.sigungu;
            vm.buy.receivers[index].receiveEupmyeondong = response.eupmyeondong;
            vm.buy.receivers[index].receiveZipcode = response.zipcode;
            vm.buy.receivers[index].receiveNewZipcode = response.newZipcode;

            vm.order.buy.receivers[index].zipcode = response.zipcode;

            let param = {
              where: 'ZIPCODE',
              query: response.zipcode
            };

            $s.api.getIslandType(param,
                function (data) {
                  let islandType = '';

                  if (data.pageContent.totalElements > 0) {
                    islandType = data.pageContent.content[0].islandType;
                  }

                  let shippingList = vm.order.buy.receivers[index].shippingList;

                  for (let i=0;i<shippingList.length;i++) {
                    let shipping = shippingList[i];

                    shipping.islandType = islandType;
                  }

                  // 배송비 재설정
                  vm.setShippingAmount();
                }
            );
          }
          vm.setCheckoutStep($s.ga.const.CHECKOUT_INPUT_USER_STEP);
        });
      }
    },
    getShippingInfo : function (receiverSequence, shippingSequence) {
      let shipping = this.order.buy.receivers[receiverSequence].shippingList[shippingSequence];
      let realShipping = this.formatNumber(shipping.realShipping) + "원";

      if (shipping.shippingPaymentType == '2') {
        realShipping += "(착불)"
      }

      if (shipping.realShipping == 0) {
        realShipping = "무료배송";
      }

      return realShipping;
    },
    useShippingCoupon: function (shipping) {
      if (this.order.buy.shippingCoupon <= this.order.useShippingCoupon) {
        document.getElementById('deli_check_' + shipping.shippingSequence).checked = false;
      }

      // 포인트 적용 후 배송비쿠폰 적용시 결제 금액이 마이너스가 나오는 경우가 있음
      this.pointUsed(0);
      this.setShippingAmount();
      // this.setAmountText();
    },
    orderInit: function(buy) {
      buy = JSON.parse(buy);
      let minimumPaymentAmount = this.config.minimumPaymentAmount;
      let pointUseMin = this.config.pointUseMin;
      let pointUseMax = this.config.pointUseMax;
      let pointUseRatio = this.config.pointUseRatio;
      let pgType = this.pgType;

      this.order.buy = buy;
      this.order.pgType = pgType;
      this.order.totalItemPriceByCoupon = buy.totalItemAmountBeforeDiscounts;

      if (!isNaN(minimumPaymentAmount) == false) {
        minimumPaymentAmount = 0;
      }

      this.order.minimumPaymentAmount = Number(minimumPaymentAmount);

      if (!isNaN(pointUseMin) == false) {
        pointUseMin = 0;
      }

      if (!isNaN(pointUseMax) == false) {
        pointUseMax = 0;
      }

      this.order.notMixPayType = buy.notMixPayType;
      this.order.orgReceivers = buy.receivers;
      this.order.pointUseMin = Number(pointUseMin);
      this.order.pointUseMax = Number(pointUseMax);
      this.order.pointUseRatio = Number(pointUseRatio);
    },
    getId: function (title,index) {
      return title + "_" + index;
    },
    getDataTarget: function (title,index) {
      return "#" + title + "_" + index;
    },
    deliverySelect: function (index) {
      let userDelivery = this.userDeliveryList[index];

      this.buy.buyer.userName = userDelivery.userName;
      this.buy.buyer.zipcode = userDelivery.zipcode;
      this.buy.buyer.sido = userDelivery.sido;
      this.buy.buyer.sigungu = userDelivery.sigungu;
      this.buy.buyer.eupmyeondong = userDelivery.eupmyeondong;
      this.buy.buyer.newZipcode = userDelivery.newZipcode;
      this.buy.buyer.address = userDelivery.address;
      this.buy.buyer.addressDetail = userDelivery.addressDetail;
      this.buy.buyer.mobile = userDelivery.mobile;
      this.buy.buyer.fullMobile = userDelivery.mobile;
      this.buy.buyer.mobile1 = userDelivery.mobile1;
      this.buy.buyer.mobile2 = userDelivery.mobile2;
      this.buy.buyer.mobile3 = userDelivery.mobile3;
      this.buy.buyer.fullPhone = userDelivery.phone;
      this.buy.buyer.phone = userDelivery.phone;
      this.buy.buyer.phone1 = userDelivery.phone1;
      this.buy.buyer.phone2 = userDelivery.phone2;
      this.buy.buyer.phone3 = userDelivery.phone3;
      this.buy.buyer.userId = userDelivery.userId;
    },
    couponCancel: function (index) {
      let select = document.getElementById('coupon1_'+index);
      let itemCoupons = this.couponInfo[index];

      for (let i=0;i<this.couponInfo.length;i++) {
        for (let j = 0; j < this.couponInfo[i].length; j++) {
          let couponInfo = this.couponInfo[i][j];

          if (couponInfo.couponKey == this.selectedCoupon[index].couponKey) {
            couponInfo.disabled = 'false';
            couponInfo.selected = 'false';
          }
        }
      }

      this.selectedCoupon[index] = 'clear';

      if (select.childNodes.length == 2) {
        select.childNodes[1].firstChild.selected = true;
      } else {
        select.firstChild.selected = true;
      }

      select.firstChild.selected = true;

      this.couponSelect(index);


    },
    couponSelect: function (index) {
      let select = document.getElementById('coupon1_'+index);
      let couponAreaKey = select.getAttribute('id');
      let selectedCouponUserId = select.value.split('.',1).toString();
      let itemCount = this.buy.receivers[0].items.length;

      for(let i=0;i<itemCount;i++) {
        let checkCouponAreaKey = 'coupon1_' + i;
        let itemCoupons = this.couponInfo[i];

        if (itemCoupons != undefined && itemCoupons != '') {
          for (let j = 0; j < itemCoupons.length; j++) {
            let coupon = itemCoupons[j];
            coupon.disabled = false;

            if (couponAreaKey == checkCouponAreaKey) {
              coupon.selected = coupon.couponUserId == selectedCouponUserId ? true : false;
            } else {
              coupon.selected = coupon.couponUserId == selectedCouponUserId ? false : coupon.selected
            }
          }
        }
      }

      for(let i=0;i<itemCount;i++) {
        let itemCoupons = this.couponInfo[i];
        for (let j=0;j<itemCoupons.length;j++) {
          let coupon = itemCoupons[j];

          if (coupon.selected == true) {
            let couponUserId = coupon.couponUserId;

            for (let k=0;k<itemCount;k++) {
              if (i == k) {
                continue;
              }
              itemCoupons = this.couponInfo[k];

              for (let k=0;k<itemCoupons.length;k++) {
                let coupon = itemCoupons[k];

                if (couponUserId == coupon.couponUserId) {
                  coupon.disabled = true;
                }
              }
            }
          }
        }
      }

      this.setCouponDiscountData(index);
      this.setCoupon();

    },
    setCouponDiscountData: function(index) {

      let itemCount = this.buy.receivers[0].items.length;

      let differentPlaceSelectedCoupons = [];

      for(let i=0;i<itemCount;i++) {
        let itemCoupons = this.couponInfo[i];
        for (let j = 0; j < itemCoupons.length; j++) {
          if (itemCoupons[j].selected) {
            differentPlaceSelectedCoupons.push(itemCoupons[j]);
          }
        }
      }

      for(let i=0;i<itemCount;i++) {
        let differentPlaceSelectNotCoupons = [];
        let selectId = 0;
        let itemCoupons = this.couponInfo[i];
        let select = document.getElementsByClassName('op-item-coupon', 'select')[i];


        for (let j = 0; j < itemCoupons.length; j++) {
          let coupon = itemCoupons[j];

          if (coupon.selected == true) {
            selectId = coupon.couponUserId;
          }

          let pushFlag = true;
          for (let k=0; k<differentPlaceSelectedCoupons.length; k++) {
            if (coupon.couponUserId == differentPlaceSelectedCoupons[k].couponUserId) {
              pushFlag = false;
              break;
            }
          }

          if (pushFlag) {
            differentPlaceSelectNotCoupons.push(coupon);
          }
        }

        while (document.getElementsByClassName('op-item-coupon', 'select')[i].firstChild != null) {
          document.getElementsByClassName('op-item-coupon', 'select')[i].removeChild(document.getElementsByClassName('op-item-coupon', 'select')[i].firstChild);
        }


        if (differentPlaceSelectedCoupons.length > 0) {

          let usedOptgroup = document.createElement('optgroup');
          usedOptgroup.label = "다른 상품에 적용된 쿠폰";

          let appendCount = 0;
          for (let k = 0; k < differentPlaceSelectedCoupons.length; k++) {

            let appendCoupon = differentPlaceSelectedCoupons[k];
            let appendFlag = false;

            for (let j = 0; j < itemCoupons.length; j++) {
              if (appendCoupon.couponUserId == itemCoupons[j].couponUserId) {
                appendFlag = true;
                appendCount++;
                break;
              }
            }

            if (appendFlag) {
              usedOptgroup.appendChild(this.makeOption(appendCoupon, selectId));
            }
          }

          if (appendCount > 0) {
            select.appendChild(usedOptgroup);
          }
        }

        let optgroup = document.createElement('optgroup');
        optgroup.label = "사용 가능 쿠폰";

        let defaultOption = document.createElement('option');
        defaultOption.text = "쿠폰을 선택해주세요.";
        defaultOption.value = 'clear';

        if (selectId == 0) {
          defaultOption.selected = true;
        }

        optgroup.insertBefore(defaultOption, optgroup.firstChild);

        if (differentPlaceSelectNotCoupons.length > 0) {
          for (let l=0;l<differentPlaceSelectNotCoupons.length;l++) {
            optgroup.appendChild(this.makeOption(differentPlaceSelectNotCoupons[l],0));
          }
        }

        select.appendChild(optgroup);

      }


      for(let i=0;i<itemCount;i++) {
        let itemCoupons = this.couponInfo[i];
        let select = document.getElementsByClassName('op-item-coupon', 'select')[i];

        for (let j = 0; j < itemCoupons.length; j++) {
          let coupon = itemCoupons[j];

          if (coupon.selected == true && select.value != 'clear') {
            this.selectedCoupon[i] = coupon;
            this.selectedCoupon[i].itemDiscountAmount = coupon.discountAmount + this.buy.items[index].itemPrice.discountAmount;
          }

          if (select.value == 'clear') {
            this.selectedCoupon[i] = 'clear';
          }
        }
      }
    },
    makeOption: function(coupon, selectId) {
      let optionText = coupon.couponUserId + '. ' + coupon.couponName;
      optionText += ' - ' + this.formatNumber(coupon.discountAmount) + '원 할인';

      if (coupon.couponConcurrently == '1') {
        optionText += ' [1개 수량만 적용]';
      } else {
        optionText += ' [구매 수량 할인]';
      }

      let option = document.createElement('option');
      option.textContent = optionText;

      if (coupon.couponType == null || coupon.couponType == undefined) {
        coupon.couponType = "";
      }

      if (coupon.selected == true && selectId == coupon.couponUserId) {
        option.selected = true;
      }

      return option;
    },
    useAllPoint: function() {
      this.pointUsed(this.buy.retentionPoint);
    },
    pointUsed: function(usePoint) {
      this.setPointDiscountAmount(usePoint);
      this.setAmountText();
    },
    setPointDiscountAmount: function (usePoint) {
      let order = this.order;
      if (typeof(usePoint) == 'number') {

        let retentionPoint = order.buy.retentionPoint;

        retentionPoint = parseInt(retentionPoint);
        usePoint = parseInt(usePoint);
        if (retentionPoint == 0) {
          order.buy.totalPointDiscountAmount = 0;
        }

        if (retentionPoint < usePoint) {
          usePoint = retentionPoint;
        }

        // 이미 적용된 포인트 금액은 더해서 계산함
        let orderPayAmount = order.buy.orderPayAmount + order.buy.totalPointDiscountAmount;

        let ratioPointAmount = Math.floor((orderPayAmount/100)*order.pointUseRatio);

        if (orderPayAmount - order.minimumPaymentAmount < usePoint) {
          usePoint = orderPayAmount - order.minimumPaymentAmount;
        }

        if(usePoint > ratioPointAmount){
          usePoint = ratioPointAmount;
        }
        if (usePoint < 0) {
          usePoint = 0;
        }

        if (order.pointUseMin > usePoint) {
          usePoint = 0;
        }

        if (order.pointUseMax > 0) {
          if (order.pointUseMax < usePoint) {
            usePoint = order.pointUseMax;
          }
        }

        if (usePoint > 0) {
          // 100원단위 사용 가능
          usePoint = Math.floor(usePoint * 0.01) * 100;
        }

        order.buy.totalPointDiscountAmount = usePoint;

        return;

      }

      order.buy.totalPointDiscountAmount = 0;
    },
    setAmountText: function (isClear) {
      let order = this.order;
      if (isClear == undefined) {
        isClear = true;
      }

      let totalItemQuantities = 0;

      // 적립 예정 포인트에 쿠폰 사용금액을 차감후 계산하는 경우
      if (order.buy.isPointApplyCouponDiscount == true) {
        order.buy.totalEarnPoint = 0;
      }

      let tempItems = this.getTotalItems();

      for (let i=0;i<tempItems.length;i++) {
        totalItemQuantities = tempItems[i].quantity;
        this.setItemAmountText(tempItems[i]);
      }

      // 배송비를 정책별로 합산한다. <상품 목록에 데이터 갱신용!!>
      let groupShippings = [];

      for (let i=0;i<order.buy.receivers.length;i++) {
        for (let j=0;j<order.buy.receivers[i].shippingList.length;j++) {
          let shipping = order.buy.receivers[i].shippingList[j];
          let realShipping = Number(shipping.realShipping);
          let isSet = false;

          if (groupShippings.length > 0) {
            for (let j=0;j<groupShippings.length;j++) {

              if (groupShippings[j].shippingSequence == shipping.shippingSequence) {
                groupShippings[j].realShipping += realShipping;
                isSet = true;
              }
            }
          }

          if (isSet == false) {
            let tempShipping = {
              'shippingSequence'		: shipping.shippingSequence,
              'realShipping'			: realShipping,
              'shippingPaymentType'	: shipping.shippingPaymentType
            }

            groupShippings.push(tempShipping);
          }
        }
      }

      for (let i=0;i<groupShippings.length;i++) {
        let shipping = groupShippings[i];
        let realShipping = this.formatNumber(shipping.realShipping) + '원';

        if (shipping.shippingPaymentType == '2') {
          realShipping += '(착불)';
        }

        if (shipping.realShipping == 0) {
          realShipping = "무료배송";
        }

      }

      let totalItemDiscountAmount = order.buy.totalItemDiscountAmount;
      let totalUserLevelDiscountAmount = order.buy.totalUserLevelDiscountAmount;
      let totalItemCouponDiscountAmount = order.buy.totalItemCouponDiscountAmount;
      let totalCartCouponDiscountAmount = order.buy.totalCartCouponDiscountAmount;
      let totalPointDiscountAmount = order.buy.totalPointDiscountAmount;
      let totalShippingCouponDiscountAmount = order.buy.totalShippingCouponDiscountAmount;
      let totalCouponDiscountAmount = totalItemCouponDiscountAmount + totalCartCouponDiscountAmount;
      let totalDiscountAmount = totalItemDiscountAmount + totalUserLevelDiscountAmount + totalItemCouponDiscountAmount + totalCartCouponDiscountAmount + totalPointDiscountAmount + totalShippingCouponDiscountAmount;


      // 상품 쿠폰 할인 금액
      // $('.op-total-item-coupon-discount-amount-text').html(Common.numberFormat(totalItemCouponDiscountAmount));

      // 할인 안된 금액
      // let noDiscountOrderPayAmount = Order.buy.totalItemAmountBeforeDiscounts + Order.buy.totalShippingAmount;
      // $('.op-noDiscount-order-pay-amount-text').html(Common.numberFormat(noDiscountOrderPayAmount));

      // 장바구니 쿠폰 할인 금액
      // $('.op-total-cart-coupon-discount-amount-text').not('input').html(Common.numberFormat(totalCartCouponDiscountAmount));

      // 전체 쿠폰 할인 금액
      order.buy.totalCouponDiscountAmount = totalCouponDiscountAmount;

      // 포인트 금액

      // 배송비 할인액
      // $('.op-total-shipping-coupon-discount-amount-text').not('input').html(Common.numberFormat(totalShippingCouponDiscountAmount));
      // $('input.totalShippingCouponUseCountText').val(Common.numberFormat(Order.buy.totalShippingCouponUseCount));

      // 전체 할인 금액
      order.buy.totalDiscountAmount = totalDiscountAmount;

      // 결제금액 계산
      this.setOrderPayAmount(isClear);

      // 결제 금액


      // 총 적립 금액

    },
    /**
     * 상품 금액 View처리
     */
    setItemAmountText: function(item) {
      // 상품 토탈 할인 금액 (스팟, 즉시, 쿠폰)
      let itemDiscountAmount = item.discountAmount;

      if (item.couponDiscountAmount > 0) {
        itemDiscountAmount += item.couponDiscountAmount
      }
      let itemDiscountAmountText = this.formatNumber(itemDiscountAmount) + "원";
      let itemPayAmountText = this.formatNumber(item.saleAmount);

      // 포인트 금액을 반영하는 경우
      if (item.isPointApplyCouponDiscount == true) {

        let itemEarnPoint = 0;

        // 기본 포인트
        if (Number(item.point) > 0) {
          if (item.pointType == '1') {

            itemEarnPoint += Math.floor(Number(item.sumPrice - item.couponDiscountPrice) * (Number(item.point) / 100));
          } else {
            // CJH 2016.11.12 금액으로 지정되어있으면?
          }
        }

        // 회원 포인트
        if (Number(item.userLevelPointRate > 0)) {
          itemEarnPoint += Math.floor(Number(item.sumPrice - item.couponDiscountPrice) * (Number(item.userLevelPointRate) / 100));
        }

        this.order.buy.totalEarnPoint += Number(itemEarnPoint * item.quantity);
      }
    },
    getTotalItems: function() {
      let order = this.order;
      let tempItems = [];

      for (let i=0;i<order.buy.receivers.length;i++) {
        let receiver = order.buy.receivers[i];

        for (let j=0;j<receiver.shippingList.length;j++) {
          let shipping = receiver.shippingList[j];
          if (shipping.singleShipping) {
            let quantity = shipping.buyItem.quantity;

            let isSet = false;
            if (tempItems.length > 0) {
              for (let k=0;k<tempItems.length;k++) {
                let tempItem = tempItems[k];

                if (tempItem.itemSequence == shipping.buyItem.itemSequence) {
                  quantity = Number(quantity) + Number(tempItem.quantity);

                  tempItems[k] = {
                    'itemSequence'					: tempItem.itemSequence,
                    'couponDiscountPrice'			: tempItem.couponDiscountPrice,
                    'couponDiscountAmount'			: Number(tempItem.couponDiscountAmount),
                    'quantity'						: quantity,
                    'beforeDiscountAmount'			: Number(tempItem.sumPrice) * quantity,
                    'saleAmount'					: (Number(tempItem.sumPrice) * quantity) - (Number(tempItem.couponDiscountAmount)),
                    'sumPrice'						: tempItem.sumPrice,
                    'itemName'						: tempItem.itemName,
                    'itemUserCode'					: tempItem.itemUserCode,
                    'optionText'					: tempItem.optionText,
                    'itemImageSrc'					: tempItem.itemImageSrc,
                    'shipmentGroupType'				: tempItem.shipmentGroupType,
                    'isPointApplyCouponDiscount'	: tempItem.isPointApplyCouponDiscount,
                    'pointType'						: tempItem.pointType,
                    'point'							: tempItem.point,
                    'userLevelPointRate'			: tempItem.userLevelPointRate,

                    'itemSaleAmount'				: tempItem.itemSaleAmount,
                    'baseAmountForShipping'			: tempItem.baseAmountForShipping,
                    'discountAmount'				: tempItem.discountAmount,
                    'itemDiscountAmount'			: tempItem.itemDiscountAmount,
                    'userLevelDiscountAmount'		: tempItem.userLevelDiscountAmount
                  };

                  isSet = true;
                }
              }
            }

            if (isSet == false) {
              let tempItem = {
                'itemSequence'					: shipping.buyItem.itemSequence,
                'couponDiscountPrice'			: shipping.buyItem.couponDiscountPrice,
                'couponDiscountAmount'			: Number(shipping.buyItem.couponDiscountAmount),
                'quantity'						: quantity,
                'beforeDiscountAmount'			: Number(shipping.buyItem.sumPrice) * quantity,
                'saleAmount'					: (Number(shipping.buyItem.sumPrice) * quantity) - (Number(shipping.buyItem.couponDiscountAmount)),
                'sumPrice'						: shipping.buyItem.sumPrice,
                'itemName'						: shipping.buyItem.itemName,
                'itemUserCode'					: shipping.buyItem.itemUserCode,
                'optionText'					: shipping.buyItem.optionText,
                'itemImageSrc'					: shipping.buyItem.itemImageSrc,
                'shipmentGroupType'				: shipping.buyItem.shipmentGroupType,
                'isPointApplyCouponDiscount'	: shipping.buyItem.isPointApplyCouponDiscount,
                'pointType'						: shipping.buyItem.pointType,
                'point'							: shipping.buyItem.point,
                'userLevelPointRate'			: shipping.buyItem.userLevelPointRate,

                'itemSaleAmount'				: shipping.buyItem.itemSaleAmount,
                'baseAmountForShipping'			: shipping.buyItem.baseAmountForShipping,
                'discountAmount'				: shipping.buyItem.discountAmount,
                'itemDiscountAmount'			: shipping.itemDiscountAmount,
                'userLevelDiscountAmount'		: shipping.userLevelDiscountAmount
              };
              tempItems.push(tempItem);
            }
          } else {
            for (let k=0;k<shipping.buyItems.length;k++) {
              let item = shipping.buyItems[k];
              let quantity = item.quantity;
              let isSet = false;

              if (tempItems.length > 0) {
                for (let l=0;l<tempItems.length;l++) {
                  let tempItem = tempItems[l];
                  if (tempItem.itemSequence == item.itemSequence) {
                    quantity = Number(quantity) + Number(tempItem.quantity);
                    tempItems[l] = {
                      'itemSequence'					: tempItem.itemSequence,
                      'couponDiscountPrice'			: tempItem.couponDiscountPrice,
                      'couponDiscountAmount'			: Number(tempItem.couponDiscountAmount),
                      'quantity'						: quantity,
                      'beforeDiscountAmount'			: Number(tempItem.sumPrice) * quantity,
                      'saleAmount'					: (Number(tempItem.sumPrice) * quantity) - (Number(tempItem.couponDiscountAmount)),
                      'sumPrice'						: tempItem.sumPrice,
                      'itemName'						: tempItem.itemName,
                      'itemUserCode'					: tempItem.itemUserCode,
                      'optionText'					: tempItem.optionText,
                      'itemImageSrc'					: tempItem.itemImageSrc,
                      'shipmentGroupType'				: tempItem.shipmentGroupType,
                      'isPointApplyCouponDiscount'	: tempItem.isPointApplyCouponDiscount,
                      'pointType'						: tempItem.pointType,
                      'point'							: tempItem.point,
                      'userLevelPointRate'			: tempItem.userLevelPointRate,

                      'itemSaleAmount'				: tempItem.itemSaleAmount,
                      'baseAmountForShipping'			: tempItem.baseAmountForShipping,
                      'discountAmount'				: tempItem.discountAmount,
                      'itemDiscountAmount'			: tempItem.itemDiscountAmount,
                      'userLevelDiscountAmount'		: tempItem.userLevelDiscountAmount
                    };
                    isSet = true;
                  }
                }
              }

              if (isSet == false) {
                let tempItem = {
                  'itemSequence'					: item.itemSequence,
                  'couponDiscountPrice'			: item.couponDiscountPrice,
                  'couponDiscountAmount'			: Number(item.couponDiscountAmount),
                  'quantity'						: quantity,
                  'beforeDiscountAmount'			: Number(item.sumPrice) * quantity,
                  'saleAmount'					: (Number(item.sumPrice) * quantity) - (Number(item.couponDiscountAmount)),
                  'sumPrice'						: item.sumPrice,
                  'itemName'						: item.itemName,
                  'itemUserCode'					: item.itemUserCode,
                  'optionText'					: item.optionText,
                  'itemImageSrc'					: item.itemImageSrc,
                  'shipmentGroupType'				: item.shipmentGroupType,
                  'isPointApplyCouponDiscount'	: item.isPointApplyCouponDiscount,
                  'pointType'						: item.pointType,
                  'point'							: item.point,
                  'userLevelPointRate'			: item.userLevelPointRate,

                  'itemSaleAmount'				: item.itemSaleAmount,
                  'baseAmountForShipping'			: item.baseAmountForShipping,
                  'discountAmount'				: item.discountAmount,
                  'itemDiscountAmount'			: item.itemDiscountAmount,
                  'userLevelDiscountAmount'		: item.userLevelDiscountAmount
                };

                tempItems.push(tempItem);
              }
            }
          }
        }
      }

      return tempItems;
    },
    /**
     * 결제금액 계산
     *
     */
    setOrderPayAmount: function (isClear) {
      let order = this.order;
      let orderPrice = this.buy.orderPrice;
      let orderPayAmount = order.buy.totalItemSaleAmount + order.buy.totalShippingAmount - order.buy.totalCartCouponDiscountAmount - order.buy.totalPointDiscountAmount;
      order.buy.orderPayAmount = orderPayAmount;

      this.order = order;

      if (isClear == true) {
        // this.setOrderPayAmountClear();
      }

      orderPrice.totalItemSaleAmount = order.buy.totalItemSaleAmount;
      orderPrice.totalItemCouponDiscountAmount = order.buy.totalItemCouponDiscountAmount;
      orderPrice.totalCartCouponDiscountAmount = order.buy.totalCartCouponDiscountAmount;
      orderPrice.totalPointDiscountAmount = order.buy.totalPointDiscountAmount;
      orderPrice.totalUserLevelDiscountAmount = order.buy.totalUserLevelDiscountAmount;
      orderPrice.totalShippingAmount = order.buy.totalShippingAmount;
      orderPrice.orderPayAmount = orderPayAmount;

      let useCouponKeys = new Array();

      for (let i = 0; i < this.selectedCoupon.length; i++) {
        let selectedCoupon = this.selectedCoupon[i];

        if (selectedCoupon == 'clear') {
          if (this.buy.useCouponKeys !== null) {
            this.buy.useCouponKeys.splice(i, 1);
          }
          continue;
        }

        useCouponKeys.push(selectedCoupon.couponKey);
        this.buy.useCouponKeys = useCouponKeys;

      }

      if (vm.buy.isLogin) {
        // 배송비쿠폰 할인 적용
        this.buy.buyPayments['point'].amount = order.buy.totalPointDiscountAmount;
      }

    },
    /**
     * 상품 금액 View처리
     */
    setItemAmountTex: function(item) {
      // 상품 토탈 할인 금액 (스팟, 즉시, 쿠폰)
      let itemDiscountAmount = item.discountAmount;
      if (this.selectedCoupon[item.itemSequence] != 'clear') {
        itemDiscountAmount += this.selectedCoupon[item.itemSequence].discountAmount;
      }
      let itemDiscountAmountText = Common.numberFormat(itemDiscountAmount) + "원";



      // 쿠폰 할인 금액
      // $('.itemCouponDiscountAmountText-' + item.itemSequence).html(itemCouponDiscountAmountText);
      // $('.itemDiscountAmountText-' + item.itemSequence).html(itemDiscountAmountText);
      // $('.itemPayAmountText-' + item.itemSequence).html(Common.numberFormat(item.saleAmount));

      // 포인트 금액을 반영하는 경우
      if (item.isPointApplyCouponDiscount == true) {

        let itemEarnPoint = 0;

        // 기본 포인트
        if (Number(item.point) > 0) {
          if (item.pointType == '1') {

            itemEarnPoint += Math.floor(Number(item.sumPrice - item.couponDiscountPrice) * (Number(item.point) / 100));
          } else {
            // CJH 2016.11.12 금액으로 지정되어있으면?
          }
        }

        // 회원 포인트
        if (Number(item.userLevelPointRate > 0)) {
          itemEarnPoint += Math.floor(Number(item.sumPrice - item.couponDiscountPrice) * (Number(item.userLevelPointRate) / 100));
        }

        Order.buy.totalEarnPoint += Number(itemEarnPoint * item.quantity);
      }
    },
    setCoupon: function() {

      let itemCoupons = [];
      let addItemCoupons = [];
      let cartCoupons = [];

      for (let i=0;i<this.selectedCoupon.length;i++) {
        let coupon = this.selectedCoupon[i];
        if (coupon != 'clear') {
          itemCoupons.push(coupon);
        }
      }

      this.setCouponDiscountAmount(itemCoupons, addItemCoupons, cartCoupons);
    },
    setCouponDiscountAmount: function(itemCoupons, addItemCoupons, cartCoupons) {

      // 쿠폰 적용 시 포인트 할인금액 초기화
      // 포인트 적용 후 쿠폰적용시 결제 금액이 마이너스가 나오는 경우가 있음
      this.pointUsed(0);

      // 복합 배송 설정때 쿠폰 사용 할인금액을 각각 설정하기 위함
      let order = this.order;
      order.useItemCoupons = itemCoupons;
      order.useAddItemCoupons = addItemCoupons;
      order.useCartCoupon = cartCoupons;

      // 상품 쿠폰 할인액
      let totalItemCouponDiscountAmount = 0;
      let totalItemSaleAmount = 0;

      // 전체 상품쿠폰 할인금액 초기화
      order.buy.totalItemCouponDiscountAmount = 0;

      let couponKeys = [];

      for (let i = 0;i<order.buy.receivers.length;i++) {
        let receiver = order.buy.receivers[i];

        for (let j=0;j<receiver.shippingList.length;j++) {
          let shipping = receiver.shippingList[j];

          if (shipping.singleShipping) {
            shipping.buyItem.saleAmount = shipping.buyItem.beforeDiscountAmount;
            shipping.buyItem.couponDiscountAmount = 0;
            shipping.buyItem.couponDiscountPrice = 0;

            let key = this.setItemCouponDiscountAmount(itemCoupons, shipping.buyItem, receiver.shippingIndex);

            if (key != '') {
              let isInsert = true;
              for (let z=0;z<couponKeys.length;z++) {
                if (couponKeys[z] == key) {
                  isInsert = false;
                }
              }

              if (isInsert) {
                couponKeys.push(key);
              }
            }

            key = this.setItemCouponDiscountAmount(addItemCoupons, shipping.buyItem, receiver.shippingIndex);

            if (key != '') {
              let isInsert = true;
              for (let z=0;z<couponKeys.length;z++) {
                if (couponKeys[z] == key) {
                  isInsert = false;
                }
              }

              if (isInsert) {
                couponKeys.push(key);
              }
            }

            totalItemSaleAmount += shipping.buyItem.saleAmount;
            totalItemCouponDiscountAmount += shipping.buyItem.couponDiscountAmount;

          } else {
            for (let k=0;k<shipping.buyItems.length;k++) {
              let item = shipping.buyItems[k];

              item.saleAmount = item.beforeDiscountAmount;
              item.couponDiscountAmount = 0;
              item.couponDiscountPrice = 0;

              let key = this.setItemCouponDiscountAmount(itemCoupons, item, receiver.shippingIndex);

              if (key != '') {
                let isInsert = true;
                for (let l=0;l<couponKeys.length;l++) {
                  if (couponKeys[l] == key) {
                    isInsert = false;
                  }
                }

                if (isInsert) {
                  couponKeys.push(key);
                }
              }

              key = this.setItemCouponDiscountAmount(addItemCoupons, item, receiver.shippingIndex);

              if (key != '') {
                let isInsert = true;
                for (let l=0;l<couponKeys.length;l++) {
                  if (couponKeys[l] == key) {
                    isInsert = false;
                  }
                }

                if (isInsert) {
                  couponKeys.push(key);
                }
              }

              totalItemSaleAmount += item.saleAmount;
              totalItemCouponDiscountAmount += item.couponDiscountAmount;

            }
          }

        }
      }

      order.buy.totalItemCouponDiscountAmount = totalItemCouponDiscountAmount;
      order.buy.totalItemSaleAmount = totalItemSaleAmount;

      let totalCartCouponDiscountAmount = 0;
      if (cartCoupons.length > 0) {
        for (let i=0;i<cartCoupons.length;i++) {
          let coupon = cartCoupons[i];
          totalCartCouponDiscountAmount = totalCartCouponDiscountAmount + coupon.discountAmount;
        }
      }


      // 사용자가 상품 쿠폰을 사용하면 배송료가 변경될수 있음
      this.setShippingAmount();

    },
    /**
     * 상품쿠폰 금액 Set
     */
    setItemCouponDiscountAmount: function (itemCoupons, item, shippingIndex) {
      let order = this.order;
      let itemSequence = item.itemSequence;

      // 상품쿠폰 사용 처리
      let coupon = this.getItemCoupon(itemCoupons, itemSequence, shippingIndex);
      let couponKey = '';

      if (coupon != null) {
        item.couponDiscountPrice += coupon.discountPrice;
        item.couponDiscountAmount += coupon.discountAmount;

        item.saleAmount = item.beforeDiscountAmount - item.couponDiscountAmount;
        order.buy.totalItemCouponDiscountAmount = item.couponDiscountAmount;
        couponKey = coupon.key;
      }

      return couponKey;
    },
    /**
     * 상품별 사용 쿠폰 리턴
     */
    getItemCoupon: function (itemCoupons, itemSequence, shippingIndex) {
      if (itemCoupons.length > 0) {
        for(let i = 0; i < itemCoupons.length; i++) {
          let coupon = itemCoupons[i];

          if (coupon.itemSequence == itemSequence && coupon.shippingIndex == shippingIndex) {
            return coupon;
          }
        }
      }

      return null;
    },
    /**
     * 배송비 계산
     */
    setShippingAmount: function () {
      let order = this.order;

      //배송비 계산전 초기화
      order.buy.totalShippingAmount = 0;

      for (let i=0;i<order.buy.receivers.length;i++) {
        let receiver = order.buy.receivers[i];
        let receiverTotalDeliveryChange = 0;
        let receiverTotalDeliveryChange2 = 0;
        let islandType = '';
        let realShipping = 0;

        for (let j=0;j<receiver.shippingList.length;j++) {
          let shipping = receiver.shippingList[j];
          let addDeliveryCharge = 0;
          islandType = shipping.islandType;

          if (shipping.shippingExtraCharge1 > 0 || shipping.shippingExtraCharge2 > 0) {
            if (islandType == 'JEJU') {
              addDeliveryCharge = shipping.shippingExtraCharge1;
            } else if (islandType == 'ISLAND') {
              addDeliveryCharge = shipping.shippingExtraCharge2;
            }
          }

          if (shipping.shippingType == '1') {
            realShipping = addDeliveryCharge;
          } else if (shipping.shippingType == '2' || shipping.shippingType == '3') {
            let totalItemAmount = 0;

            if (shipping.shippingType == '3') {
              if (!shipping.shipmentGroupCode) {
                for (let i=0;i<shipping.buyItems.length;i++) {
                  let item = shipping.buyItems[i];

                  totalItemAmount += item.baseAmountForShipping;
                }
              } else {
                for (let i=0;i<order.buy.receivers.length;i++) {
                  let receiver1 = order.buy.receivers[i];

                  if (receiver.shippingIndex == receiver1.shippingIndex) {
                    for (let j=0;j<receiver1.shippingList.length;j++) {
                      let shipping1 = receiver1.shippingList[j];

                      if (shipping1.shippingType == '3') {
                        for (let k=0;k<shipping1.buyItems.length;k++) {
                          let item1 = shipping1.buyItems[k];

                          if (item1.shipmentGroupCode) {
                            if (shipping1.shipmentGroupCode == item1.shipmentGroupCode) {
                              totalItemAmount += item1.baseAmountForShipping;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              for (let i=0;i<shipping.buyItems.length;i++) {
                let item = shipping.buyItems[i];

                totalItemAmount += item.baseAmountForShipping;
              }

            }

            if (shipping.shippingFreeAmount <= totalItemAmount) {
              realShipping = addDeliveryCharge;
            } else {
              realShipping = shipping.shipping + addDeliveryCharge;
            }
          } else if (shipping.shippingType == '4') {
            let baseAmountForShipping = 0;
            if (shipping.singleShipping) {
              baseAmountForShipping = shipping.buyItem.baseAmountForShipping;
            } else {
              let items = shipping.buyItems;

              if (typeof items != undefined && items.length > 0) {
                for (let i=0;i<items.length;i++) {
                  baseAmountForShipping += items[i].baseAmountForShipping;
                }
              }
            }

            if (shipping.shippingFreeAmount <= baseAmountForShipping) {
              realShipping = addDeliveryCharge;
            } else {
              realShipping = shipping.shipping + addDeliveryCharge;
            }
          } else if (shipping.shippingType = '5') {
            let boxCount = 0;
            if (shipping.singleShipping) {
              boxCount = Math.ceil(Number(shipping.buyItem.quantity) / shipping.shippingItemCount);
            } else {
              let items = shipping.buyItems;

              if (typeof items != undefined && items.length > 0) {
                for (let i=0;i<items.length;i++) {
                  boxCount += Math.ceil(Number(items[i].quantity) / shipping.shippingItemCount);
                }
              }
            }

            realShipping = (shipping.shipping + addDeliveryCharge) * boxCount;
          } else {
            realShipping = shipping.shipping + addDeliveryCharge;
          }

          shipping.realShipping = realShipping;
          shipping.addDeliveryCharge = addDeliveryCharge;

          // 제주/도서산간 배송일 때 배송비 쿠폰 사용 버튼 비노출 2017-04-25 yulsun.yoo
          if (addDeliveryCharge > 0) {
            if (document.getElementById('where_buy_' + shipping.shippingSequence) != null) {
              document.getElementById('where_buy_' + shipping.shippingSequence).style.display = 'none';
              // 제주, 도서산간 지역일 때 배송비 쿠폰 체크 해제 2017-04-25 yulsun.yoo
              document.getElementById('deli_check_' + shipping.shippingSequence).checked = false;
            }
          } else if (shipping.realShipping > 0) {
            if (document.getElementById('where_buy_' + shipping.shippingSequence) != null) {
              document.getElementById('where_buy_' + shipping.shippingSequence).style.display = 'block';
            }
          } else {
            if (document.getElementById('where_buy_' + shipping.shippingSequence) != null) {
              document.getElementById('where_buy_' + shipping.shippingSequence).style.display = 'none';
              // 제주, 도서산간 지역일 때 배송비 쿠폰 체크 해제 2017-04-25 yulsun.yoo
              document.getElementById('deli_check_' + shipping.shippingSequence).checked = false;
            }
          }
        }
      }

      // 배송쿠폰 재설정
      this.setShippingCoupon();

      for (let i=0;i<order.buy.receivers.length;i++) {
        let receiver = order.buy.receivers[i];
        let receiverTotalDeliveryChange = 0;
        let receiverTotalDeliveryChange2 = 0;

        for (let j=0;j<receiver.shippingList.length;j++) {
          let shipping = receiver.shippingList[j];

          if (shipping.shippingPaymentType != '2') {
            receiverTotalDeliveryChange += shipping.realShipping;
            order.buy.totalShippingAmount += shipping.realShipping;
          } else {
            // 착불 금액
            receiverTotalDeliveryChange2 += shipping.realShipping;
          }
        }
      }

      this.setAmountText();
    },

    setShippingCoupon : function (addDeliveryCharge) {
      let order = this.order;

      order.buy.totalShippingCouponDiscountAmount = 0;
      order.buy.totalShippingCouponUseCount = 0;

      if (order.buy.shippingCoupon === 0) return;

      order.useShippingCoupon = 0;
      let useShippingCoupon = {};

      order.buy.receivers.forEach(receiver => {
        for (let shipping of receiver.shippingList) {
          let shippingIndex = receiver.shippingIndex;
          let shippingSequence = shipping.shippingSequence;
          let useCouponCount = 0;

          if (order.buy.shippingCoupon <= order.useShippingCoupon) {
            continue;
          }

          shipping.discountShipping = 0;

          let usedShippingSequence = this.shippingCouponSequences.find(s => s === shippingSequence);

          if (usedShippingSequence != null && shipping.realShipping > 0) {
            shipping.discountShipping = shipping.realShipping - shipping.addDeliveryCharge;

            shipping.realShipping = shipping.realShipping - shipping.discountShipping;
            order.buy.totalShippingCouponDiscountAmount += shipping.discountShipping;
            order.buy.totalShippingCouponUseCount++;
            order.useShippingCoupon++;

            useShippingCoupon['SHIPPING-COUPON-' + shippingSequence] = {
              'discountAmount': shipping.discountShipping,
              'orderCode': null,
              'shippingGroupCode': this.buy.receivers[shippingIndex].itemGroups[shippingSequence].shippingGroupCode,
              'useCouponCount': useCouponCount + 1,
              'useFlag': 'Y',
              'userId': this.buy.userId
            };
          }
        }

        this.buy.useShippingCoupon = useShippingCoupon;
      });
    },
    submit: function() {

      if (vm.searchAddress.receivers[0].addressInfo === null || vm.searchAddress.receivers[0].addressInfo === '') {
        $s.alert("배송지를 입력해주세요.");
        return false;
      }

      if (vm.order.buy.orderPayAmount > 0) {

        let payType = vm.payType;
        if (payType === 'bank') {
          let bank = vm.buy.buyPayments['bank'];
          if (bank.bankVirtualNo === undefined) {
            $s.alert("입금은행을 선택해주세요.");
            return false;
          } else if (bank.bankInName === null || bank.bankInName === '') {
            $s.alert("입금자명을 입력해주세요.");
            return false;
          } else if (bank.bankExpirationDate === undefined) {
            $s.alert("입금예정일을 선택해주세요.");
            return false;
          }
        }

        // 면세상품이 포함되어 있으면 네이버페이 사용 못하게
        if (this.includeTaxFreeItem && payType === 'naverpay') {
            $s.alert('면세상품 구매 시 네이버페이를 이용할 수 없습니다. 다른 결제수단을 선택해 주세요.');
            return false;
        }

        let cashbillCode = vm.buy.cashbill.cashbillCode;
        if (vm.buy.cashbill.cashbillType !== 'NONE' && (payType === 'bank' || payType === 'vbank' || payType === 'realtimebank')) {
          if (cashbillCode === null || cashbillCode === '') {
            $s.alert("현금영수증 발급에 필요한 휴대전화 또는 사업자등록번호를 입력해주세요.");
            return false;
          }
        }

        let cashbillType = vm.buy.cashbill.cashbillType;
        // 휴대폰 번호가 11자리 이상일 경우 나이스페이에서 '2039 : 수기,신분확인자릿수오류' 발생
        if (cashbillType == 'PERSONAL') {
          if (cashbillCode.length > 11) {
            alert("휴대폰 번호를 다시 확인해주세요 ");
            return false;
          }
        }
      }

      if(!document.getElementById('agree', 'input').checked) {
        $s.alert("구매동의 안내를 확인 후 동의해주세요.");
        return false;
      } else {
        vm.setCheckoutStep($s.ga.const.CHECKOUT_CONFIRM_ORDER_STEP);
      }

      vm.payTypeSelect(vm.payType);

      let campaignCode = $s.core.getState($s.const.CAMPAIGN_CODE);
      vm.buy.campaignCode = campaignCode;

      vm.setPhoneMobile(0);

      if(!vm.submitCheck){
        $s.api.orderSave(vm.buy, function (response) {

          // 결제 진행 중 여부 한 번 더 체크 (포인트로만 결제 시 결제하기 버튼 연속으로 클릭하면 중복 결제되는 이슈 있음)
          if (vm.submitCheck) {
            $s.alert("결제가 진행중입니다.");
            return false;
          }

          vm.submitCheck = true;
          let orderCode = response.data.orderCode;
          document.getElementById('orderCode').value = orderCode;
          vm.encryptedString = response.encryptedString;

          if (vm.getApprovalType(response.data.savePaymentType, 'naverpay')) {

            if (vm.order.buy.orderPayAmount < 100) {
              $s.alert("총 결제금액이 100원 미만일 경우 네이버페이를 이용 할 수 없습니다.");
              return false;
            }

            vm.setCheckoutStep($s.ga.const.CHECKOUT_PURCHASE_STEP);
            let oPay = Naver.Pay.create({
              "mode" : "production",
              "clientId" : vm.buy.buyPayments['naverpay'].mid,
              "openType" : "page"
            });

            let returnParam = '?orderCode=' + orderCode + '&amount=' + response.data.naverpay.totalPayAmount + '&encryptedString=' + vm.encryptedString;
            oPay.open({
              "returnUrl" : $s.config.apiDomain + '/api/order/naverpay/payment' + returnParam,
              "merchantPayKey": response.data.orderCode,
              "productName": response.data.naverpay.productName,
              "totalPayAmount": response.data.naverpay.totalPayAmount,
              "taxScopeAmount": response.data.naverpay.taxScopeAmount,
              "taxExScopeAmount": response.data.naverpay.taxExScopeAmount,
              "productItems": response.data.naverpay.productItems,
              "deliveryFee": vm.order.buy.totalShippingAmount,
              "productCount": response.data.naverpay.productCount
            });


          } else if (vm.getApprovalType(response.data.savePaymentType, 'bank') || vm.order.buy.orderPayAmount === 0) {
            nicepaySubmit();
          } else {
            $.each(response.data.pgData, function (key, value) {
              $('.nicepay-input-area > input[name="' + key + '"]').val(value);
            });

            nicepayStart();

          }

          vm.setCheckoutStep($s.ga.const.CHECKOUT_PURCHASE_STEP);
        });
      } else {
        $s.alert("결제가 진행중입니다.");
        return false;
      }
    },
    addressInfoInit: function (buyer, isSns) {

      if(!isSns) {
        let addressInfo = '[' + buyer.newZipcode + ']' + buyer.address;
        this.searchAddress.order.addressInfo = addressInfo;

        addressInfo = '[' + this.buy.receivers[0].receiveNewZipcode + ']' + this.buy.receivers[0].receiveAddress;
        this.searchAddress.receivers[0].addressInfo = addressInfo;

        this.searchAddress.order.mobile = buyer.mobile2 + buyer.mobile3;
        this.searchAddress.receivers[0].mobile = this.buy.receivers[0].receiveMobile2 + this.buy.receivers[0].receiveMobile3;
        this.searchAddress.order.phone = buyer.phone2 + buyer.phone3;
        this.searchAddress.order.email = buyer.email;

        if (addressInfo === "" || addressInfo === undefined) {
          document.getElementById("order_address_placeholder").textContent = "우편번호 찾기";
          document.getElementById("receive0_address_placeholder").textContent = "우편번호 찾기";
        }
      }

     /* this.searchAddress.receivers[0].addressInfo = ""
      this.searchAddress.receivers[0].mobile = ""*/

    },
    getApprovalType: function(array, type) {
      let approvalType = '';
      for (let i = 0; i < array.length; i++) {
        if (array[i] == type) {
          approvalType = array[i];
          return true;
        }
        return (approvalType == "" ? false : true);
      }
    },
    setPhoneMobile: function(index) {
      vm.setPhone('order', index);
      vm.setPhone('receiver', index);

      vm.setMobile('order', index);
      vm.setMobile('receiver', index);

      this.buy.buyer.fullPhone = this.buy.buyer.phone;
      this.buy.buyer.fullMobile = this.buy.buyer.mobile;

      this.buy.receivers[index].fullReceiveMobile = this.buy.receivers[index].receiveMobile;
      this.buy.receivers[index].fullReceivePhone = this.buy.receivers[index].receivePhone;
      this.buy.receivers[index].fullReceiveZipcode = this.buy.receivers[index].receiveNewZipcode;
    },
    setCheckoutStep: function(step) {
      if(this.checkoutSteps.indexOf(step) == -1) {
        this.checkoutSteps.push(step);
        $s.ga.checkout(step);
      }

    },
    offlineCouponCancel : function(){
      vm.offlineCode = '';
    },

    addOfflineCoupon : function(){
      if(typeof vm.offlineCode == 'undefined' || vm.offlineCode == '' ){
        $s.alert("쿠폰번호를 입력해주세요.");
        return false;
      }

      let param = {
        offlineCode : vm.offlineCode
      }

      $s.api.offlineCouponExchange(param,
          function (response) {
            if(response.status==="OK"){
              $s.alert("쿠폰이 등록되었습니다", function() {
                location.reload();
              });

            } else {
              $s.alert("쿠폰 정보를 확인해주세요.");
            }
          }
      );
    },

    /**
     * 배송비 정보가 있는가?
     */
    hasShippingInfo: function(shipping) {
      const shippingTypes = ["2", "3", "4"];
      if (shippingTypes.includes(shipping.shippingType)) {
        return true;
      }

      return false;
    },

    /**
     * 배송비 정보 레이어 OPEN
     */
    showShippingInfoLayer: function(shipping) {
      const shippingTypes = ["2", "3", "4"];

      if (shippingTypes.includes(shipping.shippingType)) {

        this.shippingInfo = shipping;
        this.shippingInfo.isExtraCharge = shipping.shippingExtraCharge1 > 0 || shipping.shippingExtraCharge2;

        $('#op-shipping-info-layer').modal('show');
      }

      //shipping.shippingType == 2 || shipping.shippingType == 3 || shipping.shippingType == 4
    },

    /**
     * 배송비 쿠폰을 적용할 수 있는가?
     */
    canApplyShippingCoupon: function(shipping) {
      const shippingTypes = ["2", "3", "4"];

      return this.buy.shippingCoupon > 0
          && shipping.realShipping > 0
          && shipping.shippingPaymentType === '1'
          && shippingTypes.includes(shipping.shippingType);
    },

    /**
     * 배송비 쿠폰 적용.
     */
    applyShippingCoupon: function (shipping) {
      this.$nextTick(() => {
        if (this.order.buy.shippingCoupon <= this.order.useShippingCoupon) {
          this.shippingCouponSequences = this.shippingCouponSequences.filter(ss => ss != shipping.shippingSequence);
        }

        // 포인트 적용 후 배송비쿠폰 적용시 결제 금액이 마이너스가 나오는 경우가 있음
        this.pointUsed(0);
        this.setShippingAmount();
        // this.setAmountText();
      });
    },

    shippingTypeText: function(shippingType) {
      let text = "";

      if (shippingType == 2) {
        text = "판매자";
      } else if (shippingType == 3) {
        text = "출고지";
      } else if (shippingType == 4) {
        text = "상품";
      }

      return text;
    },

    deliveryText: function(shippingType) {
      let text = "";

      if (shippingType == 2) {
        text = "판매자";
      } else if (shippingType == 3) {
        text = "동일한 출고지";
      } else if (shippingType == 4) {
        text = "해당";
      }

      return text;
    },

    typeCheck(type) {
        if (type === 'clear') {
            vm.isReadOnly = false;
            vm.isDisabled = false;
        } else {
            vm.isReadOnly = true;
            vm.isDisabled = true;
        }
    }
  },
  mounted: function() {
    this.$nextTick(function () {
      // 페이지 로딩 후 실행


      initNicepay(vm, $s);

      let naverpayErrorCode = $s.core.getParameter('naverpayErrorCode');
      if (naverpayErrorCode != '') {
        vm.submitCheck = false;
        let message = '서버 내부 에러가 발생하였습니다. 신속히 조치하겠습니다.';

        if (naverpayErrorCode === 'BAD_REQUEST_PAY_MIN_FAIL') {
          message = '최소 결제 금액을 확인해주세요.';
        } else if (naverpayErrorCode === 'userCancel') {
          message = '결제를 취소하셨습니다.';
        } else if (naverpayErrorCode === 'webhookFail') {
          message = '호출 응답에 실패하였습니다.';
        } else if (naverpayErrorCode === 'paymentTimeExpire') {
          message = '결제 시간이 초과되었습니다.';
        } else if (naverpayErrorCode === 'OwnerAuthFail') {
          message = '본인 카드 인증 오류가 발생했습니다.';
        }

        setTimeout(function() {
          $s.alert(message);
        }, 500);
      }

      $s.api.getSnsInfo(
          function (response) {
            if (response.sns) {
              vm.isSns = true;
            }
          }
      );

      $s.api.paymentStep('', function (response) {
        vm.buy = response.buy;

        vm.buy.failUrl = process.env.FRONTEND + '/order/step1';
        vm.buy.successUrl = process.env.FRONTEND + '/order/step2';

        vm.userDeliveryList = response.userDeliveryList;
        vm.useCoupon = response.useCoupon;
        vm.selectedCoupon = new Array(vm.buy.receivers[0].items.length);
        vm.pointUseMin = response.config.pointUseMin;
        vm.pointUseMax = response.config.pointUseMax;
        vm.pointUseRatio = response.config.pointUseRatio;
        vm.useEscrow =response.useEscrow;
        vm.autoCashReceipt = response.autoCashReceipt;
        vm.config = response.config;
        vm.telCodes = response.telCodes;
        vm.phoneCodes = response.phoneCodes;
        vm.orderInit(response.userData);

        if (vm.buy.isLogin) {
          vm.addressInfoInit(response.buy.buyer, vm.isSns);
        }

        vm.isUseNpayPayment = response.isUseNpayPayment;
        vm.cashbillTypes = response.cashbillTypes;
        vm.buy.cashbill.cashbillType = 'NONE';
        vm.payTypeSelect(vm.buy.defaultPaymentType);

        if ($s.isMobile()) {
          vm.isMobile = true;
          vm.buy.deviceType = 'MOBILE';
        }


        for (let i=0;i<vm.buy.receivers[0].items.length;i++) {
          vm.selectedCoupon[i] = 'clear';
          let item = vm.buy.receivers[0].items[i];

          if (item.itemCoupons !== null) {
            let itemCoupons = new Array(item.itemCoupons.length);
            for (let j = 0; j < item.itemCoupons.length; j++) {
              let coupon = item.itemCoupons[j];
              itemCoupons[j] = {
                'couponKey': 'item-coupon-' + coupon.couponUserId + '-' + item.itemSequence + '-' + item.shippingIndex,
                'couponUserId': coupon.couponUserId,
                'couponType': coupon.couponType,
                'couponConcurrently': coupon.couponConcurrently,
                'discountPrice': coupon.discountPrice,
                'discountAmount': coupon.discountAmount,
                'couponName': coupon.couponName,
                'itemSequence': item.itemSequence,
                'shippingIndex': item.shippingIndex,
                'disabled': false,
                'selected': false,
                'couponApplyAmount': item.itemPrice.saleAmount - coupon.discountAmount
              }
            }

            vm.couponInfo[i] = itemCoupons;
          }
        }

        $s.ga.checkout($s.ga.const.CHECKOUT_INIT_STEP);

        if (vm.buy.isLogin) {
          vm.setCheckoutStep($s.ga.const.CHECKOUT_INPUT_USER_STEP);
        }
        vm.setCheckoutStep($s.ga.const.CHECKOUT_INPUT_PAYMENT_STEP);

        for (let index in vm.buy.items) {
          let item = vm.buy.items[index].item;

          if ('2' === item.taxType) {
            vm.includeTaxFreeItem = true;
            break;
          }
        }

      }, function (error) {

        if ('FAIL_ORDER_SETUP' == error.response.data.code) {
          $s.alert(error.response.data.message, function() {
            $s.redirect('/');
          });
          return;
        }

        $s.alert(error.response.data.description, function() {
          if (error.response.data.description === "결제가능 상품이 없습니다.") {
            $s.redirect('/');
          }
        });
      });

    });
  }
}

</script>
<style>
    .Npay_payment_box {display:none}
</style>

