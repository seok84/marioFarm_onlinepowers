(function() {
    'use strict';
    window.addEventListener('load', function() {

        /*// validation
        Common.initValidator();

        // Event Handler
        Common.initEventHandler();

        // Navigation
        Common.initNavigation();

        // AlertCount
        Common.initAlertCount();

        // Require Badge
        Common.initRequireBadge();*/

    }, false);
})();




var Common = {};

Common.initValidator = function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

};


Common.initEventHandler = function() {
    // 로그아웃
    $('#op-logout').on('click', function(e) {
        e.preventDefault();
        $('#op-logout-form').submit();
    });

};

Common.initNavigation = function() {
    var uri = Common.$uri.pathname;
    var navLinks = $('.sidebar .nav-link');
    var isAdminPage = Common.$uri.pathname.indexOf('/admin') > -1;
    var firstMenu = '<a href="/">Home</a>';
    if (isAdminPage) {
        firstMenu = 'Admin';
    }
    $('.op-nav-0').html(firstMenu);

    navLinks.removeClass('active');

    if (uri == '/') {
        $('.sidebar .nav-link').eq(0).addClass('active');
        return;
    }

    var nav1 = '';
    var nav2 = '';
    $('.sidebar .nav-link').each(function(index) {
        var link = $(this).attr('href');

        if (uri.indexOf(link) > -1 && link != '/') {

            $(this).addClass('active');
            nav1 = $(this).closest('li').prevAll('.nav-title').first().text();
            nav2 = $(this).find('span:eq(0)').text();

        }
    });


    if (nav1 != '') {
        $('.op-nav-1').text(nav1).show();
    }

    if (nav2 != '') {
        $('.op-nav-2').text(nav2).show();
    }
};

Common.initAlertCount = function() {
    if ($('.badge-alert').length == 0) {
        return;
    }
    var uri = URI.parse(location.href);
    var isAdminPage = uri.path.indexOf('admin') > -1 ? true : false;

    axios.get('/api/molds/alert-count?adminPage=' + isAdminPage).then(function(response) {
        for (var i = 0; i < response.data.length; i++) {
            var alertCount = response.data[i];
            var $selector = $('.' + alertCount.key);
            if ($selector.length == 0) {
                continue;
            }
            if (alertCount.count == 0) {
                $selector.hide();
            } else {
                $selector.text(alertCount.count).css('display', 'inline-block');
            }
        }

    }).catch(function (error) {
        console.log(error.response);
    });
};


Common.initRequireBadge = function() {
    if ($('.needs-validation').length == 0) {
        return;
    }
    $('.needs-validation input, .needs-validation select, .needs-validation textarea').each(function() {
        var required = $(this).attr('required');

        if (required == 'required') {
            $(this).parent().parent().find('label').append(' <span class="badge-require"></span>');
        }

    });

};

Common.alert = function(message, title) {
    var $alert = $('#op-alert');
    $('.op-modal-cancel').hide();
    $alert.find('.modal-body p').text(message);
    $alert.modal('show');
};
Common.alertCallback = function() {

};

Common.confirm = function(message, title) {
    var $alert = $('#op-alert');
    $('.op-modal-cancel').show();
    $alert.find('.modal-body p').text(message);
    $alert.modal('show');
};

Common.logout = function() {
    $('#op-logout').submit();

};

Common.getPagingData = function(page) {
   // var jsonString = '{"content":[{"createdAt":1533366112.000000000,"updatedAt":1533366112.000000000,"id":1,"name":"홍길동","loginId":"skc","email":"skc@onlinepowers.com","userType":null,"gravatar":"//www.gravatar.com/avatar/0cfe94217b10060fc58516438ae68c2a?d=mm","createdDate":"2018. 8. 4"}],"pageable":{"sort":{"sorted":false,"unsorted":true},"offset":0,"pageSize":10,"pageNumber":0,"paged":true,"unpaged":false},"last":true,"totalPages":1,"totalElements":1,"size":10,"number":0,"sort":{"sorted":false,"unsorted":true},"numberOfElements":1,"first":true}';
    //var page = JSON.parse(jsonString);

    var size = 10;

    var current = page.number + 1;
    var half_size_floor = Math.floor(size / 2);

    var startPage = current < half_size_floor ? 1 : current - half_size_floor;
    startPage = current > page.totalPages - half_size_floor ? page.totalPages - size + 1 : startPage;
    startPage = page.totalPages < size ? 1 : startPage;

    var endPage = startPage + size - 1;
    endPage = endPage > page.totalPages ? page.totalPages : endPage;
    endPage = page.totalPages < size ? page.totalPages : endPage;



    var pagination = [];

    if (current > 1) {
        var pageData = {'isActive': false};
        pageData.pageNumber = current - 1;
        pageData.text = 'Prev';
        pagination.push(pageData);
    }

    for (var pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
        var pageData = {'isActive': false};
        pageData.pageNumber = pageNumber;
        pageData.text = pageNumber;

        if (current == pageNumber) {
            pageData.isActive = true;
        }

        pagination.push(pageData);
    }

    if (current < endPage) {
        var pageData = {'isActive': false};
        pageData.pageNumber = current + 1;
        pageData.text = 'Next';
        pagination.push(pageData);
    }

    return pagination;
};

/**
 * location.href 기준으로 parameter 값을 가져옴
 * @param name
 * @returns {string}
 */
Common.getParameter = function(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

/**
 * Json Data를 queryString으로 변환함..
 * @param params
 * @returns {string}
 */
Common.param = function(params) {
    if (params == undefined) {
        return "";
    }

    // ES5
    var queryString = Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    }).join('&');
    return queryString;
};

Common.parseUrl = function(url) {
    var parser = document.createElement("a");
    parser.href = url;

    // IE 8 and 9 dont load the attributes "protocol" and "host" in case the source URL
    // is just a pathname, that is, "/example" and not "http://domain.com/example".
    parser.href = parser.href;

    // IE 7 and 6 wont load "protocol" and "host" even with the above workaround,
    // so we take the protocol/host from window.location and place them manually
    if (parser.host === "") {
        var newProtocolAndHost = window.location.protocol + "//" + window.location.host;
        if (url.charAt(1) === "/") {
            parser.href = newProtocolAndHost + url;
        } else {
            // the regex gets everything up to the last "/"
            // /path/takesEverythingUpToAndIncludingTheLastForwardSlash/thisIsIgnored
            // "/" is inserted before because IE takes it of from pathname
            var currentFolder = ("/"+parser.pathname).match(/.*\//)[0];
            parser.href = newProtocolAndHost + currentFolder + url;
        }
    }

    // copies all the properties to this object
    var properties = ['host', 'hostname', 'hash', 'href', 'port', 'protocol', 'search'];
    for (var i = 0, n = properties.length; i < n; i++) {
        this[properties[i]] = parser[properties[i]];
    }

    // pathname is special because IE takes the "/" of the starting of pathname
    this.pathname = (parser.pathname.charAt(0) !== "/" ? "/" : "") + parser.pathname;

    return this;
};
Common.$uri = Common.parseUrl(location.href);


Common.getPage = function(pageCode) {
    var page = {
        'CODE': pageCode
    };
    page.LIST_PAGE = '/admin/' + page.CODE;
    page.ID = Common.$uri.pathname.replace(page.LIST_PAGE + '/', '').replace('/edit', '');
    page.IS_NEW = page.ID == 'new';
    page.IS_EDIT = !page.IS_NEW;
    page.MODE_EDIT = "EDIT";
    page.MODE_NEW = "NEW";
    page.MODE = page.IS_NEW ? page.MODE_NEW : page.MODE_EDIT;

    page.API_BASE = '/api/' + page.CODE;
    page.API_POST = page.API_BASE;
    page.API_GET = page.API_BASE + '/' + page.ID;
    page.API_PUT = page.API_GET;
    page.API_DELETE = page.API_GET;



    return page;
};

Common.handleNoResults = function(selector, dataCount) {
    var $template = $(selector);
    $template.find('.op-list').css('display', 'table-row-group');
    $template.find('.pagination').css('display', 'flex');

    var $noResult = $template.find('.no-results');
    if ($noResult.length > 0) {
        $noResult.removeClass("d-none");
        if (dataCount > 0) {
            $noResult.addClass("d-none");
        }
    }
};

Common.formatNumber = function(number) {
    try {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch(e) {
        return number;
    }
};

Common.maxLength = function(obj, len){
    if(obj.value.length > len) {
        obj.value = obj.value.slice(0, len);
    }
};

Common.vue = {
    getChild($children, componentName) {
        for(var child of $children) {
            if (child.$options._componentTag == componentName) {
                return child;
            }
        }
        return null;
    }
};

String.prototype.replaceAll = function(stringToFind,stringToReplace){
    var temp = this;
    var index = temp.indexOf(stringToFind);
    while(index != -1){
        temp = temp.replace(stringToFind,stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;
};

/**
 * 날짜 정보를 입력 받아서 유효성 체크
 * @param inDate YYYYMMDD
 **/
Common.validateDate = function (inDate){
    var END_OF_MONTH = [0,31,28,31,30,31,30,31,31,30,31,30,31];
    if (isNaN(inDate)) {
        return false;
    }

    if (Number(inDate)/10000000 <= 1) return false;

    var strDate = String(inDate);
    var nYear = Number(strDate.substring(0,4));
    var nMonth= Number(strDate.substring(4,6));
    var nDay	= Number(strDate.substring(6,8));

    //년 확인
    if (nYear <= 0)
        return false;

    //월 확인
    if (nMonth < 1 || nMonth > 12) return false;

    //윤달 확인
    if (nYear % 4 == 0)
        if (nYear % 100 != 0 || nYear % 400 == 0)
            END_OF_MONTH[2] = 29;

    //일 확인
    if (nDay < 1 || END_OF_MONTH[nMonth] < nDay)
        return false;

    return	true ;
};

// 숫자에 0을 붙임..
Common.addZero = function(v, s) {
    var stringValue = "" + v;
    if (s > stringValue.length) {
        for (var i = 0; i < s - stringValue.length; i++) v = "0" + v;
    }

    return v;
};

Common.isElementType = function(type, element) {

    if (typeof type !== 'undefined' && typeof element === 'object') {
        return type.toUpperCase() == element.nodeName.toUpperCase();
    }

    return false;
};

/**
 * 팝업 띄우는 메서드. <br />Chrome에서는 스크롤바 제어를 해당 페이지에서 스타일을 줘야 가능(overflow: hidden)<br />
 * @param {String} [url=""] URL
 * @param {String} popupName popup 이름
 * @param {int} [width="400"] 가로 사이즈
 * @param {int} [height="400"] 세로 사이즈
 * @param {int or String} [scrollbars="0"] 스크롤 여부 (예: yes, 1 아니오: n, no, 0)
 * @param {int} [xPosition="c"] 가로 위치 (가운데: c)
 * @param {int} [yPosition="c"] 세로 위치 (가운데: c)
 * @requires popupName
 * @description <pre class="code">
 popup('../../src/sample/popup.html', 'popup1')<br />
 => <input type="button" class="btn" value="실행" onclick="popup('../../src/sample/popup.html', 'popup1');return false;" /><br />
 popup('../../src/sample/popup.html', 'popup2', 200, 300, 'no')<br />
 => <input type="button" class="btn" value="실행" onclick="popup('../../src/sample/popup.html', 'popup2', 200, 300, 'no');return false;" /><br />
 popup('../../src/sample/popup.html', 'popup3', 200, 300, 'no', 100, 100)<br />
 => <input type="button" class="btn" value="실행" onclick="popup('../../src/sample/popup.html', 'popup3', 200, 300, 'no', 100, 100);return false;" />
 </pre>
 */
Common.popup = function(url, popupName, width, height, scrollbars, xPosition, yPosition) {
    var xP = 0, yP = 0, xC = 0, yC = 0, scr = 0, zero = 0, one = 1;
    var target = url == null || url == '' ? '' : url;
    var w = width == null || width == '' ? 400 : width;
    var h = height == null || height == '' ? 400 : height;

    if (parseInt(navigator.appVersion) >= 4) {
        xC = (screen.width - w) / 2;
        yC = (screen.height - h) / 2;
    }

    xP = xPosition == null || xPosition == 'c' ? xC : xPosition;
    yP = yPosition == null || yPosition == 'c' ? yC : yPosition;
    scr = scrollbars == null || scrollbars == 'n' ? 0 : scrollbars;

    var parameters = 'location=' + zero +
        ',menubar=' + zero +
        ',height=' + h +
        ',width=' + w +
        ',toolbar=' + zero +
        ',scrollbars=' + scr +
        ',status=' + zero +
        ',resizable=' + one +
        ',left=' + xP +
        ',screenX=' + xP +
        ',top=' + yP +
        ',screenY=' + yP;

    popupName = popupName.replaceAll("-", "_");
    newWin = window.open(target, popupName, parameters);

    if (newWin) {
        newWin.focus();
    }
};
