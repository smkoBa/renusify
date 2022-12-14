<template>
    <div class="r-select-container" ref="select" v-click-outside="closeList">
        <r-input :active="active"
                 v-bind="$attrs"
                 :modelValue="$helper.ifHas(chips,null,0,'value')"
                 @click.prevent="handleClick()">
            <div class="select-wrap v-center"
                 :class="{'flex-nowrap':!multiple}">
                <r-chip
                        :close="multiple&&!textChip"
                        :key="key"
                        :text="textChip || !multiple"
                        @update:modelValue="handleChip($event,key)"
                        selectable
                        v-for="(item,key) in chips">
                    {{item[text]}}
                </r-chip>
                <span>
        <input :type="type"
               @focusin="focusInput(true)"
               @focusout="focusInput(false)"
               @keydown.enter="add"
               autocomplete="no"
               class="select-input"
               ref="input"
               v-model="inputVal"
        />
          </span>
            </div>
            <r-progress-liner v-if="loading" color="color-two"></r-progress-liner>
        </r-input>
        <r-card class="card-select" :class="{
            'card-select-active':genItems.length>0 && openList,
            'to-top':openToTop
        }"
                :style="{
                    width:$refs.select&&$refs.select.getBoundingClientRect().width+'px'
                }"
        >
            <r-list :filter="inputVal&&inputVal.trim()"
                    :items="genItems"
                    :multiple="multiple"
                    :modelValue="chips"
                    :min="min"
                    @update:modelValue="listInput"
                    checked>
                <template v-slot="props">
                    <slot :item="props.item">
                        <div class="list-title">{{props.item[text]}}</div>
                    </slot>
                        <transition name="fade">
                            <r-icon class="exact-icon mdi-check pe-1"
                                    v-if="$helper.searchArray(props.list,text,props.item[text])!==false"
                                    ></r-icon>
                        </transition>
                </template>
            </r-list>
        </r-card>
    </div>
</template>
<script>
    import './scss/select.scss'
    import clickOutside from '../../directive/clickOutSide/index'

    export default {
        name: 'r-select',
        inheritAttrs: false,
        directives: {
            'click-outside': clickOutside
        },
        props: {
            searchLink: String,
            query: String,
            type: {
                type: String,
                default: 'text'
            },
            text: {
                type: String,
                default: 'name'
            },
            min: {type: Number, default: 0},
            combo: Boolean,
            readonly: Boolean,
            textChip: Boolean,
            items: Array,
            modelValue: [String, Number, Array, Object],
            tags: Boolean,
            multiple: Boolean,
            single: Boolean,
            openToTop: Boolean,
            translate: Boolean
        },
        data() {
            return {
                apiData: [],
                loading: false,
                active: false,
                openList: false,
                inputVal: null,
                chips: []
            }
        },
        mounted() {
            this.chips = this.getValue()
        },
        computed: {
            genItems() {
                let res = []
                if (this.apiData.length > 0) {
                    res = this.apiData
                }

                if (this.items) {
                    res = Object.assign([],this.items)
                }
                if (typeof res[0] === 'string') {
                    for (let i in res) {
                        if (this.$helper.hasKey(res, i)) {
                            let v = {}
                            v[this.text] = res[i].toString()
                            v['value'] = res[i]
                            res[i] = v
                        }
                    }
                }
                if (this.translate) {
                    for (let i in res) {
                        if (this.$helper.hasKey(res, i)) {
                            res[i][this.text] = this.$t(res[i][this.text])
                        }
                    }
                }
                return res
            }
        },
        watch: {
            'inputVal': function (newVal) {
                if (this.searchLink) {
                    if (newVal && newVal.length > 0) {
                        this.get()
                    }
                }
            },
            modelValue: function () {
                this.chips = this.getValue()
            }
        },
        methods: {
            get() {
                this.loading = true
                let link=this.searchLink+'?s='+this.inputVal
                if(this.query){
                    link+='&'+this.query
                }
                return this.$axios.get(link).then(({data}) => {
                    this.apiData = data
                    this.loading = false
                }, () => {
                    this.loading = false
                })
            },
            getValue() {
                if (this.modelValue !== undefined && this.modelValue !== null) {
                    if (this.$helper.ifHas(this.modelValue, false, this.text)) {
                        return [this.modelValue]
                    } else if (typeof this.modelValue === 'string' || typeof this.modelValue === 'number') {
                        const index = this.$helper.searchArray(this.genItems, 'value', this.modelValue)
                        if (index !== false) {
                            return [this.genItems[index]]
                        }
                        return [{
                            [this.text]: this.modelValue.toString(), value: this.modelValue
                        }]
                    } else if (typeof this.modelValue[0] === 'string') {
                        let res = []
                        for (let i = 0; i < this.modelValue.length; i++) {
                            res.push({[this.text]: this.modelValue[i].toString(), value: this.modelValue[i]})
                        }
                        return res
                    } else {
                        return this.modelValue
                    }
                }
                return []
            },
            handleChip(e, key) {
                if (e === false) {
                    this.chips.splice(key, 1)
                    this.emitVal()
                } else {
                    this.handleClick()
                }

            },
            handleClick() {
                if (this.$refs.input) {
                    this.$refs.input.focus()
                }
            },
            add() {
                if (this.inputVal) {
                    let val = {[this.text]: this.inputVal.toString(), value: this.inputVal}
                    if (!this.multiple) {
                        this.chips = []
                    }
                    if (!this.combo&&!this.tags) {
                        const exist = this.$helper.searchArray(this.genItems, this.text, val[this.text])
                        if (exist !== false) {
                            this.chips.push(val)
                        }
                    } else {
                        this.chips.push(val)
                    }
                    this.inputVal = null

                    this.emitVal()
                }
            },
            emitVal() {
                this.chips = this.$helper.uniqArray(this.chips)

                let val = this.chips
                if (this.tags) {
                    val = []
                    for (let i in this.chips) {
                        if (this.$helper.hasKey(this.chips, i)) {
                            val.push(this.chips[i]['value'])
                        }
                    }
                }
                if (!this.multiple && !this.tags) {
                    val = val[0]
                    if (val) {
                        if (this.single) {
                            val = val['value']
                        }
                        this.closeList()
                    }
                }

                this.$emit('update:modelValue', val)

            },
            focusInput(val) {
                if (this.readonly) {
                    return
                }
                this.active = val

                if (val === true) {
                    this.openList = true
                }
                setTimeout(() => {
                    this.add()
                }, 200)
            },
            listInput(e) {
                this.inputVal = null
                this.chips = e

                this.emitVal()
            },
            closeList() {
                this.active = false
                this.openList = false

            }
        }
    }

</script>
