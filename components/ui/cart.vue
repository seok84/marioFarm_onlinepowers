<template>
    <div>
        <div class="cart_bg" @click="closeCartLayer" v-show="showCartBg"></div>
        <div class="layer_cart" :class="{'open' : layerCart}">
            <div class="cart_layer_list">
                <div class="guide">선택하신 상품이 장바구니에 추가되었습니다.</div>
                <div class="item_list basic">
                    <div class="row no-gutters" v-for="data in (list ? list.items : [])">
                        <div class="col-3 col-md-1 col-xl-3">
                            <div class="list_area">
                                <div class="img_area">
                                    <a :href="'/item/' + data.itemUserCode">
                                        <img :src="itemImage(data.itemImage)" alt="item thumbnail_01">
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-9 col-md-11 col-xl-9">
                            <div class="txt_area">
                                <a :href="'/item/' + data.itemUserCode">
                                    <p class="brand">브랜드명</p>
                                    <p class="title">{{data.itemName}}</p>
                                    <div class="option">
                                        <p v-if="data.options">{{data.options}}</p>
                                        <p v-if="data.itemPrice.quantity > 0 ">수량: {{data.itemPrice.quantity}}</p>
                                    </div>
                                    <div class="price_area">
                                        <p class="price">
                                            <span class="before" v-if="data.itemPrice.discountAmount > 0">{{formatNumber(data.itemPrice.itemSaleAmount)}}원</span>
                                            <span class="after">{{formatNumber(data.itemPrice.saleAmount)}}원</span>
                                        </p>
                                        <p class="per" v-if="data.discountRate > 0">{{data.discountRate}}<span>%</span>
                                        </p>
                                    </div>
                                </a>
                                <button type="button" class="btn_itemDel" @click.prevent="deleteCart(data.cartId)">
                                    <img src="/static/images/icon/btn_del.png" alt="상품삭제">
                                </button>
                            </div>
                        </div>
                    </div>
                </div> <!--// item_list E-->
                <div class="row totalBox">
                    <div class="col-6 txt">총 상품금액</div>
                    <div class="col-6 price"><span>{{orderPrice ? formatNumber(orderPrice.orderPayAmount) : 0}}</span>원
                    </div>
                </div>
                <div class="btn_wrap">
                    <a href="/cart" class="btn btn_outline_light">장바구니 가기</a>
                    <button type="button" class="btn btn_primary">바로구매</button>
                </div>
            </div> <!--// cart_layer_list E-->
            <a href="#" class="pop_close" @click.prevent="closeCartLayer"><img
                    src="/static/images/icon/btn_itemDel.png" alt="팝업창 닫기"></a>
        </div> <!--// layer_cart E -->
    </div>
</template>

<script>
    module.exports = {
        data() {
            return {
                param: {
                    arrayRequiredItems: []
                },
                result: {},
                item: {
                    content: []
                },
                list: [],
                orderPrice: [],
                showCartBg: false,
                layerCart: false
            }
        },

        methods: {

            getCartItems: function () {
                let self = this;
                $s.api.getCartItems(function (response) {
                    self.list = response.list[0];
                    self.orderPrice = response.orderPrice;
                });
            },

            addToCart: function (itemId, orderMinQuantity) {
                let quantity = Number(orderMinQuantity) > 1 ? Number(orderMinQuantity) : 1;
                this.param.arrayRequiredItems.push(itemId + '||' + quantity + '||');

                let self = this;
                $s.api.addToCart(this.param, function () {
                    let arrayRequiredItems = self.param.arrayRequiredItems;
                    self.getCartItems();
                    self.layerCart = true;
                    self.showCartBg = true;
                    $("html, body").addClass("scroll_none");

                    arrayRequiredItems.splice(0, arrayRequiredItems.length);
                });
            },

            deleteCart: function (cartId) {
                let self = this;
                $s.confirm("선택하신 상품을 장바구니에서 삭제하시겠습니까?", function () {
                    $s.api.deleteCart([cartId], function () {
                        self.getCartItems();
                    })
                });
            },

            closeCartLayer: function () {
                this.layerCart = false;
                this.showCartBg = false;
                $("html, body").removeClass("scroll_none");
            },
        },
        mounted() {


        },
    };
</script>