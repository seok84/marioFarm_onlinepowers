
export const strict = false;

export const state = () => ({
	isAppUser: false,		// 앱 사용자 인가? 앱 으로 접속한 경우
	appToken: '',
	layout: 'default',
	mobileFlag: false,
	device: '',
	appVersion: '',
	seo : {
		title : '',
		keywords : '',
		description : '',
		indexFlag : false,
		openGraph : {
			title : '',
			type : '',
			image : '',
			description : '',
			link : ''
		},
	},
	salesonId: null,
	token: null,
	tokenStatus: null,
	tokenType: null,
	category: null,
	categoryUpdatedDate: null,
	savedLoginId: null,
	campaignCode: null,
	visit: null,
	visitExpireDate: null,
	latelySearch: [],
	latelyItem: [],
	quick : {
		cartQuantity: 0,
		wishlistCount: 0
	},
	newCartQuantity: 0,
	newWishlistCount: 0,
	history : {},
	gnbMenuTarget: '',
	buyOrder: '',
	kakaoShareInitFlag : false,
	snsPageType: '',
	couponCount: 0,
	shippingCouponCount: 0,
	point: 0,

});

export const mutations = {
	setAppUser(state, value) {
		state.isAppUser = value;
	},
	setAppToken(state, value) {
		state.appToken = value;
	},
	setLayout(state, value) {
		state.layout = value;
	},
	mobileFlag(state, value) {
		state.mobileFlag = value;
	},
	seo(state, seo) {
		if (typeof seo != 'undefined' && seo != null) {
			state.seo = seo;
		}
	},
	salesonId(state, value) {
		state.salesonId = value;
	},
	token(state, value) {
		state.token = value;
	},
	tokenStatus(state, value) {
		state.tokenStatus = value;
	},
	tokenType(state, value) {
		state.tokenType = value;
	},
	category(state, value) {
		state.category = value;
	},
	categoryUpdatedDate(state, value) {
		state.categoryUpdatedDate = value;
	},
	savedLoginId(state, value) {
		state.savedLoginId = value;
	},
	campaignCode(state, value) {
		state.campaignCode = value;
	},
	visit(state, value) {
		state.visit = value;
	},
	visitExpireDate(state, value) {
		state.visitExpireDate = value;
	},
	quick(state, value) {
		state.quick = value;
	},
	newCartQuantity(state, value) {
		state.newCartQuantity = value;
	},
	newWishlistCount(state, value) {
		state.newWishlistCount = value;
	},
	latelySearch(state, value) {
		state.latelySearch = value;
	},
	latelyItem(state, value) {
		state.latelyItem = value;
	},
	history(state, value) {
		state.history = value;
	},
	gnbMenuTarget(state, value) {
		state.gnbMenuTarget = value;
	},
	buyOrder(state, value) {
		state.buyOrder = value;
	},
	kakaoShareInitFlag(state, value) {
		state.kakaoShareInitFlag = value;
	},
	snsPageType(state, value) {
		state.snsPageType = value;
	},
	device(state, value) {
		state.device = value;
	},
	appVersion(state) {
		return state.appVersion;
	},
	setCouponCount(state, value) {
		state.couponCount = value;
	},
	setShippingCouponCount(state, value) {
		state.shippingCouponCount = value;
	},
	setPoint(state, value) {
		state.point = value;
	}
}

export const getters = {
	get(state) {
		return {
			seo : state.seo,
			salesonId: state.salesonId,
			token: state.token,
			tokenStatus: state.tokenStatus,
			tokenType: state.tokenType,
			category: state.category,
			categoryUpdatedDate: state.categoryUpdatedDate,
			savedLoginId: state.savedLoginId,
			campaignCode: state.campaignCode,
			visit: state.visit,
			visitExpireDate: state.visitExpireDate,
			latelyItem: state.latelyItem,
			latelySearch: state.latelySearch,
			history: state.history,
			buyOrder : state.buyOrder,
			kakaoShareInitFlag : state.kakaoShareInitFlag,
			gnbMenuTarget : state.gnbMenuTarget,
			mobileFlag : state.mobileFlag,

			isAppUser: state.isAppUser,
			layout: state.layout,
			snsPageType: state.snsPageType,
			device: state.device,
			appVersion: state.appVersion,
			couponCount: state.couponCount,
			shippingCouponCount: state.shippingCouponCount,
			point: state.point
		}
	},

	isAppUser(state) {
		return state.isAppUser;
	},
	appToken(state) {
		return state.appToken;
	},
	layout(state) {
		return state.layout;
	},
	snsPageType(state) {
		return state.snsPageType;
	},
	couponCount(state) {
		return state.couponCount;
	},
	shippingCouponCount(state) {
		return state.shippingCouponCount;
	},
	point(state) {
		return state.point;
	},
	device(state) {
		return state.device;
	},
	appVersion(state) {
		return state.appVersion;
	}
}

export const actions = {

}
