<template>
  <transition :name="animate">
    <div v-bind="$attrs" :class="{
      'r-modal':true,
      'h-end':bottom,
      'modal-no-overlay':no_overlay,
      'animate-modal-vibrate':run_animate,
    }" @click.self="close" v-if="modelValue">
      <r-btn class="color-error"
             @click.prevent="close(true)"
             fab
             size="small"
             style="border-radius: 50% 50% 0 0;" v-if="closebtn">
        <r-icon class="mdi mdi-close"></r-icon>
      </r-btn>
      <div :class="contentClass">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import './style.scss'

export default {
  name: 'r-modal',
  inheritAttrs: false,
  props: {
    modelValue: Boolean,
    bottom: Boolean,
    no_overlay: Boolean,
    fullwidth: Boolean,
    minWidth: { type: Boolean, default: true },
    flat: Boolean,
    closable: Boolean,
    closebtn: { type: Boolean, default: true },
    color: String,
    animate: {
      type: String,
      default: 'slide-up'
    }

  },
  data () {
    return {
      state: null,
      run_animate: false
    }
  },
  watch: {
    $route () {
      if (this.modelValue) {
        this.$emit('update:modelValue', false)
      }
    },
    modelValue: {
      // immediate: true, watch at created component
      handler: function (newVal, oldVal) {
        if (newVal === true) {
          document.documentElement.style.overflow = 'hidden'
          const that = this
          window.onpopstate = function (event) {
            that.$emit('update:modelValue', false)
          }
        } else {
          document.documentElement.style = null
        }
      }
    }
  },
  computed: {
    contentClass () {
      let c = 'modal-content'

      if (this.bottom) {
        c += ' modal-bottom'
      }
      if (this.color) {
        c += ' ' + this.color
      }
      if (this.animate) {
        c += ' animate-modal-' + this.animate
      }
      if (this.fullwidth) {
        c += ' modal-fullwidth'
      }
      if (this.minWidth) {
        c += ' modal-mini'
      }
      if (this.flat) {
        c += ' modal-flat'
      }
      return c
    }
  },
  methods: {
    close (force = false) {
      if (this.closable || force === true) {
        this.$emit('update:modelValue', !this.modelValue)
      } else {
        this.run_animate = true
        setTimeout(() => {
          this.run_animate = false
        }, 300)
      }
    }
  }
}
</script>
