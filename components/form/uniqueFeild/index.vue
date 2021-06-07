<template>
  <r-text-input
    :class="color"
    @update:modelValue="check"
    :model-value="modelValue"
  ></r-text-input>
</template>

<script>
export default {
  name: 'r-unique-input',
  props: {
    link: {
      type: String,
      required: true
    },

    modelValue: {
      default: null,
      type: String
    },
  },
  data () {
    return {
      item: null,
      color: null,
      error: false,
      message: ''
    }
  },
  methods: {
    emit () {
      this.$emit('update:modelValue', this.item)
    },
    check (e) {
      this.item=e
      if (this.item&&this.item.length > 4) {
        this.color = null
        this.$axios.post(this.link, {
          'unique_name': this.item
        })
          .then((res) => {
            if (res.data) {
              this.color = 'color-success-text'
              this.emit()
              this.error = false
              this.message = ''
            }
          }, (e) => {
            this.error = true
            this.message = e.response.data.message
          })
      }
    }
  }
}
</script>
