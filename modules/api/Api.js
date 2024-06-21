class Api {
    constructor(context) {
        this.$axios = context.$axios;
        this.store = context.store
        this.isLogin = context.store.$auth.loggedIn;
    }


    getRequestOptions(params) {
        const requestOptions = {
            headers:{
                SALESONID: this.store.getters.get["salesonId"]
            }
        };

        if (params !== 'undefined') {
            requestOptions.params = params;
        }

        if (this.isLogin) {
            requestOptions.headers['Authorization'] = this.store.$auth.strategy.token.get();
        }

        return requestOptions;
    }

    get(url, params) {
        return this.$axios.get(url, this.getRequestOptions(params));
    }

    post(url, params) {
        return this.$axios.post(url, params, this.getRequestOptions());
    }

    downloadFile(url,params,type) {

        const option = this.getRequestOptions(url, this.getRequestOptions(params));

        if (typeof type !== undefined) {
            option['responseType'] = type;
        }

        return this.$axios.get(url, option);
    }
}

export default Api;