<template>
  <r-modal :closebtn="false" :model-value="modelValue">
    <r-card>
      <r-container class="container-fluid">
        <r-row class="h-center no-gutters">
          <h2 class="headline">
            {{title||$t('confirm_title')}}
          </h2>
        </r-row>
        <r-row>
          <r-col class="col-12" v-if="hard">
            <r-form v-model="valid">
              <r-text-input :label="$t('confirm_code',[inputKey])"
                            :rules="['required','match:'+inputKey]"
                            v-model.number="inputVal"></r-text-input>
            </r-form>
          </r-col>
          <r-col class="col-12">
            {{text||$t('confirm_body')}}
            <r-divider class="my-2"></r-divider>
          </r-col>
        </r-row>
        <r-row class="h-end no-gutters">
          <r-btn :loading="this.loading"
                 @click.stop="cancel"
                 class="color-error-text mx-1"
                 outlined
                 rounded
                 v-if="!this.loading">
            {{cancelText||$t('cancel')}}
          </r-btn>
          <r-btn :disabled="hard&&!valid"
                 :loading="this.loading"
                 @click.stop="confirm"
                 class="color-success-text"
                 outlined
                 rounded>{{confirmText||$t('accept')}}
          </r-btn>
        </r-row>
      </r-container>
    </r-card>
  </r-modal>
</template>

<script>
export default {
  name: 'r-confirm',
  props: {
    title: String,
    text: String,
    cancelText: String,
    confirmText: String,
    modelValue: Boolean,
    hard: Boolean
  },
  data () {
    return {
      valid: false,
      inputVal: null,
      inputKey: null,
      loading: false
    }
  },
  watch: {
    modelValue: function () {
      this.resetState()
    }
  },
  methods: {
    resetState () {
      this.inputKey = this.$helper.randomInt(10, 99)
      this.inputVal = null
      this.loading = false
    },
    confirm () {
      if (this.hard && (this.inputKey !== this.inputVal)) {
        this.cancel()
      } else {
        this.loading = true
        this.$emit('accept')
      }
    },
    cancel () {
      this.loading = true
      this.$emit('cancel')
    }
  }
}
</script>
