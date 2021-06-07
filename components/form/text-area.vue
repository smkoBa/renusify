<template>
  <r-input :active="active"
           :modelValue="lazyValue"
           @click.stop="handleClick()"
           class="text-area">

      <textarea @focusin="active=true"
                @focusout="active=false"
                @input="$emit('update:modelValue', lazyValue)"
                ref="input"
                :rows="rows"
                autocomplete="no"
                v-model="lazyValue"
      ></textarea>
  </r-input>
</template>
<script>

export default {
  name: 'r-text-area',
  props: {
    modelValue: [String, Number],
      rows:{
        type:String,
          default:'7'
      }
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
    handleClick () {
      this.$refs.input.focus()
    }
  }
}

</script>
