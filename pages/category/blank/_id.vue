
<template>
    <category :category-code="categoryCode"></category>
</template>

<script>
import Category from '@/components/ui/item/category';

let $s, vm;

export default {
    layout:'base',
    components: {Category},
    head() {
        return {
            meta: this.getOpenGraphMetaList(),
            script: [
                { src: '/static/js/item.js', body: true}
            ],
            link: [
                { rel: 'stylesheet', href: '/static/css/item.css' },
                { rel: 'stylesheet', href: '/static/css/order.css' },
                { rel: 'stylesheet', href: '/static/css/mypage.css' },
                { rel: 'stylesheet', href: '/static/css/users.css' },
                { rel: 'stylesheet', href: '/static/css/customer.css' },
            ]
        }
    },
    beforeCreate: function() {
        $s = this.$saleson;
        vm = this;
    },
    async asyncData({ params }) {
        const categoryCode = params.id;
        return { categoryCode }
    },
    async fetch() {

        if (process.env.NODE_ENV !== 'production') {
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
        }

    },
    mounted: function() {
        this.$nextTick(function () {
        });
    }
}
</script>