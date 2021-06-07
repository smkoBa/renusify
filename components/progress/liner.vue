<template>
    <div class="r-progress " :class="{
        'progress-outlined':outlined,
        'progress-rounded':rounded,
        [`size-${size}`]:true
    }">
        <span class="label" v-if="showPercent">{{$n(modelValue)}} %</span>
        <div class="progress-container">
            <div :class="classes" :style="styles"></div>
        </div>
    </div>
</template>

<script>
    import './style.scss'

    export default {
        name: 'liner',
        props: {
            modelValue: [Number, String],
            color: String,
            showPercent: Boolean,
            outlined: Boolean,
            rounded: Boolean,
            size: {
                type: String,
                default: 'small',
                validator: function (value) {
                    return ['small', 'medium', 'large', 'x-large'].indexOf(value) !== -1
                }
            }
        },
        computed: {
            isIndeterminate() {
                if (this.modelValue !== undefined) {
                    return !(this.modelValue >= 0 && this.modelValue <= 100)
                } else {
                    return true
                }
            },
            classes() {
                let c = ''
                c += this.isIndeterminate ? 'liner-indeterminate' : 'liner-determinate'

                if (this.color) {
                    c += ' ' + this.color
                }
                return c
            },
            styles() {
                let c = ''
                if (!this.isIndeterminate) {
                    c += 'width:' + this.modelValue + '%'
                }
                return c
            }
        }
    }
</script>
