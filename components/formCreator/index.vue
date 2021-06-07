<template>
  <r-card v-if="!autoSend" class="overflow-auto">
    <r-container>
      <r-message :items="errors" type="error"></r-message>
      <h1 class="title">{{title}}</h1>
      <r-form ref="form" v-model="valid">
        <r-row>
          <r-col :key="key" class="col-12" v-for="(item,key) in options">
            <component
                    v-if="item['formInput']!==false"
                    :is="'r-'+item['type']"
                    :label="$t(key)"
                    v-model="editedItem[key]"
                    v-bind="getAttr(options[key])"
            ></component>
          </r-col>
        </r-row>

        <r-row class="h-end mb-12">
          <r-btn @click.prevent="close"
                 class="color-error-text mx-1"
                 outlined
                 rounded>{{$t('cancel')}}
          </r-btn>
          <r-btn :disabled="!valid"
                 :loading="loading"
                 @click.prevent="save"
                 class="color-success"
                 rounded>
            {{$t('send')}}
          </r-btn>
        </r-row>
      </r-form>
    </r-container>
  </r-card>
</template>

<script>
export default {
  name: 'r-form-creator',
  props: {
    url: {
      required: true,
      type: String
    },
    title: {
      default: 'Add form',
      type: String
    },
    autoSend: Boolean,
    redirect: {
      type: String
    },
    method: {
      default: 'post',
      type: String
    },
    options: {
      required: false,
      type: [Object, Array]
    },
    modelValue: {
      default: function () {
        return {}
      },
      type: Object
    }
  },
  data () {
    return {
      loading: false,
      valid: false,
      editedItem: this.modelValue,
      errors: [],
      alertShow: false,
      inputs: {}
    }
  },
  created () {
    if (this.autoSend) {
      this.save()
    }
  },
  methods: {
    getAttr(data){
      let res={}
      for(let i in data){
        if(this.$helper.hasKey(data,i) && !['formInput', 'sortable' , 'type','tableShow','priority'].includes(i)){
          res[i]=data[i]
        }
      }
      return res
    },
    close () {
      this.$emit('ok')
      this.alertShow = false
      this.errors = []
      setTimeout(() => {
        this.editedItem = Object.assign({}, {})
        this.loading = false
      }, 300)
    },
    save () {
      this.loading = true
      this.$axios[this.method](this.url, this.editedItem)
        .then(() => {
          this.close()
        }, (error) => {
          if (error.response.data.errors) {
            this.errors = error.response.data.errors
            this.alertShow = true
          }
          this.loading = false
        })
    }
  }
}
</script>
