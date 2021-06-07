<template>
  <div class="add-form pure-form">

    <div class="f-input">
      <input class="f-input-m" placeholder="name" type="text" v-if="needName" v-model="keyName">
      <select class="f-input-m mx-1" v-model="formatSelected">
        <option :key="index" :value="item" v-for="(item, index) in formats">{{item}}</option>
      </select>
      <!-- -- -->
      <template v-if="formatSelected !=='array' && formatSelected !== 'object'">
        <input class="f-input-m" placeholder="value" type="text" v-if="formatSelected === 'string'"
               v-model="valName">
        <input @change="dealNumber" class="f-input-m" placeholder="value" type="number"
               v-if="formatSelected === 'number'" v-model="valName">
        <select @change="dealBoolean" class="f-input-m" name="value" v-if="formatSelected === 'boolean'"
                v-model="valName">
          <option :value="true">true</option>
          <option :value="false">false</option>
        </select>
      </template>
    </div>

    <!-- -- -->
    <div class="f-btns">
      <r-btn @click.prevent.stop="confirm" class="color-info mx-1" size="small">{{$t('send')}}</r-btn>
      <r-btn @click.prevent.stop="cancel" class="color-error mx-1" size="small">{{$t('cancel')}}</r-btn>
    </div>
  </div>

</template>

<script>
export default {
  name: 'ItemAddForm',
  data: function () {
    return {
      formats: ['string', 'array', 'object', 'number', 'boolean'],
      formatSelected: 'string',
      // --
      keyName: '',
      valName: ''
    }
  },
  props: {
    needName: {
      default: true
    }
  },
  methods: {
    confirm: function () {
      let val = null
      if (
        this.formatSelected === 'array' ||
                    this.formatSelected === 'object'
      ) {
        val = []
      } else {
        val = this.valName
      }

      let objData = {
        key: this.needName ? this.keyName : null,
        val: val,
        type: this.formatSelected
      }

      this.$emit('confirm', objData)
      this.keyName = ''
      this.valName = ''
      this.formatSelected = 'string'
    },

    cancel: function () {
      this.$emit('cancel')
    },

    dealBoolean: function () {
      this.valName = Boolean(this.valName)
    },

    dealNumber: function () {
      this.valName = Number(this.valName)
    }
  }
}
</script>

<style scoped>

  .f-input,
  .f-btns {
    display: inline-block;
  }

  .f-btns {
    display: inline-block;
    margin-top: 0.5em;
  }

  .add-form {
    margin-bottom: 20px;
    font-size: .6em;
  }

</style>
