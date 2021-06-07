<template>
    <r-input :model-value="modelValue" hide labelControlClass="label-active" class="r-color-picker">
        <r-range :model-value="parts.red" :label="$t('red')" :max="255" :min="0" color="color-error"
                 @update:model-value="emit('red',$event)"></r-range>
        <r-range :model-value="parts.green" :label="$t('green')" :max="255" :min="0" color="color-success"
                 @update:model-value="emit('green',$event)"></r-range>
        <r-range :model-value="parts.blue" :label="$t('blue')" :max="255" :min="0" color="color-info"
                 @update:model-value="emit('blue',$event)"></r-range>
        <r-range :model-value="parts.opacity" :label="$t('opacity')" :max="1" :min="0" :step=".01"
                 @update:model-value="emit('opacity',$event)"></r-range>
        <div :style="`background-color: rgba(${this.red},${this.green},${this.blue},${this.opacity});height:30px;width:100%`"></div>
    </r-input>
</template>
<script>
    export default {
        name: 'r-color-picker',
        props: {
            modelValue: String
        },
        data() {
            return {
                red: 50,
                green: 200,
                blue: 50,
                opacity: 1
            }
        },
        computed: {
            parts() {
                if (!this.modelValue) {
                    return {
                        red: 50,
                        green: 200,
                        blue: 50,
                        opacity: 1
                    }
                }
                let res=this.modelValue
                res=res.replace('rgba(','')
                res=res.replace(')','')
                res=res.split(',')
                return {
                        red: res[0],
                        green: res[1],
                        blue: res[2],
                        opacity: res[3]
                    }
            }
        },
        methods: {
            emit(color, e) {
                this[color] = e
                this.$emit('update:modelValue', `rgba(${this.red},${this.green},${this.blue},${this.opacity})`)
            }
        }
    }
</script>
<style lang="scss">
    @import "../../style/include";
.#{$prefix}color-picker{
    .#{$prefix}range{
        width: 100% !important;
    }
}
</style>