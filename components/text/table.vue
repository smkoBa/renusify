<template>
  <r-container class="r-text-table py-0">
    <r-row :key="i" v-for="(item,i) in items">
      <r-col class="col-12 mt-2 mb-n5 title">{{item.title}}</r-col>
      <r-col class="col-12">
        <r-container class="container-fluid">
          <r-row :key="'p'+j" v-for="(param,j) in item.params">
            <r-col class="col-12 md-3 pa-1">
              <div class="subtitle-1 key pa-2 br-sm">{{param.key}}</div>
            </r-col>
            <r-col class="col-12 md-9 pa-1">
              <div class="subtitle-1 value ms-3 ma-md-0 pa-2 br-sm">{{param.value}}</div>
            </r-col>
          </r-row>
        </r-container>
      </r-col>
    </r-row>

  </r-container>
</template>

<script>
export default {
  name: 'r-text-table',
  props: {
    items: [Object, Array]
  },
  methods: {
    extract (items) {
      if (typeof items.options !== 'object') {
        return items
      }
      items.options.forEach((item) => {
        for (let i in item) {
          items[i] = item[i]
        }
      })
      delete items.options
      return items
    },
    objectTxt (obj) {
      let text = ''
      for (let i in obj) {
        text += ' '
        if (obj['unit'] && obj['b_unit']) {
          if (i !== 'unit') {
            text += obj[i]
          }
        } else {
          text += obj[i]
        }
      }
      return text
    },
    arrayTxt (obj) {
      let text = ''
      for (let i in obj) {
        text += obj[i]
        text += ' | '
      }
      return text.slice(0, -2)
    }
  }
}
</script>

<style lang="scss">
  @import "../../style/_include.scss";

  @include theme(#{$prefix}text-table) using($material) {
    .key {
      background-color: lighten(map-metro-get($material, 'background', 'two'), 9%);
    }

    .value {
      background-color: lighten(map-metro-get($material, 'background', 'two'), 5%);
    }
  }

  .#{$prefix}text-table {
    .key, .value {
      height: 100%;
    }
  }
</style>
