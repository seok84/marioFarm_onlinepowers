// https://www.npmjs.com/package/vuex-persistedstate

import createPersistedState from 'vuex-persistedstate';
import * as Cookies from 'js-cookie';
import cookie from 'cookie';

const paths = [
    'isAppUser',
    'appToken',
    'layout',
    'couponCount',
    'shippingCouponCount',
    'point'
];

export default ({store, req}) => {
	createPersistedState({
		key: 'saleson_store',
		storage: {
            getItem: (key) => {
                // See https://nuxtjs.org/guide/plugins/#using-process-flags
                if (process.server) {
                    let headerCookie = req.headers.cookie;
                    if (typeof headerCookie !== 'string') {
                        headerCookie = '';
                    }
                    const parsedCookies = cookie.parse(headerCookie);


                    //const parsedCookies = cookie.parse(req.headers.cookie);
                    return parsedCookies[key];
                } else {
                    return Cookies.get(key);
                }
            },
            // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
            setItem: (key, value) =>
                Cookies.set(key, value, { expires: 365, secure: false }),
            removeItem: key => Cookies.remove(key)
        },
		paths: paths
	})(store)
}