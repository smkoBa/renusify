<template>
    <div class="r-menu" v-click-outside="close" ref="menu">
        <div class="d-flex h-start flex-row v-center">
            <span class="menu-label" v-if="label" @click.prevent="open">{{label}}</span>
            <transition name="fade" mode="out-in">
                <!-- Header Navigation Menu Icons -->
                <r-btn icon text v-if="modelValue" key="on" @click.prevent="close">
                    <r-icon class="mdi-close"></r-icon>
                </r-btn>
                <r-btn icon text v-else key="off" @click.prevent="open">
                    <r-icon :class="icon"></r-icon>
                </r-btn>

            </transition>
            <div class="dropdown-menu mt-1"
                 v-if="modelValue"
                 :style="{
                    'top':top+'px',
                    'left':left,
                    'right':right,
                    'opacity':opacity
                }">
                <r-card>
                    <div class="dropdown-menu-item pa-2" v-for="(item,i) in list" :key="i">
                        <slot :item="item"></slot>
                    </div>
                </r-card>
            </div>

        </div>
    </div>
</template>
<script>
    import clickOutside from '../../directive/clickOutSide/index'

    export default {
        name: 'r-menu',
        directives: {
            'click-outside': clickOutside
        },
        props: {
            modelValue: {
                type: Boolean,
                default: false
            },
            label: String,
            icon: {
                type: String,
                default: 'mdi-dots-vertical'
            },
            reverse: Boolean,
            overlay: Boolean,
            list: [Array,Object]
        },
        data() {
            return {
                top: null,
                left: null,
                right: null,
                opacity: 0
            }
        },
        methods: {
            open() {
                const elm = this.$refs.menu.getBoundingClientRect()
                this.top = -20
                if (!this.overlay) {
                    this.top += elm.height
                }
                this.opacity = 0
                let n = 80
                if (!this.$r.rtl) {
                    this.left = 0
                } else {
                    this.right = 0
                }
                if (this.reverse) {
                    if (!this.$r.rtl) {
                        this.right = 0
                    } else {
                        this.left = 0
                    }
                }

                this.$emit('update:modelValue', true)
                setTimeout(() => {
                    this.top = this.top + 20
                    this.opacity = 1
                }, 10)

            }, close() {
                this.top = this.top - 20
                this.opacity = 0
                setTimeout(() => {
                    this.$emit('update:modelValue', false)
                }, 200)

            }
        }
    }
</script>
<style lang="scss">
    @import "../../style/include";

    @include theme(#{$prefix}menu) using($material) {
        .dropdown-menu {
            border: 1px solid map-metro-get($material, 'background', 'one');

            &-item:hover {
                background-color: map-metro-get($material, 'background', 'two');
            }
        }

    }

    .#{$prefix}menu {
        position: relative;

        .menu-label {
            cursor: pointer;
        }

        .dropdown-menu {
            scroll-behavior: smooth;
            transition: all .3s ease;
            position: absolute;
            z-index: 10;
            min-width: 150px;
            max-height: 200px;
            overflow-y: auto;
            background-clip: padding-box;
            border-radius: 4px;

            &-item {
                cursor: pointer;
            }

        }
    }


</style>