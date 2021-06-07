<template>
  <div class="r-container" :class="{'container-fluid':fullwidth,'fill':fill}">
    <slot></slot>
  </div>
</template>

<script>
import './style.scss'

export default {
  name: 'r-container',
  props: {
    fullwidth: Boolean,
    fill: Boolean
  }
}
</script>
