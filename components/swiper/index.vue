<template>
    <div class="r-swiper"
         ref="swiper"
    >
        <div class="swiper-container"
             ref="container"
             :class="{
            'in-move':inMove
             }"
             v-touch="{
                  'end':end,
                  'move':move
                 }"
             :style="{'transform':'translate3d('+x+'px,0,0)'}">
            <div class="swiper-item" v-for="(item,i) in items" :key="i">
                <slot :item="item">{{item}}</slot>
            </div>
        </div>
    </div>
</template>

<script>
    import Touch from "../../directive/touch";

    export default {
        name: 'r-swiper',
        directives: {
            'touch': Touch
        },
        props: {
            items: Array
        },
        data() {
            return {
                timer: null,
                inMove: false,
                x: 0,
                prePosition: 0,
            }
        },
        methods: {
            move(e) {
                this.timer = setTimeout(() => {
                    this.inMove = true
                    this.x = this.prePosition + e.goX
                    clearTimeout(this.timer)
                }, 50)
            },
            end(e) {
                setTimeout(() => {

                    this.inMove = false
                    const r = this.$r.rtl ? 1 : -1
                    if (this.$refs.swiper&&this.$refs.swiper.scrollWidth + this.x * r > this.$refs.container.scrollWidth) {

                        this.x = (this.$refs.container.scrollWidth - this.$refs.swiper.scrollWidth)* r
                    }
                    this.prePosition = this.x

                    if (this.x * r < 0) {
                        this.x = 0
                        this.prePosition = 0
                    }
                }, 60)

            }
        }
    }
</script>
<style lang="scss">
    @import "../../style/include";

    .#{$prefix}swiper {
        width: 100%;
        max-width: 100%;
        height: 100%;
        overflow: hidden;

        .swiper-container {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;

            &:not(.in-move) {
                transition: .3s all ease-in-out;
            }
        }

    }
</style>