<template>
    <r-card class="r-table-manage">
        <r-modal bottom fullwidth v-model="showForm">
            <slot name="form" :autoSend="autoSend"
                  :method="method"
                  :options="table.option"
                  :title="title"
                  :url="url"
                  :modelValue="editedItem"
                  :ok="ok">
                <r-form-creator :autoSend="autoSend"
                                :method="method"
                                :options="table.option"
                                :title="title"
                                :url="url"
                                :modelValue="editedItem"
                                @ok="ok"
                ></r-form-creator>
            </slot>
        </r-modal>
        <div class="r-sheet r-sheet-tile">
            <r-container class="container-fluid">
                <r-row class="h-start">
                    <r-btn @click.prevent="newItem"
                           v-if="!disableAdd"
                           class="color-success-text ma-3"
                           outlined
                           rounded>{{$t('new')}}
                    </r-btn>
                    <r-col class="col-12">
                        <r-text-input :label="$t('search')" @update:modelValue="searching()"
                                      v-model="search"></r-text-input>
                    </r-col>
                </r-row>
            </r-container>
        </div>
        <r-progress-liner color="color-one" v-if="loading"></r-progress-liner>
        <r-table :responsive="responsive" transition="table-row" :headers="headerTable" :items="table.data" key-item="_id">
            <template v-slot:header="{header}">
                <th :class="{
              'header-sortable':$helper.ifHas(item, true, 'option', 'sortable')
              }"
                    :key="`th-${key}`"
                    @click.stop="sortSetup(item)"
                    v-for="(item,key) in header">
                    <r-row class="no-gutters v-end">
                        <r-col class="col-11"><span>{{item.text}}</span></r-col>
                        <r-col class="col-1">
                            <div :class="{
            'icon-hidden': !(sortBy === item.value && sortType !== 0)
            }"
                                 class="icon-holder">
                                <r-icon :class="{
            'mdi-arrow-down': (sortType === 2 && sortBy === item.value),
        'mdi-arrow-up': (sortType !== 2 || sortBy !== item.value)
            }"></r-icon>
                            </div>
                        </r-col>

                    </r-row>
                </th>
            </template>

            <template v-slot:row="props">
                <slot name="row" :table="props" :editItem="editItem" :deleteItem="deleteItem">
                    <td :key="`td-${key2}`" v-for="(value,key2) in props.th">
                        <r-btn @click.prevent="props.open(props.key)"
                               icon text v-if="props.show(key2)">
                            <r-icon :class="{
                                                'mdi-plus':props.opened!==props.key,
                                                'mdi-minus':props.opened===props.key,
                                            }"></r-icon>
                        </r-btn>
                        <div v-if="value['option']['type']==='date-picker' && props.item[value['value']]!==undefined">
                            {{$d(new Date(props.item[value['value']]),value['option']['format']||'short')}}
                        </div>
                        <div v-else-if="value['option']['type']==='time-ago' && props.item[value['value']]!==undefined">
                            <r-time-ago :time="props.item[value['value']]"></r-time-ago>
                        </div>
                        <div v-else-if="value['option']['type']==='switch'">
                            <r-switch
                                    :readonly="value['option']['formInput']===false"
                                    :modelValue="props.item[value['value']]"
                                    @update:modelValue="value['option']['formInput']!==false?editItem(props.item,true,value['value']):''"
                                    class="mt-0"
                            ></r-switch>
                        </div>
                        <div v-else-if="value['option']['type']==='action'">
                            <r-btn v-if="!disableUpdate" @click.prevent="editItem(props.item)" class="mx-0" icon text>
                                <r-icon class="color-success-text mdi-pen exact-icon"></r-icon>
                            </r-btn>
                            <r-btn v-if="!disableDelete" @click.prevent="deleteItem(props.item)" class="mx-0" icon text>
                                <r-icon class="color-error-text mdi-delete"></r-icon>
                            </r-btn>
                            <r-btn :key="index" @click.prevent="$emit(val.name,props.item)" class="mx-0" icon text
                                   v-for="(val,index) in actions">
                                <r-icon :class="`color-${val.color}-text ${val.icon}`"></r-icon>
                            </r-btn>
                        </div>
                        <div v-else-if="value['option']['type'] === 'number'">
                            {{ $n(props.item[value["value"]]) }}
                        </div>
                        <div v-else>
                            <slot name="cell" :value="value" :item="props.item">
                            {{value['value'] in cast?
                                $helper.ifHas(props.item,'',value['value'],cast[value['value']])
                                :props.item[value['value']]}}
                                </slot>
                        </div>

                    </td>
                </slot>
            </template>

        </r-table>
        <div class="manage-footer">
            <r-container class="container-fluid">
                <r-row class="v-baseline h-end">
                    <r-col class="col-auto">
                        <r-select class="per-page" open-to-top :items="[
                      {name: '10', value: 10},
                      {name: '20', value: 20},
                      {name: '50', value: 50},
                      {name: '100', value: 100},
                      {name: '200', value: 200},
              ]"
                                  @update:modelValue="refresh"
                                  v-model="itemsPerPage"></r-select>
                    </r-col>
                    <r-col class="col-auto ms-1">{{totalSetup}}</r-col>
                    <r-col class="col-auto">
                        <div class="btn-page">
                        <r-btn :disabled="page===1" @click="pageBtn('prev')" class="btn-shaped"
                               icon
                               text>
                            <r-icon class="mdi-chevron-left"></r-icon>
                        </r-btn>
                        <input type="text" v-model.number="page" @update:model-value="page>0&&refresh()" class="input-page text-center">
                        <r-btn :disabled="endPage" @click="pageBtn('next')" class="btn-shaped"
                               icon
                               text>
                            <r-icon class="mdi-chevron-right"></r-icon>
                        </r-btn>
                            </div>
                    </r-col>
                </r-row>
            </r-container>
        </div>
        <r-confirm
                hard
                v-model="showConfirm"
                v-on:accept="accept"
                v-on:cancel="showConfirm = false"
        />
    </r-card>
</template>

<script>

    export default {
        name: 'r-table-manage',
        props: {
            link: {
                required: true,
                type: String
            },
            actions: {
                default: function () {
                    return []
                },
                type: Array
            },
            cast: {
                default: function () {
                    return {}
                },
                type: Object
            },
            perPage: Object,
            query: String,
            responsive: {
                type: Boolean,
                default: true
            },
            reGet: Boolean,
            disableAdd: Boolean,
            disableDelete: Boolean,
            disableUpdate: Boolean
        },
        data() {
            return {
                time_out_id: null,
                loading: false,
                showForm: false,
                showConfirm: false,
                search: '',
                editedItem: {},
                deleted: '',
                url: '',
                method: 'post',
                title: '',
                autoSend: false,
                itemsPerPage: this.perPage||{name: '10', value: 10},
                page: 1,
                sortBy: null,
                sortType: 0,
                table: {
                    headers: [],
                    option: {},
                    data: [],
                    startTime: false,
                    total: 0
                }
            }
        },
        created() {
            this.refresh()
        },
        watch:{
            'reGet':function (newVal) {
                if(newVal){
                    this.refresh()
                }
            }
        },
        computed: {
            headerTable() {
                const headers = this.table.headers
                const res = []
                for (let i = 0; i < headers.length; i++) {
                    if (this.$helper.ifHas(headers[i], true, 'option', 'tableShow') !== false) {
                        res.push(headers[i])
                    }
                }
                return res
            },
            totalSetup() {
                let to = this.page * this.itemsPerPage.value
                const from = to - this.itemsPerPage.value
                const total = this.table.total
                if (to > total) {
                    to = total
                }
                return this.$t('from_to_manage', [from, to, total])
            },
            endPage() {
                let to = this.page * this.itemsPerPage.value
                const total = this.table.total
                if (to > total) {
                    to = total
                }

                return to === total
            }
        },
        methods: {
            sortSetup(item) {
                if (!this.$helper.ifHas(item, true, 'option', 'sortable')) {
                    return
                }
                if (this.sortBy !== item.value) {
                    this.sortType = 0
                }
                this.sortBy = item.value
                if (this.sortType >= 2) {
                    this.sortType = 0
                } else {
                    this.sortType += 1
                }
                this.refresh()
            },
            pageBtn(v) {
                if (v === 'prev') {
                    this.page -= 1
                    this.refresh()
                } else {
                    this.page += 1
                    this.refresh()
                }
            },
            ok() {
                this.refresh()
                this.autoSend = false
                this.showForm = false
            },
            refresh(e) {
                this.loading = true
                const perPage = e !== undefined ? e.value : this.itemsPerPage.value
                let params = '?page=' + this.page
                if (this.table.startTime !== false) {
                    params += '&t=' + this.table.startTime
                }
                if (this.sortType !== 0) {
                    const sort = (this.sortType === 2) ? 'desc=' : 'asc='
                    params += '&' + sort + this.sortBy
                }
                params += '&per_page=' + perPage
                if (this.search.length >= 1) {
                    params += '&search=' + this.search
                }
                if (this.query) {
                    params += '&' + this.query
                }
                this.setup('/' + this.link + params)
            },
            searching() {
                clearTimeout(this.time_out_id)
                this.time_out_id = setTimeout(() => {
                    this.page = 1
                    this.refresh()
                }, 1000)

            },
            newItem() {
                this.title = this.$t('new')
                this.url = this.link
                const items = {}
                this.table.headers.map((item) => {
                    if (item.option.formInput !== false) {
                        if (item.option.type === 'boolean') {
                            items[item.value] = false
                        } else {
                            items[item.value] = null
                        }
                    }
                })
                this.editedItem = items
                this.method = 'post'
                this.autoSend = false
                this.showForm = true
            },
            editItem(item, autoSend = false, key = null) {
                let sw
                this.title = this.$t('edit')
                this.url = this.link + '/' + item._id
                if (key) {
                    sw = !item[key]
                }
                const items = {}
                this.table.headers.map((header) => {
                    if (header.option.formInput !== false) {
                        if (header.option.type === 'boolean') {
                            items[header.value] = item[header.value] !== undefined ? item[header.value] : false
                        } else {
                            items[header.value] = item[header.value] !== undefined ? item[header.value] : null
                        }
                    }
                })
                this.editedItem = Object.assign({}, items)

                if (key) {
                    this.editedItem[key] = sw
                }
                this.method = 'put'
                this.autoSend = autoSend
                this.showForm = true
            },
            deleteItem(item) {
                this.showConfirm = true
                this.deleted = item._id
            },
            delete(_id) {
                this.$axios.delete(this.link + '/' + _id)
                    .then((res) => {
                        this.refresh()
                    })
            },
            accept() {
                this.showConfirm = false
                this.delete(this.deleted)
                this.deleted = ''
                this.refresh()
            },
            setup(url) {
                this.loading = true

                this.$axios.get(url).then((res) => {
                    this.table.headers = res.data.headers.map((item) => {
                        this.table.option[item.value] = item.option
                        item.text = this.$t(item.value)
                        return item
                    })
                    this.table.data = res.data.data
                    this.table.total = res.data.total
                    this.table.startTime = this.$helper.ifHas(res, false, 'data', 't')
                    this.loading = false
                })
            }
        }
    }
</script>
