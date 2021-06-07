<template>
    <div :class="classes">
        <div class="d-flex h-end v-end" v-if="editable">
            <svg class="table-svg" height="18" width="18">
                <path class="table-svg-path" d="M 0 0 l 0 18 l 18 0 q -18 0 -18 -18"/>
            </svg>
            <span class="color-info-text table-editable-icon px-2"
                  @click.prevent="open_modal()">
                <r-icon class="mdi-settings"></r-icon>
            </span>
        </div>
        <div class="table-wrapper">
            <div class="table-container" ref="table">
                <r-progress-liner v-if="loading" color="color-one"></r-progress-liner>
                <table>
                    <thead>
                    <tr>
                        <slot name="header" v-bind:header="th">
                            <th :key="key" class="text-start text-no-wrap"
                                :class="{'color-info-text':sortKey===item.value}"
                                v-for="(item,key) in th"
                                @click.prevent="sorting(item.value)">
                                {{item.text}}
                                <r-icon v-if="sortKey===item.value"
                                        :class="{'sort-desc':!sortAsc}"
                                        class="mdi-arrow-up"></r-icon>
                            </th>
                        </slot>
                    </tr>
                    </thead>
                    <transition-group :name="transition" tag="tbody">
                        <template v-for="(item,key) in lists" :key="gen_key(item)||key">
                            <template v-if="true">
                                <tr :key="`${gen_key(item)||key}- f`">
                                    <slot name="row" :item="item" :th="th" :key="key" :opened="opened" :open="open"
                                          :show="show">
                                        <td :key="`${key}- ${k}`" v-for="(value,k) in th">
                                            <div>
                                                <r-btn @click.prevent="open(key)"
                                                       icon text v-if="show(k)">
                                                    <r-icon :class="{
                                                'mdi-plus':opened!==key,
                                                'mdi-minus':opened===key,
                                            }"></r-icon>
                                                </r-btn>
                                                {{item[value.value]}}
                                            </div>
                                        </td>
                                    </slot>
                                </tr>
                                <tr class="overflow-hidden" :key="`${gen_key(item)||key}- l`" v-if="opened===key">
                                    <td class="row-hidden" :colspan="($helper.size(th)||th.length)">
                                        <div class="pa-2" v-for="(v,h) in hidden" :key="key+h">
                                            <span class="title">{{getText(h)}}: </span>
                                            <span>{{item[h]}}</span>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </template>
                    </transition-group>
                </table>
            </div>
        </div>
    </div>
    <r-modal v-model="showModal" v-if="editable">
        <r-card>
            <r-container
                    v-sortable="{
            items: cols,
            end: store_db,
            grab: '.drag-btn'
          }"
            >
                <r-row
                        v-for="(col, i) in cols"
                        :key="col.value+i"
                        class="no-gutters"
                >
                    <r-col>
                        <r-card tile class="pa-4 ma-1 d-flex h-space-between">
                <span class="title">
                  <r-btn class="drag-btn" icon text>
                    <r-icon class="mdi-drag"></r-icon>
                  </r-btn>
                  {{ col.text }}
                </span>
                            <span>
                                <r-switch :label="$t('show')" v-model="col.show"
                                          @update:model-value="store_db(cols)"></r-switch>
                </span>
                        </r-card>
                    </r-col>
                </r-row>
            </r-container>
        </r-card>
    </r-modal>
</template>

<script>
    import './style.scss'
    import Sortable from "../../directive/sortable";

    export default {
        name: 'r-table',
        directives: {
            'sortable': Sortable
        },
        props: {
            transition: {
                type: String,
                default: 'table-row'
            },
            keyItem: [String, Function],
            thin: Boolean,
            responsive: Boolean,
            editable: Boolean,
            stripped: Boolean,
            sortable: Boolean,
            sortableKey: String,
            fixedHeader: Boolean,
            fixedFirstColumn: Boolean,
            headers: Array,
            items: [Array, Object]
        },
        data() {
            return {
                showTable: true,
                opened: null,
                sortKey: null,
                sortAsc: true,
                showModal: false,
                loading: false,
                eventsHandler: null,
                hidden_col: {},
                hidden: {},
                cols: []
            }
        },
        watch: {
            items: {
                immediate: true,
                handler() {
                    setTimeout(() => {
                        this.setup()
                    }, 100)
                },
            }
        },
        computed: {
            priority() {
                let res = {}
                this.th.forEach((item) => {
                    if (this.$helper.ifHas(item, false, 'option', 'priority') !== false) {
                        res[item.value] = item['option']['priority']
                    } else {
                        res[item.value] = 0
                    }
                })

                return res
            },
            lists() {
                let res = this.items
                if (!this.$helper.isArray(this.items)) {
                    res = []
                    for (const i in this.items) {
                        if (this.$helper.hasKey(this.items, i)) {
                            res.push(this.items[i])
                        }
                    }
                }

                if (res && this.sortKey !== null) {
                    return res.sort(this.dynamicSort(this.sortKey, this.sortAsc, this.sortableKey))
                }
                return res
            },
            classes() {
                let c = 'r-table'
                if (this.thin) {
                    c += ' row-thin'
                }
                if (this.fixedHeader) {
                    c += ' table-fixed-header'
                }
                if (this.sortable) {
                    c += ' table-sortable'
                }
                if (this.fixedFirstColumn) {
                    c += ' table-fixed-first-columns'
                }
                if (this.stripped) {
                    c += ' table-stripped'
                }
                if (this.editable) {
                    c += ' table-editable'
                }
                return c
            },
            th() {
                let res = []
                let list = this.cols.length > 0 ? this.cols : this.th_all
                list.forEach((item) => {
                    if (item && !(item.value in this.hidden) && !(item.value in this.hidden_col)) {
                        res.push(item)
                    }
                })
                return res
            },
            th_all() {
                let res = []
                if (this.headers) {
                    this.headers.forEach((item) => {
                        if (item) {
                            res.push(item)
                        }
                    })
                } else {
                    for (let name in this.items[0]) {
                        if (this.$helper.hasKey(this.items[0], name)) {
                            res.push({text: name, value: name})
                        }
                    }
                }
                return res
            },
            hash_key() {
                let r = ''
                this.th_all.forEach((item) => {
                    if (item) {
                        r += item.value
                    }
                })
                return this.$helper.hash(r)
            }
        },
        methods: {
            check_hidden() {
                const d = window.storage.get('table_' + this.hash_key)
                if (d) {
                    let res = {}
                    d.forEach((item) => {
                        if (item && item.show === false) {
                            res[item.value] = true
                        }
                    })
                    this.hidden_col = res
                    this.cols = d
                }

            },
            store_db(data) {
                window.storage.set('table_' + this.hash_key, data)
                this.check_hidden()
                if (this.responsive) {
                    this.build()
                }
            },
            open_modal() {
                const d = window.storage.get('table_' + this.hash_key)
                if (d) {
                    this.cols = []
                    d.forEach((item) => {
                        if (item) {
                            this.cols.push(item)
                        }
                    })
                } else {
                    this.cols = []
                    this.th_all.forEach((item) => {
                        if (item) {
                            this.cols.push({text: item.text, value: item.value, show: true})
                        }
                    })
                }
                this.showModal = true
            },
            gen_key(item) {
                if (!this.keyItem) {
                    return false
                }
                if (typeof this.keyItem === 'string') {
                    return item[this.keyItem]
                }
                return this.keyItem(item)
            },
            open(key) {
                if (this.opened === key) {
                    this.opened = null
                } else {
                    this.opened = key
                }
            },
            show(k) {
                if (this.$helper.size(this.hidden) === 0) {
                    return false
                }
                if (this.$helper.isArray(this.th) && k === 0) {
                    return true
                }
                const l = this.$helper.keys(this.th)
                return l[0] === k;

            },
            setup() {
                if (this.editable) {
                    this.check_hidden()
                    const s = window.storage.get('table_sort')
                    if (s && this.hash_key in s) {
                        this.sortKey = s[this.hash_key][0]
                        this.sortAsc = s[this.hash_key][1]
                    }
                }
                if (this.responsive) {
                    this.build()
                }
            },
            build() {
                let el = this.$refs.table
                if (!el) {
                    return
                }
                this.opened = null
                this.hidden = {}
                setTimeout(() => {
                    let table = el.querySelector('table')
                    let all_th = table.querySelectorAll('th') || []
                    let th_w = []
                    all_th.forEach((th) => {
                        if (th) {
                            th_w.push(th.clientWidth)
                        }
                    })
                    let thn_w = {}
                    let i = 0
                    for (let name in this.priority) {
                        if (this.$helper.hasKey(this.priority, name)) {
                            thn_w[name] = th_w[i]
                            i++
                        }
                    }
                    if (el.clientWidth < table.clientWidth) {
                        const [show, hide] = this.extractor(el.clientWidth, table.clientWidth, thn_w, this.priority)
                        this.hidden = hide
                    }
                }, 10)

            },
            extractor(width, table_w, th, priority, removed = 0, hide = {}) {
                if (table_w > width + removed) {
                    const name = this.remove_one(priority)
                    hide[name] = true
                    delete priority[name]
                    return this.extractor(width, table_w, th, priority, removed + th[name], hide)
                }
                return [priority, hide]

            },
            remove_one(priority) {
                let res = []
                for (let name in priority) {
                    if (this.$helper.hasKey(priority, name)) {
                        res.push({'name': name, 'value': priority[name]})
                    }
                }
                res = res.sort((a, b) => {
                    return a['value'] - b['value']
                })
                return res[0]['name']

            },
            getText(key) {
                if (this.$helper.isArray(this.headers)) {
                    for (let i = 0; i < this.headers.length; i++) {
                        const item = this.headers[i]
                        if (item.value === key) {
                            return item.text
                        }
                    }

                } else {
                    return key
                }
            },
            sorting(name) {
                if (this.sortable) {
                    this.loading = true
                    setTimeout(() => {
                        this.loading = false
                    }, 1000)
                    if (this.sortKey === name) {
                        this.sortAsc = !this.sortAsc
                    } else {
                        this.sortKey = name
                        this.sortAsc = true
                    }
                    if (this.editable) {
                        let t = window.storage.get('table_sort')
                        if (!t) {
                            t = {}
                        }
                        t[this.hash_key] = [name, this.sortAsc]
                        window.storage.set('table_sort', t)
                    }
                }
            },
            dynamicSort(property, sortAsc, sortable_key = undefined) {
                let sortOrder = 1
                if (!sortAsc) {
                    sortOrder = -1
                }
                const that = this
                return function (a, b) {
                    let result = -1
                    if (a[property] !== undefined && b[property] !== undefined) {
                        let av = a[property]
                        let bv = b[property]
                        if (sortable_key !== undefined && av[sortable_key] !== undefined && bv[sortable_key] !== undefined) {
                            av = av[sortable_key]
                            bv = bv[sortable_key]
                        }
                        result = (av < bv) ? -1 : (av > bv) ? 1 : 0
                    } else if (a[property] === undefined && b[property] !== undefined) {
                        result = -1
                    } else if (a[property] !== undefined && b[property] === undefined) {
                        result = 1
                    }

                    return result * sortOrder
                }
            }
        }
    }
</script>
