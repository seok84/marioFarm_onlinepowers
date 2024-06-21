
const appEvent = {

    async initClient({$store, $salesonApi, $nuxt, $router}) {

        if (process.client && this.is($store)) {

            try {
                // 버전 업데이트 팝업
                const versionResponse = await $salesonApi().appVersion.getAppVersion();
                const version = versionResponse.data;
                const storeVersion = $store.state.appVersion;

                if (version.version != null) {
                    const v1 = Number(storeVersion.replace(/\./g, ''));
                    const v2 = Number(version.version.replace(/\./g, ''));

                    if (v1 != v2) {
                        if (v1 < v2) {
                            $router.push('/app/update');
                        }
                    }
                }
            } catch (e) {
                console.error(e)
                console.error('app version event error');
            }

            // 첫 설치 팝업
            const firstAppAccess = $store.state.firstAppAccess;
            if (firstAppAccess) {
                $nuxt.$emit('showPushAlert');
                $store.commit('firstAppAccess', false);
            }


        }
    },

    getPushMessage() {
        return {
            PUSH_ALERT: '대상다이브스의 광고성 정보 메시지를 수신 pushType하셨습니다. ',
            SAVE_LOG_ERROR: '광고성 정보 메시지 저장에 실패하였습니다. 알림설정에서 재설정해주세요.'
        }
    },

    requestAlertStatus($store, target, receivePush = true) { //시스템 설정의 알림 ON/OFF 상태를 리턴

        const deviceInfo = $store.state.deviceInfo;

        deviceInfo.target = target;
        deviceInfo.alarm = receivePush;
        $store.commit('deviceInfo', deviceInfo);

        try {
            if (this.isIos($store)) {
                location.href = this.getIosScheme() + "requestAlertStatus";
            } else if (this.isAndroid($store)) {
                this.getAndroidScheme().requestAlertStatus();
            }
        } catch (e) {
            deviceInfo.status = 'off';
            this.$store.commit('deviceInfo', deviceInfo);
        }
    },


    requestAlertSettings($store) { //시스템 설정으로 이동
        try {
            if (this.isIos($store)) {
                location.href = this.getIosScheme() + "requestAlertSettings";
            } else if (this.isAndroid($store)) {
                this.getAndroidScheme().requestAlertSettings();
            }
        } catch (e) {
        }

    },

    requestDeviceInfo($store, target, receivePush) { //유효id, 앱 첫진입, 알림상태

        const deviceInfo = $store.state.deviceInfo;

        deviceInfo.target = target;
        deviceInfo.receive = receivePush;

        try {
            if (this.isIos($store)) {
                location.href = this.getIosScheme() + "requestDeviceInfo";
            } else if (this.isAndroid($store)) {
                this.getAndroidScheme().requestDeviceInfo();
            }
        } catch (e) {

            deviceInfo.key = '';
            deviceInfo.status = 'N';
            deviceInfo.first = true;
        }

        $store.commit('deviceInfo', deviceInfo);
    },
    clearPushTokenStatus($store) {
        $store.commit('setPushTokenStatus', '');
    },

    requestPushToken($store, $auth) {

        try {
            if ($auth.loggedIn) {

                const status = $store.state.pushTokenStatus;

                if (typeof status === undefined || status == null || status == '') {
                    if (this.isIos($store)) {
                        location.href = this.getIosScheme() + "requestPushToken";
                    } else if (this.isAndroid($store)) {
                        this.getAndroidScheme().requestPushToken();
                    } else {
                    }
                }
            } else {
                this.clearPushTokenStatus($store);
            }
        } catch (e) {
            console.error('requestPushToken error')
        }
    },

    requestAppPermission($store, $router) {
        if (this.isIos($store)) {
            location.href = this.getIosScheme() + "requestAppPermission";
        } else if (this.isAndroid($store)) {
            this.getAndroidScheme().requestAppPermission();
        } else {
            console.error('not appliction')
            $router.push('/')
        }
    },

    requestNewOpen($store, url = '') {

        if (url != '') {
            try {
                const paramText = JSON.stringify({url:url});

                if (this.isIos($store)) {
                    location.href = this.getIosScheme() + encodeURIComponent(paramText);
                } else if (this.isAndroid($store)) {
                    this.getAndroidScheme().requestNewOpen(paramText);
                }
            } catch (e) {
                console.error(`requestNewOpen error [${url}]`)
            }
        }
    },

    getAndroidScheme() {
        return cntmart;
    },

    getIosScheme() {
        return 'cntmart://';
    },

    isIos($store) {
        return 'IOS' == $store.state.device;
    },

    isAndroid($store) {
        return 'ANDROID' == $store.state.device;
    },
    is($store) {
        return this.isIos($store) || this.isAndroid($store)
    },

    async saveAppPushLog($salesoon, appPushApi, key, receiveFlag, showToast) {
        try {

            const response = await appPushApi.saveLog({key: key, receiveFlag:receiveFlag});

            if (showToast) {
                let toast = this.getPushMessage().PUSH_ALERT + response.data;
                if (receiveFlag === 'Y') {
                    toast = toast.replace("pushType","동의");
                } else {
                    toast = toast.replace("pushType","거부");
                }

                $salesoon.toast(toast);
            }

        } catch (e) {
            alert(this.getPushMessage().SAVE_LOG_ERROR);
        }
    },
};

export default appEvent;