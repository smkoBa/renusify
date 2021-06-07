<template>
  <r-input :active="active"
           :model-value="lazyValue"
           @click.prevent="handleClick">
    <input :autofocus="autofocus"
           :type="type"
           @focusin="active=true"
           @focusout="active=false"
           @input="emit"
           autocomplete="no"
           ref="input"
           v-model="lazyValue"
    />
  </r-input>
</template>
<script>
export default {
  name: 'r-text-input',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    modelValue: [String, Number],
    autofocus: Boolean,
  },

  data () {
    return {
      lazyValue: this.modelValue,
      active: false
    }
  },
  watch: {
    modelValue () {
      this.lazyValue = this.modelValue
    }
  },
  methods: {
    handleClick (e) {
      this.$refs.input.focus()
    },
    emit(){
      this.$emit('update:modelValue', this.lazyValue)
    }
  }
}

</script>
