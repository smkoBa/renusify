<template>
    <div class="r-search-container">
        <div class="search-input" v-click-outside="handleclose">
            <r-input :active="active"
                     icon="mdi-magnify"
                     v-bind="$attrs"
                     :class="{'z-important':open}"
                     :modelValue="lazyValue"
                     :input-control-class="{'search-active-border':open,'sheet':true}">
                <input :autofocus="autofocus"
                       :type="type"
                       @focusin="active=true"
                       @focusout="active=false"
                       @input="handle()"
                       autocomplete="no"
                       ref="input"
                       v-model="lazyValue"
                />
                <r-progress-liner v-if="loading" color="color-two"></r-progress-liner>
            </r-input>
            <r-card v-if="open" class="card-select text-center z-important"
            >
                <r-list v-if="list.length>0"
                        :items="list"
                        @update:modelValue="listInput">
                    <template v-slot="props">
                    <slot :item="props.item">
                        <div class="list-title">{{props.item['name']}}</div>
                    </slot>
                </template>
                </r-list>
                <div v-else-if="!loading" class="py-5">
                    {{notFoundMsg}}
                </div>
            </r-card>
        </div>
        <transition name="fade">
        <div v-if="open" class="search-shadow"></div>
            </transition>
    </div>
</template>
<script>
    import clickOutside from '../../directive/clickOutSide/index'

    export default {
        name: 'r-search-input',
inheritAttrs: false,
        directives: {
            'click-outside': clickOutside
        },
        props: {
            notFoundMsg: {
                type: String,
                default: "Can't Find Anything :("
            },
            type: {
                type: String,
                default: 'text'
            },
            url: String,
            query: {
                type: String,
                default: 'search'
            },
            modelValue: [String, Number],
            autofocus: Boolean
        },

        data() {
            return {
                lazyValue: this.modelValue,
                loading: false,
                active: false,
                open: false,
                idSet: null,
                list: []
            }
        },
        watch: {
            modelValue() {
                this.lazyValue = this.modelValue
            }
        },
        methods: {
            handleclose() {
                this.open = false
            },
            get() {
                if (this.url) {
                    this.loading = true
                    this.$axios.get(`${this.url}?${this.query}=${this.lazyValue}`).then(({data}) => {
                        this.list = data
                        this.loading = false
                        this.open = true
                    }, (e) => {
                        this.loading = false
                    })
                }
            },
            handle() {
                this.open = true
                this.loading = true
                clearTimeout(this.idSet)
                this.idSet = setTimeout(() => {
                    this.$emit('update:modelValue', this.lazyValue)
                    this.get()
                }, 1000)
            },
            listInput(e) {
                this.$emit('select', e[0])
                this.open = false
            }
        }
    }

</script>
<style lang="scss">
    @import '../../style/include';

    @include theme(#{$prefix}search-container) using($material) {
        .search-shadow {
            background-color: rgba(map-metro-get($material, 'background', 'two'), 0.5);
        }
        .sheet{
            background-color: map-get($material, 'cards');
        }
    }

    .#{$prefix}search-container {
        position: relative;
        .z-important {
            z-index: map_get($z-index, 'high');
        }

        .search-input {
            .sheet{
                transition: 0.5s all ease;
            }
            .card-select {
                position: absolute;
                left: 0;
                width: 100%;
                overflow-y: auto;
                max-height: 300px;
                border-radius: 0 0 20px 20px;
            }

            .search-active-border {
                border-radius: 20px 20px 0 0;
            }
        }

        .search-shadow {
            position: fixed;
            width: 100vw;
            height: 100vh;
            z-index: map_get($z-index, 'medium');
            top: 0;
            left: 0;
            backdrop-filter: blur(3px) grayscale(30%);
        }
    }
</style>
