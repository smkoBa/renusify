<template>
    <div class="r-group">
        <div class="group-container">
        <div class="group-item me-1" :class="{
            'group-item-active':modelValue===item.value
        }" v-for="(item,key) in items" :key="key">
            <slot :item="item"></slot>
        </div>
            </div>
    </div>
</template>

<script>
    export default {
        name: 'r-group',
        props: {
            items: Array,
            modelValue: String || Number
        }
    }
</script>

<style lang="scss">
    @import "../../style/_include";
.#{$prefix}group {
    width: 100%;
        max-width: 100%;
    overflow: auto;
    .group-container {
        display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
    }
}
</style>
