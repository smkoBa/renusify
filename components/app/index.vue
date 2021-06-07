<template>
    <div :class="classes" :id="id">
        <div class="app-wrap">
            <slot></slot>
        </div>
        <r-toast></r-toast>
        <r-notify v-if="notify" :left="notifyLeft" :top="notifyTop">
            <template #content="props">
                <slot name="notify" :item="props"></slot>
            </template>
        </r-notify>
    </div>
</template>

<script>
    import './style.scss'
    import RToast from '../toast/index.vue'
    import RNotify from '../notify/index.vue'

    export default {
        name: 'r-app',
        components: {RToast,RNotify},
        props: {
            id: {
                type: [String, Number],
                default: 'renusify'
            },
            notify: Boolean,
            notifyLeft: Boolean,
            notifyTop: Boolean,
            rtl: Boolean,
            night: Boolean,
            topOffset: Boolean,
            bottomOffset: Boolean
        },
        computed: {
            classes() {
                const res = {
                    'app-rtl': this.rtl,
                    'app-ltr': !this.rtl,
                    'top-offset': this.topOffset,
                    'bottom-offset': this.bottomOffset,
                    'app-dark': this.night,
                    'app-light': !this.night
                }
                res['r-app'] = true
                return res
            }
        }
    }
</script>
