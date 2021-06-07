<template>
    <div class="r-add-btn">
        <r-input v-bind="$attrs"
                 :modelValue="modelValue"
                 :active="active"
        >
            <r-btn @click.prevent="minus" class="minus" icon>
                <r-icon class="mdi-minus"></r-icon>
            </r-btn>
            <input @input="emit"
                   class="text-center mx-2"
                   @focusin="active=true"
                   @focusout="active=false"
                   ref="input"
                   type="number"
                   autocomplete="no"
                   v-model.number="number"
            />
            <r-btn @click.prevent="plus" class="plus" icon>
                <r-icon class="mdi-plus"></r-icon>
            </r-btn>
        </r-input>
    </div>

</template>

<script>
    export default {
        name: 'r-number',
        inheritAttrs: false,
        props: {
            modelValue: Number,
            min: {
                type: Number
            },
            max: {
                type: Number
            },
        },
        data() {
            return {
                number: this.modelValue,
                active: false
            }
        },
        watch: {
            'modelValue': function (newVal) {
                this.number = newVal
            }
        },
        methods: {
            emit() {
                let d = this.number
                if (this.max && d > this.max) {
                    d = this.max
                }
                if (this.min && d < this.min) {
                    d = this.min
                }
                this.number = d
                this.$emit('update:modelValue', d)

            },
            plus() {
                let n = this.modelValue || 0
                this.number = n + 1
                this.emit()
            },
            minus() {
                let n = this.modelValue || 0
                this.number = n - 1
                this.emit()
            }
        },
    }
</script>

<style lang="scss">
    @import "../../style/include";

    .r-add-btn {
        position: relative;

        .plus {
            position: absolute;
            right: 2px;
            top: 2px;
            z-index: 2;
        }

        .minus {
            position: absolute;
            left: 2px;
            top: 2px;
            z-index: 2;
        }

        .r-input-container:not(.input-focused) {
            .label:not(.label-active) {
                @include ltr() {
                    margin-left: 24px;
                }
                @include rtl() {
                    margin-right: 24px;
                }
            }
        }

    }

</style>
