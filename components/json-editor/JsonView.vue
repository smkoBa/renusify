<template>
    <div class="block_content">
        <span :class="['block', 'clearfix', {'hide-block': hideMyBlock[index] == true}]" :key="index"
              v-for="(item, index) in flowData">
            <span class="json-key">
                <input @blur="keyInputBlur(item, $event)" class="key-input" :readonly="!keyEditable" type="text"
                       v-if="typeof item.name == 'string' " v-model="item.name">

                <i @click.prevent="closeBlock(index, $event)" class="collapse-down"
                   v-if="item.type == 'object' || item.type == 'array'">
                  <r-icon class="mdi-chevron-down"></r-icon>
                </i>
                <i @click.prevent="delItem(flowData, item, index)" class="del-btn">
                  <r-icon class="mdi-delete color-error-text"></r-icon>
                </i>
                <i class="i-type" v-if="item.type == 'object'">{{'{' + item.childParams.length + '}'}}</i>
                <i class="i-type" v-if="item.type == 'array'">{{'[' + item.childParams.length + ']'}}</i>
            </span>
            <span class="json-val">
                <template v-if="item.type == 'object'">
                    <r-json-view :keyEditable=keyEditable :parsedData="item.childParams"
                               v-model="item.childParams"></r-json-view>
                </template>

                <template v-else-if="item.type == 'array'">
                    <r-array-view :keyEditable=keyEditable :parsedData="item.childParams"
                                v-model="item.childParams"></r-array-view>
                </template>

                <template v-else>
                    <span class="val">
                        <input class="val-input" type="text" v-if="item.type == 'string'" v-model="item.remark">
                        <input class="val-input" type="number" v-if="item.type == 'number'"
                               v-model.number="item.remark">
                        <select class="val-input" name="value" v-if="item.type == 'boolean'" v-model="item.remark">
                            <option :value="true">true</option>
                            <option :value="false">false</option>
                        </select>
                    </span>
                </template>
            </span>
        </span>

        <item-add-form @cancel="cancelNewItem" @confirm="newItem" v-if="toAddItem"></item-add-form>

        <r-btn @click.prevent="toAddItem = true" icon v-if="!toAddItem">
            <r-icon class="mdi-plus"></r-icon>
        </r-btn>

    </div>
</template>

<script>
    import ItemAddForm from './ItemAddForm.vue'

    export default {
        name: 'JsonView',
        components: {
            'item-add-form': ItemAddForm
        },
        props: {
            'parsedData': {},
            'keyEditable': {
                default: false,
                type: Boolean
            }

        },
        data: function () {
            return {
                'flowData': this.parsedData,
                'toAddItem': false,
                'hideMyBlock': {}
            }
        },

        watch: {
            flowData: {
                handler(newval, oldVal) {
                    this.$emit('update:modelValue', this.flowData)
                },
                deep: true
            }
        },

        methods: {
            'delItem': function (parentDom, item, index) {
                this.flowData.splice(index, 1)
                if (this.hideMyBlock[index]) this.hideMyBlock[index] = false
                this.$emit('update:modelValue', this.flowData)
            },

            'closeBlock': function (index, e) {
                this.hideMyBlock[index] = !this.hideMyBlock[index]
            },

            'addItem': function () {
                this.toAddItem = true
            },

            'cancelNewItem': function () {
                this.toAddItem = false
            },

            'newItem': function (obj) {
                let oj = {
                    'name': obj.key,
                    'type': obj.type
                }
                if (obj.type === 'array' || obj.type === 'object') {
                    oj.childParams = obj.val
                    oj.remark = null
                } else {
                    oj.childParams = null
                    oj.remark = obj.val
                }

                if (!oj.name) {
                    alert('please must input a name!')
                } else {
                    this.flowData.push(oj)
                    this.$emit('update:modelValue', this.flowData)
                    this.cancelNewItem()
                }
            },

            'keyInputBlur': function (item, e) {
                if (item.name.length <= 0) {
                    alert('please must input a name!')
                    item.name = 'null'
                    e.target.focus()
                    // return 1
                }
                console.debug(item)
                console.debug(e)
            }
        }
    }

</script>
