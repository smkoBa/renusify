<template>
    <r-input :model-value="numLinks" hide labelControlClass="label-active">
        <r-row>
            <div :key="n" class="ma-1" v-for="n in size">
                <single :accept="accept"
                        :uploadLink="uploadLink"
                        :modelValue="filesLinks?filesLinks[n-1]:null"
                        @delete="numberSelect--"
                        @file-link="setLink(n,$event)"
                        @select="numberSelect++"
                        v-if="canShow(n)"
                ></single>
            </div>
        </r-row>
    </r-input>
</template>

<script>
    import single from './single'

    export default {
        name: 'r-file-uploader',
        props: {
            uploadLink: {
                type: String,
                required: true
            },
            accept: {
                default: '*',
                type: String
            },
            size: {
                default: 3,
                type: Number
            },
            modelValue: {
                default: () => {
                    return []
                },
                type: Array
            }
        },
        components: {
            single
        },
        data() {
            return {
                showAdd: true,
                files: [],
                numberSelect: 0,
                filesLinks: [],
                numLinks: null
            }
        },
        created() {
            this.$emit('update:modelValue', [])
            this.setValue()
        },
        methods: {
            setValue() {
                if (this.modelValue) {
                    this.filesLinks = this.modelValue
                    if (this.filesLinks.length > 0) {
                        this.numLinks = this.filesLinks.length
                        this.numberSelect = this.filesLinks.length
                    }
                }
            },
            setLink(n, $event) {
                this.filesLinks[n - 1] = $event
                let clean = this.$helper.cleanArray(this.filesLinks)
                this.numLinks = clean.length > 0 ? clean : null
                this.$emit('update:modelValue', clean)
            },
            canShow(n) {
                return n <= this.numberSelect + 1
            },
            addFile() {
                this.files = this.$refs.file.files
                this.showAdd = false
            },
            pickFile() {
                this.$refs.file.click()
            },
            fileDelete() {
                this.files = []
                this.showAdd = true
            },
            url(value) {
                return URL.createObjectURL(value)
            },
            isImg(type) {
                let image = type.split('/')
                return image[0] === 'image'
            }

        }
    }
</script>

<style scoped>
    .image {
        max-width: 400px;
    }

    .image-canvas {
        position: relative;
        border-radius: 10px;
    }

    .image-close {
        position: absolute;
    }
</style>
