<template>
  <div class="r-toast">
    <transition name="slide-up">
      <div class="toast-content py-0 br-sm elevation-md" :class="'color-'+type" v-if="modelValue">
        <r-row class="v-center">
          <r-col class="col-10">
            <slot></slot>
          </r-col>
          <r-col class="col-2 h-end">
            <r-btn @click.prevent="close()"
                   icon
                   text
                   v-if="closable">
              <r-icon class="mdi-close"></r-icon>
            </r-btn>
          </r-col>
        </r-row>
      </div>
    </transition>
  </div>

</template>

<script>
import './style.scss'
export default {
  name: 'r-toast',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: function (value) {
        return ['info', 'warning', 'error', 'success'].indexOf(value) !== -1
      }
    },
    modelValue: Boolean,
    closable: Boolean,
    time: {
      type: Number,
      default: 3000
    }
  },
  methods: {
    delay () {
      if (this.time !== -1) {
        setTimeout(() => {
          this.close()
        }, this.time)
      }
    },
    close () {
      this.$emit('update:modelValue', false)
    }
  },
  watch: {
    modelValue (nVal) {
      if (nVal === true) {
        this.delay()
      }
    }
  }
}
</script>
