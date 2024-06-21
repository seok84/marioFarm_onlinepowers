<template>
    <section class="contents privacy_contents">

        <div class="tit_wrap">
            <h2 class="tit">{{ result.title }}</h2>
        </div>

        <div class="container">
            <div class="privacy_wrap">
                <p class="content">
                    <div v-html="result.content"></div>
                </p>
            </div>
        </div>

    </section>
</template>

<script>
let $s, vm;

export default {
    head() {
        return {
            script: [],
            link: []
        }
    },
    beforeCreate: function () {
        $s = this.$saleson;
        vm = this;
    },
    data: function () {
        return {
            result: {}
        }
    },
    methods: {
        // custom methods..
        async submit() {
            const { data } = await this.$salesonApi().policy.getPolicy({ policyType: 'POLICY_TYPE_PROTECT_POLICY'});
            vm.result = data.policy;
        },
    },
    mounted: function() {
        this.$nextTick(function () {
            vm.submit();
        });
    }
}
</script>
