<template>
    <span :class="classes" @click.stop="select">
      <span class="chip-content">
        <r-icon class="mdi-check" exact v-if="modelValue"></r-icon>
      <slot></slot>
        <r-btn @click.prevent="closeChip" class="chip-close mx-1" icon size="x-small" text v-if="close">
          <r-icon class="mdi-close-circle"></r-icon>
        </r-btn>
    </span>

    </span>
</template>

<script>
import './style.scss'

export default {
  name: 'r-chip',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default',
      validator: function (value) {
        return ['x-small', 'small', 'default', 'large', 'x-large'].indexOf(value) !== -1
      }
    },
    selectable: Boolean,
    close: Boolean,
    disabled: Boolean,
    label: Boolean,
    outlined: Boolean,
    text: Boolean
  },
  computed: {
    classes () {
      let c = 'r-chip px-3 chip-size-' + this.size
      if (this.selectable) {
        c += ' chip-selectable'
      }
      if (this.modelValue) {
        c += ' chip-active ps-0 color-three'
      }

      if (this.close) {
        c += ' pe-0'
      }
      if (this.disabled) {
        c += ' chip-disabled'
      }
      if (this.label) {
        c += ' chip-label'
      }
      if (this.outlined) {
        c += ' chip-outlined'
      }
      if (this.text) {
        c += ' chip-text'
      }
      return c
    }
  },
  methods: {
    closeChip () {
      this.$emit('update:modelValue', false)
    },
    select () {
      this.$emit('update:modelValue', !this.modelValue)
    }
  }
}
</script>
