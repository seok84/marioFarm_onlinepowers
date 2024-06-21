
<template>
  <category :category-code="categoryCode"></category>
</template>

<script>
import Category from '@/components/ui/item/category';

let $s, vm;

export default {
  components: {Category},
  head() {
    return {
      title: this.seo.title,
      meta: this.seo.meta,
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
  async asyncData({ params, $axios,$seo, route}) {
    const categoryCode = params.id;
    const seo = await $seo(route.path, $axios);

    return {
      categoryCode : categoryCode,
      seo : seo
    }
  },
  async fetch() {

    if (process.env.NODE_ENV !== 'production') {
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    }

  },
  data: function(){
    return {
      categoryCode: ''
    }
  },
  methods: {

  },
  mounted: function() {
    this.$nextTick(function () {
    });
  },
  computed: {
  }
}
</script>
