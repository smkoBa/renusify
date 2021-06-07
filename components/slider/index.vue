<template>
    <div class="slider-container"
         ref="slider"
         v-touch="{
                'left':$r.rtl?prev:next,
                'right':$r.rtl?next:prev
            }">
        <transition :name="direction" mode="out-in" appear>
            <div :key="`slider-${currentIndex}`"
                 :class="{'slide-loaded':loaded,'slide-loading':!loaded}"
                 class="slider-slides">
                <slot :item="currentSlide" :width="width" :height="width/WperH">
                    {{currentSlide}}
                </slot>
            </div>
        </transition>
        <div class="d-flex h-center v-center color-one-text">
            <ul class="slider-dots pt-1" v-if="dots">
                <li :class="{'slider-dot--current': slides[n-1] === currentSlide}"
                    :key="n"
                    class="slider-dot"
                    v-for="n in slides.length">
                    <button @click.prevent="goToSlide(n-1)" type="button">{{n}}</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Touch from "../../directive/touch";

    export default {
        name: 'r-slider',
        directives: {
            'touch': Touch
        },
        props: {
            slides: {
                type: Array,
                default: () => {
                    return []
                }
            },
            speed: {
                type: Number,
                default: 5000
            },
            WperH: {
                type: Number,
                default: 2
            },
            autoplay: {
                type: Boolean,
                default: false
            },
            dots: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                direction: 'slider-right',
                loaded: false,
                currentIndex: 0,
                loaded_timer: null,
                timer: null,
                width: 1200
            }
        },

        mounted: function () {
            this.init()
        },
        methods: {
            init() {
                const w = this.$refs.slider.clientWidth
                this.width = w || 1200
                this.startSlide()
                this.loaded = true
            },
            toggle() {
                clearInterval(this.timer)
                this.loaded = false
                clearInterval(this.loaded_timer)
                this.loaded_timer = setTimeout(() => {
                    this.loaded = true
                }, 500)
                this.startSlide()
            },
            startSlide: function () {
                if (this.autoplay) {
                    this.timer = setInterval(this.next, this.speed)
                }
            },

            next: function () {
                this.toggle()
                this.direction = 'slider-right'
                if (this.currentIndex > this.slides.length - 2) {
                    this.currentIndex = 0
                } else {
                    this.currentIndex += 1
                }

            },
            prev: function () {
                this.toggle()
                this.direction = 'slider-left'
                if (this.currentIndex === 0) {
                    this.currentIndex = this.slides.length - 1
                } else {
                    this.currentIndex -= 1
                }
            },
            goToSlide(i) {
                this.toggle()
                if (i < this.currentIndex) {
                    this.direction = 'slider-left'
                } else {
                    this.direction = 'slider-right'
                }

                this.currentIndex = i
            }
        },

        computed: {
            currentSlide: function () {
                return this.slides[Math.abs(this.currentIndex) % this.slides.length]
            }
        }
    }
</script>
<style lang="scss">
    @import '../../style/include';

    .slider-right {
        &-enter-active {
            transition: all .3s ease;
        }

        &-leave-active {
            transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
        }

        &-enter-from {
            @include rtl() {
                transform: translateX(-200px);
            }
            @include ltr() {
                transform: translateX(200px);
            }

            opacity: 0;
        }

        &-leave-to {
            @include rtl() {
                transform: translateX(200px);
            }
            @include ltr() {
                transform: translateX(-200px);
            }

            opacity: 0;
        }
    }

    .slider-left {
        &-enter-active {
            transition: all .3s ease;
        }

        &-leave-active {
            transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
        }

        &-enter-from {
            @include rtl() {
                transform: translateX(200px);
            }
            @include ltr() {
                transform: translateX(-200px);
            }

            opacity: 0;
        }

        &-leave-to {
            @include rtl() {
                transform: translateX(-200px);
            }
            @include ltr() {
                transform: translateX(200px);
            }

            opacity: 0;
        }
    }

    .slider-container {
        width: 100%;
        max-width: 100%;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
        }

        .slider-slides {
            width: 100%;
            position: relative;
        }

        .slider-dots {
            position: absolute;
            bottom: 10px;
            align-items: inherit;
            display: flex;
            list-style: none;
            padding: 0;
            white-space: nowrap;
        }

        .slider-dot {
            align-items: inherit;
            justify-content: center;
            display: flex;
            padding: 5px;

            button {
                transition: 0.3s all ease-in-out;
                background-color: #bfbfbf;
                outline: none;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                display: block;
                font-size: 0;
                line-height: 0;
                padding: 0;
                transition-duration: .3s;
                width: 10px;
                height: 10px;
            }
        }

        .slider-dot--current button {
            transition: 0.5s all ease-in-out;
            background-color: currentColor;
            width: 30px;
        }
    }
</style>
