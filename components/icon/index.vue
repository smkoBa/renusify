<template>
  <i :class="{
    'icon-disabled':disabled,
    'exact-icon':exact,
    }" class="r-icon mdi"></i>
</template>

<script>
import './style.scss'

export default {
  name: 'index',
  props: {
    disabled: Boolean,
    exact: Boolean
  }
}
</script>
