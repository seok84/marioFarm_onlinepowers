
let $s;
let self;

export default {

    initSns($saleson) {

        $s = $saleson;
        self = this;
    },

    connectSns(snsType, snsUserId, pageType) {
        if (snsUserId != undefined && snsUserId > 0) {
            $s.confirm("선택하신 SNS의 연결해제를 진행하시겠습니까?", function () {
                var snsUser = {
                    "snsUserId" : snsUserId,
                    "snsType" : snsType,
                    "token" : ''
                };

                $s.api.disconnectSns(snsUser,
                    function (response) {
                        if (response?.info?.status == "00") {
                            $s.alert(response?.info?.message, function() {
                                if (response?.info?.value == "disconnectSuccess") {
                                    location.reload();
                                }
                            });
                        } else {
                            console.log("error occurred - " + response.info.message);
                        }
                    }, function (error) {
                        console.dir(error,'error');
                        $s.alert(error.response.data.description);
                    }
                );
            });
        } else {
            if (snsType === "naver") {
                self.loginWithNaver(pageType);
            } else if (snsType === "facebook") {
                self.facebookLogin(pageType);
            } else if (snsType === "kakao") {
                self.loginWithKakao(pageType);
            } else if (snsType === "apple") {
                self.loginWithApple(pageType);
            }
        }
    },
    loginWithNaver(pageType) {

        let uri = 'https://nid.naver.com/oauth2.0/authorize?' +
            'response_type=code' +                  // 인증과정에 대한 내부 구분값 code 로 전공 (고정값)
            '&client_id='+$s.config.naverLoginAppId +     // 발급받은 client_id 를 입력
            '&redirect_uri='+$s.config.frontDomain+ $s.config.naverLoginCallback;   // 어플케이션에서 등록했던 CallBack URL를 입력
        //'&state=' + pageType +            // CORS 를 방지하기 위한 특정 토큰값(임의값 사용)
        console.log(uri,'uri');
        $s.core.setState($s.const.SNS_PAGE_TYPE, pageType);
        // 사용자가 사용하기 편하게끔 팝업창으로 띄어준다.
        if($s.isMobile()){
            $s.redirect(uri);
        }else{
            console.log(uri, 'uri');
            window.open(uri, "Naver Login PopupScreen", "width=450, height=600");
        }
    },
    loginWithApple(pageType) {
        // 사용할 앱의 JavaScript 키를 설정해 주세요.
        AppleID.auth.init({
            clientId : $s.config.appleClientId,
            scope : 'name email',
            redirectURI : $s.config.appleRedirectUri, // return urls 등록 필요(Resister Website URLs) : localhost는 허용되지 않음
            usePopup : true //or false defaults to false
        });
        //Listen for authorization success
        document.addEventListener('AppleIDSignInOnSuccess', (data) => {
            var snsUser = {
                "snsType" : "apple",
                "token" : data.detail.authorization.id_token
            };

            self.snsUserSubmit(snsUser, pageType);
        });
        //Listen for authorization failures
        document.addEventListener('AppleIDSignInOnFailure', (error) => {
            //handle error.
            $s.alert(JSON.stringify(error));
        });
    },
    loginWithKakao(pageType) {

        // 사용할 앱의 JavaScript 키를 설정해 주세요.
        if (!Kakao.isInitialized()) {
            Kakao.init($s.config.kakaoLoginAppId);
        }
        let that = this;

        //PC로 로그인하는 경우
        if (!$s.isMobile()) {
            // 로그인 창을 띄웁니다.
            Kakao.Auth.login({
                success: function (authObj) {
                    Kakao.API.request({
                        url: '/v2/user/me',
                        success: function (response) {
                            // 카톡 닉네임 이모티콘 제거 정규식
                            var patterns = "[\\uD83C-\\uDBFF\\uDC00-\\uDFFF]+";
                            var nickName = response?.properties?.nickname;
                            if (nickName) {
                                nickName = nickName.replace(new RegExp(patterns), '');
                                response.properties.nickname = nickName;
                            }

                            // 카카오에서 던지는 response.id값은 정수형
                            // 스크립트에서 id가 문자형으로 파싱되면서 hash값이 변경되므로 뒤에 ''를 붙여 hash값 변조를 막는다.
                            var snsUser = {
                                "snsType" : "kakao",
                                "snsId" : response.id + '',
                                "email" : response?.kakao_account?.email ?? '',
                                "snsName" : response?.properties?.nickname ?? '',
                                "token" : ''
                            };

                            //self.snsUserSubmit(snsUser, pageType);
                            if (pageType == $s.config.snsPageType.LOGIN) {
                                that.snsUserLogin(snsUser);
                            } else if (pageType == $s.config.snsPageType.MYPAGE) {
                                that.snsConnect(snsUser);
                            }
                        },
                        fail: function (error) {
                            console.log(JSON.stringify(error));
                        }
                    });
                },
                fail: function (err) {
                    $s.alert(JSON.stringify(err));
                }
            });
        } else {
            console.log("mobile: "+$s.config.frontDomain+ $s.config.kakaoLoginCallback);
            $s.core.setState($s.const.SNS_PAGE_TYPE, pageType);
            Kakao.Auth.authorize({
                redirectUri: $s.config.frontDomain+ $s.config.kakaoLoginCallback,
            });

        }
    },

    facebookLogin(pageType) {
        FB.login(function(response) {
            if (response.authResponse) {
                let access_token = response.authResponse.accessToken; //get access token
                let user_id = response.authResponse.userID; //get FB UID

                FB.api('/me', {fields: 'email, name, id'}, function(response) {
                    var snsUser = {
                        "snsType" : "facebook",
                        "snsId" : response.id,
                        "email" : response.email,
                        "snsName" : response.name
                    };

                    self.snsUserSubmit(snsUser, pageType);
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: 'public_profile, email'});
    },

    naverResponse(snsUser, pageType) {
        self.snsUserSubmit(snsUser, pageType);
    },
    naverProcess() {
        $('#naverIdLogin_loginButton img').click();
    },

    snsUserSubmit(snsUser, pageType) {
        if (pageType === "mypage") {
            snsUser.isMypage = true;
        }
        var isJoined = true;
        if (pageType != "mypage") {
            $s.api.checkSnsJoin(snsUser,
                function (response) {
                    if (response.info.value === "0") {
                        isJoined = false;
                    }
                    if (isJoined && pageType != "mypage") {
                        // 가입정보가 있을경우, SNS 로그인 진행
                        self.snsUserLogin(snsUser);
                    } else {
                        // 가입정보가 없을경우, SNS DB 연동처리
                        $s.api.snsJoin(snsUser,
                            function (response) {
                                console.log(response.info);
                                if (response.info.status === "00") {    // 처리 성공
                                    $s.alert(response.info.message, function() {
                                        if (response.info.value === "00") {    // 연동 성공
                                            if (pageType === "login") {
                                                self.snsUserLogin(snsUser);         // 로그인 페이지에서 접근시 login 처리
                                            } else {
                                                location.reload();             // 그 외 페이지에서 접근시 reload 처리
                                            }
                                        }
                                        $s.closeAlert();
                                    });
                                }
                            }, function (error) {
                                console.dir(error,'error');
                                $s.alert(error.message);
                            }
                        );
                    }
                }, function (error) {
                    console.dir(error,'error');
                    $s.alert(error.message);
                }
            )
        }

    },

    snsUserLogin(snsUser) {
        var target = $s.core.getParameter("target");
        var redirectUrl = $s.pages.INDEX;

        if (target != null && target != '') {
            redirectUrl = decodeURIComponent(target);
        }

        $s.api.getAuthSnsToken(snsUser,  (info) => {
            if (info.value == "loginSuccess"){
                $s.redirect(redirectUrl);
                //$s.router.push(this.$router.resolve({ path: redirectUrl }).location);
            } else if(info.value == "redirectToJoin") {
                $s.alert(info.message, () => {
                    $s.redirect($s.pages.JOIN_SNS);
                    //$s.router.push(this.$router.resolve({ path: $s.pages.LOGIN }).location);
                });
            } else {
                $s.alert(info.message, () => {
                    $s.redirect($s.pages.LOGIN);
                    //$s.router.push(this.$router.resolve({ path: $s.pages.LOGIN }).location);
                });
            }
        }, (error) => {
            let {data} = error.response;

            $s.alert(data.message, () => {
                //$s.router.push(this.$router.resolve({ path: $s.pages.LOGIN }).location);
                $s.redirect($s.pages.LOGIN);
            });

        });
    },
    snsConnect(snsUser){
        let that = this;
        $s.api.snsConnect(snsUser, function (response) {
            console.dir(response, 'kakao connect');
            let info = response.data.info;
            if (info.value == "connectSuccess" || info.value == "connectAlready"){
                $s.alert(info.message, function(){
                    if (snsUser.snsType == 'naver') {
                        if (!$s.isMobile()) {
                            opener.location.reload();
                            window.close();
                        } else{
                            //$s.router.push("/user/modify");
                            $s.redirect("/user/modify");
                        }
                    }else if(snsUser.snsType == 'kakao'){
                        if (!$s.isMobile()) {
                            location.reload();
                        } else {
                            //$s.router.push("/user/modify");
                            $s.redirect("/user/modify");
                        }
                    } else if (snsUser.snsType == 'apple') {
                        if (!$s.isMobile()) {
                            location.reload();
                        } else {
                            //$s.router.push("/user/modify");
                            $s.redirect("/user/modify");
                        }
                    }
                });//end alert
            }
        }, function (error) {
            console.dir(error);
            console.log('sns mypage error');
            let info = error.response.data.info;
            $s.alert(info.message);
        });
    },
    snsUserPopupLogin(snsUser) {
        var target = $s.core.getParameter("target");
        var redirectUrl = $s.pages.INDEX;

        if (target != null && target != '') {
            redirectUrl = decodeURIComponent(target);
        }
        $s.api.getAuthSnsToken(snsUser, function (info) {
            console.log(info, 'info');
            if (info.value == "loginSuccess") {
                opener.parent.location = "/";
                window.close();
            }else{
                $s.alert(info.message,function(){
                    window.close();
                });
            }
        }, function (error) {
            let {data} = error.response;
            $s.alert(data.message, function (){
                opener.parent.location = "/";
                window.close();
            });
        });
    }
}

