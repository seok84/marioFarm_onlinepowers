
<template>
    <section class="contents detail_contents item_view">
        <h2 class="screen_out">상품상세페이지</h2>
        <div class="item_category">
            <div class="container">
                <div class="item_dropdown pc">
                    <div class="dropDown_wrap">
                        <div class="dropDown" v-for="(currentCate, index) in currentCategories"
                             v-if="currentCate.codes !== null && currentCate.codes !== 'undefined' && currentCate.codes.length > 0">
                            <button class="btn dropdown-toggle" type="button" :id="'dropdownMenuButton'+index"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {{currentCate.title}}
                            </button>
                            <div class="dropdown-menu" :aria-labelledby="'dropdownMenuButto1'+index">
                                <a v-for="codes in currentCate.codes" :key="codes.url" class="dropdown-item"
                                   @click="link(codes.url, index)">{{codes.name}}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> <!--// item_category E-->
        <div class="view_top container">
            <div class="row no-gutters">
                <div class="col-12 col-lg-6 view_photo">
                    <client-only>
                        <swiper ref="awesomeViewImageSwiper" class="img_area" :options="swiperOption.mainSlider">
                            <div class="sold_out" v-if="item.soldOut === '1'">
                                <p>품절</p>
                                <a href="javascript:" :class="isRestockNotice === true ? 'restock on' : 'restock'" id="restock" @click="restockNotice()">
                                    <img src="/static/images/icon/btn_alert_off.png" class="restock_img" alt="재입고 알림 아이콘 off">
                                    <span class="restock_tit">재입고 알림</span>
                                </a>
                            </div>
                            <swiper-slide v-for="slide in slides" :key="slide.imageId">
                                <a href="javascript:void(0)" data-toggle="modal" data-target=".popup_detail">
                                    <img :src="itemImage(slide.image)" :alt="slide.imageId" @error="errorImage">
                                </a>
                            </swiper-slide>
                            <div class="swiper-button-prev pc" slot="button-prev"><span class="screen_out">이전슬라이드</span></div>
                            <div class="swiper-button-next pc" slot="button-next"><span class="screen_out">다음슬라이드</span></div>
                            <div class="swiper-pagination d-none d-lg-block" slot="pagination"></div>
                        </swiper>

                        <swiper ref="awesomeViewThumbsSwiper" class="thumb_area d-none d-lg-block" :options="swiperOption.thumbSlider" @click-slide="toSlideViewImage">
                            <swiper-slide v-for="(slide, index) in slides" :key="slide.imageId">
                                <img :src="itemImage(slide.image)" :alt="slide.imageId" @error="errorImage" @click="toSlideViewImage(index)">
                            </swiper-slide>
                        </swiper>
                    </client-only>

                </div>
                <!--// view_photo E-->
                <div class="col-12 col-lg-6 view_info">
                    <div class="row no-gutters time_sale_wrap" v-if="item.spotItem">
                        <div class="time_sale">
                            <div class="time_txt">
                                <p class="timesale">
                                    <span>TIME</span>
                                    <span>SALE</span>
                                </p>
                            </div>
                            <div class="time_term">
                                <p class="d_day" v-if="item.spotEndDDay == 0">오늘 마감</p>
                                <p class="d_day" v-else>D-{{item.spotEndDDay}}</p>
                                <p class="time">{{timeFormat(item.spotStartTime)}}~{{timeFormat(item.spotEndTime)}}</p>
                                <p class="date">
                                    <span v-for="code in item.spotWeekDayList" v-if="code.detail == '1'">{{code.label.substring(0,1)}}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!--// spot_sale E -->
                    <div class="tit_area">
                        <div class="badge-wrap">
							<span class="badge badge_txt" v-if="item.itemLabel === '2'">
								<em>NEW</em>
							</span>
                            <span class="badge badge_txt" v-if="item.itemLabel === '3'">
								<em>SALE</em>
							</span>
                            <span class="badge badge_txt" v-if="item.itemType1 === '1'">
								<em>인기상품</em>
							</span>
                            <span class="badge badge_txt" v-if="item.itemType2 === '1'">
								<em>BEST상품</em>
							</span>
                            <span class="badge badge_txt" v-if="item.itemType4 === '1'">
								<em>추천상품</em>
							</span>
                            <span class="badge badge_txt" v-if="item.itemType5 === '1'">
								<em>기본상품</em>
							</span>
                        </div>
                        <div class="brand_mall" v-if="item.brand != ''">
                            <p class="brand">{{item.brand}}</p>
                        </div>
                        <p class="title">{{unescapeHtml(item.itemName)}}</p>
                        <p class="title2">{{unescapeHtml(item.itemSummary)}}</p>
                        <div class="price_area">
                            <p class="before" v-if="item.salePrice > item.presentPrice">
                                <span>{{formatNumber(item.salePrice)}}</span>원
                            </p>
                            <div class="sale_area">
                                <p class="sale" v-if="(Number(item.discountRate) + Number(item.userLevelDiscountRate)) > 0">
                                    {{Number(item.discountRate) + Number(item.userLevelDiscountRate)}}%
                                </p>
                                <p class="price"><span>{{formatNumber(item.presentPrice)}}</span>원</p>
                                <div class="ttip_btn" v-if="item.salePrice > item.presentPrice">
                                    할인혜택보기
                                    <div class="price_ttip">
                                        <p class="tit">할인혜택</p>
                                        <dl class="price_det">
                                            <dd class="top" v-if="Number(item.itemPrice) > 0">
                                                <span>정상가</span>{{formatNumber(item.itemPrice)}}원
                                            </dd>
                                            <dt><span>판매가</span><b>{{formatNumber(item.salePrice)}}</b>원</dt>
                                            <dd v-if="item.itemType === '3' && item.setDiscountPrice > 0">
                                                <span>세트할인</span>-{{formatNumber(item.setDiscountPrice)}}원
                                            </dd>
                                            <dd v-if="item.spotItem && item.spotDiscountAmount > 0">
                                                <span>타임세일</span>-{{formatNumber(item.spotDiscountAmount)}}원
                                            </dd>
                                            <dd v-if="item.sellerDiscountAmount > 0">
                                                <span>즉시할인</span>-{{formatNumber(item.sellerDiscountAmount)}}원
                                            </dd>
                                            <dd v-if="item.userLevelDiscountAmount > 0">
                                                <span>회원추가할인({{item.levelName}} {{item.userLevelDiscountRate}}%)</span>
                                                -{{formatNumber(item.userLevelDiscountAmount)}}원
                                            </dd>
                                        </dl><!--// price_det -->
                                        <div class="btm_total">
                                            <p>최대혜택가</p><b>{{formatNumber(item.presentPrice)}}</b>원
                                        </div><!--// btm_total -->
                                    </div><!--// price_ttip -->
                                </div><!--// ttip_btn -->
                            </div>
                        </div>
                        <a href=".layer_sns" class="btn_sns" data-toggle="modal"><img src="/static/images/icon/btn_share.png" alt="sns공유하기"></a>
                    </div>
                    <!--// tit_area E -->
                    <div class="info_area">
                        <dl class="row no-gutters">
                            <template v-if="cardBenefits">
                                <dt class="col-4 col-md-3">카드혜택</dt>
                                <dd class="col-8 col-md-9">
                                    <div class="dropdown_detail">
                                        <button type="button" class="btn dropdown-toggle" data-toggle="collapse"
                                                data-target="#dropdown1" aria-expanded="false" aria-controls="dropdown1">
                                            <strong>{{cardBenefits.subject}}</strong>
                                        </button>
                                    </div>
                                </dd>
                                <dd class="col-12 dropdown_content_wrap">
                                    <div id="dropdown1" class="collapse dropdown_content">
                                        <p v-html="cardBenefits.content"></p>
                                    </div>
                                </dd>
                            </template>
                            <dt class="col-4 col-md-3 img_lineheight">상품쿠폰</dt>
                            <dd class="col-8 col-md-9"><a href="javascript:;" class="btn btn_coupon" data-toggle="modal"
                                                          data-target=".pop_down_coupon">쿠폰다운</a></dd>
                            <dt class="col-4 col-md-3">적립예정포인트</dt>
                            <dd class="col-8 col-md-9">
                                {{pointInfoText}}
                            </dd>
                            <dt class="col-4 col-md-3">상품코드</dt>
                            <dd class="col-8 col-md-9">{{item.itemUserCode}}</dd>
                            <dt class="col-4 col-md-3">배송정보</dt>
                            <dd class="col-8 col-md-9">
                                <p>
                                    {{shippingText}}
                                </p>
                                <p v-if="item.shippingExtraCharge1 > 0 || item.shippingExtraCharge2 > 0">
                                    {{shippingExtraText}}
                                </p>
                                <a href="javascript:;" class="etc" data-toggle="modal" data-target=".pop_delivery_location">도서산간
                                    지역보기</a>
                            </dd>
                            <template v-if="item.freeGiftFlag == 'Y' ">
                                <dt class="col-5 col-lg-4">사은품</dt>
                                <dd class="col-7 col-lg-8">{{item.freeGiftName}}</dd>
                            </template>
                        </dl>
                    </div>
                    <!-- 하단 레이어 바로구매 -->
                    <div class="detail_view_wrap d-none d-md-block">
                        <template v-if="item.itemSoldOutFlag === 'N'">
                            <a href="javascript:void(0)" class="btn_open2">바로구매</a>
                        </template>
                        <h4 class="option_layer_tit">{{unescapeHtml(item.itemName)}}</h4>
                        <div class="view_wrap">
                            <div class="view_left">
                                <!-- ============ 세트상품 (PC) ============ -->
                                <template v-if="item.itemType === '3'">
                                    <!-- 수량 -->
                                    <div class="amt_box" v-if="item.itemOptionFlag === 'N' && item.itemSoldOutFlag === 'N'">
                                        <span>수량</span>
                                        <div class="btn_amt_box">
                                            <button type="button" class="btn_minus">
                                                <img src="/static/images/icon/btn_minus.png" alt="-" @click="minus(0)">
                                            </button>
                                            <input type="number" title="수량" v-model="param.order.itemSets[0].quantity" class="form-control box number" v-on:input="inputQuantity($event, 0)">
                                            <button type="button" class="btn_plus" @click="plus(0)">
                                                <img src="/static/images/icon/btn_add.png" alt="+">
                                            </button>
                                        </div>
                                    </div>
                                    <!-- 구성 상품 -->
                                    <div class="set_box">
                                        <a href="#" class="set_btn">구성상품</a>
                                        <ul class="set_det">
                                            <li v-for="(data, pIndex) in item.itemSets">
                                                <a :href="'/item/' + data.item.itemUserCode" class="img">
                                                    <img :src="itemImage(data.item.imageSrc)" :alt="unescapeHtml(data.item.itemName)" @error="errorImage">
                                                </a>
                                                <div class="info">
                                                    <a :href="'/item/' + data.item.itemUserCode" class="tit">
                                                        {{unescapeHtml(data.item.itemName)}}
                                                        <span>({{data.quantity}}개씩 구매되는 상품)</span>
                                                    </a>
                                                    <p class="price">{{formatNumber(data.item.salePrice)}}원</p>
                                                    <!-- 옵션 선택 -->
                                                    <div class="dropdown_box" v-if="data.item.itemOptionFlag === 'Y'">
                                                        <button type="button" class="custom-select box select-pc" @click="writeSetOptionName(pIndex)">
                                                            [필수] 옵션 선택
                                                        </button>
                                                        <div class="option_drop">
                                                            <div class="drop_inner">
                                                                <p class="drop_tit">옵션</p>
                                                                <!-- 옵션 상품 (S) -->
                                                                <div class="dropdown_area" v-if="data.item.itemOptionType === 'S'">
                                                                    <button class="tit">{{unescapeHtml(data.item.itemOptions[0].optionName1)}}</button>
                                                                    <div class="option_btn">
                                                                        <button type="button" v-for="(option1, index) in data.item.itemOptions"
                                                                                @click="writeOptionName(1, option1.optionName2, index, pIndex)"
                                                                                :disabled="option1.soldOut">
                                                                            {{unescapeHtml(option1.optionName2)}}
                                                                            <template v-if="option1.optionPrice > 0">(+{{formatNumber(option1.optionPrice)}}원)</template>
                                                                            <template v-if="option1.soldOut">[품절]</template>
                                                                            <template v-else-if="option1.optionStockFlag == 'Y' && option1.optionStockQuantity > 0">| 재고 {{option1.optionStockQuantity}}개</template>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <!-- 옵션 상품 (S2, S3) -->
                                                                <div class="dropdown_area" v-else-if="data.item.itemOptionType === 'S2' || data.item.itemOptionType === 'S3'">
                                                                    <!-- 옵션 1 -->
                                                                    <button class="tit itemOptionTitle1" v-if="data.item.itemOptionTitle1" @click="selectOptionTitle(1, pIndex)">
                                                                        {{unescapeHtml(itemOptionInfo.itemOptionTitle1)}}
                                                                        {{itemOptionInfo.selectOptionName1 == '' ? '' : '- ' +
                                                                            unescapeHtml(itemOptionInfo.selectOptionName1)}}
                                                                    </button>
                                                                    <div class="option_btn" v-if="data.item.itemOptionTitle1">
                                                                        <button type="button" v-for="(option1, index) in itemOptionInfo.optionName1"
                                                                                @click="writeOptionName(1, option1, index, pIndex)">
                                                                            {{unescapeHtml(option1)}}
                                                                        </button>
                                                                    </div>
                                                                    <!-- 옵션 2 -->
                                                                    <button class="tit itemOptionTitle2" v-if="data.item.itemOptionTitle1" @click="selectOptionTitle(2, pIndex)">
                                                                        {{unescapeHtml(itemOptionInfo.itemOptionTitle2)}}
                                                                    </button>
                                                                    <div class="option_btn" v-if="data.item.itemOptionTitle1">
                                                                        <button type="button" v-for="(option2, index) in itemOptionInfo.optionName2"
                                                                                @click="writeOptionName(2, option2, index, pIndex)"
                                                                                :disabled="data.item.itemOptionType === 'S2' && itemOptionInfo.optionSoldOuts[index]">
                                                                            {{unescapeHtml(option2)}}
                                                                            <template v-if="data.item.itemOptionType === 'S2' && itemOptionInfo.optionPrices[index] > 0">(+{{formatNumber(itemOptionInfo.optionPrices[index])}}원)</template>
                                                                            <template v-if="data.item.itemOptionType === 'S2' && itemOptionInfo.optionSoldOuts[index]">[품절]</template>
                                                                            <template v-else-if="data.item.itemOptionType === 'S2' && itemOptionInfo.optionStockFlags[index] == 'Y' && itemOptionInfo.optionStockQuantity[index] > 0">| 재고 {{itemOptionInfo.optionStockQuantity[index]}}개</template>
                                                                        </button>
                                                                    </div>
                                                                    <!-- 옵션 3 -->
                                                                    <button class="tit itemOptionTitle3" v-if="data.item.itemOptionTitle3">
                                                                        {{unescapeHtml(itemOptionInfo.itemOptionTitle3)}}
                                                                    </button>
                                                                    <div class="option_btn" v-if="data.item.itemOptionTitle3">
                                                                        <button type="button" v-for="(option3, index) in itemOptionInfo.optionName3"
                                                                                @click="writeOptionName(3, option3, index, pIndex)"
                                                                                :disabled="data.item.itemOptionType === 'S3' && itemOptionInfo.optionSoldOuts[index]">
                                                                            {{unescapeHtml(option3)}}
                                                                            <template v-if="data.item.itemOptionType === 'S3' && itemOptionInfo.optionPrices[index] > 0">(+{{formatNumber(itemOptionInfo.optionPrices[index])}}원)</template>
                                                                            <template v-if="data.item.itemOptionType === 'S3' && itemOptionInfo.optionSoldOuts[index]">[품절]</template>
                                                                            <template v-else-if="data.item.itemOptionType === 'S3' && itemOptionInfo.optionStockFlags[index] == 'Y' && itemOptionInfo.optionStockQuantity[index] > 0">| 재고 {{itemOptionInfo.optionStockQuantity[index]}}개</template>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <button type="button" class="drop_close"><span class="screen_out">옵션 닫기 버튼</span></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <!-- 옵션 선택 결과 리스트 -->
                                    <div class="option_list" v-if="item.itemOptionFlag === 'Y'">
                                        <ul class="list_in">
                                            <li v-for="(info, pIndex) in param.order.itemSets">
                                                <p class="op_tit">
                                                    <template v-for="(data, index) in info.arrayItemSetInfos">
                                                        구성상품{{index + 1}} {{unescapeHtml(data.itemName)}} ({{data.quantity}}개)
                                                        <span v-if="data.itemOption != null">- {{unescapeHtml(data.itemOption.optionName)}}</span>
                                                        <span v-else></span>
                                                    </template>
                                                </p>
                                                <div class="price_wrap">
                                                    <div class="amt_box">
                                                        <button type="button" class="btn_minus" @click="minus(pIndex)">
                                                            <img src="/static/images/icon/btn_minus.png" alt="-">
                                                        </button>
                                                        <input type="text" title="수량" v-model="info.quantity" class="form-control box number" v-on:input="inputQuantity($event, pIndex)">
                                                        <button type="button" class="btn_plus" @click="plus(pIndex)">
                                                            <img src="/static/images/icon/btn_add.png" alt="+">
                                                        </button>
                                                    </div>
                                                    <div class="text-right">
                                                        <p class="op_price"><span>{{formatNumber(info.amount)}}</span>원</p>
                                                    </div>
                                                </div>
                                                <a href="javascript:;" class="btn_item_delete" @click="param.order.itemSets.splice(pIndex, 1)">
                                                    <img src="/static/images/icon/icon_close_black.png" alt="옵션삭제">
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </template>
                                <!-- ============ 일반상품 (PC) ============ -->
                                <template v-else>
                                    <!-- 수량 -->
                                    <template v-if="item.itemOptionFlag === 'N'">
                                        <div class="amt_box" v-for="(optionInfo, index) in itemOptionInfo.addOptionList">
                                            <span>수량</span>
                                            <div class="btn_amt_box">
                                                <button type="button" class="btn_minus">
                                                    <img src="/static/images/icon/btn_minus.png" alt="-" @click="minus(index)">
                                                </button>
                                                <input type="number" title="수량" v-model="optionInfo.quantity"
                                                       class="form-control box number" v-on:input="inputQuantity($event, index)">
                                                <button type="button" class="btn_plus" @click="plus(index)">
                                                    <img src="/static/images/icon/btn_add.png" alt="+">
                                                </button>
                                            </div>
                                        </div>
                                    </template>
                                    <!-- 선택형 옵션 (S, S2, S3) 선택 -->
                                    <div class="dropdown_box" v-if="item.itemOptionFlag === 'Y' && item.itemOptionType !== 'T'">
                                        <button type="button" class="custom-select box select-pc">상품 옵션을 선택하세요.</button>
                                        <div class="option_drop">
                                            <div class="drop_inner">
                                                <p class="drop_tit">상품 옵션을 선택하세요.</p>
                                                <div class="dropdown_area" v-if="item.itemOptionType === 'S'">
                                                    <button class="tit">{{unescapeHtml(item.itemOptions[0].optionName1)}}</button>
                                                    <div class="option_btn">
                                                        <button type="button" v-for="(option1, index) in item.itemOptions"
                                                                @click="writeOptionName(1 ,option1.optionName2, index)"
                                                                :disabled="option1.soldOut">
                                                            {{unescapeHtml(option1.optionName2)}}
                                                            <template v-if="option1.optionPrice > 0">(+{{formatNumber(option1.optionPrice)}}원)</template>
                                                            <template v-if="option1.soldOut">[품절]</template>
                                                            <template v-else-if="option1.optionStockFlag == 'Y' && option1.optionStockQuantity > 0">| 재고 {{option1.optionStockQuantity}}개</template>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="dropdown_area" v-if="item.itemOptionType === 'S2' || item.itemOptionType === 'S3'">
                                                    <button class="tit itemOptionTitle1" v-if="item.itemOptionTitle1" @click="selectOptionTitle(1)">
                                                        {{unescapeHtml(itemOptionInfo.itemOptionTitle1)}}
                                                        {{unescapeHtml(itemOptionInfo.selectOptionName1) == '' ? '' : '- ' +
                                                            unescapeHtml(itemOptionInfo.selectOptionName1)}}
                                                    </button>
                                                    <div class="option_btn" v-if="item.itemOptionTitle1">
                                                        <button type="button"
                                                                v-for="(option1, index) in itemOptionInfo.optionName1"
                                                                @click="writeOptionName(1, option1, index)">
                                                            {{unescapeHtml(option1)}}
                                                        </button>
                                                    </div>
                                                    <button class="tit itemOptionTitle2" v-if="item.itemOptionTitle1" @click="selectOptionTitle(2)">
                                                        {{unescapeHtml(itemOptionInfo.itemOptionTitle2)}}
                                                        {{unescapeHtml(itemOptionInfo.selectOptionName2) == '' ? '' : '- ' +
                                                            unescapeHtml(itemOptionInfo.selectOptionName2)}}
                                                    </button>
                                                    <div class="option_btn" v-if="item.itemOptionTitle1">
                                                        <button type="button"
                                                                v-for="(option2, index) in itemOptionInfo.optionName2"
                                                                @click="writeOptionName(2, option2, index)"
                                                                :disabled="item.itemOptionType === 'S2' && itemOptionInfo.optionSoldOuts[index]">
                                                            {{unescapeHtml(option2)}}
                                                            <template v-if="item.itemOptionType === 'S2' && itemOptionInfo.optionPrices[index] > 0">(+{{formatNumber(itemOptionInfo.optionPrices[index])}}원)</template>
                                                            <template v-if="item.itemOptionType === 'S2' && itemOptionInfo.optionSoldOuts[index]">[품절]</template>
                                                            <template v-else-if="item.itemOptionType === 'S2' && itemOptionInfo.optionStockFlags[index] == 'Y' && itemOptionInfo.optionStockQuantity[index] > 0">| 재고 {{itemOptionInfo.optionStockQuantity[index]}}개</template>
                                                        </button>
                                                    </div>
                                                    <button class="tit itemOptionTitle3" v-if="item.itemOptionTitle3" @click="selectOptionTitle(3)">
                                                        {{unescapeHtml(itemOptionInfo.itemOptionTitle3)}}
                                                    </button>
                                                    <div class="option_btn" v-if="item.itemOptionTitle3">
                                                        <button type="button"
                                                                v-for="(option3, index) in itemOptionInfo.optionName3"
                                                                @click="writeOptionName(3, option3, index)"
                                                                :disabled="item.itemOptionType === 'S3' && itemOptionInfo.optionSoldOuts[index]">
                                                            {{unescapeHtml(option3)}}
                                                            <template v-if="item.itemOptionType === 'S3' && itemOptionInfo.optionPrices[index] > 0">(+{{formatNumber(itemOptionInfo.optionPrices[index])}}원)</template>
                                                            <template v-if="item.itemOptionType === 'S3' && itemOptionInfo.optionSoldOuts[index]">[품절]</template>
                                                            <template v-else-if="item.itemOptionType === 'S3' && itemOptionInfo.optionStockFlags[index] == 'Y' && itemOptionInfo.optionStockQuantity[index] > 0">| 재고 {{itemOptionInfo.optionStockQuantity[index]}}개</template>
                                                        </button>
                                                    </div>
                                                </div>
                                                <button type="button" class="drop_close"><span class="screen_out">옵션 닫기 버튼</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 텍스트 옵션 (T) 선택 -->
                                    <div class="txt_box" v-if="item.itemOptionFlag === 'Y' && item.itemOptionType === 'T'">
                                        <div class="item-option-info"  v-for="(option, index) in item.itemOptions">
                                            <p><strong>{{unescapeHtml(option.optionName1)}}</strong></p>
                                            <input type="hidden" class="text-option-id" :value="option.itemOptionId" />
                                            <input type="hidden" class="text-option-name" :value="option.optionName1" />
                                            <input type="text" class="form-control box text-option-value" name="text-option-value">
                                        </div>
                                        <div>
                                            <button type="button" class="btn btn_m btn_outline_secondary btn_add" @click="addTextOption()">추가</button>
                                        </div>
                                    </div>
                                    <!-- 옵션 선택 결과 리스트 -->
                                    <div class="option_list" v-if="item.itemOptionFlag === 'Y'">
                                        <ul class="list_in">
                                            <li v-for="(optionInfo, index) in itemOptionInfo.addOptionList">
                                                <p class="op_tit">{{unescapeHtml(optionInfo.optionName)}}</p>
                                                <div class="price_wrap">
                                                    <div class="amt_box">
                                                        <button type="button" class="btn_minus" @click="minus(index)">
                                                            <img src="/static/images/icon/btn_minus.png" alt="-">
                                                        </button>
                                                        <input type="text" title="수량" v-model="optionInfo.quantity" class="number" v-on:input="inputQuantity($event, index)">
                                                        <button type="button" class="btn_plus" @click="plus(index)">
                                                            <img src="/static/images/icon/btn_add.png" alt="+">
                                                        </button>
                                                    </div>
                                                    <div class="text-right">
                                                        <p class="op_price">
                                                            <span>{{formatNumber(optionInfo.optionPrice)}}</span>원
                                                        </p>
                                                    </div>
                                                </div>
                                                <a href="javascript:;" class="btn_item_delete" @click="deleteOption(index)" v-if="item.itemOptionFlag == 'Y'">
                                                    <img src="/static/images/icon/icon_close_black.png" alt="옵션삭제">
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </template>
                            </div>
                            <div class="view_right">
                                <div class="option_total">
                                    <span class="total">
                                        <strong>합계</strong>
                                    </span>
                                    <span class="total" v-if="item.itemType === '3'">
                                        <strong>{{formatNumber(setItemTotal)}}</strong>원
                                    </span>
                                    <span class="total" v-else>
										<strong>{{formatNumber(optionItemTotal)}}</strong>원
									</span>
                                </div>
                                <div class="option_btn_wrap" v-if="item.itemSoldOutFlag === 'N'">
                                    <div class="option_btn_area top">
                                        <a href="#" class="btn btn_save" @click="addToWishList">
                                            <span class="screen_out">찜하기</span>
                                        </a>
                                        <a href="#" class="btn btn_secondary" @click="addToCart">장바구니</a>
                                        <a href="#" class="btn btn_primary" @click="buyOrder">바로구매</a>
                                    </div>
                                    <!-- ======= 네이버페이 ======== -->
                                    <template v-if="item.naverPayFlag">
                                        <div class="npay_type1">
                                            <naver-pay-button :order-type="'item'" :is-mobile="this.isMobile"></naver-pay-button>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="option_area d-block d-md-none">
                        <button type="button" class="btn_open"><span class="screen_out">옵션버튼</span></button>
                        <div class="conts_area type_option">
                            <!-- ============ 세트상품 (MOBILE) ============ -->
                            <template v-if="item.itemType === '3'">
                                <!-- 수량 -->
                                <div class="amt_box" v-if="item.itemOptionFlag === 'N' && item.itemSoldOutFlag === 'N'">
                                    <button type="button" class="btn_minus" @click="minus(0)"><img src="/static/images/icon/btn_minus.png" alt="마이너스 버튼"></button>
                                    <input type="number" title="수량" v-model="param.order.itemSets[0].quantity"
                                           class="form-control box number" v-on:input="inputQuantity($event, 0)">
                                    <button type="button" class="btn_plus" @click="plus(0)"><img src="/static/images/icon/btn_add.png" alt="플러스 버튼"></button>
                                </div>
                                <!-- 구성 상품 -->
                                <div class="option_yes">
                                    <div class="set_box">
                                        <a href="#" class="set_btn">구성상품</a>
                                        <ul class="set_det">
                                            <li v-for="(data, pIndex) in item.itemSets">
                                                <a :href="'/item/' + data.item.itemUserCode" class="img">
                                                    <img :src="itemImage(data.item.imageSrc)" :alt="unescapeHtml(data.item.itemName)" @error="errorImage">
                                                </a>
                                                <div class="info">
                                                    <a :href="'/item/' + data.item.itemUserCode" class="tit">
                                                        {{unescapeHtml(data.item.itemName)}}
                                                        <span>({{data.quantity}}개씩 구매되는 상품)</span>
                                                    </a>
                                                    <p class="price">{{formatNumber(data.item.salePrice)}}원</p>
                                                    <!-- 옵션 선택 -->
                                                    <div class="dropdown_box" v-if="data.item.itemOptionFlag === 'Y'">
                                                        <button type="button" class="custom-select box select-pc" @click="writeSetOptionName(pIndex)">[필수] 옵션 선택</button>
                                                        <div class="option_drop">
                                                            <div class="drop_inner">
                                                                <p class="drop_tit">옵션</p>
                                                                <!-- 옵션 상품 (S) -->
                                                                <div class="dropdown_area" v-if="data.item.itemOptionType === 'S'">
                                                                    <button class="tit">{{unescapeHtml(data.item.itemOptions[0].optionName1)}}</button>
                                                                    <div class="option_btn">
                                                                        <button type="button" v-for="(option1, index) in data.item.itemOptions"
                                                                                @click="writeOptionName(1, option1.optionName2, index, pIndex)"
                                                                                :disabled="option1.soldOut">
                                                                            {{unescapeHtml(option1.optionName2)}}
                                                                            <template v-if="option1.optionPrice > 0">(+{{formatNumber(option1.optionPrice)}}원)</template>
                                                                            <template v-if="option1.soldOut">[품절]</template>
                                                                            <template v-else-if="option1.optionStockFlag == 'Y' && option1.optionStockQuantity > 0">| 재고 {{option1.optionStockQuantity}}개</template>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <!-- 옵션 상품 (S2, S3) -->
                                                                <div class="dropdown_area" v-else-if="data.item.itemOptionType === 'S2' || data.item.itemOptionType === 'S3'">
                                                                    <!-- 옵션 1 -->
                                                                    <button class="tit itemOptionTitle1" v-if="data.item.itemOptionTitle1" @click="selectOptionTitle(1, pIndex)">
                                                                        {{unescapeHtml(itemOptionInfo.itemOptionTitle1)}}
                                                                        {{itemOptionInfo.selectOptionName1 == '' ? '' : '- ' +
                                                                            unescapeHtml(itemOptionInfo.selectOptionName1)}}
                                                                    </button>
                                                                    <div class="option_btn" v-if="data.item.itemOptionTitle1">
                                                                        <button type="button" v-for="(option1, index) in itemOptionInfo.optionName1"
                                                                                @click="writeOptionName(1, option1, index, pIndex)">
                                                                            {{unescapeHtml(option1)}}
                                                                        </button>
                                                                    </div>
                                                                    <!-- 옵션 2 -->
                                                                    <button class="tit itemOptionTitle2" v-if="data.item.itemOptionTitle1" @click="selectOptionTitle(2, pIndex)">
                                                                        {{unescapeHtml(itemOptionInfo.itemOptionTitle2)}}
                                                                    </button>
                                                                    <div class="option_btn" v-if="data.item.itemOptionTitle1">
                                                                        <button type="button" v-for="(option2, index) in itemOptionInfo.optionName2"
                                                                                @click="writeOptionName(2, option2, index, pIndex)"
                                                                                :disabled="data.item.itemOptionType === 'S2' && itemOptionInfo.optionSoldOuts[index]">
                                                                            {{unescapeHtml(option2)}}
                                                                            <template v-if="data.item.itemOptionType === 'S2' && itemOptionInfo.optionPrices[index] > 0">(+{{formatNumber(itemOptionInfo.optionPrices[index])}}원)</template>
                                                                            <template v-if="data.item.itemOptionType === 'S2' && itemOptionInfo.optionSoldOuts[index]">[품절]</template>
                                                                            <template v-else-if="data.item.itemOptionType === 'S2' && itemOptionInfo.optionStockFlags[index] == 'Y' && itemOptionInfo.optionStockQuantity[index] > 0">| 재고 {{itemOptionInfo.optionStockQuantity[index]}}개</template>
                                                                        </button>
                                                                    </div>
                                                                    <!-- 옵션 3 -->
                                                                    <button class="tit itemOptionTitle3" v-if="data.item.itemOptionTitle3">
                                                                        {{unescapeHtml(itemOptionInfo.itemOptionTitle3)}}
                                                                    </button>
                                                                    <div class="option_btn" v-if="data.item.itemOptionTitle3">
                                                                        <button type="button" v-for="(option3, index) in itemOptionInfo.optionName3"
                                                                                @click="writeOptionName(3, option3, index, pIndex)"
                                                                                :disabled="data.item.itemOptionType === 'S3' && itemOptionInfo.optionSoldOuts[index]">
                                                                            {{unescapeHtml(option3)}}
                                                                            <template v-if="data.item.itemOptionType === 'S3' && itemOptionInfo.optionPrices[index] > 0">(+{{formatNumber(itemOptionInfo.optionPrices[index])}}원)</template>
                                                                            <template v-if="data.item.itemOptionType === 'S3' && itemOptionInfo.optionSoldOuts[index]">[품절]</template>
                                                                            <template v-else-if="data.item.itemOptionType === 'S3' && itemOptionInfo.optionStockFlags[index] == 'Y' && itemOptionInfo.optionStockQuantity[index] > 0">| 재고 {{itemOptionInfo.optionStockQuantity[index]}}개</template>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <button type="button" class="drop_close"><span class="screen_out">옵션 닫기 버튼</span></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <!-- 옵션 선택 결과 리스트 -->
                                    <div class="option_list" v-if="item.itemOptionFlag === 'Y'">
                                        <ul class="list_in">
                                            <li v-for="(info, pIndex) in param.order.itemSets">
                                                <p class="op_tit">
                                                    <template v-for="(data, index) in info.arrayItemSetInfos">
                                                        구성상품{{index + 1}} {{unescapeHtml(data.itemName)}}
                                                        <span v-if="data.itemOption != null">- {{unescapeHtml(data.itemOption.optionName)}}</span>
                                                        <span v-else></span>
                                                    </template>
                                                </p>
                                                <div class="amt_box">
                                                    <button type="button" class="btn_minus" @click="minus(pIndex)">
                                                        <img src="/static/images/icon/btn_minus.png" alt="-">
                                                    </button>
                                                    <input type="text" title="수량" v-model="info.quantity" class="number" v-on:input="inputQuantity($event, pIndex)">
                                                    <button type="button" class="btn_plus" @click="plus(pIndex)">
                                                        <img src="/static/images/icon/btn_add.png" alt="+">
                                                    </button>
                                                </div>
                                                <a href="javascript:;" class="btn_item_delete" @click="param.order.itemSets.splice(pIndex, 1)">
                                                    <img src="/static/images/icon/icon_close_black.png" alt="옵션삭제">
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </template>
                            <!-- ============ 일반상품 (MOBILE) ============ -->
                            <template v-else>
                                <!-- 수량 -->
                                <div class="amt_box" v-if="item.itemOptionFlag === 'N' && item.itemSoldOutFlag === 'N'" v-for="(optionInfo, index) in itemOptionInfo.addOptionList">
                                    <button type="button" class="btn_minus" @click="minus(index)">
                                        <img src="/static/images/icon/btn_minus.png" alt="마이너스 버튼">
                                    </button>
                                    <input type="number" title="수량" v-model="optionInfo.quantity" class="form-control box number" v-on:input="inputQuantity($event, index)">
                                    <button type="button" class="btn_plus" @click="plus(index)">
                                        <img src="/static/images/icon/btn_add.png" alt="플러스 버튼">
                                    </button>
                                </div>
                                <!-- 옵션 -->
                                <div class="option_yes" v-if="item.itemOptionFlag === 'Y'">
                                    <!-- 선택형 옵션 (S, S2, S3) 선택 -->
                                    <div class="dropdown_box" v-if="item.itemOptionType !== 'T'">
                                        <button type="button" class="custom-select box select-pc">상품 옵션을 선택하세요.</button>
                                        <div class="option_drop">
                                            <div class="drop_inner">
                                                <p class="drop_tit">상품 옵션을 선택하세요.</p>
                                                <div class="dropdown_area" v-if="item.itemOptionType === 'S'">
                                                    <button class="tit">{{unescapeHtml(item.itemOptions[0].optionName1)}}</button>
                                                    <div class="option_btn">
                                                        <button type="button"
                                                                v-for="(option1, index) in item.itemOptions"
                                                                @click="writeOptionName(1, option1.optionName2, index)"
                                                                :disabled="option1.soldOut">
                                                            {{unescapeHtml(option1.optionName2)}}
                                                            <template v-if="option1.optionPrice > 0">(+{{formatNumber(option1.optionPrice)}}원)</template>
                                                            <template v-if="option1.soldOut">[품절]</template>
                                                            <template v-else-if="option1.optionStockFlag == 'Y' && option1.optionStockQuantity > 0">| 재고 {{option1.optionStockQuantity}}개</template>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="dropdown_area"
                                                     v-if="item.itemOptionType === 'S2' || item.itemOptionType === 'S3'">
                                                    <button class="tit itemOptionTitle1"
                                                            v-if="item.itemOptionTitle1" @click="selectOptionTitle(1)">
                                                        {{unescapeHtml(itemOptionInfo.itemOptionTitle1)}}
                                                        {{unescapeHtml(itemOptionInfo.selectOptionName1) == '' ? '' : '- ' +
                                                            unescapeHtml(itemOptionInfo.selectOptionName1)}}
                                                    </button>
                                                    <div class="option_btn" v-if="item.itemOptionTitle1">
                                                        <button type="button"
                                                                v-for="(option1, index) in itemOptionInfo.optionName1"
                                                                @click="writeOptionName(1, option1, index)">
                                                            {{unescapeHtml(option1)}}
                                                        </button>
                                                    </div>
                                                    <button class="tit itemOptionTitle2"
                                                            v-if="item.itemOptionTitle1" @click="selectOptionTitle(2)">
                                                        {{unescapeHtml(itemOptionInfo.itemOptionTitle2)}}
                                                    </button>
                                                    <div class="option_btn" v-if="item.itemOptionTitle1">
                                                        <button type="button"
                                                                v-for="(option2, index) in itemOptionInfo.optionName2"
                                                                @click="writeOptionName(2, option2, index)"
                                                                :disabled="item.itemOptionType === 'S2' && itemOptionInfo.optionSoldOuts[index]">
                                                            {{unescapeHtml(option2)}}
                                                            <template v-if="item.itemOptionType === 'S2' && itemOptionInfo.optionPrices[index] > 0">(+{{formatNumber(itemOptionInfo.optionPrices[index])}}원)</template>
                                                            <template v-if="item.itemOptionType === 'S2' && itemOptionInfo.optionSoldOuts[index]">[품절]</template>
                                                            <template v-else-if="item.itemOptionType === 'S2' && itemOptionInfo.optionStockFlags[index] == 'Y' && itemOptionInfo.optionStockQuantity[index] > 0">| 재고 {{itemOptionInfo.optionStockQuantity[index]}}개</template>
                                                        </button>
                                                    </div>
                                                    <button class="tit itemOptionTitle3" v-if="item.itemOptionTitle3" @click="selectOptionTitle(3)">
                                                        {{unescapeHtml(itemOptionInfo.itemOptionTitle3)}}
                                                    </button>
                                                    <div class="option_btn" v-if="item.itemOptionTitle3">
                                                        <button type="button"
                                                                v-for="(option3, index) in itemOptionInfo.optionName3"
                                                                @click="writeOptionName(3, option3, index)"
                                                                :disabled="item.itemOptionType === 'S3' && itemOptionInfo.optionSoldOuts[index]">
                                                            {{unescapeHtml(option3)}}
                                                            <template v-if="item.itemOptionType === 'S3' && itemOptionInfo.optionPrices[index] > 0">(+{{formatNumber(itemOptionInfo.optionPrices[index])}}원)</template>
                                                            <template v-if="item.itemOptionType === 'S3' && itemOptionInfo.optionSoldOuts[index]">[품절]</template>
                                                            <template v-else-if="item.itemOptionType === 'S3' && itemOptionInfo.optionStockFlags[index] == 'Y' && itemOptionInfo.optionStockQuantity[index] > 0">| 재고 {{itemOptionInfo.optionStockQuantity[index]}}개</template>
                                                        </button>
                                                    </div>
                                                </div>
                                                <button type="button" class="drop_close">
                                                    <span class="screen_out">옵션 닫기 버튼</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 텍스트 옵션 (T) 선택 -->
                                    <div class="txt_box" v-if="item.itemOptionType === 'T'">
                                        <div class="item-option-info"  v-for="(option, index) in item.itemOptions">
                                            <p><strong>{{unescapeHtml(option.optionName1)}}</strong></p>
                                            <input type="hidden" class="text-option-id" :value="option.itemOptionId" />
                                            <input type="hidden" class="text-option-name" :value="option.optionName1" />
                                            <input type="text" class="form-control box text-option-value" name="text-option-value">
                                        </div>
                                        <div>
                                            <button type="button" class="btn btn_m btn_outline_secondary btn_add" @click="addTextOption()">추가</button>
                                        </div>
                                    </div>
                                    <!-- 옵션 선택 결과 리스트 -->
                                    <div class="option_list">
                                        <ul class="list_in">
                                            <li v-for="(optionInfo, index) in itemOptionInfo.addOptionList">
                                                <p class="op_tit">{{unescapeHtml(optionInfo.optionName)}}</p>
                                                <div class="amt_box">
                                                    <button type="button" class="btn_minus" @click="minus(index)">
                                                        <img src="/static/images/icon/btn_minus.png" alt="-">
                                                    </button>
                                                    <input type="text" title="수량" v-model="optionInfo.quantity" class="form-control box number" v-on:input="inputQuantity($event, index)">
                                                    <button type="button" class="btn_plus" @click="plus(index)">
                                                        <img src="/static/images/icon/btn_add.png" alt="+">
                                                    </button>
                                                </div>
                                                <a href="javascript:void(0);" class="btn_item_delete" @click="deleteOption(index)"><img src="/static/images/icon/icon_close_black.png" alt="옵션삭제"></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <!--// conts_area E-->
                        <div class="row no-gutters total_price">
                            <div class="col-6">합계</div>
                            <div class="col-6 price" v-if="item.itemType === '3'"><span>{{formatNumber(setItemTotal)}}</span>원</div>
                            <div class="col-6 price" v-else><span>{{formatNumber(optionItemTotal)}}</span>원</div>
                        </div>
                        <!--// total_price E-->
                        <div class="btn_area1" v-if="item.itemSoldOutFlag === 'N'">
                            <button type="button" class="btn btn_primary btn_buy">구매하기</button>
                            <a href="javascript:void(0);" class="btn btn_save" @click="addToWishList"><span class="screen_out">찜하기</span></a>
                        </div>
                        <!--// btn_area1 E -->
                        <div class="btn_area2">
                            <div class="btn_area2_wrap">
                                <a href="javascript:void(0);" class="btn btn_secondary btn_cart" @click="addToCart">장바구니</a>
                                <button type="button" class="btn btn_primary" @click="buyOrder">바로구매</button>
                            </div>
                            <div class="npay_type1">
                                <!-- ======= 네이버페이 ======== -->
                                <naver-pay-button :order-type="'item'" :is-mobile="this.isMobile"></naver-pay-button>
                            </div>
                        </div> <!--// btn_area2 E -->
                    </div> <!--// option_area E-->
                </div> <!--// view_info E-->
            </div>
        </div>

        <div class="modal fade modal_full popup_detail">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-body">
                        <div v-for="(image,index) in item.itemImages">
                            <img :src="itemImage(image.bigImageSrc)" alt="image.imageName" @error="errorImage">
                        </div>
                    </div>
                    <button type="button" class="modal_close" data-dismiss="modal">
                        <span class="screen_out">닫기</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- // view_top E -->
        <div class="item_tab">
            <div class="container">
                <ul class="nav nav-tabs nav-justified">
                    <li class="nav-item">
                        <a href="#nav-detail" class="nav-link active" data-toggle="tab">
                            <span class="txt">상품정보</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#nav-review" class="nav-link" data-toggle="tab">
                            <span class="txt">상품후기</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#nav-qna" class="nav-link" data-toggle="tab">
                            <span class="txt">Q&amp;A</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#nav-buyer" class="nav-link" data-toggle="tab">
                            <span class="txt">판매자정보</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <!--// item_tab E -->
        <div class="container tab_container">
            <div class="tab-content item_view">
                <div id="nav-detail" class="tab-pane fade show active">
                    <div class="item_detail">
                        <div class="item_info_inner">
                            <table class="item_info_detail tab_inner" v-if="item.itemInfos.length > 0">
                                <caption>상품정보</caption>
                                <colgroup>
                                    <col style="width:35%;">
                                    <col style="width:65%;">
                                </colgroup>
                                <tbody>
                                <tr v-for="(itemInfo,index) in item.itemInfos">
                                    <th scope="row">{{itemInfo.title}}</th>
                                    <td>{{itemInfo.description}}</td>
                                </tr>
                                </tbody>
                            </table>
                            <div v-if="item.detailContent != ''" v-html="appendCdnDomain(unescapeHtml(item.detailContent))"></div>
                        </div>

                        <div class="item_slider">
                            <p class="tit">다른고객이 함께 구매한 상품</p>
                            <client-only>
                                <swiper ref="awesomeItemSwiper" class="item_list thumb" :options="swiperOption.itemSlider">
                                    <swiper-slide class="list_area swiper-slide" v-for="slide in itemRelations"
                                                  :key="slide.relationId">
                                        <div class="img_area">
                                            <a :href="'/item/' + slide.itemUserCode">
                                                <img :src="itemImage(slide.imageSrc)" :alt="slide.relationId" @error="errorImage">
                                            </a>
                                            <div class="sale_per" v-show="slide.discountRate > 0">{{slide.discountRate}}<span>%</span>
                                            </div>
                                        </div>
                                        <div class="txt_area">
                                            <p class="brand">{{slide.brandName == '' ? '' : slide.brandName}}</p>
                                            <p class="title"><a
                                                    :href="'/item/' + slide.itemUserCode">{{unescapeHtml(slide.itemName)}}</a>
                                            </p>
                                            <div class="price_area">
                                                <template
                                                        v-show="slide.totalDiscountAmount > 0 && slide.discountRate > 0">
                                                    <p class="before"><span>{{formatNumber(slide.salePrice)}}</span>원
                                                    </p>
                                                </template>
                                                <div class="sale_area">
                                                    <p class="price"><span>{{formatNumber(slide.presentPrice)}}</span>원
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </swiper-slide>
                                    <div class="swiper-button-prev pc" slot="button-prev"><span class="screen_out">이전슬라이드</span></div>
                                    <div class="swiper-button-next pc" slot="button-next"><span class="screen_out">다음슬라이드</span></div>
                                </swiper>
                            </client-only>


                            <!--// swiper-wrapper E-->
                        </div>

                        <!--// item_slide E-->
                    </div>
                    <!--// item_detail E-->
                </div>
                <div id="nav-review" class="tab-pane fade">
                    <div class="item_review">
                        <div class="total_top">
                            <div class="total_area">
                                <p class="total">전체 <span>{{formatNumber(result.review.totalElements)}}</span></p>
                                <button type="button" class="btn_inquiry" @click="writeReview">후기작성하기</button>
                            </div>
                        </div>
                        <div class="grade" v-if="result.review.content.length > 0">
                            <p class="txt">평점</p>
                            <div class="rating_star lg" v-html="ratingStarHtml"></div>
                            <p class="num"><b>{{ratingStarScore}}</b> / 5</p>
                        </div>
                        <div class="list_wrap review_list" v-if="result.review.content.length > 0">
                            <div class="list_top_sel">
                                <a href="javascript:;" class="btn_my_filter" data-toggle="modal" data-target=".pop_rv_myfilter"
                                   @click="openReviewFilter" v-if="reviewFilters != null && reviewFilters.length > 0">>
                                    <span>나와 비슷한 체형의 상품후기 모아보기</span>
                                </a>
                                <select id="" name="" class="custom-select line" @change="selectReviewOrderBy">
                                    <option value="LIKE_COUNT">추천순</option>
                                    <option value="CREATED_DATE">최신순</option>
                                    <option value="SCORE">평점순</option>
                                </select>
                            </div><!--// list_top_sel -->
                            <ul>
                                <li class="list_area" v-for="(review,index) in result.review.content">
                                    <div class="list_in">
                                        <div class="review_open">
                                            <div class="list_top">
                                                <div class="rating_star">
												<span v-for="i in 5"
                                                      :class="{'on' : reviewAssessment(i, review.score)}"></span>
                                                </div>
                                                <div class="id_date">
                                                    <p class="id">{{review.maskUsername}}</p>
                                                    <p class="date">{{dateFormat(review.createdDate).substring(0,10)}}</p>
                                                </div>
                                            </div>
                                            <ul class="rv_my_info" v-if="isDisplayReviewInfo(index)">
                                                <li v-for="(reviewFilter, filterIndex) in review.filters" v-if="validFilter(reviewFilter.group, reviewFilter.code)">
                                                    <span class="cate">{{getFilterGroupName(reviewFilter.group)}}</span>
                                                    {{getFilterCodeName(reviewFilter.group, reviewFilter.code)}}
                                                </li>
                                                <li v-if="review.displayOptionsFlag && review.options != '' && review.options != ''">
                                                    <span class="cate">선택한 옵션</span>
                                                    <p>
                                                        <span v-html="nl2br(review.options)"></span>
                                                    </p>
                                                </li>
                                            </ul><!--// rv_my_info -->
                                            <div class="review_origin">
                                                <div class="txt_area">
                                                    <p class="title" v-html="nl2br(review.content)"></p>
                                                </div>
                                                <div class="img_area" v-if="review.photoReview">
                                                    <img :src="itemImage(review.thumbnailSrc)" alt="썸네일" class="img_full"  @error="errorImage">
                                                    <div class="img_more" v-if="review.itemReviewImages.length > 0"><span>{{review.itemReviewImages.length}}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="review_img" v-if="review.photoReview">
                                            <div class="row">
                                                <div class="col-12 col-md-3" v-for="image in review.itemReviewImages">
                                                    <div class="img_area">
                                                        <a href="javascript:;">
                                                            <img :src="itemImage(image.imageSrc)" class="img_full"
                                                                 alt="썸네일" @error="errorImage">
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <dl class="rv_btm">
                                            <dt>&nbsp;</dt>
                                            <dd>도움됐어요
                                                <a href="javascript:;" class="btn_good" @click="addItemReviewLike(index)">
                                                    <span>{{formatNumber(review.likeCount)}}</span>
                                                </a>
                                            </dd>
                                        </dl><!--// rv_btm -->
                                        <dl class="rv_comment" v-if="review.adminComment !=''">
                                            <dt>관리자</dt>
                                            <dd v-html="nl2br(review.adminComment)"></dd>
                                        </dl><!--// rv_comment -->
                                    </div>
                                </li>
                            </ul>
                            <pagination :current-page="result.review.currentPage"
                                        :total-pages="result.review.totalPages" :page-target="'review'"
                                        @change="paging" v-if="result.review.content.length > 0"></pagination>
                        </div>

                        <div class="review_none" v-if="result.review.content.length == 0">
                            <p>고객님께서 작성해주시는 이용후기는 <br>다른 분의 쇼핑에 소중한 정보가 됩니다.</p>
                        </div>

                    </div>
                </div>
                <div id="nav-qna" class="tab-pane fade">
                    <div class="item_qna">
                        <div class="total_top">
                            <div class="total_area">
                                <p class="total">전체 <span>{{result.qna.totalElements}}</span></p>
                                <button type="button" class="btn_inquiry">Q&amp;A쓰기</button>
                            </div>
                            <div class="inquiry_write" id="qna_write">
                                <form class="needs-validation" @submit.prevent="registerQna">
                                    <div class="form_wrap_box">
                                        <div class="form-group select_check">
                                            <div class="row no-gutters">
                                                <div class="col-6 col-md-5 col-lg-3">
                                                    <select class="custom-select box" v-model="itemQna.qnaGroup" required>
                                                        <option value="">문의유형 선택</option>
                                                        <option v-for="code in qnaGroups" :value="code.id">{{code.label}}</option>
                                                    </select>
                                                </div>
                                                <div class="col-6 col-md-7 col-lg-9 secret_txt">
                                                    <div class="check_area">
                                                        <input type="checkbox" id="a1" v-model="secretFlag">
                                                        <label for="a1">비밀글</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <input type="text" class="form-control box" placeholder="제목을 입력해주세요" title="제목을 입력해주세요" v-model="itemQna.subject" required>
                                        </div>
                                        <div class="form-group">
                                            <textarea class="form-control" cols="30" rows="10" placeholder="내용을 입력해주세요" v-model="itemQna.question" required></textarea>
                                        </div>
                                        <div class="row no-gutters btn-group right">
                                            <div class="col col-md-3 col-lg-2">
                                                <button type="button" class="btn btn_lg btn_light btn_cancel">취소</button>
                                            </div>
                                            <div class="col col-md-3 col-lg-2">
                                                <button type="submit" class="btn btn_lg btn_primary">등록</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="list_wrap faq_list on" v-if="result.qna.content.length > 0">
                            <ul>
                                <template v-for="(qna,index) in result.qna.content">
                                    <li class="list_area list_open">
                                        <div class="list_in">
                                            <div class="list_top">
                                                <p class="state">{{qna.answerCount > 0 ? '답변완료' : '답변대기'}}</p>
                                                <div class="id_date">
                                                    <p class="id">{{qna.maskUserName}}</p>
                                                    <p class="date">{{dateFormat(qna.createdDate).substring(0,10)}}</p>
                                                </div>
                                            </div>
                                            <p class="category">[{{qna.qnaGroupLabel}}]</p>
                                            <div class="list_tit">
                                                <template v-if="qna.secretFlag == 'Y' && qna.userId != userId">
                                                    <span class="lock"></span>비밀글입니다.
                                                </template>
                                                <template v-else>
                                                    {{qna.subject}}
                                                </template>
                                            </div>
                                            <div class="hide_area">
                                                <div class="question"><span class="qa">Q.</span>{{qna.question}}</div>
                                                <template
                                                        v-if="(qna.secretFlag == 'N' || qna.userId == userId) && qna.answerCount > 0">
                                                    <div class="answer"><span class="qa">A.</span>
                                                        {{qna.qnaAnswer.answer}}
                                                    </div>
                                                    <p class="answer_date">답변일 : <span>{{dateFormat(qna.qnaAnswer.answerDate).substring(0,10)}}</span>
                                                    </p>
                                                </template>
                                            </div>
                                        </div>
                                    </li>
                                </template>
                            </ul>

                            <pagination :current-page="result.qna.currentPage"
                                        :total-pages="result.qna.totalPages" :page-target="'qna'"
                                        @change="paging" v-if="result.qna.content.length > 0"></pagination>
                        </div>
                        <!--// qna_list E -->

                        <div class="review_none" v-if="result.qna.content.length == 0">
                            <p>상품에 대해 궁금한 사항을 적어주세요.</p>
                        </div>
                    </div> <!--// item_qna E-->
                </div>
                <div id="nav-buyer" class="tab-pane fade">
                    <div class="buyer_wrap">
                        <div class="buyer_area">
                            <table class="item_info_detail">
                                <caption>상품정보</caption>
                                <colgroup>
                                    <col style="width:35%;">
                                    <col style="width:65%;">
                                </colgroup>
                                <tbody>
                                <tr>
                                    <th scope="row">대표자명</th>
                                    <td>{{seller.representativeName}}</td>
                                </tr>
                                <tr>
                                    <th scope="row">사업자번호</th>
                                    <td>{{seller.businessNumber}}</td>
                                </tr>
                                <tr>
                                    <th scope="row">연락처</th>
                                    <td>{{seller.telephoneNumber}}
                                        <!--<a href="javascript:void(0);" class="btn btn_buyer" @click="telLink">
                                          <img src="/static/images/icon/ic_phone.png" alt="">
                                          <span>전화걸기</span>
                                        </a>-->
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">E-mail</th>
                                    <td>{{seller.email}}</td>
                                </tr>
                                <tr>
                                    <th scope="row">FAX</th>
                                    <td>{{seller.faxNumber}}</td>
                                </tr>
                                <tr>
                                    <th scope="row" class="vertical_top">소재지</th>
                                    <td>{{seller.address}}, {{seller.addressDetail}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <!--// buyer_area -->
                        <div class="deli_info">
                            <p class="deli_tit">배송/반품/교환 상세정보</p>
                            <div v-html="config.deliveryInfo"></div>
                        </div>
                        <!--// deli_info E -->
                    </div>
                    <!--// buyer_wrap E-->
                </div>
            </div>
        </div>
        <!--// item_view E -->

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
                            <a href="javascript:;" class="sns_url" @click="snsShare('urlCopy')">
                                <img src="/static/images/icon/btn_url.png" alt="url">
                            </a>
                            <a href="javascript:;" class="sns_ka" @click="snsShare('kakao')">
                                <img src="/static/images/icon/btn_kakao.png" alt="카카오톡">
                            </a>
                            <a href="javascript:;" class="sns_url" @click="snsShare('kakaoStory')">
                                <img src="" style="visibility:hidden;" alt="카카오스토리">
                            </a>
                            <a href="javascript:;" class="sns_url" @click="snsShare('naverBand')">
                                <img src="" style="visibility:hidden;" alt="밴드">
                            </a>
                        </div>
                    </div>
                    <button type="button" class="modal_close" data-dismiss="modal">
                        <span class="screen_out">sns공유 닫기</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- 제주/도서산간지역 레이어 -->
        <div class="modal fade modal_full pop_delivery_location">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal_tit">제주/도서산간지역</h3>
                    </div>
                    <div class="modal-body">
                        <div class="location_top">
                            <select class="custom-select box" id="where" v-model="param.delivery.where">
                                <option value="ADDRESS">주소</option>
                                <option value="ZIPCODE">우편번호</option>
                            </select>
                            <input type="text" class="form-control box" id="query" v-model="param.delivery.query"
                                   @keyup.enter="paging(1,'delivery')">
                            <button type="button" class="search_btn" @click="paging(1,'delivery')">
                                <img src="/static/images/icon/btn_search.png" alt="검색 버튼">
                            </button>
                        </div>

                        <template v-if="result.delivery.content.length > 0">
                            <table class="item_info_detail table_detail">
                                <caption>제주/도서산간지역</caption>
                                <colgroup>
                                    <col>
                                    <col>
                                    <col>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th scope="row">우편번호/주소</th>
                                    <th scope="row">제주</th>
                                    <th scope="row">도서산간</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="data in result.delivery.content">
                                    <td>
                                        <p>{{data.zipcode}}</p>{{data.address}}
                                    </td>
                                    <td>
                                        <template v-if="data.islandType == 'JEJU'">o</template>
                                    </td>
                                    <td>
                                        <template v-if="data.islandType == 'ISLAND'">o</template>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </template>
                        <template v-else>
                            <div class="common_none">
                                <p>검색결과가 없습니다. 검색어에 잘못된 철자가 없는지, 정확한 주소인지 다시 한번 확인해 주세요.</p>
                            </div>
                        </template>

                        <pagination :current-page="result.delivery.number+1" :total-pages="result.delivery.totalPages"
                                    :page-target="'delivery'" @change="paging"
                                    v-if="result.delivery.content.length > 0"></pagination>
                    </div>
                    <button type="button" class="modal_close" data-dismiss="modal">
                        <span class="screen_out">제주/도서산간지역 닫기</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- 쿠폰다운로드 레이어-->
        <div class="modal fade modal_full pop_down_coupon">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal_tit">다운로드 가능쿠폰</h3>
                    </div>
                    <div class="modal-body">
                        <button type="button" class="btn btn_lg btn_down_coupon" @click="downloadCoupon('all', 0)"
                                v-if="result.coupon.content != undefined && result.coupon.content.length > 0">
                            <span>다운로드 가능쿠폰 모두받기</span>
                        </button>
                        <div class="coupon_list"
                             v-if="result.coupon.content != undefined && result.coupon.content.length > 0">
                            <div class="list_area" v-for="(coupon,index) in result.coupon.content">
                                <div class="tit_area">
                                    <p class="tit">{{coupon.couponName}}</p>
                                </div>
                                <p class="explain">{{formatNumber(coupon.couponPay)}}{{coupon.couponPayType == '1' ? '원'
                                        : '%'}} 할인</p>
                                <div class="info">
                                    <p>
                                        <template v-if="coupon.couponApplyType == '0'">
                                            제한없음
                                        </template>
                                        <template v-else-if="coupon.couponApplyType == '2'">
                                            다운로드 시점부터 <strong>{{coupon.couponApplyDay}}일</strong> 후까지
                                        </template>
                                        <template v-else>
                                            {{dateFormat(coupon.couponApplyStartDate, 'date')}} ~
                                            {{dateFormat(coupon.couponApplyEndDate, 'date')}}
                                        </template>
                                    </p>
                                    <p v-if="coupon.couponPayRestriction > 0">
                                        {{formatNumber(coupon.couponPayRestriction)}}원 이상 구매시 사용가능</p>
                                </div>
                                <div class="etc_area">
                                    <button type="button" class="btn_coupon_get"
                                            @click="downloadCoupon(coupon.couponId, index)"><span>쿠폰받기</span></button>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="common_none">
                                <p>현재 다운로드 가능한 쿠폰이 없습니다.</p>
                            </div>
                        </div>
                        <pagination :current-page="result.coupon.currentPage"
                                    :total-pages="result.coupon.totalPages" :page-target="'coupon'"
                                    @change="paging" v-if="result.coupon.content.length > 0"></pagination>
                    </div>
                    <button type="button" class="modal_close" data-dismiss="modal">
                        <span class="screen_out">다운로드가능쿠폰 닫기</span>
                    </button>
                </div>
            </div>
        </div>

        <!--리뷰 필터-->
        <div class="modal fade modal_full pop_rv_myfilter">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal_tit">나와 비슷한 체형의 상품후기 모아보기</h3>
                    </div>
                    <div class="modal-body">
                        <div class="md_rv_myft">
                            <div class="myft_top">
                                <button class="btn_filter_reset" @click="clearReviewFilter">필터 초기화</button>
                            </div><!--// myft_top -->
                            <dl class="myft_list">
                                <template v-for = "(filterGroup, index) in reviewFilters">
                                    <dt>{{unescapeHtml(filterGroup.label)}}</dt>
                                    <dd>
                                        <div class="chk_g">
											<span  v-for="(filterCode, codeIndex) in filterGroup.codes">
												<input type="checkbox"
                                                       :id="'filter-'+filterGroup.id+'-'+filterCode.id"
                                                       :value = "filterCode.id"
                                                       v-model="param.filter.filterCodeIds">
												<label :for="'filter-'+filterGroup.id+'-'+filterCode.id">
													{{unescapeHtml(filterCode.label)}}
												</label>
											</span>
                                        </div><!--// chk_g -->
                                    </dd>
                                </template><!--// myft_list -->
                            </dl><!--// myft_list -->
                            <div class="row no-gutters btn-group">
                                <div class="col col-md-4">
                                    <button type="button" class="btn btn_lg btn_primary" @click="applyReviewFilter">적용하기</button>
                                </div>
                            </div>
                        </div><!--// md_rv_myft -->
                    </div>
                    <button type="button" class="modal_close" data-dismiss="modal">
                        <span class="screen_out">나와 비슷한 체형의 상품후기 모아보기 닫기</span>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Pagination from '@/components/ui/pagination';
import NaverPayButton from '@/components/ui/naver/naver-pay-button.vue';

let $s, vm;

export default {
    components: {Pagination,NaverPayButton},
    head() {
        return {
          title: this.seo.title,
          meta: this.seo.meta,
          script: [
              { src: '/static/js/item.js', body: true},
              { src: '//developers.kakao.com/sdk/js/kakao.min.js'},
              { src: '/static/js/sns/facebook.js'}
          ],
          link: [
              { rel: 'stylesheet', href: '/static/css/item.css' },
          ]
        }
    },
    beforeCreate: function() {
        $s = this.$saleson;
        vm = this;
    },
    async asyncData({ params, $axios, $seo, route}) {
      const itemUserCode = params.id;
      const seo = await $seo(route.path, $axios);


      return {
        itemUserCode  : itemUserCode,
        seo : seo
      }
    },
    async fetch() {

        if (process.env.NODE_ENV !== 'production') {
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        }

    },
    data: function () {
        return {
            isMobile : false,
            pageUrl: '',
            showReviewForm : false,
            itemUserCode: '',
            error: {},
            itemRelations: [],
            newCartQuantity: 0,
            newLatelyItemCount: 0,
            newWishlistCount : 0,
            latelyItems: [],
            display: {
                quantity: 1,
                presentPrice: 0
            },
            param: {
                filter: {
                    filterCodeIds: [],
                    initFilterCodeIds: []
                },
                order: {
                    arrayRequiredItems: [],
                    itemSets : [],
                    campaignCode: null
                },
                review: {
                    page: 1,
                    itemsPerPage: 5,
                    itemUserCode: '',
                    size: 5,
                    orderBy:'LIKE_COUNT',
                    fcIds: ''
                },
                qna: {
                    page: 1,
                    itemsPerPage: 5,
                    itemUserCode: '',
                    size: 5
                },
                coupon: {
                    page: 1,
                    itemsPerPage: 5,
                    itemUserCode: '',
                    size: 5
                },
                delivery: {
                    page: 1,
                    itemsPerPage: 5,
                    query: '',
                    where: 'ADDRESS',
                    size: 5
                },
                category: {
                    categoryCode: '',
                    page: 1,
                    itemsPerPage: 20,
                },
                unRegisterReview: {
                    showStarFlags: [],
                    content: '',
                    subject: '',
                    files: [],
                    fileImages: []
                }
            },
            item: {
                freeGiftItemList: [],
                itemImages: [],
                itemInfos: [],
                itemOptions: [],
                itemRelations: [],
                itemSets : []
            },
            itemOptionInfo: {
                optionPrices: [],
                optionStockFlags: [],
                optionStockQuantity: [],
                selectOptionName1: '',
                selectOptionName2: '',
                selectOptionName3: '',
                selectOptionIndex1: '',
                selectOptionIndex2: '',
                selectOptionIndex3: '',
                optionName1: [],
                optionName2: [],
                optionName3: [],
                optionName1Ids: [],
                optionName2Ids: [],
                optionName3Ids: [],
                optionTextVals: [],
                optionSoldOuts: [],
                addOptionList: []
            },
            itemSetInfo: {
                amount : 0,
                selectList: [],
                addOptionList: []
            },
            list: [],
            pointPolicy: {},
            config: {},
            cardBenefits: {},
            seller: {
                companyName: '',
                representativeName: '',
                businessNumber: '',
                telephoneNumber: '',
                email: '',
                faxNumber: '',
                address: '',
                addressDetail: ''
            },
            userId: 0,
            result: {
                review: {
                    currentPage: 1,
                    totalPages: 0,
                    totalElements: 0,
                    content: {}
                },
                qna: {
                    currentPage: 1,
                    totalPages: 0,
                    totalElements: 0,
                    content: {}
                },
                coupon: {
                    currentPage: 1,
                    totalPages: 0,
                    totalElements: 0,
                    content: {}
                },
                delivery: {
                    number: 0,
                    content: {}
                }
            },
            itemQna: {
                qnaGroup: ''
            },
            secretFlag: false,
            slides: [
                {
                    imageId: '',
                    image: ''
                },
            ],
            category: {
                groups: []
            },
            currentCategories: [],
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
            breadcrumbs: [],
            isRestockNotice: '',
            earnPoint: {
                levelPoint : 0,
                point : 0,
                totalPoint : 0,
                levelPointRate: 0,
                pointRate: 0,
                levelName: ''
            },
            reviewFilters: [],
            qnaGroups: [],
            swiperOption: {
                thumbSlider: {
                    slidesPerView: 'auto',
                    freeMode: true,
                    watchSlidesVisibility: true,
                    watchSlidesProgress: true,
                    allowTouchMove: false
                },
                mainSlider: {
                    spaceBetween: 15,
                    navigation: {
                        nextEl: '.view_photo .swiper-button-next',
                        prevEl: '.view_photo .swiper-button-prev',
                    },
                    pagination: {
                        el: '.view_photo .swiper-pagination',
                    },
                    thumbs: {
                        swiper: this.viewThumbsSwiper
                    }
                },
                itemSlider: {
                    slidesPerView: 4,
                    centerSlides: true,
                    spaceBetween: 30,
                    navigation: {
                        nextEl: '.item_slider .swiper-button-next',
                        prevEl: '.item_slider .swiper-button-prev',
                    },
                    breakpoints: {
                        767: {
                            slidesPerView: 2,
                            spaceBetween: 16
                        },
                        991: {
                            slidesPerView: 3,
                            spaceBetween: 20
                        }
                    }
                }
            }
        }
    },
    methods: {
        initUnregisteredItemReviews: function (items) {
            let contents = '';

            try {
                if (items != null && items.length > 0) {
                    contents = initContent(items[0]);
                }
            } catch (e) {
                console.log(e)
            }

            return contents;

            function initContent (item) {
                return {
                    orderCode : item.orderCode,
                    itemId : item.itemId,
                    itemUserCode : item.itemUserCode,
                    imageSrc : item.imageSrc,
                    itemName : item.itemName,
                    score : 0,
                    content : '',
                    subject : '',
                    files : [],
                    fileImages : [],
                    showStarFlags : [false, false, false, false, false],
                }
            }
        },
        // 후기작성
        registerReview : function(){
            let content = this.param.unRegisterReview;

            if(content.subject === ""){
                $s.alert("제목을 입력해주세요.");
                return false;
            }

            let formData = new FormData();
            formData.append('subject', content.subject);       // 후기제목
            formData.append('content', content.content);       // 후기내용
            formData.append('score', content.score);
            formData.append('itemId', content.itemId);
            formData.append('item.itemName', content.itemName);
            formData.append('orderCode', content.orderCode);

            let files = content.files;

            if (files != null && files.length > 0) {
                formData.append('itemReviewImageFile', files[0]);
                for (let i=0; i<files.length; i++) {
                    formData.append('itemReviewImageFiles[' + i + ']', files[i]);
                }
            }

            $s.confirm('후기를 작성하시겠습니까?', function() {
                $s.api.review(formData, function (response) {
                    if (response.status === "OK") {
                        $s.alert("후기가 작성되었습니다.", function () {
                            location.reload();
                        });
                    } else {
                        $s.alert(response);
                    }
                });
            });
        },
        fileSelect: function (e) {
            let size = 5;
            let limit = 4;
            let extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

            let selectFiles = this.param.unRegisterReview.files;
            let images = this.param.unRegisterReview.fileImages;
            let fileList = e.target.files;

            // 파일 첨부 개수 체크
            if (limit < selectFiles.length + fileList.length) {
                $s.alert('사진은 ' + limit + '장까지 첨부 가능합니다.');
                return;
            }

            for (let i=0; i<fileList.length; i++) {
                let file = fileList[i];
                let fileExt = fileList[i].name;

                // 사이즈 체크
                if (fileExt != "") {
                    if (file.size > (size * 1024 * 1024)) {
                        $s.alert("파일크기는 " + size + "MB 이내로 등록 가능합니다.");
                        return;
                    }
                }

                // 확장자 체크
                fileExt = fileExt.slice(fileExt.indexOf(".") + 1).toLowerCase();
                if (!extensions.includes(fileExt)){
                    $s.alert("이미지 파일(jpg, jpeg, png, gif, bmp) 만 등록 가능합니다.");
                    return;
                }

                // 미리보기 생성
                try {
                    let reader = new FileReader();
                    let self = this;

                    reader.onload = function (ie) {
                        images.push(ie.target.result);
                        self.param.unRegisterReview.fileImages = images;
                    };

                    selectFiles.push(file);
                    self.param.unRegisterReview.files = selectFiles;

                    reader.readAsDataURL(file);
                } catch (e) {

                }
            }
        },

        fileDelete : function(fileIndex){
            let files = this.param.unRegisterReview.files;
            let images = this.param.unRegisterReview.fileImages;

            files.splice(fileIndex,1);
            images.splice(fileIndex,1);
        },

        rating : function(starIndex){

            let score = starIndex + 1;

            this.param.unRegisterReview.score = score;

            let showStarFlags = [false, false, false, false, false];

            for(let i = 0; i <= starIndex; i++){
                showStarFlags[i] = true;
            }

            this.param.unRegisterReview.showStarFlags = showStarFlags;
        },
        closeReviewForm : function () {
            vm.showReviewForm = false;
        },
        writeReview : function () {
            $s.redirect('/mypage/order');
        },
        getItemRelations: function () {

            let param = {
                itemUserCode : this.itemUserCode
            }

            $s.api.viewItemRelations(param, function (response) {
                vm.itemRelations = response.list;
            });
        },
        inputQuantity: function (e, index) {
            let isSet = vm.item.itemType === '3';
            let keyValue = e.target.value.replace(/[^0-9]/g, "");

            if (keyValue.substring(0, 1) == 0) {
                keyValue = keyValue.substring(1, keyValue.length);
            }

            if (!this.checkForItem("manual", index)) {
                return;
            }

            if (isSet) {
                let itemSets = vm.param.order.itemSets;

                itemSets[index].quantity = parseInt(keyValue);
                itemSets[index].amount = itemSets[index].tempAmount * itemSets[index].quantity;
            } else {
                let addOptionList = vm.itemOptionInfo.addOptionList;
                addOptionList[index].quantity = parseInt(keyValue);
                addOptionList[index].optionPrice = addOptionList[index].tempOptionPrice * addOptionList[index].quantity;

                this.setRequiredItem(index);
            }
        },
        getItemReviews: function (page) {
            this.param.review.itemUserCode = this.itemUserCode;
            this.param.review.page = page;

            $s.api.getItemReviewsForDetail(this.param.review,
                    function (response) {
                        vm.result.review = response;
                    }
            );
        },
        getItemQna: function (page) {
            this.param.qna.page = page;
            this.param.qna.itemUserCode = this.itemUserCode;
            $s.api.getItemQna(this.param.qna,
                    function (response) {
                        vm.result.qna = response;
                    }
            );
        },
        getDownloadCouponList: function (page) {
            this.param.coupon.itemUserCode = this.itemUserCode;
            this.param.coupon.page = page;
            $s.api.downloadItemCouponList(this.param.coupon,
                    function (response) {
                        vm.result.coupon = response;
                    }
            );
        },
        getIslandType: function (page) {
            this.param.delivery.page = page;

            $s.api.getIslandType(this.param.delivery,
                    function (response) {
                        vm.result.delivery = response.pageContent;
                    }
            );
        },
        paging: function (page, target) {

            if (target == 'review') {

                this.getItemReviews(page);

            } else if (target == 'qna') {

                this.getItemQna(page);

            } else if (target == 'coupon') {

                this.getDownloadCouponList(page);

            } else if (target == 'delivery') {

                this.getIslandType(page);

            } else if (target == 'all') {

                this.getItemReviews(page);
                this.getItemQna(page);
                this.getDownloadCouponList(page);
                this.getIslandType(page);

            }
        },

        isUserDiscount: function () {
            return this.item.exceptUserDiscountPresentPrice != this.item.presentPrice;
        },

        plus: function (index) {
            let isSet = vm.item.itemType === '3';

            if (isSet) {
                let itemSets = vm.param.order.itemSets;

                itemSets[index].quantity += 1;
                if (!this.checkForItem("plus", index)) {
                    return;
                }

                itemSets[index].amount = itemSets[index].tempAmount * itemSets[index].quantity;
            } else {
                if (!this.checkForItem("plus", index)) {
                    return;
                }

                let addOptionList = vm.itemOptionInfo.addOptionList;

                addOptionList[index].quantity += 1;
                addOptionList[index].optionPrice = addOptionList[index].tempOptionPrice * addOptionList[index].quantity;

                this.setRequiredItem(index);
            }
        },

        minus: function (index) {
            let isSet = vm.item.itemType === '3';

            if (!this.checkForItem("minus", index)) {
                return;
            }

            if (isSet) {
                let itemSets = vm.param.order.itemSets;

                itemSets[index].quantity -= 1;
                itemSets[index].amount = itemSets[index].tempAmount * itemSets[index].quantity;
            } else {
                let addOptionList = this.itemOptionInfo.addOptionList;

                addOptionList[index].quantity -= 1;
                addOptionList[index].optionPrice = addOptionList[index].tempOptionPrice * addOptionList[index].quantity;

                this.setRequiredItem(index);
            }
        },

        setRequiredItem: function (index) {
            let addOptionList = this.itemOptionInfo.addOptionList;
            let item = this.item.itemId;
            let option = '';
            let arrayRequiredItems = this.param.order.arrayRequiredItems;
            let arrayRequiredItem = arrayRequiredItems[index];
            let itemPrice = this.item.presentPrice;

            if (this.item.itemOptionFlag === 'N') {
                if (addOptionList[index] == undefined) {
                    addOptionList.push({
                        'quantity': this.item.orderMinQuantity,
                        'optionPrice': itemPrice,
                        'tempOptionPrice': itemPrice
                    });
                }
            } else {
                option = arrayRequiredItem.substr(arrayRequiredItem.lastIndexOf("||") + 2);
            }

            let quantity = addOptionList[index].quantity;

            if (arrayRequiredItems.length == 0) {
                arrayRequiredItems.push(item + '||' + quantity + '||' + option);
            } else {
                arrayRequiredItems[index] = item + '||' + quantity + '||' + option;
            }
        },

        deleteOption: function (index) {
            this.itemOptionInfo.addOptionList.splice(index, 1);
            this.param.order.arrayRequiredItems.splice(index, 1);
        },

        buyOrder: function () {
            if (this.checkForItem('buy_now', 0)) {
                let campaignCode = $s.core.getState($s.const.CAMPAIGN_CODE);
                vm.param.order.campaignCode = campaignCode;

                $s.api.buyOrder(vm.param.order, function (response) {
                    let url = '/order/step1';

                    if (!$s.isLogin()) {
                        $s.core.setState($s.const.BUY_ORDER, JSON.stringify(vm.param.order));
                        url = '/order/no-member';
                    }

                    $s.redirect(url);
                }, function(error) {
                    $s.alert(error.response.data.message);
                });
            }
        },
        addToCart: function () {
            if (this.checkForItem('cart', 0)) {
                $s.api.addToCart(vm.param.order, function (response) {
                    if (response.status == 'OK') {
                        $s.api.getCartInfo(function (response) {
                            vm.newCartQuantity = response.cartQuantity;
                            vm.updateDisplayCartQuantity(vm, response.cartQuantity);
                        });

                        $s.toast('해당 상품이 장바구니에 담겼습니다.');
                    }
                }, function(error) {
                    $s.alert(error.response.data.message);
                });
            }

        },

        addToWishList: function () {
            $s.api.addToWishList(vm.item.itemId, function (response) {
                if (response.status == 'OK') {
                    $s.toast('해당 상품이 관심상품에 담겼습니다.');
                    $s.api.getQuickInfo(function (data) {
                        vm.newWishlistCount = data.wishlistCount;
                        vm.updateDisplayWishlistCount(vm, data.wishlistCount);
                    });
                }
            })
        },
        reviewAssessment: function (index, score) {
            if (index <= score) {
                return true;
            }
            return false;
        },
        clearOptionItems: function() {
            vm.itemOptionInfo.optionName1 = new Array();
            vm.itemOptionInfo.optionName1Ids = new Array();
            vm.itemOptionInfo.optionName2 = new Array();
            vm.itemOptionInfo.optionName2Ids = new Array();
            vm.itemOptionInfo.optionName3 = new Array();
            vm.itemOptionInfo.optionName3Ids = new Array();
            vm.itemOptionInfo.selectOptionName1 = '';
            vm.itemOptionInfo.selectOptionName2 = '';
            vm.itemOptionInfo.selectOptionName3 = '';
            vm.itemOptionInfo.selectOptionIndex1 = '';
            vm.itemOptionInfo.selectOptionIndex2 = '';
            vm.itemOptionInfo.selectOptionIndex3 = '';

            vm.itemOptionInfo.optionPrices = [];
            vm.itemOptionInfo.optionSoldOuts = [];
        },
        addOptionItems: function (index, pIndex, level) {
            let isSet = vm.item.itemType === '3';
            let checkDuplication = false;
            let itemOptionInfo = vm.itemOptionInfo;
            let optionId = '';

            // 선택한 옵션이 품절일 경우
            if (itemOptionInfo.optionSoldOuts[index]) {
                return false;
            }

            if (level === 1) {
                optionId = itemOptionInfo.optionName1Ids[index];
            } else if (level === 2) {
                optionId = itemOptionInfo.optionName2Ids[index];
            } else if (level === 3) {
                optionId = itemOptionInfo.optionName3Ids[index];
            }

            let $element = document.querySelector('.detail_view_wrap');
            if ($s.isMobile()) {
                $element = document.querySelector('.option_area');
            }

            if (isSet) {
                let itemSets = vm.item.itemSets;
                let optionName = '';

                // 선택 옵션정보 loop
                for (let i=0; i<itemOptionInfo.addOptionList.length; i++) {
                    // 선택 정보 중복시, 기존 선택정보 삭제
                    if (itemOptionInfo.addOptionList[i].itemId === itemSets[pIndex].item.itemId) {
                        itemOptionInfo.addOptionList.splice(i, 1);
                        break;
                    }
                }

                // 옵션 정보 추가
                optionName = this.addOptionList(index, pIndex, level, optionId);

                // 선택 옵션 숨김
                $element.querySelectorAll('ul.set_det > li')[pIndex].getElementsByClassName('option_drop')[0].style.display = 'none';

                // 버튼에 선택 옵션명 표시
                $element.querySelectorAll('ul.set_det > li')[pIndex].getElementsByClassName('select-pc')[0].innerHTML = optionName;

                // 옵션 초기화
                this.clearOptionItems();

                // 모든 옵션 선택시, 세트상품 추가
                if (itemOptionInfo.addOptionList.length === $element.getElementsByClassName('option_drop').length) {
                    this.addItemSets();

                    for (let i=0; i<$element.getElementsByClassName('option_drop').length; i++) {
                        $element.getElementsByClassName('select-pc')[i].innerHTML = '[필수] 옵션 선택';
                    }

                    // 옵션 정보 초기화
                    itemOptionInfo.addOptionList = new Array();
                }
            } else {
                for (let i=0; i<vm.param.order.arrayRequiredItems.length; i++) {
                    let requiredItem = vm.param.order.arrayRequiredItems[i];

                    if (requiredItem.indexOf(optionId) >= 0) {
                        checkDuplication = true;
                        break;
                    }
                }

                if (!checkDuplication) {
                    vm.param.order.arrayRequiredItems.push(vm.item.itemId + "||" + vm.item.orderMinQuantity + "||" + optionId + "```");
                    this.addOptionList(index, pIndex, level, optionId);
                }

                $element.getElementsByClassName('option_drop')[0].style.display = 'none';
                $element.getElementsByClassName('select-pc')[0].style.display = 'block';

                // 옵션 초기화
                this.clearOptionItems();

                // 옵션 세팅
                this.writeOptionName();
            }
        },
        addTextOption: function() {
            let optionText = '';
            let optionData = '';
            let optionCount = 0;
            let optionAdditionAmount = 0;
            let optionMaxQuantity = 9999;
            let optionTxtName = '';
            let toi = $s.isMobile() ? $(".option_area .txt_box") : $(".detail_view_wrap .txt_box");
            let valCheck = true;

            $(toi).find(".text-option-id").each(function() {
                let $textOption = $(this).closest('div');
                let optionName = $textOption.find('.text-option-name').val();
                let optionValue = $textOption.find('.text-option-value').val();
                if (optionValue==='') {
                    $s.alert(optionName+"의 옵션을 입력해주세요.");
                    valCheck = false;
                    return false;
                }
            });

            if (valCheck) {
                $(toi).find(".text-option-id").each(function() {
                    if (optionCount > 0) {
                        optionTxtName += ' / ';
                        optionData += '^^^';
                    }

                    let $textOption = $(this).closest('div');
                    let optionId = $(this).val();
                    let optionName = $textOption.find('.text-option-name').val();
                    let optionValue = $textOption.find('.text-option-value').val();
                    let optionPrice = Number($textOption.find('.text-option-price').val());

                    optionData += optionId + '```' + optionValue;
                    optionTxtName += optionName + ": " + optionValue;
                    optionAdditionAmount += optionPrice;

                    $textOption.find('.text-option-value').val("");
                    optionCount++;
                });

                // 중복체크
                let isAlreadyAddition = false;
                $(".list_in").each(function() {
                    $(this).find("li").each(function() {
                        let currentText = $(this).find('.op_tit').text();

                        if (currentText == optionTxtName) {
                            isAlreadyAddition = true;
                            return false;
                        }
                    });
                });

                if (optionTxtName != "" && !isAlreadyAddition) {
                    this.param.order.arrayRequiredItems.push(this.item.itemId + "||" + this.item.orderMinQuantity + "||" + optionData);

                    let addOptionList = this.itemOptionInfo.addOptionList;
                    let item = this.item;
                    let itemPrice = item.presentPrice;

                    addOptionList.push({
                        'optionName': optionTxtName,
                        'quantity': item.orderMinQuantity,
                        'optionPrice': itemPrice * item.orderMinQuantity,
                        'tempOptionPrice': itemPrice,
                        'optionStockQuantity': item.itemOptions[0].optionStockQuantity
                    });
                }
            }
        },
        addItemSets: function() {
            if (vm.item.itemSoldOutFlag === 'Y') {
                return false;
            }

            let itemSets = vm.item.itemSets;						// 세트상품 정보
            let itemSetInfo = vm.itemSetInfo;						// 세트상품 temp (데이터 만드는 용도)
            let addOptionList = vm.itemOptionInfo.addOptionList; 	// 선택 옵션 리스트
            let orderItemSets = vm.param.order.itemSets;			// 세트상품 주문정보

            for (let i=0; i<itemSets.length; i++) {
                let selectInfo = {
                    'itemId': itemSets[i].item.itemId,
                    'itemName': itemSets[i].item.itemName,
                    'stockFlag': itemSets[i].item.stockFlag,
                    'stockQuantity': itemSets[i].item.stockQuantity,
                    'quantity': itemSets[i].quantity
                };

                // 옵션 상품
                if (itemSets[i].item.itemOptionFlag === 'Y') {
                    for (let j=0; j<addOptionList.length; j++) {
                        if (addOptionList[j].itemId === itemSets[i].item.itemId) {
                            // 선택한 옵션이 품절일 경우
                            if (addOptionList[j].soldOut) {
                                return false;
                            }

                            itemSetInfo.amount += addOptionList[j].baseOptionPrice;
                            itemSetInfo.addOptionList.push(itemSets[i].itemId + "||" + itemSets[i].quantity + "||" + addOptionList[j].optionId + "```");

                            // 옵션 정보 세팅
                            selectInfo.itemOption = addOptionList[j];

                            // 재고값에 옵션 재고 세팅
                            selectInfo.stockFlag = addOptionList[j].optionStockFlag;
                            selectInfo.stockQuantity = addOptionList[j].optionStockQuantity;
                            break;
                        }
                    }
                }
                // 일반 상품
                else {
                    itemSetInfo.addOptionList.push(itemSets[i].itemId + "||" + itemSets[i].quantity + "||");
                }

                // 선택된 상품 정보 세팅
                itemSetInfo.selectList.push(selectInfo);
            }

            for (let i = 0; i < orderItemSets.length; i++) {
                // 세트 옵션 중복 체크
                if (JSON.stringify(orderItemSets[i].arrayItemSets) === JSON.stringify(itemSetInfo.addOptionList)) {
                    // $s.alert("해당 옵션이 이미 추가되었습니다.");
                    itemSetInfo.amount = 0;
                    itemSetInfo.selectList = new Array();
                    itemSetInfo.addOptionList = new Array();
                    return false;
                }
            }

            // 옵션금액 총합 + 현재 상품가격
            itemSetInfo.amount += vm.item.presentPrice;

            // 세트상품 주문 정보 세팅
            orderItemSets.push({
                'itemId' : vm.item.itemId,
                'quantity' : 1,
                'amount':  itemSetInfo.amount,
                'tempAmount': itemSetInfo.amount,
                'arrayItemSetInfos': itemSetInfo.selectList,
                'arrayItemSets' : itemSetInfo.addOptionList
            });

            // 세트상품 정보 초기화
            itemSetInfo.amount = 0;
            itemSetInfo.selectList = new Array();
            itemSetInfo.addOptionList = new Array();

            // 재고 체크
            if (!vm.isAvailableSetStock('create')) {
                orderItemSets.pop();
                return false;
            }
        },
        isAvailableSetStock: function(target, index) {
            index = index || 0;	// 현재 세트상품 주문 데이터 index
            let buyItems = [];	// 재고 체크용 temp array

            let order = vm.param.order;	// 주문 정보

            let isAvailable = true;	// 재고 가능 여부
            let alertText = '';		// alert 표시 text
            let inputQuantity = order.itemSets[index].quantity; // 입력 수량

            // 세트상품 주문 정보 loop
            for (let i = 0; i < order.itemSets.length; i++) {
                // 세트상품별 상품정보 loop
                for (let j = 0; j < order.itemSets[i].arrayItemSetInfos.length; j++) {

                    let info = order.itemSets[i].arrayItemSetInfos[j];

                    // 각 상품별 최종 구매 수량 (세트 수량 * 세트 상품별 수량)
                    let buyQuantity = order.itemSets[i].quantity * order.itemSets[i].arrayItemSetInfos[j].quantity;

                    // 재고 체크용 데이터 만들기
                    let isAdd = false;
                    for (let z = 0; z < buyItems.length; z++) {
                        // 이미 추가된 상품일 경우, buyQuantity 를 변경
                        // 옵션이 없는 경우 itemId 매칭, 옵션이 있는 경우 optionId 매칭
                        let item = buyItems[z].item;
                        if ((item.itemOption == null && item.itemId === info.itemId) ||
                                (item.itemOption != null && info.itemOption != null && item.itemOption.optionId === info.itemOption.optionId)) {
                            buyItems[z].buyQuantity += buyQuantity;
                            isAdd = true;
                            break;
                        }
                    }

                    if (!isAdd) {
                        // 새로 추가된 상품 저장
                        buyItems.push({
                            'item': info,
                            'buyQuantity': buyQuantity
                        });
                    }
                }
            }

            // 재고 수량 내림차순 정렬
            if (buyItems.length > 1) {
                buyItems.sort(function(a, b) {
                    return Math.floor(b.item.stockQuantity / b.item.quantity) - Math.floor(a.item.stockQuantity / a.item.quantity);
                });
            }

            // 만들어진 데이터로 재고 체크 및 수량 조절 (재고 수량이 많은 상품부터 내림차순 조절)
            for (let i=0; i<buyItems.length; i++) {
                let buyQuantity = buyItems[i].buyQuantity;
                let stockFlag = buyItems[i].item.stockFlag;
                let stockQuantity = buyItems[i].item.stockQuantity;

                if (stockFlag === 'Y' && buyQuantity > stockQuantity) {
                    // 재고 내 가능한 최대값을 세팅
                    // 수량 조절 : [재고수량 - {총 구매수량 - (입력수량 * 세트수량)}] / 세트수량
                    if (target === 'manual' || target === 'order' || target === 'plus') {
                        order.itemSets[index].quantity = Math.floor((stockQuantity - (buyQuantity - (inputQuantity * buyItems[i].item.quantity))) / buyItems[i].item.quantity);
                    }

                    // alert text 세팅
                    alertText = this.unescapeHtml(buyItems[i].item.itemName);
                    if (buyItems[i].item.itemOption != null) { // 옵션 존재시, 옵션명 노출
                        alertText += ' <' + this.unescapeHtml(buyItems[i].item.itemOption.optionName) + '>';
                    }
                    alertText += '의 최대 구매 수량은 ' + buyItems[i].item.stockQuantity + '개 입니다.';

                    isAvailable = false;
                }
            }

            // 재고 수량이 가장 적은 마지막 상품 정보만 노출됨
            if (!isAvailable) {
                $s.alert(alertText);
            }

            return isAvailable;
        },
        writeOptionName: function (level, optionName, index, pIndex) {
            level = level || 0;
            index = index || 0;
            pIndex = pIndex || 0;
            let isSet = vm.item.itemType === '3';
            let item = isSet ? vm.item.itemSets[pIndex].item : vm.item;
            let itemOptions = item.itemOptions;
            let itemOptionInfo = vm.itemOptionInfo;
            let checkDuplication = '';

            if (level === 1) {
                itemOptionInfo.selectOptionName1 = optionName;
                itemOptionInfo.selectOptionIndex1 = index;
                itemOptionInfo.optionName2 = [];
                itemOptionInfo.optionName3 = [];
                itemOptionInfo.optionName2Ids = [];
                itemOptionInfo.optionName3Ids = [];

                if (item.itemOptionType === "S") {
                    this.addOptionItems(index, pIndex, level);
                    return false;
                } else {
                    // 다음 옵션 표시
                    this.displayNextOptionGroup(pIndex, level);
                    itemOptionInfo.optionPrices = [];
                    itemOptionInfo.optionSoldOuts = [];
                    itemOptionInfo.optionStockFlags = [];
                    itemOptionInfo.optionStockQuantity = [];
                }
            } else if (level === 2) {
                itemOptionInfo.selectOptionName2 = optionName;
                itemOptionInfo.selectOptionIndex2 = index;
                itemOptionInfo.optionName3 = [];
                itemOptionInfo.optionName3Ids = [];

                if (item.itemOptionType === "S2") {
                    this.addOptionItems(index, pIndex, level);
                    return false;
                } else {
                    this.displayNextOptionGroup(pIndex, level);
                    itemOptionInfo.optionPrices = [];
                    itemOptionInfo.optionSoldOuts = [];
                    itemOptionInfo.optionStockFlags = [];
                    itemOptionInfo.optionStockQuantity = [];
                }

            } else if (level === 3) {
                itemOptionInfo.selectOptionName3 = optionName;
                itemOptionInfo.selectOptionIndex3 = index;
                this.addOptionItems(index, pIndex, level);
            }

            for (let i = 0; i < itemOptions.length; i++) {
                if (level === 0) {
                    itemOptionInfo.itemOptionTitle1 = item.itemOptionTitle1;
                    itemOptionInfo.itemOptionTitle2 = item.itemOptionTitle2;
                    itemOptionInfo.itemOptionTitle3 = item.itemOptionTitle3;

                    if (item.itemOptionType === "S") {
                        if (checkDuplication != itemOptions[i].optionName2) {
                            itemOptionInfo.optionName1.push(itemOptions[i].optionName2);
                            itemOptionInfo.optionPrices.push(itemOptions[i].optionPrice);
                            itemOptionInfo.optionSoldOuts.push(itemOptions[i].soldOut);
                            itemOptionInfo.optionStockFlags.push(itemOptions[i].optionStockFlag);
                            itemOptionInfo.optionStockQuantity.push(itemOptions[i].optionStockQuantity);
                        }

                        checkDuplication = itemOptions[i].optionName2;
                    } else {
                        if (checkDuplication != itemOptions[i].optionName1) {
                            itemOptionInfo.optionName1.push(itemOptions[i].optionName1);
                            itemOptionInfo.optionPrices.push(itemOptions[i].optionPrice);
                            itemOptionInfo.optionSoldOuts.push(itemOptions[i].soldOut);
                            itemOptionInfo.optionStockFlags.push(itemOptions[i].optionStockFlag);
                            itemOptionInfo.optionStockQuantity.push(itemOptions[i].optionStockQuantity);
                        }

                        checkDuplication = itemOptions[i].optionName1;
                    }

                    itemOptionInfo.optionName1Ids.push(itemOptions[i].itemOptionId);
                } else if (level === 1) {
                    if (checkDuplication != itemOptions[i].optionName2 && itemOptions[i].optionName1 == itemOptionInfo.selectOptionName1) {
                        itemOptionInfo.optionName2.push(itemOptions[i].optionName2);
                        itemOptionInfo.optionName2Ids.push(itemOptions[i].itemOptionId);
                        itemOptionInfo.optionPrices.push(itemOptions[i].optionPrice);
                        itemOptionInfo.optionSoldOuts.push(itemOptions[i].soldOut);
                        itemOptionInfo.optionStockFlags.push(itemOptions[i].optionStockFlag);
                        itemOptionInfo.optionStockQuantity.push(itemOptions[i].optionStockQuantity);
                        checkDuplication = itemOptions[i].optionName2;
                    }
                } else if (level === 2) {
                    if (itemOptions[i].optionName1 == itemOptionInfo.selectOptionName1 && itemOptions[i].optionName2 == itemOptionInfo.selectOptionName2) {
                        itemOptionInfo.optionName3.push(itemOptions[i].optionName3);
                        itemOptionInfo.optionName3Ids.push(itemOptions[i].itemOptionId);
                        itemOptionInfo.optionPrices.push(itemOptions[i].optionPrice);
                        itemOptionInfo.optionSoldOuts.push(itemOptions[i].soldOut);
                        itemOptionInfo.optionStockFlags.push(itemOptions[i].optionStockFlag);
                        itemOptionInfo.optionStockQuantity.push(itemOptions[i].optionStockQuantity);
                    }
                } else if (level === 3) {
                    if (itemOptions[i].optionName1 == itemOptionInfo.selectOptionName1
                            && itemOptions[i].optionName2 == itemOptionInfo.selectOptionName2
                            && itemOptions[i].optionName3 == itemOptionInfo.selectOptionName3) {

                        itemOptionInfo.optionPrices.push(itemOptions[i].optionPrice);
                        itemOptionInfo.optionSoldOuts.push(itemOptions[i].soldOut);
                        itemOptionInfo.optionStockFlags.push(itemOptions[i].optionStockFlag);
                        itemOptionInfo.optionStockQuantity.push(itemOptions[i].optionStockQuantity);
                    }
                }
            }// for E
        },
        writeSetOptionName: function(pIndex) {
            // 옵션 초기화
            this.clearOptionItems();

            // 옵션 세팅
            this.writeOptionName(0, '', 0, pIndex);
        },
        displayNextOptionGroup: function (pIndex, level) {
            let isSet = vm.item.itemType === '3';
            let item = isSet ? vm.item.itemSets[pIndex].item : vm.item;
            let itemOptionType = item.itemOptionType;
            let itemOptionInfo = vm.itemOptionInfo;

            if (itemOptionType === 'S2') {
                itemOptionInfo.optionName1 = new Array();
                itemOptionInfo.optionName1Ids = new Array();
            } else if (itemOptionType === 'S3') {
                if (level === 1) {
                    itemOptionInfo.optionName1 = new Array();
                    itemOptionInfo.optionName1Ids = new Array();
                } else if (level === 2) {
                    itemOptionInfo.optionName2 = new Array();
                    itemOptionInfo.optionName2Ids = new Array();
                }
            }
        },
        checkForItem: function (target, index) {
            let isSet = vm.item.itemType === '3';

            // 비회원 구매 불가인 경우 로그인 페이지로 이동
            if (this.checkForNonmemberOrder() === false) {
                return false;
            }

            // 품절 확인
            if (vm.item.itemSoldOutFlag === 'Y') {
                $s.alert('해당 상품은 판매 종료 되었습니다.');
                return false;
            }

            if (target === 'wishlist') {
                return true;
            }

            if (isSet) {
                // 세트 상품
                let itemSets = vm.param.order.itemSets;

                if (target === 'cart' || target === 'buy_now') {
                    if (itemSets.length === 0) {
                        $s.alert('상품 필수옵션을 선택하세요.');
                        return false;
                    }

                    if (!vm.isAvailableSetStock('order', index)) {
                        return false;
                    }
                } else if (target === 'minus') {
                    if (itemSets[index].quantity <= 1) {
                        $s.alert('상품을 1개 이상 선택해주세요.');
                        return false;
                    }
                } else if (target === 'plus') {
                    if (!vm.isAvailableSetStock('plus', index)) {
                        return false;
                    }
                } else if (target === 'manual') {
                    if (!vm.isAvailableSetStock('manual', index)) {
                        itemSets[index].amount = itemSets[index].tempAmount * itemSets[index].quantity;
                        return false;
                    }

                    if (itemSets[index].quantity < 1) {
                        $s.alert('상품을 1개 이상 선택해주세요.');
                        itemSets[index].quantity = 1;
                        itemSets[index].amount = itemSets[index].tempAmount * itemSets[index].quantity;
                        return false;
                    }
                } else {
                    $s.alert('처리할 수 없습니다.');
                    return false;
                }
            } else {
                // 일반 상품
                let addOptionList = vm.itemOptionInfo.addOptionList;

                if (target === 'cart' || target === 'buy_now') {
                    if (vm.param.order.arrayRequiredItems.length === 0) {
                        $s.alert('상품 필수옵션을 선택하세요.');
                        return false;
                    }
                } else if (target === 'minus') {
                    if (vm.item.itemOptionFlag === 'Y') {
                        let optionStockQuantity = vm.item.itemOptions[index].optionStockQuantity;
                    }

                    if (vm.item.orderMinQuantity === addOptionList[index].quantity) {
                        $s.alert('최소 구매 수량은 ' + vm.item.orderMinQuantity + '개 입니다.');
                        return false;
                    }

                    if (addOptionList[index].quantity <= 1) {
                        $s.alert('상품을 1개 이상 선택해주세요.');
                        return false;
                    }
                } else if (target === 'plus') {
                    let optionName = '';
                    let stockQuantity = vm.item.stockQuantity;

                    if (vm.item.itemOptionFlag === 'Y') {
                        optionName = '<' + addOptionList[index].optionName + '>의 ';
                        stockQuantity = addOptionList[index].optionStockQuantity;
                    }

                    if (addOptionList[index].quantity >= stockQuantity && stockQuantity != -1) {
                        $s.alert(optionName + '최대 구매 수량은 ' + stockQuantity + '개 입니다.');
                        addOptionList[index].quantity = stockQuantity;
                        return false;
                    }

                    if (vm.item.orderMaxQuantity <= addOptionList[index].quantity) {
                        $s.alert('최대 구매 수량은 ' + vm.item.orderMaxQuantity + '개 입니다.');
                        addOptionList[index].quantity = vm.item.orderMaxQuantity;
                        return false;
                    }
                } else if (target === 'manual') {
                    let optionName = '';
                    let stockQuantity = vm.item.stockQuantity;

                    if (vm.item.itemOptionFlag === 'Y') {
                        optionName = '<' + addOptionList[index].optionName + '>의 ';
                        stockQuantity = addOptionList[index].optionStockQuantity;
                    }

                    if (addOptionList[index].quantity > stockQuantity && stockQuantity != -1) {
                        $s.alert(optionName + '최대 구매 수량은 ' + stockQuantity + '개 입니다.');
                        addOptionList[index].quantity = stockQuantity;
                        this.setRequiredItem(index);
                        return false;
                    }

                    if (vm.item.orderMaxQuantity < addOptionList[index].quantity) {
                        $s.alert('최대 구매 수량은 ' + vm.item.orderMaxQuantity + '개 입니다.');
                        addOptionList[index].quantity = vm.item.orderMaxQuantity;
                        this.setRequiredItem(index);
                        return false;
                    }

                    if (vm.item.orderMinQuantity > addOptionList[index].quantity) {
                        $s.alert('최소 구매 수량은 ' + vm.item.orderMinQuantity + '개 입니다.');
                        addOptionList[index].quantity = vm.item.orderMinQuantity;
                        vm.setRequiredItem(index);
                        return false;
                    }

                    if (addOptionList[index].quantity < 1) {
                        $s.alert('상품을 1개 이상 선택해주세요.');
                        addOptionList[index].quantity = 1;
                        this.setRequiredItem(index);
                        return false;
                    }
                } else {
                    $s.alert('처리할 수 없습니다.');
                    return false;
                }
            }

            return true;
        },
        addOptionList: function (index, pIndex, level, optionId) {
            if (vm.item.itemSoldOutFlag === 'Y') {
                return false;
            }

            let isSet = vm.item.itemType === '3';
            let item = isSet ? vm.item.itemSets[pIndex].item : vm.item;
            let itemOptions = item.itemOptions;
            let itemOptionInfo = vm.itemOptionInfo;
            let addOptionList = itemOptionInfo.addOptionList;
            let optionName = '';
            let optionPrice = itemOptionInfo.optionPrices[index];
            let itemPrice = item.presentPrice;

            if (item.itemOptionType === "S") {
                // 선택형
                optionName = item.itemOptions[0].optionName1 + ": " + itemOptionInfo.selectOptionName1;
            } else if (item.itemOptionType === "S2" || item.itemOptionType === "S3") {
                // S2
                optionName = item.itemOptionTitle1 + ": " + itemOptionInfo.selectOptionName1 + " | "
                        + item.itemOptionTitle2 + ": " + itemOptionInfo.selectOptionName2;

                if (item.itemOptionType === "S3") {
                    // S3
                    optionName += " | " + item.itemOptionTitle3 + ": " + itemOptionInfo.selectOptionName3;
                }
            }

            optionName += optionPrice > 0 ? " (+" + this.formatNumber(optionPrice) + "원)" : "";

            addOptionList.push({
                'itemId' : item.itemId,
                'optionId' : optionId,
                'optionName': optionName,
                'quantity': item.orderMinQuantity,
                'optionPrice': (itemPrice + optionPrice) * item.orderMinQuantity,
                'tempOptionPrice': itemPrice + optionPrice,
                'optionStockFlag': item.itemOptions[index].optionStockFlag,
                'optionStockQuantity': item.itemOptions[index].optionStockQuantity,
                'soldOut': item.itemOptions[index].soldOut,
                'baseOptionPrice' : optionPrice
            });

            itemOptionInfo.optionName1 = [];
            itemOptionInfo.optionName2 = [];
            itemOptionInfo.optionName3 = [];

            for (let i = 0; i < itemOptions.length; i++) {
                itemOptionInfo.optionName1.push(itemOptions[i].optionName1);
                itemOptionInfo.optionName1Ids.push(itemOptions[i].itemOptionId);
            }

            return optionName;
        },
        checkForNonmemberOrder: function () {
            let nonmemberOrderType = this.item.nonmemberOrderType;

            if (nonmemberOrderType != '1') {
                // if (this.userId <= 0 && nonmemberOrderType == '1') {
                let message = '회원만 구매가 가능합니다. 로그인 페이지로 이동하시겠습니까?';	// 회원만 구매가 가능합니다. 로그인 페이지로 이동하시겠습니까?
                if (confirm(message)) {
                    $s.redirect($s.pages.LOGIN + "?target=" + encodeURIComponent($s.requestContext.requestFullUri));
                }
                return false;
            }
        },

        snsShare: function (target) {

            let title = this.item.itemName;
            let description = this.item.itemSummary;
            let imageUrl = this.itemImage(this.item.imageSrc);
            let link = this.item.eventViewUrl;

            if (target == 'facebook') {
                $s.api.social.facebook(this.item.link);
            } else if (target == 'twitter') {
                $s.api.social.twitter(title, description, imageUrl, link);
            } else if (target == 'kakao') {
                $s.api.social.kakao(title, description, imageUrl, link);
            } else if (target == 'kakaoStory') {
                $s.api.social.kakaoStory(title, description, imageUrl, link);
            } else if (target == 'naverBand') {
                $s.api.social.naverBand(title, description, imageUrl, link);
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

        timeFormat: function (date) {
            return date.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
        },
        downloadCoupon: function (downloadTargetId, index) {
            let itemCoupons = vm.result.coupon.content;

            // 전체 쿠폰 일괄발급
            if (downloadTargetId == 'all') {

                let param = {
                    itemUserCode: vm.itemUserCode
                }

                $s.api.downloadAllItemCouponList(param, function (response) {
                    vm.paging(1, 'coupon');
                    $s.alert('쿠폰 모두받기가 완료 되었습니다.');
                });

            } else {
                let param = {
                    'couponId': downloadTargetId
                };

                $s.api.couponDownload(param, function (response) {
                    if (response.status === 'OK') {
                        itemCoupons.splice(index, 1);
                    }

                    $s.alert(response.message);
                });

                this.paging(this.param.coupon.page, 'coupon');
            }
        },
        registerQna: function () {
            this.itemQna.itemId = this.item.itemId;

            if ($s.isLogin()) {
                $s.api.createItemQna(this.itemQna, function (response) {
                    if (response.status === 'OK') {
                        $s.alert('상품Q&A가 등록되었습니다.');
                        vm.paging(vm.param.coupon.page, 'qna');

                        vm.itemQna.qnaGroup = '';
                        vm.itemQna.question = '';
                        vm.itemQna.subject = '';

                        document.getElementById('qna_write').style.display = 'none';
                        document.getElementsByClassName('faq_list')[0].classList.remove('on');
                    }
                }, function (error) {
                    $s.alert(error.response.data.description);
                });
            } else {
                $s.alert('로그인이 필요 합니다.');
                return;
            }
        },
        telLink: function () {
            location.href = 'tel:' + this.seller.telephoneNumber;
        },
        getNewLatelyItems: function () {
            let lately = $s.core.getState($s.const.LATELY_ITEM);

            if (typeof lately == 'undefined' || lately == null) {
                this.latelyItems = [];
            } else {
                this.latelyItems = JSON.parse(lately);
            }

            this.newLatelyItemCount = this.latelyItems.length;
        },
        getCurrentCategories: function () {
            let breadcrumbs = vm.breadcrumbs[0];

            if (breadcrumbs !== undefined) {
                vm.breadcrumbs = breadcrumbs;
                vm.current.groupUrl = breadcrumbs.groupUrl;
                vm.current.groupName = breadcrumbs.groupName;
                vm.current.category1Url = breadcrumbs.breadcrumbCategories[0].categoryUrl;
                vm.current.category1Name = breadcrumbs.breadcrumbCategories[0].categoryName;
                vm.current.categoryLevel = "1";

                if (breadcrumbs.breadcrumbCategories[1] !== undefined) {
                    vm.current.category2Url = breadcrumbs.breadcrumbCategories[1].categoryUrl;
                    vm.current.category2Name = breadcrumbs.breadcrumbCategories[1].categoryName;
                    vm.current.categoryLevel = "2";
                } else {
                    vm.current.category2Name = "전체";
                }

                if (breadcrumbs.breadcrumbCategories[2] !== undefined) {
                    vm.current.category3Url = breadcrumbs.breadcrumbCategories[2].categoryUrl;
                    vm.current.category3Name = breadcrumbs.breadcrumbCategories[2].categoryName;
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
                let categories = vm.currentCategories[vm.current.categoryLevel].codes;
                let categoryCode = '';

                for (let i = 0; i < categories.length; i++) {
                    let category = categories[i];

                    if (category.categoryId == vm.breadcrumbs.categoryClass) {
                        categoryCode = category.url;
                    }
                }

                let currentChildForMobile = {
                    categoryName: categoryName,
                    categoryCode: vm.currentCategories[vm.current.categoryLevel].codes,
                    categories: categories,
                    childCategories: childCategories
                }
                vm.currentChildForMobile = currentChildForMobile;
            }
        },
        link: function (url, index) {
            if (index === 0) {
                $s.redirect('/category/' + this.childCategories(url)[0].url);
            } else {
                $s.redirect('/category/' + url);
            }
        },
        selectOptionTitle: function (level, pIndex) {
            let itemOptionInfo = vm.itemOptionInfo;

            if (level === 1) {
                // 초기화
                this.clearOptionItems();

                this.writeOptionName(0, '', 0, pIndex);

            } else if (level === 2) {
                itemOptionInfo.optionName3 = new Array();
                itemOptionInfo.optionName3Ids = new Array();
                itemOptionInfo.selectOptionName3 = '';
                itemOptionInfo.selectOptionIndex2 = '';
                itemOptionInfo.selectOptionIndex3 = '';

                this.writeOptionName(1, itemOptionInfo.selectOptionName1, itemOptionInfo.selectOptionIndex1, pIndex);
            }
        },
        getRestockNotice: function(itemId) {
            let param = {
                'itemId' : itemId
            };
            $s.api.getRestockNotice(param, function (response) {
                vm.isRestockNotice = response.isRestockNotice;
            });
        },

        restockNotice: function() {
            if (vm.isRestockNotice === true || document.getElementById('restock').getAttribute('class') === 'restock on') {
                $s.alert('이미 신청한 상태입니다.');
                return false;
            }

            if ($s.isLogin() === false) {
                $s.alert('로그인 후 이용이 가능합니다.', function () {
                    $s.redirect($s.pages.LOGIN + '?target=' + encodeURIComponent($s.requestContext.requestFullUri));
                });
            } else {
                let param = {
                    'itemId' : vm.item.itemId
                };
                $s.api.restockNotice(param, function (response) {
                    if (response.status === 'OK'){
                        document.getElementById('restock').setAttribute('class', 'restock on');
                        $s.alert('재입고 알림을 신청했습니다.');
                    }
                });
            }
        },

        addItemReviewLike: function(index) {

            let review = vm.result.review.content[index],
                    likeCount = review.likeCount;

            $s.api.addItemReviewLike(review.itemReviewId, function (response) {

                let message = '';

                if (response.flag) {
                    message = '해당 리뷰가 도움이 되었습니다.';
                    review.likeCount = likeCount + 1;
                } else {
                    message = '이미 도움을 주셨습니다.';
                }

                $s.alert(message);
            });
        },
        selectReviewOrderBy: function(e) {

            let value = e.target.value;

            this.param.review.orderBy = value;
            this.paging(1, 'review');
        },
        isDisplayReviewInfo: function(index) {

            let review = vm.result.review.content[index];

            return review.filters.length > 0 || (review.displayOptionsFlag  && review.options.length > 0);
        },

        validFilter: function (groupId, codeId) {
            let group = this.getFilterGroup(groupId);

            if (group == null) {
                return false;
            }

            let code = this.getFilterCode(groupId, codeId);

            if (code == null) {
                return false;
            }

            return true;
        },

        getFilterGroup: function (groupId) {

            let groups = this.reviewFilters;

            if (groups != null && groups.length > 0) {

                for (let i=0; i<groups.length; i++) {

                    if (groupId == groups[i].id) {
                        return groups[i];
                    }

                }
            }

            return null;
        },

        getFilterCode: function (groupId, codeId) {

            let group = this.getFilterGroup(groupId);

            if (group == null) {
                return null;
            }

            let codes = group.codes;

            if (codes != null && codes.length > 0) {

                for (let i=0; i<codes.length; i++) {

                    if (codeId == codes[i].id) {
                        return codes[i];
                    }

                }
            }

            return null
        },

        getFilterGroupName: function(groupId) {

            let group = this.getFilterGroup(groupId);

            if (group != null) {
                return this.unescapeHtml(group.label);
            }

            return '';
        },
        getFilterCodeName: function(groupId, codeId) {

            let code = this.getFilterCode(groupId, codeId);

            if (code != null) {
                return this.unescapeHtml(code.label);
            }

            return '';
        },

        openReviewFilter: function() {
            let filters = this.param.filter.initFilterCodeIds;
            this.param.filter.filterCodeIds = filters;
        },
        closeReviewFilter: function() {
            $('.pop_rv_myfilter').modal("hide");
        },
        applyReviewFilter: function() {
            let filters = this.param.filter.filterCodeIds;
            this.param.filter.initFilterCodeIds = filters;

            this.param.review.fcIds = filters.join('||');
            this.paging(1, 'review');
            this.closeReviewFilter();
        },
        clearReviewFilter: function() {
            this.param.filter.filterCodeIds = [];
            this.param.filter.initFilterCodeIds = [];
            this.param.review.fcIds = '';
        },
        toSlideViewImage: function (index) {
            this.viewImageSwiper.slideTo(index);
        },
        initPage: function (response) {
            let item = response.item;
            vm.item = item;
            vm.list = response.list;
            vm.pointPolicy = response.pointPolicy;
            vm.config = response.config;
            vm.cardBenefits = response.cardBenefits;
            vm.seller = response.seller;
            vm.userId = response.userId;
            vm.breadcrumbs = response.breadcrumbs;
            vm.isRestockNotice = response.isRestockNotice;
            vm.earnPoint = response.earnPoint;
            vm.reviewFilters = response.reviewFilters;
            vm.qnaGroups = response.qnaGroups;

            let isSet = item.itemType === '3';
            let slides = new Array();

            for (let i = 0; i < item.itemImages.length; i++) {
                let slide = {
                    imageId: item.itemImages[i].itemImageId,
                    image: item.itemImages[i].imageSrc
                };

                slides.push(slide);
            }

            vm.slides = slides;

            // 최대 & 최소 구매수량 조정
            if (item.orderMinQuantity === -1) item.orderMinQuantity = 1;
            if (item.orderMaxQuantity === -1) item.orderMaxQuantity = 999;

            vm.display.quantity = item.orderMinQuantity;

            // 세트상품 분기 처리
            if (isSet) {
                for (let i=0; i<item.itemSets.length; i++) {
                    // 최대 & 최소 구매수량 조정
                    if (item.itemSets[i].item.orderMinQuantity === -1) item.itemSets[i].item.orderMinQuantity = 1;
                    if (item.itemSets[i].item.orderMaxQuantity === -1) item.itemSets[i].item.orderMaxQuantity = 999;
                }

                if (item.itemOptionFlag === 'N' && item.itemSoldOutFlag === 'N') {
                    vm.addItemSets();
                }
            } else {
                if (item.itemOptionFlag === 'N' && item.itemSoldOutFlag === 'N') {
                    vm.setRequiredItem(0);
                }

                vm.writeOptionName();
            }

            vm.addlatelyItem(item.itemId);
            vm.getNewLatelyItems();
            vm.getCurrentCategories();
            vm.getRestockNotice(item.itemId);

            $s.ga.detail(item.itemUserCode);
            $s.ev.log.item(item.itemUserCode);
        }
    },
    watch: {
        secretFlag: function (value) {
            let result = 'N';

            if (value == true) {
                result = 'Y';
            }
            this.itemQna.secretFlag = result;
        },
    },
    computed: {
        ratingStarHtml: function () {
            let maxScore = 5,
                    ratingScore = Math.ceil(Number(this.item.reviewScore)),
                    subScore = maxScore - ratingScore;

            if (ratingScore > maxScore) ratingScore = maxScore;

            let ratingStarHtml = '';

            for (let i = 0; i < ratingScore; i++) {
                ratingStarHtml += "\<span class='on'\>\<\/span\>";
            }

            if (subScore > 0) {
                for (let i = 0; i < subScore; i++) {
                    ratingStarHtml += "\<span\>\<\/span\>";
                }
            }
            return ratingStarHtml;
        },
        ratingStarScore: function () {
            let maxScore = 5,
                    score = Number(this.item.reviewScore).toFixed(1);
            if (score > maxScore) score = maxScore;

            return score;
        },
        total: function () {

            let itemPrice = this.item.presentPrice;

            return this.display.quantity * itemPrice;
        },
        setItemTotal: function () {
            let itemSets = this.param.order.itemSets;
            let sum = 0;
            if (typeof itemSets !== 'undefined') {
                for (let i = 0; i < itemSets.length; i++) {
                    sum += itemSets[i].amount;
                }
            }
            return sum;
        },
        optionItemTotal: function () {
            let addOptionList = this.itemOptionInfo.addOptionList;
            let sum = 0;
            if (typeof addOptionList !== 'undefined') {
                for (let i = 0; i < addOptionList.length; i++) {
                    sum += addOptionList[i].optionPrice;
                }
            }
            return sum;
        },
        pointInfoText: function () {

            let earnPoint = this.earnPoint;
            let text = '';

            if (typeof earnPoint != 'undefined') {

                let pointText = '';
                let levelPointText = '';

                if (earnPoint.point > 0 && earnPoint.pointRate > 0) {
                    pointText = '기본적립 '+earnPoint.pointRate+'%';
                }
                if (earnPoint.levelPoint > 0 && earnPoint.levelPoint > 0) {
                    levelPointText = earnPoint.levelName+'회원 추가적립 '+earnPoint.levelPointRate+'%';
                }

                /*text += (earnPoint.pointRate + earnPoint.levelPointRate) + '% ';*/

                text += this.formatNumber(earnPoint.totalPoint) + 'P 적립 ';

                text += '(';

                if (pointText != '' && levelPointText != '') {
                    text += pointText + ' + ' + levelPointText;
                } else if (pointText == '' && levelPointText != '') {
                    text += levelPointText;
                } else if (pointText != '' && levelPointText == '') {
                    text += pointText;
                }

                text += ')';
            }
            return text;
        },
        viewImageSwiper() {

            let swiper = this.$refs.awesomeViewImageSwiper;

            if (typeof swiper != 'undefined' && swiper != null) {
                return swiper.$swiper
            }

            return false;
        },
        viewThumbsSwiper() {

            let swiper = this.$refs.awesomeViewThumbsSwiper;

            if (typeof swiper != 'undefined' && swiper != null) {
                return swiper.$swiper
            }

            return false;
        },
        shippingText: function() {
            // 1: 무료, 2: 판매자, 3: 출고지, 4: 상품, 5: 개당, 6: 고정
            let shipping = vm.item.shipping;
            let shippingFreeAmount = vm.item.shippingFreeAmount;
            let shippingType = vm.item.shippingType;
            let text = "무료배송";

            if (shipping > 0) {
                text = this.formatNumber(shipping) + "원";

                if (shippingFreeAmount > 0 &&
                        (shippingType === '2' || shippingType === '3' || shippingType === '4')) { // 판매자조건부, 출고지조건부, 상품조건부
                    text += " / 같은 ";
                    if (shippingType === '2') text += "판매자 ";
                    if (shippingType === '3') text += "출고지 ";
                    text += "상품 " + this.formatNumber(shippingFreeAmount) + "원 이상 구매 시 무료";
                } else {  // 개당배송비, 고정배송비
                    if (shippingType === '5') text += " / " + vm.item.shippingItemCount + "개당 배송비 추가";
                    if (shippingType === '6') text += " / 고정 배송비";
                }
            }

            return text;
        },
        shippingExtraText: function() {
            let shippingExtraCharge1 = vm.item.shippingExtraCharge1;
            let shippingExtraCharge2 = vm.item.shippingExtraCharge2;
            let text = "";

            if (shippingExtraCharge1 > 0) text += "제주 지역 추가 " + this.formatNumber(shippingExtraCharge1) + "원";
            if (shippingExtraCharge1 > 0 && shippingExtraCharge2 > 0) text += " / ";
            if (shippingExtraCharge2 > 0) text += "도서산간 지역 추가 " + this.formatNumber(shippingExtraCharge2) + "원";

            return text;
        }
    },
    updated: function() {
        this.$nextTick(function () {

        });
    },
    mounted: function() {
        this.$nextTick(function () {



            $s.core.setState($s.const.KAKAO_SHARE_INIT_FLAG, null);

            this.pageUrl = $s.requestContext.href;

            this.categoryInfo(this);
            this.deleteOption(0);
            $s.api.getItem(this.itemUserCode, function (response) {
                vm.initPage(response);
            }, function (error) {

                if ('BAD_REQUEST_NO_ITEM' == error.response.data.code) {
                    $s.alert(error.response.data.message, function () {
                        $s.redirect($s.pages.INDEX);
                    });
                    // modal alert 바깥영역 클릭해도 이전페이지로 이동
                    $('.items_detail_wrap').on('click', '#op-alert', function(){
                        history.back();
                    });
                }
            });

            this.getItemRelations();
            this.paging(1, 'all');

            initializeListEvent();
            initializeItemsEvent();

            this.isMobile = $s.isMobile();
        });

    },
}
</script>
