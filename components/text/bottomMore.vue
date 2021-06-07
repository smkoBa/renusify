<template>
  <div :style="{
                 'max-height':height
                 }"
       class="r-bottom-more pa-3">
    <r-row class="h-space-between">
      <r-col class="col-auto title">{{title}}</r-col>
      <r-col class="col-auto">
        <r-btn @click.stop="show=true" class="color-info-text btn-table pe-0" text>
          {{$t('see_more')}}
          <r-icon class="mdi-chevron-right"></r-icon>
        </r-btn>
      </r-col>
    </r-row>
    <slot v-bind:show="show"></slot>
    <r-modal bottom
             closable
             fullwidth
             v-model="show">
      <r-container>
        <r-row class="h-center title my-5">{{title}}</r-row>
        <r-divider class="mb-5"></r-divider>
        <slot v-bind:show="show"></slot>
      </r-container>
    </r-modal>
  </div>
</template>

<script>
export default {
  name: 'r-bottom-more',
  props: {
    height: String,
    title: String
  },
  data () {
    return {
      show: false
    }
  }
}
</script>
<style lang="scss">
  @import "../../style/_include.scss";

  @include theme(#{$prefix}bottom-more) using($material) {
    &:after {
      //background: -webkit-gradient(linear, left top, left bottom, from(rgba(map-metro-get($material,'background','two'),0)), color-stop(99%, rgba(map-metro-get($material,'background','two'),1)), to(map-metro-get($material,'background','two')));
      background: linear-gradient(180deg, rgba(map_get($material, 'cards'), 0), rgba(map_get($material, 'cards'), 1) 98%, map_get($material, 'cards'));
    }
  }

  .#{$prefix}bottom-more {
    overflow: hidden;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      right: 0;
      left: 0;
      opacity: 1;
      bottom: -2px;
      height: 100px;
      z-index: 1;
    }
  }
</style>
