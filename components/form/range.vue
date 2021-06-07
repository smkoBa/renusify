<template>
    <div :class="classes" :style="pRangeStyle"
         @click="pRangeClick"
         ref="pRange"
         v-show="show"
    >
        <div class="range-label">{{label}}</div>
        <div :style="pRangeSliderStyle"
             aria-hidden="true"
             class="slider"
             ref="pRangeSlider"
        >
            <div v-if="isRange">
                <div :class="dotClasses"
                     :style="dotStyle"
                     ref='dot0'
                >
                    <div :class="`slider-dot-handle ${color}`"></div>
                    <div :class="`slider-tooltip-wrap slider-tooltip-${tooltipDirection[0]}`" ref='tooltip0'>
                        <span :class="`slider-tooltip ${color}`">{{val[0]}}</span>
                    </div>
                </div>
                <div :class="dotClasses"
                     :style="dotStyle"
                     ref='dot1'
                >
                    <div :class="`slider-dot-handle ${color}`"></div>
                    <div :class="`slider-tooltip-wrap slider-tooltip-${tooltipDirection[1]}`" ref='tooltip1'>
                        <span :class="`slider-tooltip ${color}`">{{val[1]}}</span>
                    </div>
                </div>
            </div>
            <div :class="dotClasses" :style="dotStyle"
                 ref='dot'
                 v-else
            >
                <div :class="`slider-dot-handle ${color}`"></div>
                <div :class="`slider-tooltip-wrap slider-tooltip-${tooltipDirection}`">
                    <span :class="`slider-tooltip ${color}`">{{val}}</span>
                </div>
            </div>

            <div :class="`slider-process ${color}`"
                 ref='process'
            >
            </div>
        </div>
    </div>
</template>
<script>
    //Licence https://github.com/xwpongithub/vue-range-slider
    import './scss/range.scss'
    import {isArray} from "../../tools/helper";

    const elementStyle = document.createElement('div').style;
    const vendor = (() => {
        const transformNames = {
            webkit: 'webkitTransform',
            Moz: 'MozTransform',
            O: 'OTransform',
            ms: 'msTransform',
            standard: 'transform'
        };
        for (const key in transformNames) {
            if (elementStyle[transformNames[key]] !== undefined) {
                return key;
            }
        }
        return false;
    })();

    function prefixStyle(style) {
        if (vendor === false) {
            return false;
        }
        if (vendor === 'standard') {
            if (style === 'transitionEnd') {
                return 'transitionend';
            }
            return style;
        }
        return vendor + style.charAt(0).toUpperCase() + style.substr(1);
    }

    const transform = prefixStyle('transform')

    const EVENT_TOUCH_START = 'touchstart'
    const EVENT_TOUCH_MOVE = 'touchmove'
    const EVENT_TOUCH_END = 'touchend'
    const EVENT_TOUCH_CANCEL = 'touchcancel'

    const EVENT_MOUSE_DOWN = 'mousedown'
    const EVENT_MOUSE_MOVE = 'mousemove'
    const EVENT_MOUSE_UP = 'mouseup'
    const EVENT_MOUSE_LEAVE = 'mouseleave'

    const EVENT_RESIZE = 'resize'

    export default {
        name: 'r-range',
        props: {
            label: String,
            show: {
                type: Boolean,
                default: true
            },
            modelValue: {
                type: [String, Number, Array, Object],
                default: 0
            },
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 100
            },
            color: {
                type: String,
                default: 'color-one'
            },
            step: {
                type: Number,
                default: 1
            },
            width: {
                type: [Number, String],
                default: 'auto'
            },
            height: {
                type: [Number, String],
                default: 6
            },

            stopPropagation: {
                type: Boolean,
                default: true
            },

            realTime: {
                type: Boolean,
                default: false
            },

            tooltip: {
                type: [String, Boolean],
                default: 'hover',
                validator(val) {
                    return ['hover', 'always'].indexOf(val) > -1
                }
            },

            disabled: {
                type: [Boolean, Array],
                default: false
            },

            debug: {
                type: Boolean,
                default: true
            },

            data: Array

        },
        data() {
            return {
                currentValue: 0,
                size: 0,
                focusSlider: 0,
                currentSlider: 0,
                flag: false,
                processFlag: false,
                processSign: false,

                focusFlag: false,
                dragFlag: false,
                crossFlag: false,

                isMounted: false
            }
        },

        computed: {
            classes() {
                let c = 'r-range slider-component slider-horizontal my-5'

                if (this.boolDisabled) {
                    c += ' slider-disabled'
                }
                if (this.processFlag) {
                    c += ' slider-state-process-drag'
                }
                if (this.focusFlag) {
                    c += ' slider-state-focus'
                }
                if (this.flag && !this.processFlag) {
                    c += ' slider-state-drag'
                }
                return c
            },
            dotClasses() {
                let c = 'slider-dot'
                if (this.tooltip === 'hover' && this.flag) {
                    c += ' slider-always'
                } else if (this.tooltip) {
                    c += ` slider-${this.tooltip}`
                }
                if (this.focusFlag && this.focusSlider === 0) {
                    c += ' slider-dot-focus'
                }
                if (this.flag && this.currentSlider === 0) {
                    c += ' slider-dot-dragging'
                }
                return c
            },
            val: {
                get() {
                    return this.data ? (this.isRange ? [this.data[this.currentValue[0]], this.data[this.currentValue[1]]] : this.data[this.currentValue]) : this.currentValue
                },
                set(val) {
                    if (this.data) {
                        if (this.isRange) {
                            const index0 = this.data.indexOf(val[0])
                            const index1 = this.data.indexOf(val[1])
                            if (index0 > -1 && index1 > -1) {
                                this.currentValue = [index0, index1]
                            }
                        } else {
                            const index = this.data.indexOf(val)
                            if (index > -1) {
                                this.currentValue = index
                            }
                        }
                    } else {
                        this.currentValue = val
                    }
                }
            },
            currentIndex() {
                if (this.isRange) {
                    return this.data ? this.currentValue : [this.getIndexByValue(this.currentValue[0]), this.getIndexByValue(this.currentValue[1])]
                } else {
                    return this.getIndexByValue(this.currentValue)
                }
            },

            tooltipDirection() {
                const dir = 'top'

                return this.isRange ? [dir, dir] : dir
            },

            total() {
                if (this.data) {
                    return this.data.length - 1
                } else if (Math.floor((this.maximum - this.minimum) * this.multiple) % (this.step * this.multiple) !== 0) {
                    this.printError('Prop[step] is illegal, Please make sure that the step can be divisible')
                }
                return (this.maximum - this.minimum) / this.step
            },

            dotStyle() {
                return `
        width: 16px;
        height: 16px;
        top: ${(-(16 - this.height) / 2)}px;
      `
            },

            pRangeSliderStyle() {
                return `
        height: ${this.height}px
      `
            },

            pRangeStyle() {
                return `width: ${typeof this.width === 'number' ? this.width + 'px' : this.width};
        padding: ${16 / 2}px 16/ 2}px`
            },

            minimum() {
                return this.data ? 0 : this.min
            },
            maximum() {
                return this.data ? (this.data.length - 1) : this.max
            },
            multiple() {
                const decimals = `${this.step}`.split('.')[1]
                return decimals ? Math.pow(10, decimals.length) : 1
            },
            indexRange() {
                return this.isRange ? this.currentIndex : [0, this.currentIndex]
            },
            spacing() {
                return this.data ? 1 : this.step
            },
            gap() {
                return this.size / this.total
            },

            disabledArray() {
                return this.$helper.isArray(this.disabled) ? this.disabled : [this.disabled, this.disabled]
            },
            boolDisabled() {
                return this.disabledArray.every(b => b === true)
            },

            isRange() {
                return this.$helper.isArray(this.modelValue)
            },
            isDisabled() {
                return this.boolDisabled
            },

            position() {
                return this.isRange ? [(this.currentValue[0] - this.minimum) / this.spacing * this.gap, (this.currentValue[1] - this.minimum) / this.spacing * this.gap] : ((this.currentValue - this.minimum) / this.spacing * this.gap)
            },
            limit() {
                return this.isRange ? [[0, this.position[1]], [this.position[0], this.size]] : [0, this.size]
            },
            valueLimit() {
                return this.isRange ? [[this.minimum, this.currentValue[1]], [this.currentValue[0], this.maximum]] : [this.minimum, this.maximum]
            },
            idleSlider() {
                return this.currentSlider === 0 ? 1 : 0
            },
            slider() {
                return this.isRange ? [this.$refs.dot0, this.$refs.dot1] : this.$refs.dot
            }
        },
        methods: {
            addEvent(el, type, fn, capture) {
                el.addEventListener(type, fn, {passive: false, capture: !!capture});
            },
            removeEvent(el, type, fn, capture) {
                el.removeEventListener(type, fn, {passive: false, capture: !!capture});
            },
            isDiff(a, b) {
                if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
                    return true;
                } else if (this.$helper.isArray(a) && a.length === b.length) {
                    return a.some((v, i) => v !== b[i]);
                }
                return a !== b;
            },
            setValue(val, noCb) {
                if (this.isDiff(this.val, val)) {
                    const resetVal = this.limitValue(val)
                    this.val = this.isRange ? resetVal.concat() : resetVal

                    this.syncValue(noCb)
                }
                this.$nextTick(() => this.setPosition())
            },

            pRangeClick(e) {
                if (this.isDisabled || this.processFlag || this.dragFlag) {
                    return false
                }
                const pos = this.getPos(e)
                if (this.isRange) {
                    if (this.disabledArray.every(b => b === false)) {
                        this.currentSlider = pos > ((this.position[1] - this.position[0]) / 2 + this.position[0]) ? 1 : 0
                    } else if (this.disabledArray[0]) {
                        if (pos < this.position[0]) return false
                        this.currentSlider = 1
                    } else if (this.disabledArray[1]) {
                        if (pos > this.position[1]) return false
                        this.currentSlider = 0
                    }
                }
                if (this.disabledArray[this.currentSlider]) {
                    return false
                }
                this.setValueOnPos(pos)
            },

            syncValue(noCb) {
                const val = this.isRange ? this.val.concat() : this.val
                this.$emit('update:modelValue', val)
                noCb || this.$emit('slide-end', val)
            },
            getPos(e) {
                this.realTime && this.getStaticData()
                return (e.pageX - this.offset)
            },
            setValueOnPos(pos, isDrag) {
                const range = this.isRange ? this.limit[this.currentSlider] : this.limit
                const valueRange = this.isRange ? this.valueLimit[this.currentSlider] : this.valueLimit
                const index = Math.round(pos / this.gap)
                if (pos >= range[0] && pos <= range[1]) {
                    const v = this.getValueByIndex(index)
                    this.setTransform(pos)
                    this.setCurrentValue(v, isDrag)
                } else {
                    const anotherSlider = pos < range[0] ? 0 : 1
                    const currentSlider = anotherSlider === 0 ? 1 : 0
                    this.setTransform(range[anotherSlider])
                    this.setCurrentValue(valueRange[anotherSlider])
                    if (this.isRange && !this.disabledArray[anotherSlider] && this.currentSlider === currentSlider) {
                        this.focusSlider = anotherSlider
                        this.currentSlider = anotherSlider
                    }
                }
                this.crossFlag = false
            },
            setCurrentValue(val, isDrag, isIdleSlider) {
                const slider = isIdleSlider ? this.idleSlider : this.currentSlider
                if (val < this.minimum || val > this.maximum) return false
                if (this.isRange) {
                    if (this.isDiff(this.currentValue[slider], val)) {
                        this.currentValue.splice(slider, 1, val)

                        this.syncValue()
                    }
                } else if (this.isDiff(this.currentValue, val)) {
                    this.currentValue = val

                    this.syncValue()
                }
                isDrag || this.setPosition()
            },
            setPosition() {
                if (this.isRange) {
                    this.setTransform(this.position[0], this.currentSlider === 1)
                    this.setTransform(this.position[1], this.currentSlider === 0)
                } else {
                    this.setTransform(this.position)
                }
            },
            roundToDPR() {
                const r = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
                return value => Math.round(value * r) / r;
            },
            setTransform(val, isIdleSlider) {
                const slider = isIdleSlider ? this.idleSlider : this.currentSlider
                const value = this.roundToDPR((val - (16 / 2)))
                const translateValue = `translateX(${value}px)`
                const processSize = `${slider === 0 ? this.position[1] - val : val - this.position[0]}px`
                const processPos = `${slider === 0 ? val : this.position[0]}px`
                if (this.isRange) {
                    this.slider[slider].style[transform] = translateValue

                    this.$refs.process.style.width = processSize
                    this.$refs.process.style.left = processPos
                } else {
                    this.slider.style[transform] = translateValue

                    this.$refs.process.style.width = `${val}px`
                    this.$refs.process.style.left = 0
                }
            },

            limitValue(val) {
                if (this.data) {
                    return val
                }
                const inRange = v => {
                    if (v < this.min) {
                        this.printError(`The value of the slider is ${val}, the minimum value is ${this.min}, the value of this slider can not be less than the minimum value`)
                        return this.min
                    } else if (v > this.max) {
                        this.printError(`The value of the slider is ${val}, the maximum value is ${this.max}, the value of this slider can not be greater than the maximum value`)
                        return this.max
                    }
                    return v
                }
                if (this.isRange) {
                    return val.map(v => inRange(v))
                } else {
                    return inRange(val)
                }
            },
            getStaticData() {
                if (this.$refs.pRangeSlider) {
                    this.size = this.$refs.pRangeSlider.offsetWidth
                    this.offset = this.$refs.pRangeSlider.getBoundingClientRect().left
                }
            },
            getValueByIndex(index) {
                return ((this.spacing * this.multiple) * index + (this.minimum * this.multiple)) / this.multiple
            },
            getIndexByValue(value) {
                return Math.round((value - this.minimum) * this.multiple) / (this.spacing * this.multiple)
            },
            _start(e, index = 0, isProcess) {
                if (this.disabledArray[index]) {
                    return false
                }
                if (this.stopPropagation) {
                    e.stopPropagation()
                }
                if (this.isRange) {
                    this.currentSlider = index
                    if (isProcess) {
                        this.processFlag = true
                        this.processSign = {
                            pos: this.position,
                            start: this.getPos((e.targetTouches && e.targetTouches[0]) ? e.targetTouches[0] : e)
                        }
                    }

                    this.crossFlag = true
                }
                if (!isProcess) {
                    this.focusFlag = true
                    this.focusSlider = index
                }
                this.flag = true
                this.$emit('drag-start', this)
            },
            _move(e) {
                e.preventDefault()
                if (this.stopPropagation) {
                    e.stopPropagation()
                }
                if (!this.flag) return false
                if (e.targetTouches && e.targetTouches[0]) e = e.targetTouches[0]
                if (this.processFlag) {
                    this.currentSlider = 0
                    this.setValueOnPos(this.processSign.pos[0] + this.getPos(e) - this.processSign.start, true)
                    this.currentSlider = 1
                    this.setValueOnPos(this.processSign.pos[1] + this.getPos(e) - this.processSign.start, true)
                } else {
                    this.dragFlag = true
                    this.setValueOnPos(this.getPos(e), true)
                }
            },
            _end(e) {
                if (this.stopPropagation) {
                    e.stopPropagation()
                }
                if (this.flag) {
                    this.$emit('drag-end', this)
                } else {
                    return false
                }
                this.flag = false
                this.$nextTick(() => {
                    this.crossFlag = false
                    this.dragFlag = false
                    this.processFlag = false
                })
                this.setPosition()
            },
            blurSlider(e) {
                const dot = this.isRange ? this.$refs[`dot${this.focusSlider}`] : this.$refs.dot
                if (!dot || dot === e.target || dot.contains(e.target)) {
                    return false
                }
                this.focusFlag = false
            },

            bindEvents() {
                const me = this
                this.processStartFn = function (e) {
                    me._start(e, 0, true)
                }
                this.dot0StartFn = function (e) {
                    me._start(e, 0)
                }
                this.dot1StartFn = function (e) {
                    me._start(e, 1)
                }
                if (this.$helper.isMobile) {
                    this.addEvent(this.$refs.process, EVENT_TOUCH_START, this.processStartFn)

                    this.addEvent(document, EVENT_TOUCH_MOVE, this._move)
                    this.addEvent(document, EVENT_TOUCH_END, this._end)
                    this.addEvent(document, EVENT_TOUCH_CANCEL, this._end)

                    if (this.isRange) {
                        this.addEvent(this.$refs.dot0, EVENT_TOUCH_START, this.dot0StartFn)
                        this.addEvent(this.$refs.dot1, EVENT_TOUCH_START, this.dot1StartFn)
                    } else {
                        this.addEvent(this.$refs.dot, EVENT_TOUCH_START, this._start)
                    }
                } else {
                    this.addEvent(this.$refs.process, EVENT_MOUSE_DOWN, this.processStartFn)

                    this.addEvent(document, EVENT_MOUSE_DOWN, this.blurSlider)
                    this.addEvent(document, EVENT_MOUSE_MOVE, this._move)
                    this.addEvent(document, EVENT_MOUSE_UP, this._end)
                    this.addEvent(document, EVENT_MOUSE_LEAVE, this._end)

                    if (this.isRange) {
                        this.addEvent(this.$refs.dot0, EVENT_MOUSE_DOWN, this.dot0StartFn)
                        this.addEvent(this.$refs.dot1, EVENT_MOUSE_DOWN, this.dot1StartFn)
                    } else {
                        this.addEvent(this.$refs.dot, EVENT_MOUSE_DOWN, this._start)
                    }
                }
                this.addEvent(window, EVENT_RESIZE, this.refresh)
            },
            unbindEvents() {
                if (this.$helper.isMobile) {
                    this.removeEvent(this.$refs.process, EVENT_TOUCH_START, this.processStartFn)
                    this.removeEvent(document, EVENT_TOUCH_MOVE, this._move)
                    this.removeEvent(document, EVENT_TOUCH_END, this._end)
                    this.removeEvent(document, EVENT_TOUCH_CANCEL, this._end)

                    if (this.isRange) {
                        this.removeEvent(this.$refs.dot0, EVENT_TOUCH_START, this.dot0StartFn)
                        this.removeEvent(this.$refs.dot1, EVENT_TOUCH_START, this.dot1StartFn)
                    } else {
                        this.removeEvent(this.$refs.dot, EVENT_TOUCH_START, this._start)
                    }
                } else {
                    this.removeEvent(this.$refs.process, EVENT_MOUSE_DOWN, this.processStartFn)
                    this.removeEvent(document, EVENT_MOUSE_DOWN, this.blurSlider)
                    this.removeEvent(document, EVENT_MOUSE_MOVE, this._move)
                    this.removeEvent(document, EVENT_MOUSE_UP, this._end)
                    this.removeEvent(document, EVENT_MOUSE_LEAVE, this._end)

                    if (this.isRange) {
                        this.removeEvent(this.$refs.dot0, EVENT_MOUSE_DOWN, this.dot0StartFn)
                        this.removeEvent(this.$refs.dot1, EVENT_MOUSE_DOWN, this.dot1StartFn)
                    } else {
                        this.removeEvent(this.$refs.dot, EVENT_MOUSE_DOWN, this._start)
                    }
                }
                this.removeEvent(window, EVENT_RESIZE, this.refresh)
            },
            refresh() {
                if (this.$refs.pRangeSlider) {
                    this.getStaticData()

                    this.setPosition()
                    this.unbindEvents()
                    this.bindEvents()
                }
            },
            printError(msg) {
                if (this.debug) {
                    console.error(`[r-range error]: ${msg}`)
                }
            }
        },
        mounted() {
            if (typeof window === 'undefined' || typeof document === 'undefined') {
                return this.printError('window or document is undefined, can not be initialization.')
            }
            this.$nextTick(() => {
                this.getStaticData()
                this.setValue(this.limitValue(this.modelValue), true)
                this.bindEvents()
            })
            this.isMounted = true
        },
        watch: {
            modelValue(val) {
                this.flag || this.setValue(val, true)
            },
            show(bool) {
                if (bool && !this.size) {
                    this.$nextTick(this.refresh)
                }
            },
            max(val) {
                if (val < this.min) {
                    return this.printError('The maximum value can not be less than the minimum value.')
                }
                const resetVal = this.limitValue(this.val)
                this.setValue(resetVal)
                this.refresh()
            },
            min(val) {
                if (val > this.max) {
                    return this.printError('The minimum value can not be greater than the maximum value.')
                }
                const resetVal = this.limitValue(this.val)
                this.setValue(resetVal)
                this.refresh()
            }
        },
        beforeUnmount() {
            this.unbindEvents()
            this.refresh()
        },
        deactivated() {
            this.unbindEvents()
            this.refresh()
        }
    }
</script>
