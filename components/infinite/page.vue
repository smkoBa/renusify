<template>
    <div class="infinite-page">
        <div class="infinite-page-container" v-scroll="onScroll">
            <slot :items="datacollection"></slot>
        </div>
        <r-progress-liner color="color-one"
                          v-show="loading"

        ></r-progress-liner>
        <div class="text-center subtitle-1"
             v-if="noItem"
        >{{this.$t(noItemMsg)}}
        </div>
    </div>
</template>

<script>
    import Scroll from "../../directive/scroll";

    export default {
        name: 'r-infinite-page',
        directives: {'scroll': Scroll},
        props: {
            url: {
                required: true,
                type: String
            },
            query: {
                type: String
            },
            noItemMsg: {
                type: String,
                default: 'no_item'
            },
            distanceLoad: {
                type: Number,
                default: 150
            }
        },
        data() {
            return {
                datacollection: [],
                page: 1,
                active: true,
                loading: false,
                total: 0,
                set: null,
                noItem: false
            }
        },
        created() {
            this.get()
        },
        activated() {
            this.active = true
        },
        deactivated() {
            this.active = false
        },
        methods: {
            onScroll(e) {
                if (this.active && document.body.offsetHeight < ((window.innerHeight + window.scrollY) + this.distanceLoad).valueOf()) {
                    if (!this.loading) {
                        this.page++
                        if (this.datacollection.length < this.total) {
                            this.get()
                        }
                    }
                }

            },
            get() {
                this.$helper.log('infinite page get')
                this.loading = true
                this.noItem = false
                let par = '?page=' + this.page
                if (this.query) {
                    par += '&' + this.query
                }
                this.$axios.get(`${this.url + par}`).then(
                    (res) => {
                        this.push(res.data.data)
                        this.total = res.data.total
                        if (this.total === 0) {
                            this.noItem = true
                        }
                        this.loading = false
                    }, () => {
                        this.loading = false
                    })
            },
            push(data) {
                for (let key = 0; key < data.length; key++) {
                    this.datacollection.push(data[key])
                }
            }
        },
    }
</script>
<style>
    .infinite-page {
        margin-bottom: 100px;
        width: 100%
    }
</style>
