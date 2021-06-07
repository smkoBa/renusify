<template>
    <div class="block_content array">
        <ol class="array-ol">
            <li :class="['array-item', {'hide-item': hideMyItem[index] === true}]" :key="index"
                v-for="(member, index) in flowData">
                <div v-if="member.type !== 'object' && member.type !== 'array'">
                    <input class="val-input" placeholder="string" type="text"
                           v-if="member.type === 'string'" v-model="flowData[index].remark">
                    <input class="val-input" placeholder="number" type="number"
                           v-if="member.type === 'number'" v-model.number="flowData[index].remark">
                    <select class="val-input" name="value" v-if="member.type === 'boolean'"
                            v-model="flowData[index].remark">
                        <option :value="true">true</option>
                        <option :value="false">false</option>
                    </select>
                </div>
                <div v-else>
                    <span :class="['json-key', 'json-desc']">{{flowData[index].type.toUpperCase()}}
                        <i @click.prevent="closeBlock(index, $event)" class="collapse-down"
                           v-if="member.type === 'object' || member.type === 'array'">
                            <r-icon class="mdi-chevron-down"></r-icon>
                        </i>
                        <i v-if="member.type === 'object'">{{'{' + flowData[index].childParams.length + '}'}}</i>
                        <i v-if="member.type === 'array'">{{'[' + flowData[index].childParams.length + ']'}}</i>
                    </span>

                    <span class="json-val">
                        <template v-if="member.type === 'array'">
                            <r-array-view :keyEditable=keyEditable
                                        :parsedData="flowData[index].childParams"
                                        v-model="flowData[index].childParams"></r-array-view>
                        </template>

                        <template v-if="member.type === 'object'">
                           <r-json-view :keyEditable=keyEditable
                                       :parsedData="flowData[index].childParams"
                                       v-model="flowData[index].childParams"></r-json-view>
                        </template>
                    </span>
                </div>

                <i @click.prevent="delItem(parsedData, member, index)" class="del-btn">
                    <r-icon class="mdi-delete color-error-text"></r-icon>
                </i>
            </li>
        </ol>

        <item-add-form :needName="false" @cancel="cancelNewItem" @confirm="newItem" v-if="toAddItem"></item-add-form>

        <div @click.prevent="addItem" class="block add-key" v-if="!toAddItem">
            <r-icon class="mdi-plus"></r-icon>
        </div>
    </div>
</template>

<script>
    import ItemAddForm from './ItemAddForm.vue'

    export default {
        name: 'ArrayView',
        components: {
            ItemAddForm
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
                'hideMyItem': {}
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
                this.flowData = this.flowData.splice(index, 1)
                if (this.hideMyItem[index]) this.hideMyItem[index] = false
                this.$emit('update:modelValue', this.flowData)
            },

            'addItem': function () {
                this.toAddItem = true
            },

            'cancelNewItem': function () {
                this.toAddItem = false
            },

            'closeBlock': function (index, e) {
                this.hideMyBlock[index]=!this.hideMyBlock[index]
            },

            'newItem': function (obj) {
                this.toAddItem = false

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

                this.flowData.push(oj)
                this.$emit('update:modelValue', this.flowData)
                this.cancelNewItem()
            }
        }
    }

</script>
