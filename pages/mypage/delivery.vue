<template>
	<section class="contents delivery_contents">
		<div class="tit_wrap">
			<h2 class="tit">배송주소록 관리</h2>
		</div>
		<div class="delivery_wrap">
			<div class="container">
				<div class="btn_right">
					<button type="button" class="btn btn_sm btn_default" @click="setDefaultFlag()">배송지로 선택</button>
				</div>
				<div class="delivery_list">
					<template v-if="result.content != null && result.content.length > 0">
						<ul>
							<li v-for="(data, index) in result.content" v-cloak>
								<div class="radio_area">
									<input type="radio" :id="'ship_check'+(index)" v-model="param.userDeliveryId" title="선택" :value="data.userDeliveryId">
									<label :for="'ship_check'+(index)"></label>
								</div>
								<div class="txt_area">
									<p class="name">{{unescapeHtml(data.title)}} <span v-if="data.defaultFlag === 'Y'">(기본)</span></p>
									<p class="address">{{unescapeHtml(data.userName)}}</p>
									<p class="address">({{data.newZipcode}}) {{unescapeHtml(data.address)}}
										<br class="mobile">{{unescapeHtml(data.addressDetail)}}</p>
									<p class="phone"><span>{{data.mobile}}</span><!--<br><span>{{data.phone}}</span>--></p>
									<div class="btn_right">
										<button type="button" class="btn btn_sm btn_light" @click="showModal(data)">수정</button>
										<button type="button" class="btn btn_sm btn_light" @click="listAction('del', message.delete, data.userDeliveryId)">삭제</button>
									</div>
								</div>
							</li>
						</ul>
					</template>
					<div class="common_none" v-else><p>조회 된 배송주소록이 없습니다.</p></div>
					<div class="row no-gutters btn-group">
						<div class="col-12 col-md-6 col-lg-4">
							<button type="button" class="btn btn_lg btn_deli_add" data-toggle="modal" data-target=".pop_deli_add" @click="init()"><span>배송지추가</span></button>
						</div>
					</div>
				</div>
			</div> <!--// container E -->
		</div> <!--// delivery_wrap E -->

		<!-- 배송지추가 레이어 -->
		<div class="modal fade modal_full pop_deli_add">
			<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
				<div class="modal-content">
					<div class="modal-header" v-if="param.userDeliveryId != '' ">
						<h3 class="modal_tit">배송지 수정</h3>
					</div>
					<div class="modal-header" v-else>
						<h3 class="modal_tit">배송지 추가</h3>
					</div>
					<div class="modal-body">
						<div class="form_wrap_line">
							<form class="needs-validation" @submit.prevent="saveShipping">
								<div class="form-group">
									<input type="text" class="form-control line" placeholder="배송지 이름" title="배송지 이름" v-model="param.title" required>
								</div>
								<div class="form-group">
									<input type="text" class="form-control line" placeholder="받는사람 이름" title="받는사람 이름" v-model="param.userName" required>
								</div>
								<div class="form-group address_area">
									<div class="input" v-html="param.addressInfo"></div>
									<span id="address_placeholder" class="placeholder">우편번호 찾기</span>
									<button type="button" class="btn_address" @click="openDaumPostcode()"><img class="img-fluid" src="/static/images/icon/btn_address.png" alt="주소찾기"></button>
								</div>
								<div class="form-group">
									<input type="text" class="form-control line" placeholder="상세주소를 입력하세요" title="상세주소를 입력하세요" v-model="param.addressDetail" required>
								</div>
								<div class="form-group phone_area">
									<div class="row no-gutters">
										<div class="col-4 col-md-2">
											<select class="custom-select line" v-model="param.frontMobile" required>
												<option v-for="data in param.phoneCodes" :value="data.detail">{{data.label}}</option>
											</select>
										</div>
										<div class="col-8 col-md-10">
											<input type="number" class="form-control line" placeholder="'-'없이 숫자만 입력" title="'-'없이 숫자만 입력"
											       v-model="param.backMobile" @change="valid($event, validate.numberOnly)" @input.capture="maxlength($event,8)" required>
											<div class="invalid-feedback">{{validate.numberOnlyMessage}}</div>
										</div>
									</div>
								</div>
								<div class="check_area">
									<input type="checkbox" id="common_ship" title="선택" v-model="param.defaultFlag" :true-value="yes" :false-value="no">
									<label for="common_ship">기본 배송지로 설정</label>
								</div>
								<div class="row no-gutters btn-group">
									<div class="col-12 col-md-6 col-lg-4">
										<button type="submit" class="btn btn_lg btn_primary">저장하기</button>
									</div>
								</div>
							</form>
						</div>
					</div>
					<button type="button" class="modal_close" data-dismiss="modal">
						<span class="screen_out">배송지추가 닫기</span>
					</button>
				</div>
			</div>
		</div>
    <address-layer></address-layer>
	</section> <!--// contents E -->
</template>

<script>
import AddressLayer from "@/components/ui/daum/address-layer";

let $s, vm;

export default {
  components: {AddressLayer},
  head() {
    return {
      script: [
        { src:'https://spi.maps.daum.net/imap/map_js_init/postcode.v2.js'}
      ],
      link: [
        { rel: 'stylesheet', href: '/static/css/item.css' },
        { rel: 'stylesheet', href: '/static/css/order.css' },
        { rel: 'stylesheet', href: '/static/css/mypage.css' },
        { rel: 'stylesheet', href: '/static/css/customer.css' }
      ]
    }
  },
  beforeCreate: function() {
    $s = this.$saleson;
    vm = this;
  },
  data: function () {
    return {
      yes: "Y",
      no: "N",
      param: {
        userDeliveryId: 0,
        mode: "",
        title : "", // 배송지 이름
        userName: "",
        zipcode: "",
        newZipcode: "",
        address: "",
        addressDetail: "",
        sido: "",
        sigungu: "",
        eupmyeondong: "",
        addressInfo: "",
        frontMobile: "010",
        backMobile: "",
        defaultFlag: "N",
        phoneCodes: {}
      },
      result: {
        content: [],
        last: true,
        totalPages: 0,
        totalElements: 0,
        size: 10,
        number: 0,
        sort: {},
        first: true,
        numberOfElements: 0
      },
      message: {
        default: "기본 배송지로 설정하시겠습니까?",
        delete: "배송지를 삭제하시겠습니까?"
      },
      validate: {
        numberOnly: $s.validator.patterns.number_only,
        numberOnlyMessage: $s.validator.messages.number_only
      }
    }
  },
  methods: {
    init: function() {
      vm.param.userDeliveryId = 0;
      vm.param.mode = "";
      vm.param.title = "";  // 배송지 이름
      vm.param.userName = "";
      vm.param.zipcode = "";
      vm.param.newZipcode = "";
      vm.param.address = "";
      vm.param.addressDetail = "";
      vm.param.addressInfo = "";
      vm.param.frontMobile = "010";
      vm.param.backMobile = "";
      vm.param.defaultFlag = "N";

      document.getElementById("address_placeholder").textContent = "우편번호 찾기";
    },
    getShipping: function() {
      $s.api.getShipping(
          function (response) {
            vm.result = response;
            vm.param.phoneCodes = response.phoneCodes;
          }
      );
    },
    listAction: function (mode, message, value) {
      $s.confirm(message, function() {
        vm.param.mode = mode;
        vm.param.userDeliveryId = value;

        $s.api.shippingListAction(vm.param,
            function (response) {
              if (response.status === "OK") {
                vm.reload($("#op-alert"));
              }
            }, function (error) {
              $s.alert(error.response.data.description);
            }
        );
      });
    },
    saveShipping: function() {
      if (!vm.checkfeed('.form_wrap_line')) {
        return false;
      }

      $s.api.saveShipping(vm.param,
          function (response) {
            if (response.status === "OK") {
              vm.reload($(".pop_deli_add"));
            }
          }, function (error) {
            $s.alert(error.response.data.description);
          }
      );
    },
    showModal: function (data) {
      vm.init();

      vm.param.title = data.title;
      vm.param.userDeliveryId = data.userDeliveryId;
      vm.param.userName = vm.unescapeHtml(data.userName);
      vm.param.zipcode = data.zipcode;
      vm.param.newZipcode = data.newZipcode;
      vm.param.address = data.address;
      vm.param.addressDetail = data.addressDetail;
      vm.param.addressInfo = "[" + data.newZipcode + "]" + data.address;
      vm.param.frontMobile = data.frontMobile;
      vm.param.backMobile = data.backMobile;
      vm.param.defaultFlag = data.defaultFlag;
      vm.param.mode = "edit";

      if (vm.param.address != "" && vm.param.address != undefined) {
        document.getElementById("address_placeholder").textContent = "";
      } else {
        document.getElementById("address_placeholder").textContent = "우편번호 찾기";
      }

      $(".pop_deli_add").modal("show");
    },
    openDaumPostcode: function () {
      let child = this.getChild("address-layer");
      if (child != null) {
        child.openDaumAddress(function(response) {
          vm.param.zipcode = response.zipcode;
          vm.param.newZipcode = response.newZipcode;
          vm.param.address = response.jibunAddress;
          vm.param.sido = response.sido;
          vm.param.sigungu = response.sigungu;
          vm.param.eupmyeondong = response.eupmyeondong;

          vm.param.addressInfo = "[" + response.newZipcode + "] " + response.jibunAddress;

          document.getElementById("address_placeholder").textContent = "";
        });
      }
    },
    setDefaultFlag: function () {
      if (vm.param.userDeliveryId === 0) {
        $s.alert("배송지를 선택해주세요.");
        return false;
      }

      vm.listAction("mod", vm.message.default, vm.param.userDeliveryId);
    },
    reload: function ($element) {
      $element.modal("hide");
      vm.getShipping();
      vm.init();
    }
  },
  mounted: function() {
    this.$nextTick(function () {



      vm.getShipping();
    });
  }
}
</script>
