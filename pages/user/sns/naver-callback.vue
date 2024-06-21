<template></template>
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
            Sns.initSns($s);
            const { code } = this.$route.query;
            let req = {
                grant_type : "authorization_code",
                client_id : $s.config.naverLoginAppId,
                client_secret : $s.config.naverClientSecret,
                code : code
            }

            $s.loading(true);
            $s.axios
            .post($s.config.apiDomain+"/api/auth/naver-user",req)
            .then(function(response){
                console.dir(response);
                $s.loading(false);
                const {id, name, email} = response.data.snsInfo;
                let snsUser = {
                    "snsType" : "naver",
                    "snsId" : id,
                    "email" : email,
                    "snsName" : name,
                    "token" : ''
                };
                const pageType = $s.core.getState($s.const.SNS_PAGE_TYPE);
                if($s.isMobile()){
                    if(pageType == $s.config.snsPageType.LOGIN) {
                        Sns.snsUserLogin(snsUser);
                    }else if(pageType == $s.config.snsPageType.MYPAGE){
                        Sns.snsConnect(snsUser);
                    }
                }else{
                    // 부모창 페이지 종류 조회 (mypage, login...)
                    //const pageType = opener.$("#naverIdLogin").data('page-type');
                    console.log(response, "naver-callback response");
                    console.log(pageType, 'pageType');
                    console.log(snsUser, 'SNSuSER');
                    if (pageType=='login'){
                        Sns.snsUserPopupLogin(snsUser);
                    }else if(pageType == 'mypage'){
                        Sns.snsConnect(snsUser);
                    }
                }
                //self.close();
            }).catch(function(error){
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