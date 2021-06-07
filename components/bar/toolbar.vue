<template>
  <header :class="{
    'toolbar-fixed':fixed,
    'toolbar-sticky':sticky,
    'r-sheet-tile':tile,
    'elevation-md':!flat
    }" class="r-toolbar r-sheet">
    <r-container class="pa-0">
      <div class="toolbar-content">
        <r-btn @click.stop="menuEmit" class="me-1 ps-1" :icon="isMobile" :text="isMobile" :outlined="!isMobile" :rounded="!isMobile" v-if="menu">
          <r-icon class="mdi-menu px-1"></r-icon>
          {{isMobile?'':$t('app_lists')}}
        </r-btn>
        <div class="toolbar-title" v-if="title">{{title}}</div>
        <r-spacer></r-spacer>
        <div :class="{
        'toolbar-items-fill':itemsFill
        }" class="toolbar-items">
          <slot></slot>
        </div>
      </div>
    </r-container>
  </header>
</template>

<script>
import './scss/toolbar.scss'

export default {
  name: 'r-toolbar',
  props: {
    menu: {
      type: Boolean,
      default: true
    },
    title: String,
    fixed: Boolean,
    modelValue: Boolean,
    itemsFill: Boolean,
    flat: Boolean,
    sticky: Boolean,
    tile: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isMobile () {
      return this.$helper.width() < 600
    }
  },
  methods: {
    menuEmit () {
      this.$emit('update:modelValue', !this.modelValue)
    }
  }
}
</script>
