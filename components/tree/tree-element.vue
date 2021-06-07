<template>
    <r-container v-if="show" fullwidth class="r-tree-element px-0" ref="tree">
        <r-row class="h-center flex-nowrap no-gutters">
            <r-col v-if="node[nodeKey]['type']==='select'" class="text-center">
                <div class="d-flex h-center mb-1">
                    <r-card
                            class="d-flex h-center v-center"
                            :class="{
                                'node-selected':selected===nodeKey
                            }"
                            @click.prevent="handleSelect(nodeKey,true)">
                        <r-icon class="mdi-plus display-1 color-one-text"></r-icon>
                    </r-card>
                </div>
            </r-col>
            <r-col v-else class="text-center">
                <div class="d-flex h-center mb-1 node-info">
                    <r-card @click.prevent="back=!back"
                            class="mx-4 br-sm" flat>
                        <transition name="rotate-y" mode="out-in">
                            <r-container v-if="back"
                                         class="node text-left pl-3"
                                         :class="{
                        'parent-node':nodeKey===parentNode,
                        'default-node':node[nodeKey]['state']===0&nodeKey!==parentNode,
                        'actived-node':node[nodeKey]['active']&node[nodeKey]['state']===1,
                        'disabled-node':!node[nodeKey]['active'],
                    }">
                                <r-row class="mt-7">
                                    <r-col class="py-0">
                                        gen: {{node[nodeKey]['gen']}}
                                    </r-col>
                                </r-row>
                                <r-row>
                                    <r-col>
                                        {{node[nodeKey]['label']['name']}}
                                    </r-col>
                                </r-row>

                                <r-img v-if="node[nodeKey]['label']['image']"
                                       class="node-img"
                                       :src="'/'+node[nodeKey]['label']['image']"
                                       width="80"
                                       height="80"
                                       alt="label"></r-img>

                            </r-container>
                            <r-container v-else
                                         class="py-2 node"
                                         :class="{
                        'parent-node':nodeKey===parentNode,
                        'default-node':node[nodeKey]['state']===0&nodeKey!==parentNode,
                        'actived-node':node[nodeKey]['active']&node[nodeKey]['state']===1,
                        'disabled-node':!node[nodeKey]['active'],
                    }">
                                <div class=" name-div">{{node[nodeKey].user.name}}</div>
                                <r-row v-if="node[nodeKey]['rp']!==undefined"
                                       class="no-gutters py-2">
                                    <r-col>
                                        <span>R: </span>
                                        <span>{{$n((node[nodeKey]['rp']/1000000).toFixed(2))}}</span>
                                    </r-col>
                                    <r-col>
                                        <span>L: </span>
                                        <span>{{$n((node[nodeKey]['lp']/1000000).toFixed(2))}}</span>
                                    </r-col>
                                </r-row>
                                <r-row v-else-if="node[nodeKey]['tp']!==undefined"
                                       class="no-gutters py-2">
                                    <r-col>
                                        <span>T: </span>
                                        <span>{{$n((node[nodeKey]['tp']/1000000).toFixed(2))}}</span>
                                    </r-col>
                                </r-row>
                                <r-row v-if="node[nodeKey]['rs']!==undefined" class="no-gutters">
                                    <r-col class="col-6">
                                        <span>RS: </span>
                                        <span>{{$n((node[nodeKey]['rs']/1000000).toFixed(2))}}</span>
                                    </r-col>
                                    <r-col class="col-6">
                                        <span>LS: </span>
                                        <span>{{$n((node[nodeKey]['ls']/1000000).toFixed(2))}}</span>
                                    </r-col>
                                </r-row>
                            </r-container>
                        </transition>
                    </r-card>
                </div>
                <span v-if="size>0||(link &&(node[nodeKey]['childs_total']>0||node[nodeKey]['state']===0))"
                      class="btn-extend"
                      :class="{'btn-open':open,'single-child':size===1}">
                <r-btn class="tree-btn-expand"
                       icon
                       :loading="loading"
                       labelClass="color-one"
                       :label="node[nodeKey]['childs_total']"
                       @click.prevent="handleExpand(nodeKey,true)">
                    <r-icon :class="{'mdi-plus':!open,'mdi-minus':open}"></r-icon>
                </r-btn>
                    </span>
            </r-col>
        </r-row>
        <r-row class="h-center flex-nowrap childs-container no-gutters" :class="{'childs-show':open}">
            <r-col class="text-center childLevel mt-6" :class="{'single-child':size===1}" v-for="(child,k) in childs"
                   :key="k">
                <r-tree-element @update:model-value="updateNode($event,child['gen'])"
                                :link="link"
                                :model-value="{[child['gen']]:child}" @select-node="handleSelect" @expand="handleExpand"
                                :selected="selected"
                                :expand="expand"></r-tree-element>
            </r-col>
        </r-row>
    </r-container>
</template>
<script>

    export default {
        name: 'r-tree-element',
        props: {
            modelValue: Object,
            link: String,
            parentNode: String,
            selected: undefined,
            sortBy: {
                type: String,
                default: 'position'
            },
            expand: {
                type: Boolean,
                default: false
            },
            childsName: {
                type: String,
                default: 'childs'
            },
        },
        data() {
            return {
                back: false,
                show: false,
                loading: false,
                open: this.expand,
            }
        },
        created() {
            if (this.modelValue) {
                this.show = true
            }
        },
        computed: {
            node() {
                return this.modelValue
            },
            size() {
                return this.childs.length
            },
            childs() {
                let res = []
                if (!this.node || !(this.nodeKey in this.node) || !(this.childsName in this.node[this.nodeKey])) {
                    return res
                }
                const childs = this.node[this.nodeKey][this.childsName]

                let s = []
                for (const key in childs) {
                    if (this.$helper.hasKey(childs, key)) {
                        s.push({
                            'key': key,
                            'value': childs[key]
                        })
                    }
                }
                const sortBy = this.sortBy
                s.sort(function (a, b) {
                    return a['value'][sortBy].localeCompare(b['value'][sortBy]);
                });
                for (let i = 0; i < s.length; i++) {

                    res.push( s[i]['value'])
                }
                return res
            },
            nodeKey() {
                const keys = Object.keys(this.node)
                if (keys) {
                    return keys[0]
                }
                return false
            }
        },
        methods: {
            updateNode(e, key) {
                let res = Object.assign({}, this.modelValue)
                res[this.nodeKey][this.childsName][key] = e[key]
                this.$emit('update:model-value', this.modelValue)
            },
            handleExpand(e, current) {
                if (current) {
                    if (this.link && this.size === 0) {
                        this.loading = true
                        this.$axios.get(this.link + e)
                            .then(({data}) => {
                                this.$emit('update:model-value', data)
                                this.open = !this.open
                                setTimeout(() => {
                                    this.$emit('expand', [this.open, this.$refs.tree.$el])
                                }, 220)
                                this.loading = false
                            }, () => {
                                this.loading = false
                            })
                    } else {
                        this.open = !this.open
                        setTimeout(() => {
                            this.$emit('expand', [this.open, this.$refs.tree.$el])
                        }, 250)
                    }

                } else {
                    this.$emit('expand', e)
                }
            },
            handleSelect(e, current) {
                if (current) {
                    if (this.selected === this.nodeKey) {
                        e = undefined
                    }
                }
                this.$emit('select-node', e)
            }
        }
    }
</script>
<style lang="scss">
    @import "../../style/include";

    $distance: 20px;
    .#{$prefix}tree-element {
        direction: ltr;
        position: relative;
        display: table;

        .node {
            width: 100%;
            height: 100%;
            position: relative;
        }
        .node-img{
            position: absolute;
            top:-20px;
            right: -20px;
            img{
             border-radius: 5px ;
            }
        }

        .parent-node {
            background-color: #f50456;
            color: white;
        }

        .default-node {
            background-color: #2196f3;
            color: white;
        }

        .actived-node {
            background-color: #0b8e6b;
            color: white;
        }

        .disabled-node {
            background-color: #444444;
            color: white;
        }

        .#{$prefix}card {
            cursor: pointer;
            width: 150px;
            height: 110px;
            .name-div{
                max-height: 40px;height:40px;
                overflow: hidden;
                font-size: medium;
                line-height: 20px;
            }
        }

        .node-info {
            user-select: none;
            @include rtl() {
                direction: rtl;
            }
            @include ltr() {
                direction: ltr;
            }
        }

        .node-selected {
            border: 1px solid #0b8e6b;
        }

        .btn-extend {
            position: relative;
            height: 40px;

            &::after {
                transition: .2s all ease-in-out;
                content: "";
                transform: translateY(-$distance*2);
                z-index: -1;
                max-height: 0;
                position: absolute;
                left: 50%;
                right: 50%;
                border-left: 2px solid #ccc;
            }

            &.btn-open.single-child::after {
                transition: .2s all ease-in-out;
                bottom: -$distance*2 - 10px;
                height: $distance*2;
                max-height: $distance*2;
                transform: translateY(0);
            }

            &.btn-open:not(.single-child)::after {
                transition: .2s all ease-in-out;
                bottom: -$distance - 12px;
                height: $distance;
                max-height: $distance;
                transform: translateY(0);
            }
        }

        .childLevel {
            position: relative;

            &:not(.single-child) {
                &::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: $distance;
                    border-top: 2px solid #ccc;
                }

                &:not(:first-child):not(:last-child)::after {
                    content: "";
                    position: absolute;
                    left: 50%;
                    right: 50%;
                    top: $distance - 8px;
                    height: $distance;
                    border-left: 2px solid #ccc;
                }

                &:first-child::before {
                    content: "";
                    position: absolute;
                    left: 50%;
                    right: 0;
                    width: 50%;
                    border-radius: 8px 0 0 0;
                    border-top: 2px solid #ccc;
                    border-left: 2px solid #ccc;
                }

                &:last-child::before {
                    content: "";
                    position: absolute;
                    right: 50%;
                    left: 0;
                    width: 50%;
                    border-radius: 0 8px 0 0;
                    border-top: 2px solid #ccc;
                    border-right: 2px solid #ccc;
                }
            }
        }

        .childs-container {
            max-width: 0;
            max-height: 0;
            transform: translateY(-30px);
            opacity: .4;
            overflow: hidden;
            transition: 0.2s all ease-in-out;

            &.childs-show {
                opacity: 1;
                max-width: 1000000000vw;
                max-height: 1000000000vh;
                transform: translateY(0);
            }
        }
    }
</style>