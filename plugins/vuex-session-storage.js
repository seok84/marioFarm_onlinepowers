// https://www.npmjs.com/package/vuex-persistedstate

import createPersistedState from 'vuex-persistedstate'

const paths = [
	'seo',
	'quickInfo',
	'mobileFlag',
	'salesonId',
	'category',
	'categoryUpdatedDate',
	'tokenType',
	'token',
	'tokenStatus',
	'quick',
	'newCartQuantity',
	'newWishlistCount',
	'latelyItem',
	'history',
	'gnbMenuTarget'
];

export default ({store}) => {
	createPersistedState({
		key: 'saleson_store',
		storage: window.sessionStorage,
		paths: paths
	})(store)
}