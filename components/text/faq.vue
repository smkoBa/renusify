<template>
  <r-container>
    <r-row :key="key" v-for="(item,key) in getItems">
      <r-card class="flex-grow-1 ma-1">
        <r-col class="col-12">
          <r-btn @click.stop="openFaq(null)" class="mx-1" icon v-if="opened===key">
            <r-icon class="mdi-minus"></r-icon>
          </r-btn>
          <r-btn @click.stop="openFaq(key)" class="mx-1" icon v-else>
            <r-icon class="mdi-plus"></r-icon>
          </r-btn>
          <span :class="{'color-one-text':opened===key}">{{item.key}}</span>
        </r-col>
        <transition name="slide-up">
          <r-col class="col-12" v-if="opened===key">
            <div class="ps-10">{{item.value}}</div>
          </r-col>
        </transition>
      </r-card>
    </r-row>
  </r-container>
</template>

<script>
export default {
  name: 'r-faq',
  props: {
    items: Array
  },
  data () {
    return {
      opened: null
    }
  },
  computed: {
    getItems () {
      let items = this.items
      let res = []
      for (let i = 0; i < items.length; i++) {
        if (items[i]['type'] === 'title' && this.$helper.ifHas(items, false, i + 1, 'value', 0)) {
          res.push({ 'key': items[i]['value'], 'value': items[i + 1]['value'][0] })
        }
      }
      return res
    }
  },
  methods: {
    openFaq (i) {
      this.opened = i
    }
  }
}
</script>
