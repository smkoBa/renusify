<template>
    <r-input :modelValue="lazyValue" hide>
        <div class="r-switch v-center">
            <div class="switch-label me-1 mt-1">{{label}}</div>
            <div :class="{
      'switch-btn--checked':lazyValue,
      'switch-btn-flat':flat,
      'elevation-sm':!flat,
      }" @click="toggle()" class="switch-btn">
                <r-icon :class="icon" v-if="icon"></r-icon>
                <div class="ripple ripple--dark"></div>
                <div class="ripple ripple--light"></div>

                <div class="toggle toggle--dark"></div>
                <div class="toggle toggle--light"></div>
            </div>
            <div class="switch-label ms-1 mt-1" v-if="label2">{{label2}}</div>
        </div>
    </r-input>
</template>
<script>
    import './scss/switch.scss'

    export default {
        name: 'r-switch',
        props: {
            label: String,
            label2: String,
            icon: String,
            flat: Boolean,
            readonly: Boolean,
            modelValue: {
                type: [Boolean, String]
            }
        },

        data() {
            return {
                lazyValue: this.modelValue

            }
        },
        watch: {
            modelValue() {
                this.lazyValue = this.modelValue
            }
        },
        methods: {
            toggle() {
                if (!this.readonly) {
                    if (this.lazyValue === true) {
                        this.lazyValue = false
                        this.$emit('change', true)
                        this.$emit('update:modelValue', false)
                    } else {
                        this.lazyValue = true
                        this.$emit('change', true)
                        this.$emit('update:modelValue', true)
                    }
                }
            }
        }
    }

</script>
