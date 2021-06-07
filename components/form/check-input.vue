<template>
    <r-input class="r-check-input" :active="active"
             :model-value="lazyValue"
             inputControlClass="pe-0"
             :msg="msg"
             :error="pass===false"
             @click.prevent="handleClick">
        <div class="check-input-container">
            <input :autofocus="autofocus"
                   :type="type"
                   @focusin="active=true"
                   @focusout="active=false"
                   @input="emit"
                   autocomplete="no"
                   ref="input"
                   v-model="lazyValue"
            />
            <r-btn rounded :loading="loading" @click.prevent="check()" class="elevation-none">
                {{$t('check')}}
                <r-icon v-if="pass!==null" exact :class="{
                'mdi-check':pass!==false,
                'mdi-close':pass===false
            }"></r-icon>

            </r-btn>
        </div>
    </r-input>
</template>
<script>
    export default {
        name: 'r-check-input',
        props: {
            type: {
                type: String,
                default: 'text'
            },
            name: {
                type: String,
                default: 'text'
            },
            link: String,
            modelValue: [String, Number],
            autofocus: Boolean,
        },

        data() {
            return {
                lazyValue: this.modelValue,
                msg: null,
                pass: null,
                loading: false,
                active: false
            }
        },
        watch: {
            modelValue() {
                this.msg = null
                this.pass = null
                this.$emit('data', {})
                this.lazyValue = this.modelValue
            }
        },
        methods: {
            check() {
                if (this.link) {
                    this.loading = true
                    this.$axios.post(this.link, {
                        [this.name]: this.lazyValue
                    }).then(({data}) => {
                        this.$emit('data', data)
                        this.msg = null
                        this.loading = false
                        this.pass = true
                    }, ({response}) => {
                        if (response.data.msg) {
                            this.msg = this.$t(response.data.msg)
                        }
                        this.$emit('data', response.data)
                        this.loading = false
                        this.pass = false
                    })
                }

            },
            handleClick(e) {
                this.$refs.input.focus()
            },
            emit() {
                this.$emit('update:modelValue', this.lazyValue)
            }
        }
    }

</script>
<style lang="scss">
    @import "../../style/include";

    .#{$prefix}check-input {
        .check-input-container {
            display: flex;
            width: 100%;
        }
    }
</style>
