<template>
  <r-container v-if="items">
    <r-row :key="i" v-for="(item,i) in items">
      <r-col class="title mt-2 col-12" v-if="item.type==='title'">{{item.value}}</r-col>
      <r-col class="col-12" v-if="item.type==='p'">
        <p :key="'p'+n" class="body-1" v-for="(p,n) in item.value">{{p}}</p>
      </r-col>
      <r-col class="col-12 text-center" v-if="item.type==='img'">
        <img :alt="get(i)"
             :key="'img'+m"
             :src="`/fileManagers/img/${img}`"
             class="description-img"
             v-for="(img,m) in item.value">
      </r-col>
    </r-row>
  </r-container>
</template>

<script>
export default {
  name: 'r-description',
  props: {
    items: [Object, Array]
  },
  methods: {
    get (i) {
      for (let j = 0; j < 5; j++) {
        if (this.$helper.ifHas(this.items, false, i - j, 'type') === 'title') {
          return this.items[i - j].value
        }
      }
      return 'image'
    }
  }
}
</script>
<style>
  .description-img {
    max-width: 100%;
  }
</style>
