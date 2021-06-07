<template>
    <div class="r-timeline">
        <div class="timeline-item" v-for="(item,i) in items" :key="i">
            <div class="timeline-counter">
                <slot name="counter" :item="item" :k="i">
                    <div class="color-one h-full w-full d-flex h-center v-center">{{$n(i+1)}}</div>
                </slot>
            </div>
            <slot :item="item">{{item}}</slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: "rTimeline",
        props: {
            items: {
                type: Array
            }
        }
    }
</script>
<style lang="scss">
    @import "~renusify/style/include";

    .#{$prefix}timeline {
        display: flex;
        flex-direction: column;
        direction: rtl;
        .timeline-item {
            width: 50%;
            position: relative;
            padding:20px 0 0 30px;
           &:not(:last-child):before {
                content: '';
                width: 1px;
                height: calc(100% + 20px);
                border-right: 4px solid #696969;
                position: absolute;
                left: -2px;
                top: 0;
                z-index: 0;
            }

            &:first-child:before{
                top:20px
            }

            &:nth-child(2n) {
                padding:20px 30px 0 0;
                margin-right: 50%;

                &:before {
                    right: -2px;
                }
                .timeline-counter{
                    right: -25px;
                }
            }

        }
        .timeline-counter{
            position: absolute;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            top:20px;
            left: -25px;
            z-index: 1;
            overflow: hidden;
        }
    }
</style>