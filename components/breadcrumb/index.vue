<template>
  <transition name="slide-up">
    <ul class="r-breadcrumbs r-sheet-tile mb-1" :class="{'r-sheet':sheet}" v-if="genItems.length>0">
      <li
        :key="key"
        v-for="(item,key) in genItems">

        <r-breadcrumbs-item :href="item.href"
                            :item="item"
                            :to="item.to"
                            @click="go(item)"></r-breadcrumbs-item>
      </li>
    </ul>
  </transition>
</template>

<script>
import './style.scss'

export default {
  name: 'r-breadcrumbs',
  props: {
    sheet: {
      type: Boolean,
      default: true
    },
    divider: {
      type: String,
      default: '/'
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    genItems () {
      const lists = []

      for (let i = 0; i < this.items.length; i++) {
        if (i !== 0) {
          lists.push({ name: 'mdi-chevron-right', type: 'divider' })
        }
        let c = {}
        c = this.items[i]
        c.type = 'item'

        if (i === (this.items.length - 1)) {
          c.disabled = true
        } else {
          c.disabled = false
        }
        lists.push(c)
      }

      return lists
    }
  },
  methods: {
    go (key) {
      this.$emit('click', key)
    }
  }
}
</script>
