<template>
    <div id="saleson">
        <layout-header></layout-header>
        <nuxt />
        <layout-footer></layout-footer>
        <alert></alert>
        <toast></toast>
    </div>
</template>
<script>

import LayoutHeader from '@/components/layouts/header.vue';
import LayoutFooter from '@/components/layouts/footer.vue';
import Alert from "@/components/layouts/alert";
import Toast from "@/components/layouts/toast";

export default {
    components: {LayoutHeader, LayoutFooter, Alert, Toast},
    head() {
        return  {
            script: [
                { src: '/static/js/jquery-3.4.1.min.js'},
                { src: '/static/js/swiper.min.js'},
                { src: '/static/js/bootstrap/vendor/popper.min.js'},
                { src: '/static/js/bootstrap/bootstrap.min.js'},
                { src: '/static/js/bootstrap/vendor/clipboard.min.js'},
                { src: '/static/js/jquery.popupoverlay.js'},
                { src: '/static/js/jquery.waypoints.min.js'},
                { src: '/static/js/jquery.counterup.min.js'},
                { src: '/static/js/jquery.cookie.js'},
                { src: '/static/js/common.js', body: true},
                { src: '/static/js/header.js', body: true},
                { src: '/static/js/footer.js', body: true}
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'stylesheet', href: '/static/css/bootstrap/bootstrap.css' },
                { rel: 'stylesheet', href: '/static/css/swiper.min.css' },
                { rel: 'stylesheet', href: '/static/css/common.css' },
                { rel: 'stylesheet', href: '/static/css/layout.css' },
                { rel: 'stylesheet', href: '/static/css/popup.css' }
            ]
        }
    },
    beforeMount: function() {
        this.$saleson.initVueModule(this);
        this.$saleson.init();
    }
}
</script>



