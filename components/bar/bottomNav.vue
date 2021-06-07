<template>
  <div :class="{
    'r-bottom-navigation elevation-md':true,
    'bottom-navigation-fixed':fixed,
    'bottom-navigation-grow':grow
  }">
    <slot></slot>
  </div>
</template>

<script>
import './scss/bottomNav.scss'

export default {
  name: 'r-bottomNav',
  props: {
    fixed: Boolean,
    grow: Boolean
  }
}
</script>
