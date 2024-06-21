// https://www.npmjs.com/package/vuex-persistedstate

import createPersistedState from 'vuex-persistedstate'

const paths = [
	'savedLoginId',
	'visitExpireDate',
	'visit',
	'latelySearch',
	'snsPageType'
];

export default ({store}) => {
	createPersistedState({
		key: 'saleson_store',
		paths: paths
	})(store)
}