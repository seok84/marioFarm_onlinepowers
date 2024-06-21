// Vue 전역 Mixin
const Const = {
    defaultCountry: 'KR',
    defaultDialingCode: '82',
};

export default {
    methods: {

        getOpenGraphMetaList() {
            let seo = this.$store.state.seo;

            let list = [];

            if (typeof seo != 'undefined' && seo != null) {
                let og = seo.openGraph;

                if (typeof og != 'undefined' && og != null) {
                    addMeta(list,'og:url', 'og:url', og.link);
                    addMeta(list,'og:title', 'og:title', this.unescapeHtml(og.title));
                    addMeta(list,'og:image', 'og:image', og.image);
                    addMeta(list,'og:description', 'og:description', this.unescapeHtml(og.description));
                }
            }

            return list;

            function addMeta(list, hid, property, content) {
                if (content != null && content != '') {
                    list.push({
                        hid: hid,
                        property : property,
                        content : content
                    });
                }
            }
        },

        appendCdnDomain: function (value) {
            if (value != null && value !='') {
                let target = '/upload/editor';
                value = value.replace(/\/upload\/editor/g, this.$saleson.config.cdnDomain + '' + target);
            }

            return value;
        },

        formatNumber: function (number) {
            try {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } catch (e) {
                return number;
            }
        },

        itemImage: function (src) {

            if (src == null || src == '') {
                return this.$saleson.config.loadingImage;
            }

            return this.$saleson.config.cdnDomain + '' + this.unescapeHtml(src);
        },

        errorImage: function (e) {
            e.target.src = this.$saleson.config.noImage;
        },

        partName: function (part) {
            if (part.enabled) {
                return part.name;
            } else {
                return '<span class="disabled">' + part.name + '</span>';
            }
        },

        companyName: function (companyName, enabled) {
            if (enabled) {
                return companyName;
            } else {
                return '<span class="disabled">' + companyName + '</span>';
            }
        },
        /*companyName: function(company) {
			if (company.enabled) {
				return company.name;
			} else {
				return '<span class="disabled">' + company.name + '</span>';
			}
		},*/

        locationName: function (locationName, enabled) {
            if (enabled) {
                return locationName;
            } else {
                return '<span class="disabled">' + locationName + '</span>';
            }
        },

        categoryName: function (category) {
            if (category.enabled) {
                return category.name;
            } else {
                return '<span class="disabled">' + category.name + '</span>';
            }
        },


        alertUnchangeableStatus: function () {
            alert('You cannot change the status.');
        },

        condition: function (mold, status) {
            if (mold.equipmentStatus == 'DISCARDED' && status == 'discarded') {
                return false;
                //return true;

            } else if (mold.equipmentStatus == 'FAILURE' && status == 'failure') {
                return false;
                //return true;

            } else {
                if (mold.toolingCondition == 'GOOD' && status == 'good') {
                    return true;
                }

                if (mold.toolingCondition == 'FAIR' && status == 'fair') {
                    return true;
                }

                if (mold.toolingCondition == 'POOR' && status == 'poor') {
                    return true;
                }
            }
            return false;
        },


        multipartHeader: function () {
            return {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        },

        lower: function (code) {
            return code == undefined ? code : code.toLowerCase();
        },

        initNotifyAlert: function (self, alertType) {
            let component = Common.vue.getChild(self.$children, 'notify-alert');
            if (component != null) {
                component.init(alertType);
            }
        },

        dateFormat: function (t, type) {
            let result = "";
            if (t != null) {
                if (type == null || type == "time") {
                    result = t.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6');
                } else if (type == "date") {
                    result = t.substr(0, 8).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                }
            }
            return result;
        },

        maxlength: function (e, len) {
            let str = e.target.value;
            if (str.length > len) {
                str = str.slice(0, len);

                this.$saleson.alert(len + '자를 초과 할 수 없습니다.');
                e.target.value = str;
            }
        },

        redirect: function (uri) {
            this.$saleson.redirect(uri);
        },

        validfeed: function (e, flag) {

            let element = e.target;

            if (typeof flag == 'boolean') {
                element.className = element.className.replace(/ is-valid/g, '');
                element.className = element.className.replace(/ is-invalid/g, '');

                if (flag) {
                    element.className = element.className + ' is-valid';
                } else {
                    element.className = element.className + ' is-invalid';
                }
            }
        },

        valid: function (e, pattern) {

            let element = e.target;
            let flag = new RegExp(pattern).test(element.value);

            this.validfeed(e, flag);
        },

        checkfeed: function (value) {

            let element = document.querySelector(value);

            let list = element.getElementsByClassName('is-invalid');

            if (typeof list == 'undefined' || list == null) {
                return true;
            }

            return list.length == 0;
        },
        childCategories: function (groupUrl, category1Url, category2Url, category3Url) {

            try {

                let category = JSON.parse(this.$saleson.core.getState(this.$saleson.const.CATEGORY));
                let child = [];

                if (typeof groupUrl != 'undefined') {
                    // 그룹 에서 자식 카테고리 추출
                    let groups = category.groups;

                    for (let i = 0; i < groups.length; i++) {
                        if (groupUrl == groups[i].url) {
                            child = groups[i].categories;
                            break;
                        }
                    }
                }

                child = getChildCategories(child, category1Url);

                child = getChildCategories(child, category2Url);

                child = getChildCategories(child, category3Url);

                return child;

            } catch (e) {
                this.$saleson.error('get childCategories error');
                return [];
            }

            function getChildCategories(parent, url) {

                let child = [];

                if (parent.length > 0 && typeof url != 'undefined' && url != '') {

                    for (let i = 0; i < parent.length; i++) {
                        if (url == parent[i].url) {
                            child = parent[i].childCategories;
                            break;
                        }
                    }

                } else {
                    child = parent;
                }

                return child;
            }
        },
        categoryInfo: function (self, callbackHandler) {
            let $s = this.$saleson;

            let category = $s.core.getState($s.const.CATEGORY);

            if (typeof category == 'undefined' || category == null) {
                getCategories(callbackHandler);
            } else {
                $s.api.getCategoriesUpdatedCheck(function (data) {

                    if (data.categoryUpdateFlag) {
                        getCategories(callbackHandler);
                    } else {
                        self.category = JSON.parse(category);

                        if ($s.core.isFunction(callbackHandler)) {
                            callbackHandler(JSON.parse(category));
                        }
                    }
                }, function() {
                    $s.error('getCategoriesUpdatedCheck error');

                    self.category = JSON.parse(category);

                    if ($s.core.isFunction(callbackHandler)) {
                        callbackHandler(JSON.parse(category));
                    }
                });

            }

            function getCategories(callbackHandler) {
                $s.api.getCategories(function (data) {
                    let category = JSON.stringify(data.list[0]);
                    $s.core.setState($s.const.CATEGORY, category);
                    self.category = JSON.parse(category);
                    $s.core.setState($s.const.CATEGORY_UPDATED_DATE, data.updatedDate);

                    if ($s.core.isFunction(callbackHandler)) {
                        callbackHandler(JSON.parse(category));
                    }
                }, function (error) {
                    $s.error('getCategories error');
                });
            }
        },
        latelyInfo: function (self) {

            let maxLength = 10;
            let lately = this.$saleson.core.getState(this.$saleson.const.LATELY_SEARCH);

            if (typeof self.latelySearch == 'undefined') {
                self.latelySearch = [];
            }

            if (typeof lately != 'undefined' && lately != null && lately.length > 0) {

                self.latelySearch = JSON.parse(lately);

                if (self.latelySearch.length > maxLength) {
                    self.latelySearch = self.latelySearch.slice(0, maxLength);
                }
            }

        },

        addlatelyItem: function (itemId) {

            let lately = this.$saleson.core.getState(this.$saleson.const.LATELY_ITEM);

            if (typeof lately != 'undefined' && lately != null && lately.length > 0) {
                lately = JSON.parse(lately);
            } else {
                lately = [];
            }

            let limit = 10;

            let pos = lately.indexOf(itemId);

            if (pos < 0) {
                lately.unshift(itemId);

                if (lately.length > limit) {
                    let subLength = lately.length - limit;
                    lately.splice(limit, subLength);
                }
            } else {
                lately.splice(pos, 1);
                lately.unshift(itemId);
            }

            this.$saleson.core.setState(this.$saleson.const.LATELY_ITEM, JSON.stringify(lately));

            this.$nuxt.$emit('updateQuickLatelyItemsItems');
        },

        latelyItemInfo: function (self) {
            let lately = this.$saleson.core.getState(this.$saleson.const.LATELY_ITEM);

            if (typeof lately != 'undefined' && lately != null && lately.length > 0) {
                lately = JSON.parse(lately);
            } else {
                lately = [];
            }

            self.latelyItems = lately;

        },
        unescapeHtml: function (str) {

            if (str != undefined && str != "") {
                str = str.replace(/&amp;/g, '&')
                    .replace(/&#40;/g, '(')
                    .replace(/&#41;/g, ')')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '\"')
                    .replace(/&apos;/g, '\'')
                    .replace(/&#x2F;/g, '\\')
                    .replace(/<p>&nbsp;<\/p>/g, '<br/>')
                    .replace(/&nbsp;/g, ' ');
            }

            return str;
        },

        formatTime: function (time) {
            if (time.length < 6) {
                return "";
            }
            return time.substr(0, 2) + ":" + time.substr(2, 2) + ":" + time.substr(4, 2);
        },

        nl2br: function(value) {
            return value.replace(/(?:\r\n|\r|\n)/g, '<br/>')
        },

        setPageInfo: function (title, description, keywords) {
            if (typeof title != 'undefined' && title != '') {
                document.title = title;
            }

            if (typeof description != 'undefined' && description != '') {
                this.setMetaTag('description', description);
            }

            if (typeof keywords != 'undefined' && keywords != '') {
                this.setMetaTag('keywords', keywords);
            }
        },
        getMetaTagContent: function (name) {
            let metas = document.head.getElementsByTagName('meta');

            if (typeof metas != 'undefined' && metas.length > 0) {

                for (let i=0 ;i<metas.length; i++) {
                    if (metas[i].name == name) {
                        return metas[i].content;
                    }
                }
            }

            return ''
        },

        setMetaTag: function (name, value) {

            if (typeof value != 'undefined' && value != '') {
                let metas = document.head.getElementsByTagName('meta');

                if (typeof metas != 'undefined' && metas.length > 0) {

                    for (let i=0 ;i<metas.length; i++) {
                        if (metas[i].name == name) {
                            metas[i].content = value;
                            break;
                        }
                    }
                }
            }
        },

        makeOpenGraphTag: function(url, title, image, description) {

            try {
                let head = document.getElementsByTagName('head')[0];

                if (typeof url != 'undefined' && url != '') {
                    head.appendChild(getMeta('og:url', url));
                }

                if (typeof title != 'undefined' && title != '') {
                    head.appendChild(getMeta('og:title', this.unescapeHtml(title)));
                }

                if (typeof image != 'undefined' && image != '' && image != this.$saleson.config.noImage) {
                    head.appendChild(getMeta('og:image', image));
                }

                if (typeof description != 'undefined' && description != '') {
                    head.appendChild(getMeta('og:description', this.unescapeHtml(description)));
                }
            } catch (e) {
                this.$saleson.error(e);
            }

            function getMeta(property, content) {
                let e = document.createElement('meta');
                e.setAttribute('property', property);
                e.content = content;

                return e;
            }
        },

        discountRate : function(itemPrice, presentPrice){
            return Math.floor(((Number(itemPrice)-presentPrice)/Number(itemPrice))*100);
        },

        /**
         * 브라우저 이름을 소문자로 반환하며 Internet Explorer는 ie로 반환한다.<br />
         * 지원 브라우저 : Internet Explorer, Chrome, Opera, FireFox, Safari
         * @returns {String}
         */
        getBrowser: function(agent) {
            if (agent == null) {
                return '기타';
            }

            agent = agent.toLowerCase();
            let os = this.getOs(agent);
            let browser = '';

            if (agent.substr(0, 7) == 'mozilla' && agent.indexOf("like gecko") > -1 && agent.indexOf("edge") > -1) {
                browser = 'MS Edge';
            } else if (agent.indexOf('rv:11.0') > -1 || agent.indexOf('trident/7.0') > -1) {
                browser = 'IE 11';
            } else if (agent.indexOf('trident/6.0') > -1) {
                browser = 'IE 10';
            } else if (agent.indexOf('trident/5.0') > -1) {
                browser = 'IE 9';
            } else if (agent.indexOf('trident/4.0') > -1) {
                browser = 'IE 8';
            } else if (agent.indexOf("msie 6.") > -1) {
                browser = "IE 6";
            } else if (agent.indexOf("msie 5.5") > -1)	{
                browser = "IE 5.5";
            } else if (agent.indexOf("msie 5.") > -1)	{
                browser = 'IE 5';
            } else if (agent.indexOf('msie 7.') > -1) {
                browser = 'IE 7';
            } else if (agent.indexOf('msie 8.') > -1) {
                browser = 'IE 8';
            } else if (agent.indexOf('msie 9.') > -1) {
                browser = 'IE 9';
            } else if (agent.indexOf('msie 10.') > -1) {
                browser = 'IE 10';
            } else if (agent.indexOf('msie 4.') > -1) {
                browser = 'IE 4.x';
            } else if (os == 'iOS') {
                browser = 'Safari Mobile';
            } else if (agent.indexOf('firefox') > -1 && agent.indexOf('seamonkey') == -1) {
                browser = 'Firefox';
            } else if (agent.indexOf('safari') > -1 && !(agent.indexOf('chrome') > -1 || agent.indexOf('chromium') > -1)) {
                browser = 'Safari';
            } else if (agent.indexOf('chrome') > -1 && agent.indexOf('chromium') == -1) {
                browser = 'Chrome';
            } else if (agent.indexOf('opera') > -1) {
                browser = 'Opera';
            } else if (agent.indexOf('x11') > -1) {
                browser = 'Netscape';
            } else if (agent.indexOf('gec') > -1) {
                browser = 'Gecko';
            } else if (agent.indexOf('bot|slurp') > -1) {
                browser = 'Robot';
            } else if (agent.indexOf('internet explorer') > -1) {
                browser = 'IE';
            } else if (agent.indexOf('mozilla') > -1) {
                browser = 'Mozilla';
            } else {
                browser = '기타';
            }
            return browser;
        },

        getOs: function(agent) {
            if (agent == null) {
                return '기타';
            }
            agent = agent.toLowerCase();
            let os = '';

            if (agent.indexOf('windows 98') > -1)                 { os = 'Windows 98'; }
            else if (agent.indexOf('windows 95') > -1)            { os = 'Windows 95'; }
            else if(agent.indexOf('windows nt 4') > -1)   		  { os = 'Windows NT'; }
            else if(agent.indexOf('windows nt 5.0') > -1)         { os = 'Windows 2000'; }
            else if(agent.indexOf('windows nt 5.1') > -1)         { os = 'Windows XP'; }
            else if(agent.indexOf('windows nt 5.2') > -1)         { os = 'Windows XP x64'; }
            else if(agent.indexOf('windows nt 6.0') > -1)         { os = 'Windows Vista'; }
            else if(agent.indexOf('windows nt 6.1') > -1)         { os = 'Windows 7'; }
            else if(agent.indexOf('windows nt 6.2') > -1)         { os = 'Windows 8'; }
            else if(agent.indexOf('windows nt 6.3') > -1)         { os = 'Windows 8.1'; }
            else if(agent.indexOf('windows nt 10') > -1)          { os = 'Windows 10'; }
            else if(agent.indexOf('windows 9x') > -1)             { os = 'Windows ME'; }
            else if(agent.indexOf('windows ce') > -1)             { os = 'Windows CE'; }
            else if(agent.indexOf('macintosh') > -1)              { os = 'Mac OS'; }
            else if(agent.indexOf('iphone') > -1)                 { os = 'iOS'; }
            else if(agent.indexOf('android') > -1)                { os = 'Android'; }
            else if(agent.indexOf('mac') > -1)                    { os = 'Mac OS'; }
            else if(agent.indexOf('linux') > -1)                  { os = 'Linux'; }
            else if(agent.indexOf('sunos') > -1)                  { os = 'sunOS'; }
            else if(agent.indexOf('irix') > -1)                   { os = 'IRIX'; }
            else if(agent.indexOf('phone') > -1)                  { os = 'Phone'; }
            else if(agent.indexOf('bot|slurp') > -1)              { os = 'Robot'; }
            else if(agent.indexOf('internet explorer') > -1)      { os = 'IE'; }
            else if(agent.indexOf('mozilla') > -1)                { os = 'Mozilla'; }
            else { os = '기타'; }

            return os;
        },

        getDomainName: function(domain) {
            if (domain == null) {
                return '';
            }

            let domainName = domain;
            if (domain.indexOf('naver.com') > -1) {
                domainName = '네이버';
            } else if (domain.indexOf('google.co.kr') <= -1 && domain.indexOf('google.com') <= -1) {
                if (domain.indexOf('yahoo.co.kr') <= -1 && domain.indexOf('yahoo.com') <= -1) {
                    if (domain.indexOf('daum.net') > -1) {
                        domainName = '다음';
                    } else if (domain.indexOf('paran.com') > -1) {
                        domainName = '파란';
                    } else if (domain.indexOf('msn.com') > -1) {
                        domainName = 'MSN';
                    } else if (domain.indexOf('nate.com') > -1) {
                        domainName = '네이트';
                    } else if (domain.indexOf('onlinepowers.com') > -1) {
                        domainName = '온라인파워스';
                    } else if (domain.indexOf('jungle.co.kr') > -1) {
                        domainName = '디자인정글';
                    } else if (domain.indexOf('gongmo21.com') > -1) {
                        domainName = '공모닷컴';
                    } else if (domain.indexOf('reportworld.co.kr') > -1) {
                        domainName = '레포트월드';
                    } else if (domain.indexOf('campusmon.com') > -1) {
                        domainName = '캠퍼스몬';
                    } else if (domain.indexOf('chulsa.kr') > -1) {
                        domainName = '출사닷컴';
                    } else if (domain.indexOf('beautifulshinhan.com') > -1) {
                        domainName = '직접입력';
                    } else if (domain == '직접입력') {
                        domainName = '직접입력';
                    }
                } else {
                    domainName = '야후';
                }
            } else {
                domainName = '구글';
            }

            return domainName;
        },

        findDomain: function(str) {
            let result = '';
            if (str != null && str != '') {
                result = str.match(/^https?:\/\/([a-z0-9_\-\.]+)/i)[0];
            } else {
                result = '직접입력';
            }

            return result;
        },
        googleAnalyticsImpression: function(items, listName, category) {

            try {
                let gaItems = [];
                if (typeof items != 'undefined' && items != null) {
                    let index = 0;
                    for (let i=0; i < items.length; i++) {
                        let item = items[i],
                            gaItem = this.$saleson.ga.getImpressionsItem(
                                item.itemUserCode,
                                item.itemName,
                                listName,
                                item.brand,
                                category,
                                index,
                                item.presentPrice
                            );

                        if (gaItem != null) {
                            gaItems.push(gaItem);
                            index++;
                        }
                    }

                    this.$saleson.ga.impression(gaItems);
                }
            } catch (e) {
                this.$saleson.error(e);
            }
        },
        googleAnalyticsSelect: function(item, listName, category) {
            try {

                let gaItem = this.$saleson.ga.getImpressionsItem(
                    item.itemUserCode,
                    item.itemName,
                    listName,
                    item.brand,
                    category,
                    -1,
                    item.presentPrice
                );

                this.$saleson.ga.select([gaItem]);
            } catch (e) {
                this.$saleson.error(e);
            }
        },

        handleScroll: function() {
            let updatePercentage = 80;
            if (getCurrentScrollPercentage() > updatePercentage && vm.result.content.length > 0 && vm.scroll) {
                vm.scroll = false;
                vm.param.page++;
                vm.addItems();
            }

            function getCurrentScrollPercentage() {
                let _scrollTop = window.scrollY || document.documentElement.scrollTop;
                let value = ((_scrollTop + window.innerHeight) / document.body.clientHeight) * 100;
                return Math.ceil(value);
            }
        },

        viewDetails: function(url, type, name) {
            this.setHistory(type, name);
            this.$saleson.redirect(url);
        },

        setHistory (type, name) {

            // 스크롤링
            if (type === 'scroll') {
                this.param.indexScroll = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
            }

            let history = this.$saleson.core.getState('history');
            history[name] = JSON.stringify(this.param)

            this.$saleson.core.setState('history', history);
        },

        getHistory (type, name) {
            let history = this.$saleson.core.getState('history');

            if (typeof history[name] != 'undefined' && history[name] != null) {
                this.param = JSON.parse(history[name]);

                // 스크롤링
                if (type === 'scroll') {
                    this.addItems();
                    document.addEventListener('scroll', this.handleScroll);
                }

                history[name] = null;

                this.$saleson.core.setState('history', history);

            }

        },
        getChild: function(componentName, $children) {
            if (typeof $children == 'undefined' || $children == null) {
                $children = this.$children;
            }

            for (let i=0; i<$children.length; i++) {
                let child = $children[i];

                if (child.$options._componentTag == componentName) {
                    return child;
                }
            }

            console.log('Not Found Component[' + componentName + ']');
            return null;
        },

        updateDisplayCartQuantity: function (vue, quantity = 0) {

            try {
                $s.core.setState('newCartQuantity', quantity);
                vue.$nuxt.$emit('updateHeaderCartQuantity', quantity);
                vue.$nuxt.$emit('updateQuickCartQuantity', quantity);
            } catch (e) {}
        },
        updateDisplayWishlistCount: function (vue, count = 0) {

            try {
                $s.core.setState('newWishlistCount', count);
                vue.$nuxt.$emit('updateQuickWishlistCount', count);
            } catch (e) {}
        }
    }
}
