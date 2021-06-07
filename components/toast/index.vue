<template>
    <toast :time="time"
           :type="type"
           closable
           v-model="show">
        {{ msg }}
    </toast>
</template>

<script>
    import Toast from './toast.vue'

    const EVENTS = ['online', 'offline', 'load']
    export default {
        name: 'r-toast',
        components: {
            Toast
        },
        data() {
            return {
                msg: '',
                time: 3000,
                show: false,
                type: 'info'
            }
        },
        mounted() {
            window.renusifyBus.on(
                'toast', (data) => {
                    if (this.show) {
                        this.show = false
                        setTimeout(() => {
                            this.build(data)
                        }, 300)
                    } else {
                        this.build(data)
                    }
                }
            )
            EVENTS.forEach(event => window.addEventListener(event, this.updateOnlineStatus))
        },
        beforeUnmount() {
            EVENTS.forEach(event => window.removeEventListener(event, this.updateOnlineStatus))
        },
        methods: {
            build(data) {
                const message = data.msg
                const option = data.options || {}
                this.msg = this.$t(message, option.t)
                this.time = this.$helper.ifHas(option, 3000, 'time')
                this.type = this.$helper.ifHas(option, 'info', 'type')
                this.show = true
            },
            updateOnlineStatus() {
                if (!navigator.onLine) {
                    this.$toast('no_internet', {type: 'warning', time: -1})
                } else {
                    this.$toast('no_internet', {type: 'warning', time: 0})
                }
            }
        }
    }
</script>
