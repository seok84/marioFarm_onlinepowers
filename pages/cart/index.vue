<template>
    <section class="contents cart_contents">
        <h2 class="screen_out">장바구니</h2>
        <ol class="step_indicator">
            <li class="active">
                <div class="step">1</div>
                <div class="caption">장바구니</div>
            </li>
            <li>
                <div class="step">2</div>
                <div class="caption">주문서</div>
            </li>
            <li>
                <div class="step">3</div>
                <div class="caption">완료</div>
            </li>
        </ol>
        <div class="cart_wrap">
            <div class="container" v-if="buyItems.length > 0">
                <form class="needs-validation" @submit.prevent="submit">
                    <div class="cart_top">
                        <div class="check_area">
                            <input type="checkbox" id="all" v-model="selectAll">
                            <label for="all">전체선택</label>
                        </div>
                    </div>

                    <div class="cart_container">
                        <div class="cart_list" v-for="(buyItem, buyItemIndex) in buyItems" :key="'buyItems_'+buyItemIndex">
                            <div class="item_list check del">
                                <div class="list_area" v-for="(data, index) in buyItem" :key="'buyItem_'+index">
                                    <div class="item_top">
                                        <div class="check_area">
                                            <input type="checkbox" :id="data.cartId" title="선택" :value="data.cartId"
                                                   v-model="selected">
                                            <label :for="data.cartId"></label>
                                        </div>
                                        <button type="button" class="btn_item_del"
                                                @click.prevent="deleteCart(data.cartId)">
                                            <span class="screen_out">상품 지우기</span>
                                        </button>
                                    </div>
                                    <div class="img_area">
                                        <a :href="'/item/' + data.itemUserCode">
                                            <img :src="itemImage(data.item.itemImage)" :alt="unescapeHtml(data.itemName)" @error="errorImage">
                                        </a>
                                    </div>
                                    <div class="txt_area">
                                        <p class="brand">{{unescapeHtml(data.brand)}}</p>
                                        <p class="title">{{unescapeHtml(data.itemName)}}</p>
                                        <p class="option" v-if="data.options != ''" v-html="unescapeHtml(data.options)"></p>
                                        <p class="gifts" v-if="data.freeGiftItemText">
                                            사은품 : {{unescapeHtml(data.freeGiftItemText)}}
                                        </p>
                                        <div class="product_discount_area">
                                            <p>상품가 : <span :id="'salesAmount' + index">{{formatNumber(data.itemPrice.itemSaleAmount)}}</span>
                                            </p>
                                            <p>할인 : <span>{{formatNumber(data.itemPrice.discountAmount)}}</span>
                                            </p>
                                        </div>
                                        <p class="coupon" v-if="data.itemPrice.saleAmount > 0"><span>할인적용가 <span>{{formatNumber(data.itemPrice.saleAmount)}}</span></span></p>
                                    </div>
                                    <div class="etc_area">
                                        <div class="amt_box">
                                            <input type="hidden" :id="'store-quantity-' + data.cartId" :value="data.itemPrice.quantity"/>
                                            <input type="number" class="form-control box number_s" title="수량"
                                                   :value="formatNumber(data.itemPrice.quantity)" maxlength="3"
                                                   :id="'quantity-' + data.cartId" required>
                                            <button type="button" class="btn btn_sm btn_default"
                                                    @click="updateCartQuantity(data.cartId, data.orderQuantity.maxQuantity, data.orderQuantity.minQuantity)">
                                                변경
                                            </button>

                                            <!--<button type="button" class="btn_minus" @click="minus(data.cartId, data.orderQuantity.minQuantity)">
                                                <img src="/static/images/icon/btn_minus.png" alt=""></button>
                                            <input type="number" title="수량" class="form-control box number" :value="formatNumber(data.itemPrice.quantity)" maxlength="3" :id="'quantity-' + data.cartId">
                                            <button type="button" class="btn_plus" @click="plus(data.cartId, data.orderQuantity.maxQuantity)"><img src="/static/images/icon/btn_add.png" alt=""></button>-->
                                        </div>
                                        <div class="btn_wrap">
                                            <button type="button" class="btn btn_sm btn_outline_secondary"
                                                    @click="addToWishList(data.itemId)">관심상품
                                            </button>
                                            <button type="button" class="btn btn_sm btn_primary"
                                                    @click="buyOrder(data.cartId)">바로주문
                                            </button>
                                        </div>
                                    </div>
                                    <div :class="[buyItems[buyItemIndex].length-1 !== index ? 'disabled' : '', 'ship_info_area']">
                                        <p class="sub_tit">배송 정보
                                            <span class="company">(<span>{{data.sellerName}}</span>)</span>
                                        </p>
                                        <p class="txt" v-if="itemGroups[buyItemIndex].realShipping === 0">무료배송</p>
                                        <div class="radio_wrap" v-else>
                                            <div class="radio_area"
                                                 @change="changeShipping(buyItems[buyItemIndex][0].cartId, $event)">
                                                <input type="radio" :id="'shipping' + data.cartId"
                                                       :name="'shipping' + data.cartId" :value="1"
                                                       :checked="itemGroups[buyItemIndex].shippingPaymentType  === '1'"
                                                       :disabled="buyItems[buyItemIndex].length-1 !== index">
                                                <label :for="'shipping' + data.cartId">{{formatNumber(itemGroups[buyItemIndex].realShipping)}}원
                                                    선불</label>
                                            </div>
                                            <div class="radio_area"
                                                 @change="changeShipping(buyItems[buyItemIndex][0].cartId, $event)">
                                                <input type="radio" :id="'shipping_' + data.cartId"
                                                       :name="'shipping_' + data.cartId" :value="2"
                                                       :checked="itemGroups[buyItemIndex].shippingPaymentType  === '2'"
                                                       :disabled="buyItems[buyItemIndex].length-1 !== index">
                                                <label :for="'shipping_' + data.cartId">
                                                    {{formatNumber(itemGroups[buyItemIndex].realShipping )}}원
                                                    착불</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal fade pop_condi_ship" :id="'modal' + buyItemIndex">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <dl class="condi_ship_txt">
                                                <dt>
                                                    {{shippingTypeText(itemGroups[buyItemIndex].shippingType)}} 조건부 무료배송
                                                </dt>
                                                <dd>{{deliveryText(itemGroups[buyItemIndex].shippingType)}} 상품
                                                    {{formatNumber(itemGroups[buyItemIndex].shippingFreeAmount)}}원 이상 구매 시 무료, 미만 구매시
                                                    {{formatNumber(itemGroups[buyItemIndex].shipping)}}원 부과
                                                </dd>
                                                <template
                                                    v-if="itemGroups[buyItemIndex].shippingExtraCharge1 > 0 || itemGroups[buyItemIndex].shippingExtraCharge2 > 0">
                                                    <dt>제주/도서산간</dt>
                                                    <dd>
                                                        제주
                                                        <template
                                                            v-if="itemGroups[buyItemIndex].shippingExtraCharge1 > 0">
                                                            {{formatNumber(itemGroups[buyItemIndex].shippingExtraCharge1)}}원
                                                            추가
                                                        </template>
                                                        <template v-else>
                                                            추가비용 없음
                                                        </template>

                                                        / 도서산간
                                                        <template
                                                            v-if="itemGroups[buyItemIndex].shippingExtraCharge2 > 0">
                                                            {{formatNumber(itemGroups[buyItemIndex].shippingExtraCharge2)}}원
                                                            추가
                                                        </template>
                                                        <template v-else>
                                                            추가비용 없음
                                                        </template>
                                                    </dd>
                                                </template>

                                            </dl>
                                        </div>
                                        <button type="button" class="modal_close" data-dismiss="modal">
                                            <span class="screen_out">조건부무료배송 닫기</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="total_area">
                                <p class="summing">상품 <span>{{formatNumber(groupsSaleAmount[buyItemIndex])}}</span>원 +
                                    배송비
                                    <span>{{formatNumber(groupsRealShipping[buyItemIndex])}}</span>원</p>
                                <p class="total info"
                                   v-if="itemGroups[buyItemIndex].shippingType === '2' || itemGroups[buyItemIndex].shippingType === '3' || itemGroups[buyItemIndex].shippingType === '4'">
                                    <a href="javascript:" data-toggle="modal"
                                       :data-target="'#modal'+ buyItemIndex"><strong>{{formatNumber(groupsSaleAmount[buyItemIndex]
                                        + groupsRealShipping[buyItemIndex])}}</strong>원</a>
                                </p>
                                <p class="total" v-else><strong>{{formatNumber(groupsSaleAmount[buyItemIndex] +
                                    groupsRealShipping[buyItemIndex])}}</strong>원</p>
                            </div>
                        </div>

                    </div>
                    <div class="cart_bot">
                        <div class="btn_left">
                            <button type="button" class="btn btn_m btn_default" @click="deleteCartList()">선택 상품 삭제
                            </button>
                        </div>
                        <dl class="row no-gutters price_area">
                            <dt class="col-6">상품금액</dt>
                            <dd class="col-6"><span>{{formatNumber(orderPrice.totalItemPrice)}}</span> 원</dd>
                            <dt class="col-6">배송비</dt>
                            <dd class="col-6"><span>{{formatNumber(orderPrice.totalShippingAmount)}}</span> 원</dd>
                            <dt class="col-6">할인혜택</dt>
                            <dd class="col-6"><span>{{orderPrice.totalDiscountAmount ? "-" + formatNumber(orderPrice.totalDiscountAmount) : 0}}</span>
                                원
                            </dd>
                        </dl>
                        <dl class="row no-gutters total_area">
                            <dt class="col-6">총 주문금액</dt>
                            <dd class="col-6"><strong>{{orderPrice ? formatNumber(orderPrice.orderPayAmount) :
                                0}}</strong>원
                            </dd>
                        </dl>
                        <dl class="row no-gutters point_area">
                            <dt class="col-6">적립예정 포인트</dt>
                            <dd class="col-6"><span>{{formatNumber(orderPrice.totalEarnPoint)}}</span> P</dd>
                        </dl>
                        <div class="row no-gutters btn-group">
                            <div class="col-12 col-md-6 col-lg-5 col-xl-4 btn_order">
                                <button type="button" class="btn btn_lg btn_primary" @click="buyOrderList">주문하기</button>
                            </div>
                            <!-- ======= 네이버페이 ======== -->
                            <template v-if="displayNaverPayFlag">
                                <div class="npay_type1 col-12 col-md-6 col-lg-5 col-xl-4">
                                    <naver-pay-button :order-type="'cart'"></naver-pay-button>
                                </div>
                            </template>
                        </div>
                        <div class="cart_guide">
                            <p>장바구니에 담긴 상품은 30일 동안 보관됩니다. 30일이 초과된 상품은 자동으로 삭제됩니다. <br class="mobile">더 오래 보관하고 싶은 상품은
                                관심상품으로 전환하시기 바랍니다.</p>
                        </div>
                    </div>
                </form>
            </div>
            <div class="common_none" v-else>
                <p>장바구니에 담겨있는 상품이 없습니다.</p>
            </div>

        </div>
    </section>
</template>

<script>
import Pagination from "@/components/ui/pagination";

let $s, vm;

import NaverPayButton from '@/components/ui/naver/naver-pay-button.vue';

export default {
    components: {NaverPayButton},
    head() {
        return {
            script: [],
            link: [
                { rel: 'stylesheet', href: '/static/css/order.css' },
            ]
        }
    },
    beforeCreate: function() {
        // 기존 Vue로 작성된 스크립트 실행시 적용
        $s = this.$saleson;
        vm = this;
    },
    data: function () {
        return {
            displayNaverPayFlag: false,
            list: [],
            itemGroups: [],
            orderPrice: [],
            selected: [],
            buyItems: [],
            groupsSaleAmount: [],
            groupsRealShipping: [],
        }
    },
    methods: {
        getCartItems: function () {
            $s.api.getCartItems(function (response) {
                if (response.list.length > 0) {
                    vm.displayNaverPayFlag = response.displayNaverPayFlag;
                    vm.list = response.list[0];
                    vm.orderPrice = response.orderPrice;
                    let itemGroups = vm.list.itemGroups;
                    vm.itemGroups = itemGroups;

                    for (let i = 0; i < itemGroups.length; i++) {
                        if (itemGroups[i].singleShipping === true) {
                            let tempArray = [itemGroups[i].buyItem];
                            vm.buyItems.push(tempArray);
                            vm.groupsSaleAmount.push(itemGroups[i].buyItem.itemPrice.saleAmount);

                            if (itemGroups[i].shippingPaymentType === '1') {
                                vm.groupsRealShipping.push(itemGroups[i].realShipping);
                            } else {
                                vm.groupsRealShipping.push(0);
                            }

                        } else {
                            vm.buyItems.push(itemGroups[i].buyItems);

                            if (itemGroups[i].shippingPaymentType === '1') {
                                vm.groupsRealShipping.push(itemGroups[i].realShipping);
                            } else {
                                vm.groupsRealShipping.push(0);
                            }

                            let groupsSaleAmount = 0;
                            for (let j = 0; j < itemGroups[i].buyItems.length; j++) {
                                groupsSaleAmount += itemGroups[i].buyItems[j].itemPrice.saleAmount;
                            }

                            vm.groupsSaleAmount.push(groupsSaleAmount);
                        }
                    }
                }
            });
        },

        updateCartQuantity: function (cartId, orderMaxQuantity, orderMinQuantity) {
            let storeQuantity = document.getElementById('store-quantity-' + cartId).value;
            let quantity = document.getElementById('quantity-' + cartId).value;
            if (quantity === '' || quantity === 0) {
                $s.alert("상품의 수량을 입력해 주세요.");
                return;
            }
            if (orderMinQuantity > 0 && quantity < orderMinQuantity) {
                $s.alert('최소 구매 수량은 ' + orderMinQuantity + '개 입니다.');
                document.getElementById('quantity-' + cartId).value = orderMinQuantity;
                return;
            }

            if (orderMaxQuantity > 0 && quantity > orderMaxQuantity) {
                $s.alert('최대 구매 수량은 ' + orderMaxQuantity + '개 입니다.');
                document.getElementById('quantity-' + cartId).value = orderMaxQuantity;
                return;
            }

            let params = {
                'cartId': cartId,
                'quantity': quantity
            };

            $s.api.updateCartQuantity(params, function () {

                try {
                    let calcQuantity = quantity - storeQuantity;
                    if (calcQuantity != 0) {

                        let addQuantityFlag = calcQuantity > 0;
                        calcQuantity = addQuantityFlag ? calcQuantity : calcQuantity * -1;
                        $s.ga.changeFromCartQuantity([vm.getGoogleAnalyticsItem(cartId, calcQuantity)], addQuantityFlag);
                    }
                } catch (e) {
                    console.log(e)
                }

                location.reload();
            });
        },

        changeShipping: function (cartId, event) {
            let params = {
                'cartId': cartId,
                'shippingPaymentType': event.target.value
            };

            $s.api.updateShippingPaymentType(params, function () {
                location.reload();
            });

        },

        deleteCart: function (cartId) {
            $s.confirm("상품을 장바구니에서 삭제하시겠습니까?", function () {
                $s.api.deleteCart([cartId], function () {

                    try {
                        $s.ga.removeFromCart([vm.getGoogleAnalyticsItem(cartId)]);
                    } catch (e) {}

                    location.reload();
                });
            });
        },

        deleteCartList: function () {
            if (this.selected.length === 0) {
                $s.alert("삭제할 상품을 선택해주세요.");
                return false;
            }

            $s.confirm("상품을 장바구니에서 삭제하시겠습니까?", function () {
                $s.api.deleteCart(vm.selected, function () {
                    let params = {'id': vm.selected}

                    try {
                        let gaItems = [];
                        for (let i=0; i<vm.selected.length; i++) {
                            gaItems.push(vm.getGoogleAnalyticsItem(vm.selected[i]));
                        }
                        $s.ga.removeFromCart(gaItems);
                    } catch (e) {}

                    location.reload();
                });
            });
        },

        buyOrder: function (cartId) {
            vm.selected = false;
            vm.selected = [cartId];
            this.saveOrderItemTemp(vm.selected, "구매할 상품을 선택해 주세요.");
        },

        buyOrderList: function () {
            this.saveOrderItemTemp(vm.selected, "구매할 상품을 선택해 주세요.");
        },

        saveOrderItemTemp: function (availableItem, message) {
            if (availableItem.length === 0) {
                $s.alert(message);
                return;
            }

            let cartIds = [];
            let isSuccess = true;
            let quantity = -1;

            for (let i = 0; i < availableItem.length; i++) {
                quantity = parseInt(document.getElementById('quantity-' + availableItem[i]).value);
                if (quantity <= 0) {
                    isSuccess = false;
                }
                cartIds[i] = availableItem[i];
            }

            if (isSuccess == false) {
                $s.alert("상품의 수량을 확인해주세요.");
                return;
            }

            let campaignCode = $s.core.getState($s.const.CAMPAIGN_CODE);

            let params = {
                'cartIds': cartIds,
                'campaignCode': campaignCode
            };

            $s.api.buyOrder(params, function () {
                let url = '/order/step1';

                if (!$s.isLogin()) {
                    url = '/order/no-member';
                }

                $s.redirect(url);
            }, function(error) {
                $s.alert(error.response.data.message);
            });
        },

        addToWishList: function (itemId) {
            $s.api.addToWishList(itemId, function () {
                $s.toast("해당 상품이 관심상품에 담겼습니다.");
            });
        },
        getGoogleAnalyticsItem(cartId, quantity) {

            try {
                let list = this.buyItems;

                for (let i = 0 ; i<list.length; i++) {

                    let buyItem = list[i];
                    for (let j=0 ; j< buyItem.length; j++) {

                        let item = buyItem[j];
                        if (cartId == item.cartId) {

                            if (typeof quantity == 'undefined' || quantity == null || quantity == '') {
                                quantity = item.itemPrice.quantity
                            }

                            return {
                                id : item.itemUserCode,
                                nm : item.itemName,
                                qt : quantity,
                                va : item.options
                            }
                        }

                    }
                }
            } catch (e) {}

            return null;
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
        }
        /*plus: function (cartId, maxQuantity) {
            let quantity = parseInt(document.getElementById('quantity-' + cartId).value);
            quantity += 1;

            if (maxQuantity > 0 && quantity > maxQuantity) {
                $s.alert('최대 구매 수량은 ' + maxQuantity + '개 입니다.');
                document.getElementById('quantity-' + cartId).value = maxQuantity;
                return;
            }

            document.getElementById('quantity-' + cartId).value = quantity;
        },

        minus: function (cartId, minQuantity) {
            let quantity = parseInt(document.getElementById('quantity-' + cartId).value);
            quantity -= 1

            if (minQuantity > 0 && quantity < minQuantity) {
                $s.alert('최소 구매 수량은 ' + minQuantity + '개 입니다.');
                document.getElementById('quantity-' + cartId).value = minQuantity;
                return;
            }

            document.getElementById('quantity-' + cartId).value = quantity;
        },*/
    },
    computed: {
        selectAll: {
            get: function () {
                return this.list.items ? this.selected.length === this.list.items.length : false;
            },
            set: function (value) {
                let selected = [];
                if (value) {
                    this.list.items.forEach(function (data) {
                        selected.push(data.cartId);
                    });
                }
                this.selected = selected;
            }
        },
    },
    mounted: function() {
        this.$nextTick(function () {



            vm.getCartItems();
        });
    }
}
</script>
