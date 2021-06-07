<template>
  <nav :class="`r-nav ${open?'nav-active':''}`">
    <r-modal :modelValue="open" @update:modelValue="emit">
      <r-breadcrumbs :items="breadcrumbs"></r-breadcrumbs>
      <r-progress-liner color="color-one" v-if="!cardShow"></r-progress-liner>
      <transition name="slide-end">
        <div class="list-holder" v-if="cardShow">
          <r-card
            :class="`pa-3`"
            :key="key"
            @click="changeMenu(key)"
            tile
            v-for="(item,key) in lists"
            v-ripple>
            <r-icon :class="`${item.icon}`" size="large"></r-icon>
            <h6 class="title ps-2">{{ts(item.name)}}</h6>
            <r-spacer></r-spacer>
            <r-icon class="mdi-chevron-right" v-if="item[childName]"></r-icon>
          </r-card>
        </div>
      </transition>
    </r-modal>
  </nav>
</template>

<script>
import './scss/navbar.scss'
import Ripple from '../../directive/ripple/index'
export default {
  directives: { ripple: Ripple },
  props: {
    modelValue: Boolean,
    items: {
      type: [Object, Array],
      default: () => {
        return {}
      }
    },
    childName: {
      type: String,
      default: 'children'
    },
    live: {
      type: Boolean,
      default: false
    },
    translate: Boolean
  },
  data () {
    return {
      cardShow: true,
      breadcrumbs: [{ name: 'root' }],
      lists: {}
    }
  },
  created () {
    this.lists = this.items
  },
  watch: {
    items () {
      this.lists = this.items
      this.cardShow = true
    }
  },
  computed: {
    open () {
      return this.modelValue
    }
  },
  methods: {
    emit (e) {
      this.lists = this.items

      this.$emit('update:modelValue', e)
    },
    changeMenu (key) {
      this.$emit('select', this.lists[key])
      this.cardShow = false

      if (this.lists[key][this.childName]) {
        this.breadcrumbs.push({ name: this.lists[key].name })
        setTimeout(() => {
          this.cardShow = true
          this.lists = this.lists[key][this.childName]
        }, 450)
      } else {
        this.cardShow = true
        if (!this.live) {
          const routeName = this.lists[key].route_name
          this.$emit('update:modelValue', false)
          this.$router.push({ name: routeName })

          this.lists = this.items
        }
        this.breadcrumbs = [{ name: 'root' }]
      }
    },
    ts (name) {
      if (this.translate) {
        return this.$t(name)
      }
      return name
    }

  }
}
</script>
