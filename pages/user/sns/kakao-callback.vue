<template>

</template>

<script>
import Sns from '@/modules/op.sns.js';
let $s, vm;

export default {
    layout:'blank-client',
    beforeCreate: function () {
        // 기존 Vue로 작성된 스크립트 실행시 적용
        $s = this.$saleson;
        vm = this;
    },
    mounted: function () {
        this.$nextTick(function () {
            console.log('kakao-callback mounted');
            Sns.initSns($s);
            const { code } = this.$route.query;

            let req = {
                grantType : "authorization_code",
                clientId : $s.config.kakaoRestApiKey,
                code : code,
                redirectUri : $s.config.frontDomain+ $s.config.kakaoLoginCallback
            }
            $s.loading(true);
            $s.axios.post($s.config.apiDomain+"/api/auth/kakao-user",req).then(function(response){
                const {snsId, nickname, email} = response.data.snsInfo;
                let snsUser = {
                    "snsType" : "kakao",
                    "snsId" : snsId,
                    "email" : email,
                    "snsName" : nickname,
                    "token" : ''
                };

                const pageType = $s.core.getState($s.const.SNS_PAGE_TYPE);
                console.log(snsUser, 'snsUser');
                if ( pageType == $s.config.snsPageType.LOGIN ) {
                    Sns.snsUserLogin(snsUser);
                } else if(pageType == $s.config.snsPageType.MYPAGE ) {
                    Sns.snsConnect(snsUser);
                }

            }).catch(function(error){
                $s.loading(false);
                $s.alert(error?.response?.data?.message, function(){
                    $s.router.push($s.pages.LOGIN);
                });
            }).finally(()=>{
                $s.loading(false);
            });
        });
    }
}
</script>