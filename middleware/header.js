import * as Cookies from 'js-cookie';

export default async function ({req, route, store}) {
    // application start
    let userAgent = '';
    if (process.server) {
        userAgent = req.headers['user-agent'];

    }
    if (process.client) {
        userAgent = navigator.userAgent || navigtor.vendor || window.opera;
    }

    if (userAgent !== '') {

        console.log('userAgent : '+userAgent);

        let mobileFlag = userAgent.indexOf("Mobi") > -1;
        let device = '';

        if (/SALESON_APPLICATION_ANDROID/.test(userAgent)) {
            device = 'ANDROID';
            mobileFlag = true;
        } else if (/SALESON_APPLICATION_IOS/.test(userAgent)) {
            device =  'IOS';
            mobileFlag = true;
        } else {
            if (mobileFlag) {
                device = 'MOBILE';
            } else {
                device = 'PC';
            }
        }

        store.commit('device', device);
        store.commit('mobileFlag', mobileFlag);


        let appVersion = '';
        try {
            const arrayUserAgent= userAgent.split(' ').filter(s=> {return s.includes('appver=')});

            if (arrayUserAgent.length > 0) {
                const appver = arrayUserAgent[0].trim().split('=');
                appVersion = appver[1];
            }

        } catch (e) {
            appVersion = '';
        }
        store.commit('appVersion', appVersion);
    } // application end

    try {

        const path = route.path;
        const pathType = ['/mypage', '/mypage/', '/user/modify', '/user/change-password'];
        let pathValidation = false;

        pathType.forEach( type => {
            if(path.indexOf(type) >= 0) {
                pathValidation = true;
                return false;
            }
        });

        if(pathValidation) {
            const {data} = await store.$axios.get("/api/mypage/coupon-and-point");

            store.commit('setPoint', data.point);
            store.commit('setCouponCount', data.couponCount);
            store.commit('setShippingCouponCount', data.shippingCouponCount);
        }
    } catch (error){
        console.log(error,'error');
    }
}
