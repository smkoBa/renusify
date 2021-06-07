<template>
    <div class="r-password">
        <r-input v-bind="$attrs"
                 :active="active"
                 :model-value="lazyValue"
                 @click.prevent="handleClick"
                 :error="errorState"
                 :icon="show?'mdi-eye-off':'mdi-eye'"
                 @icon="show=!show"
                 :msg="msg"
        >
            <input :autofocus="autofocus"
                   :type="show?'text':'password'"
                   class="pb-0"
                   @focusin="active=true"
                   @focusout="active=false"
                   @input="emit"
                   autocomplete="no"
                   ref="input"
                   v-model="lazyValue"
            />
            <r-progress-liner v-if="!hideLine" class="w-full" v-model="p" :color="color"></r-progress-liner>
        </r-input>
    </div>
</template>
<script>
    export default {
        name: 'r-password',
        props: {
            modelValue: [String, Number],
            hideLine: Boolean,
            autofocus: Boolean,
            mode: {
                type: String,
                default: 'weak',
                validator: function (value) {
                    return ['medium', 'strong', 'weak'].indexOf(value) !== -1
                }
            }
        },

        data() {
            return {
                lazyValue: this.modelValue,
                show: false,
                active: false,
                p: 0,
                msg: null,
                errorState: false
            }
        },
        computed: {
            color() {
                if (this.p >= 80) {
                    return 'color-success'
                }
                if (this.p >= 60) {
                    return 'color-info'
                }
                if (this.p >= 40) {
                    return 'color-warning'
                }
                return 'color-error'
            }
        },
        watch: {
            modelValue() {
                this.lazyValue = this.modelValue
            }
        },
        methods: {
            check() {
                const lng = this.lazyValue.length
                const lowerR = new RegExp("^(?=.*[a-z])").test(this.lazyValue)
                const upperR = new RegExp("^(?=.*[A-Z])").test(this.lazyValue)
                const specialR = new RegExp("^(?=.*[!@#\$%\^&\*])").test(this.lazyValue)

                if (upperR && lowerR && specialR && lng > 8) {
                    this.p = 100
                } else if ((upperR || lowerR) && specialR && lng > 5) {
                    this.p = 80
                } else if (upperR && lowerR && lng > 8) {
                    this.p = 70
                } else if (lng > 20) {
                    this.p = 70
                } else if (upperR && lowerR && lng > 5) {
                    this.p = 60
                } else if (lng > 8) {
                    this.p = 40
                } else {
                    this.p = 20
                }
                if (this.mode === 'medium' && this.p < 50) {
                    this.errorState = true
                    this.msg = this.$t('password_must_medium')
                }
                if (this.mode === 'strong' && this.p < 80) {
                    this.errorState = true
                    this.msg = this.$t('password_must_strong')
                }

            },
            handleClick(e) {
                this.$refs.input.focus()
            },
            emit() {
                this.$emit('update:modelValue', this.lazyValue)
                this.errorState = false
                this.msg = null
                if (this.lazyValue&& !this.hideLine) {
                    this.check()
                }
            }
        }
    }

</script>
<style lang="scss">
    @import "../../style/include";
    .#{$prefix}password {
        .progress-container {
height: 6px;
        }
    }
</style>