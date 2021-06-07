<template>
    <nav class="r-tabs">
        <div class="btn-tabs d-flex h-end v-center">
            <r-btn @click.stop="isRtl?scroll_right():scroll_left()"
                   icon
                   text
                   v-if="isRtl?!disableRight:!disableLeft">
                <r-icon class="mdi-chevron-left display-1"></r-icon>
            </r-btn>
        </div>

        <div :class="[wrapperClass,{
    'tabs-hidden':$helper.width()>960
    }]" class="tabs-wrap" ref="tabs">
            <button
                    :class="[
        { 'tabs__item_active' : tab.value === value },
        tab.value === value && tabActiveClass ? tabActiveClass: '',
        tabClass,
      ]"
                    :disabled="tab.disabled || false"
                    :key="tab.title"
                    :ref="tab.value"
                    @click="handleClick(tab.value)"
                    class="tabs__item title"
                    type="button"
                    v-for="tab in tabs"
                    >
                {{tab.title}}
            </button>
            <div
                    :class="lineClass"
                    :style="{ width: `${activeLineWidth}px`, transform: `translateX(${activeLineOffset}px)` }"
                    class="tabs__active-line"></div>
        </div>
        <div class="btn-tabs d-flex h-start v-center">
            <r-btn @click.stop="isRtl?scroll_left():scroll_right()"
                   icon
                   text
                   v-if="isRtl?!disableLeft:!disableRight">
                <r-icon class="mdi-chevron-right display-1"></r-icon>
            </r-btn>
        </div>

    </nav>
</template>

<script>
export default {
  name: 'r-tabs',
  props: {
    modelValue: {
      type: String
    },
    tabs: {
      type: Array,
      required: true
    },
    updated: {
      type: [Boolean, String, Array],
      default: undefined
    },
    wrapperClass: {
      type: String,
      required: false
    },
    tabClass: {
      type: String,
      required: false
    },
    tabActiveClass: {
      type: String,
      required: false
    },
    lineClass: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      disableLeft: true,
      disableRight: true,
      activeLineWidth: 0,
      activeLineOffset: 0,
      newTab: ''
    }
  },
  mounted () {
    setTimeout(() => {
      this.offset()
      this.moveActiveLine(this.modelValue)
    }, 100)
  },
  watch: {
    modelValue (newCurrentTab) {
      if (this.newTab === newCurrentTab) return
      setTimeout(() => {
        this.offset()
        this.moveActiveLine(newCurrentTab)
      }, 100)
    },
    updated () {
      this.moveActiveLine(this.modelValue)
    }
  },
  computed: {
    isRtl () {
      return this.$r.rtl
    }
  },
  methods: {
    scroll_left () {
      this.$refs.tabs.scrollLeft -= this.$refs.tabs.clientWidth * 3 / 4
      this.offset()
    },
    scroll_right () {
      this.$refs.tabs.scrollLeft += this.$refs.tabs.clientWidth * 3 / 4
      this.offset()
    },
    offset () {
      const div = this.$refs.tabs
      this.disableLeft = false
      this.disableRight = false
      if (!div) {
        return false
      }

      setTimeout(() => {
        if (div.clientWidth === div.scrollWidth) {
          this.disableLeft = true
          this.disableRight = true
        } else if (div.scrollLeft === 0) {
          this.disableLeft = true
          this.disableRight = false
        } else if (div.scrollLeft + div.clientWidth === div.scrollWidth) {
          this.disableRight = true
          this.disableLeft = false
        }
      }, 100)
    },
    handleClick (value) {
      this.$emit('update:modelValue', value)
      this.moveActiveLine(value)
      this.newTab = value
    },
    moveActiveLine (newValue) {
      if (!this.modelValue) return
      if (!this.$refs || !this.$refs[newValue] || !this.$refs[newValue][0]) return
      let element = this.$refs[newValue][0]

      if (!(element instanceof Element)) {
        element = element.$el
      }
      this.activeLineWidth = element.clientWidth
      this.activeLineOffset = element.offsetLeft
      element.scrollIntoView()
    }
  }
}
</script>
<style lang="scss">
    @import "../../style/include";

    $btnTabsWidth: 50px;
    @include theme(#{$prefix}tabs) using($material) {
        .tabs__item {
            color: map-metro-get($material, 'text', 'secondary');

            &_active {
                color: map-metro-get($material, 'text', 'primary')
            }

            &:hover {
                color: map-metro-get($material, 'text', 'primary');
                border-bottom: 2px solid map-metro-get($material, 'text', 'secondary');
            }
        }
    }

    .#{$prefix}tabs {
        max-width: 100%;
        display: flex;
        flex-direction: row;

        .tabs-wrap {
            position: relative;
            margin: 0 auto;
            white-space: nowrap;
            width: calc(100% - #{$btnTabsWidth*2});
            overflow: auto;

            &.tabs-hidden {
                overflow: hidden;
            }

            scroll-behavior: smooth;
        }

        .tabs__active-line {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            background-color: currentColor;
            transition: transform 0.4s ease, width 0.4s ease;
        }

        .tabs__item {
            display: inline-block;
            margin: 0 5px;
            padding: 10px;
            padding-bottom: 8px;
            text-decoration: none;
            border: none;
            background-color: transparent;
            border-bottom: 2px solid transparent;
            cursor: pointer;
            transition: all 0.25s;

            &:focus {
                outline: none;
            }

            &:first-child {
                margin-left: 0;
            }

            &:last-child {
                margin-right: 0;
            }
        }

        .btn-tabs {
            width: $btnTabsWidth;
        }
    }
</style>
