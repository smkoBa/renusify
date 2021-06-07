<template>
    <r-input
            v-bind="$attrs"
            :model-value="modelValue"
            hide>

    </r-input>
    <r-container class="r-text-editor container-fluid">
        <r-row class="editor-header h-center">
            <r-col class="col-auto">
                <r-btn-group @update:modelValue="handle_dir" :items="['mdi-format-align-left',
            'mdi-format-align-center',
            'mdi-format-align-right'
            ]"></r-btn-group>
            </r-col>
            <r-col class="col-auto">
                <r-btn-group @update:modelValue="addCss" @open="handleOpen" is-select exact :items="menu">
                    <template v-slot:list="{item}">
                        <div class="list-title pa-2"
                             :class="[ 'color-white-text', 'color-transparent-text', 'color-transparent'].includes(item['name'])?'':item['name']"
                             >{{item['name']}}</div>
                    </template>
                </r-btn-group>
            </r-col>
            <r-col class="col-auto">
                <r-btn-group exact @update:modelValue="format($event)"
                             :items="{
                    'insertOrderedList':'mdi-format-list-numbered',
                    'insertUnorderedList':'mdi-format-list-bulleted-square',
            'subscript':'mdi-format-subscript',
            'superscript':'mdi-format-superscript',
            'bold':'mdi-format-bold',
            'italic':'mdi-format-italic',
            'strikeThrough':'mdi-format-strikethrough',
            'underline':'mdi-format-underline',
            'insertHorizontalRule':'mdi-color-helper',
            'removeFormat':'mdi-format-clear'}"></r-btn-group>
            </r-col>

            <r-col class="col-auto">
                <r-btn-group @update:modelValue="handle($event)"
                             :items="{
                    'DIV':'mdi-format-paragraph',
                    'BLOCKQUOTE':'mdi-format-quote-close',
                    'PRE':'mdi-xml',
                'insertImage':'mdi-image',
                'createLink':'mdi-link',
            }"></r-btn-group>
            </r-col>
            <r-col class="col-auto">
                <r-btn-group @update:modelValue="format($event)" :items="{
                'undo':'mdi-undo',
                'redo':'mdi-redo',
            }"></r-btn-group>
            </r-col>
        </r-row>
        <r-row>
            <r-col class="col-12">
                <div :ref="'editorContent'+id" class="editor-content" contenteditable="true"
                     @input="updateText()" v-html="text">
                </div>
            </r-col>
        </r-row>
        <r-modal :closable="false"
                 :closebtn="false"
                 v-model="show">
            <r-form v-model="valid1">
                <r-container class="r-sheet">
                    <r-row>
                        <r-col class="col-12 ltr">
                            <r-text-input v-model="link"
                                          :label="t('link')"
                                          :rules="['required']"></r-text-input>
                        </r-col>
                        <r-col class="col-12">
                            <r-switch :label="$t('open_new_tab')"
                                      v-model="target"></r-switch>
                        </r-col>
                    </r-row>
                    <r-row class="h-end">
                        <r-col class="col-auto">
                            <r-btn class="color-error-text"
                                   outlined
                                   @click.prevent="show=false">{{$t('cancel')}}</r-btn>
                        </r-col>
                        <r-col class="col-auto">
                            <r-btn class="color-success-text"
                                   :disabled="!valid1"
                                   outlined
                                   @click.prevent="handleForm()">{{$t('send')}}</r-btn>
                        </r-col>
                    </r-row>
                </r-container>
            </r-form>
        </r-modal>
        <r-modal :closable="false"
                 :closebtn="false"
                 v-model="showImg">
            <r-form v-model="valid2">
                <r-container class="r-sheet">
                    <r-file-uploader v-model="image"
                                     :label="$t('image')"
                                     :size="1"
                                     :upload-link="uploadLink"
                                     accept="image/*"></r-file-uploader>
                    <r-text-input v-model="img_alt"
                                  :label="$t('img_alt')"
                                  :rules="['required']"></r-text-input>
                    <r-row class="h-end">
                        <r-col class="col-auto">
                            <r-btn class="color-error-text"
                                   outlined
                                   @click.prevent="showImg=false">{{$t('cancel')}}</r-btn>
                        </r-col>
                        <r-col class="col-auto">
                            <r-btn class="color-success-text"
                                   :disabled="!valid2"
                                   outlined
                                   @click.prevent="handleImageForm()">{{$t('send')}}</r-btn>
                        </r-col>
                    </r-row>
                </r-container>
            </r-form>
        </r-modal>
    </r-container>
</template>

<script>
    import './style.scss'
    export default {
        name: 'r-text-editor',
        inheritAttrs: false,
        props: {
            uploadLink: {type: String, default: '/storage'},
            modelValue: {type: String, default: ''}
        },
        data() {
            return {
                id: Math.random(),
                text: this.modelValue,
                valid1: false,
                valid2: false,
                show: false,
                showImg: false,
                image: [],
                img_alt: null,
                target: false,
                link: null,
                preSelected: null,
                menu: {
                    'font': {
                        icon: 'mdi-format-annotation-plus',
                        items: ['display-1', 'display-2', 'display-3', 'display-4', 'headline', 'title', 'subtitle-1', 'subtitle-2', 'body-2', 'body-1', 'caption', 'overline']
                    },
                    'header': {icon: 'mdi-format-header-pound', items: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']},
                    'color': {
                        icon: 'mdi-format-color-fill',
                        items: ['color-primary-text', 'color-secondary-text', 'color-disabled-text', 'color-one-text', 'color-two-text', 'color-three-text', 'color-error-text', 'color-info-text', 'color-warning-text', 'color-success-text', 'color-black-text', 'color-white-text', 'color-transparent-text']
                    },
                    'background': {
                        icon: 'mdi-format-paint',
                        items: ['color-one', 'color-two', 'color-three', 'color-error', 'color-info', 'color-warning', 'color-success', 'color-black', 'color-white', 'color-transparent']
                    }
                }
            }
        },
        mounted() {
            /* document.execCommand('enableObjectResizing', false, true);
            document.execCommand('enableInlineTableEditing', false, true);
            document.execCommand('enableAbsolutePositionEditor', false, true) */

            this.format('defaultParagraphSeparator', 'div')
            this.element.addEventListener('paste', function (e) {
                e.preventDefault()
                var text = (e.originalEvent || e).clipboardData.getData('text/plain')

                document.execCommand('insertHTML', false, text)
            })
        },
        beforeUnmount() {
            this.element.removeEventListener('paste', () => {
            })
        },
        computed: {
            element() {
                return this.$refs['editorContent' + this.id]
            }

        },
        methods: {
            handleImageForm() {
                if (!this.getSelection() || !this.image || !this.img_alt) {
                    this.$toast(this.$t('invalid_data'), {type: 'error'})
                    return
                }
                let sel = this.getSelection()
                sel.removeAllRanges()
                sel.addRange(this.preSelected)
                let url = '<img src="/' + this.image[0] + '" alt="' + this.img_alt + '"/>'

                document.execCommand('insertHTML', true, url)
                this.showImg = false
            },
            handleForm() {
                if (!this.getSelection() || !this.link) {
                    this.$toast(this.$t('invalid_data'), {type: 'error'})
                    return
                }
                let sel = this.getSelection()
                sel.removeAllRanges()
                sel.addRange(this.preSelected)
                let url = '<a href="' + this.link.trim() + '"'
                if (this.target) {
                    url += 'target="_blank"'
                }
                url += '>' + sel + '</a>'

                document.execCommand('insertHTML', true, url)
                this.show = false
            },
            getSelection() {
                if (window.getSelection) {
                    return window.getSelection()
                }
                return false
            },
            handleOpen(e) {
                if (e === true) {
                    let sel = window.getSelection()
                    if (sel.rangeCount > 0) {
                        this.preSelected = sel.getRangeAt(0)
                    }
                }
            },
            addCss(e) {
                let btn = e['menu']
                e = e['item'].value
                if (!this.getSelection()) {
                    return
                }
                let sel = this.getSelection()
                sel.removeAllRanges()
                sel.addRange(this.preSelected)
                if (btn === 'header') {
                    document.execCommand('insertHTML', true, '<' + e.trim() + '>' + sel + '</' + e.trim() + '>')
                    return null
                }
                let selectedElement = sel.focusNode.parentNode
                if (selectedElement.tagName === 'SPAN' && selectedElement.innerText === sel.toString()) {
                    let cls = selectedElement.classList.value.split(' ')
                    for (let c of cls) {
                        if (this.menu[btn]['items'].includes(c.trim())) {
                            selectedElement.classList.remove(c.trim())
                        }
                    }

                    selectedElement.classList.add(e)
                } else {
                    let cls = ''
                    if (selectedElement.tagName === 'SPAN') {
                        cls = selectedElement.classList.value
                    }
                    e = cls + ' ' + e

                    document.execCommand('insertHTML', true, "<span class='" + e.trim() + "'>" + sel + '</span>')
                }
            },
            handle(e) {
                let selectedElement = window.getSelection().focusNode.parentNode
                if (selectedElement.tagName === e) {
                    this.format('formatBlock', '<div>')
                } else {
                    if (e === 'createLink') {
                        this.link = null
                        this.target = false
                        this.handleOpen(true)
                        this.show = true
                    } else if (e === 'insertImage') {
                        this.image = []
                        this.img_alt = null
                        this.handleOpen(true)
                        this.showImg = true
                    } else {
                        this.format('formatBlock', e)
                    }
                }
            },
            handle_dir(e) {
                let name = ''
                switch (e) {
                    case 0:
                        name = 'text-start'
                        break
                    case 1:
                        name = 'text-center'
                        break
                    case 2:
                        name = 'text-end'
                        break
                }
                let selectedElement = window.getSelection().focusNode
                if (selectedElement === null) {
                    return null
                }
                selectedElement = selectedElement.parentNode
                selectedElement.classList.remove('text-start', 'text-center', 'text-end')
                selectedElement.classList.add(name)
                this.updateText()
            },
            updateText() {

                this.$emit('update:modelValue', this.element.innerHTML)
            },
            format(command, value) {
                if (command === 'removeFormat') {
                    document.execCommand('insertHTML', true, '<div>' + this.getSelection().toString() + '</div>')
                } else {
                    document.execCommand(command, false, value)
                }
            },
        }
    }
</script>
