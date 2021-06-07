<template>
  <div class="r-text-editor" v-html="$helper.cleanXss(text)"></div>
</template>

<script>
export default {
  name: "law",
  props:{
    text:String
  }
};
</script>

<style lang="scss">
@import "~renusify/style/include";
@import "~renusify/components/form/text-editor/style";
</style>
