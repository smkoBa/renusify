<template>
  <div class="div-description">
    <div :class="`description ${showDescription?'active':''}`">
      <p class="white-space-pre-line">{{content}}</p>
    </div>
    <div :class="`mask ${showDescription?'active':''}`">
      <v-btn @click.prevent.stop="showDescription=!showDescription"
             color="primary"
             outlined
             rounded>
        {{showDescription?$t('read_less'):$t('read_more')}}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'maskDiv',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showDescription: false
    }
  }
}
</script>

<style scoped>
  .description {
    height: 240px;
    max-height: 240px;
    overflow: hidden;
  }

  .description.active {
    height: auto !important;
    max-height: unset !important;
    padding-bottom: 38px;
  }

  .div-description {
    position: relative;
    padding-bottom: 13px;
  }

  .mask {
    position: absolute;
    right: 0;
    left: 0;
    width: 100%;
    text-align: center;
    bottom: 15px;
    color: #2196f3;
    background: #fcfcfc;
    cursor: pointer;
  }

  .mask:after {
    content: "";
    position: absolute;
    right: 0;
    left: 0;
    opacity: 1;
    bottom: 38px;
    height: 105px;
    z-index: 1;
    background: -webkit-gradient(linear, left top, left bottom, from(hsla(0, 0%, 100%, 0)), color-stop(99%, hsla(0, 0%, 98.8%, .99)), to(#fcfcfc));
    background: linear-gradient(180deg, hsla(0, 0%, 100%, 0), hsla(0, 0%, 98.8%, .99) 99%, #fcfcfc);
  }

  .mask.active {
    height: auto;
    -webkit-transition: opacity .15s ease;
    transition: opacity .15s ease;
  }

  .mask.active:after {
    content: none;
  }
</style>
