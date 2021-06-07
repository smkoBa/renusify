<template>
  <div class="r-rating ">
    <r-btn :class="`${Math.round(modelValue)>=i?'color-warning-text':''}`" :key="i"
           :readonly="readonly"
           :size="size"
           @click="select(i)"
           icon
           text
           v-for="i in count">
      <r-icon class="mdi-star"></r-icon>
    </r-btn>
  </div>
</template>

<script>
import './scss/rating.scss'

export default {
  name: 'r-rating',
  props: {
    count: {
      type: Number,
      default: 5
    },
    size: {
      type: String,
      default: 'default',
      validator: function (value) {
        return ['x-small', 'small', 'default', 'large', 'x-large'].indexOf(value) !== -1
      }
    },
    modelValue: Number,
    readonly: Boolean
  },
  methods: {
    select (n) {
      this.$emit('update:modelValue', n)
    }
  }
}
</script>
