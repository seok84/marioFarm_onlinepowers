<template>
    <div>
        {{error}}
    </div>
</template>

<script>
export default {
    props: ["error"],
    layout: "base",
    mounted: function() {
        this.$nextTick(function () {
            console.error(this.error);
        });
    }
}
</script>