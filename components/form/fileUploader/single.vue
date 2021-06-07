<template>
    <div class="image-card elevation-lg br-md">
        <div :key="key" class="image-canvas" v-for="(item, key) in files">
            <r-icon @click.prevent="fileDelete()" class="image-close color-error-text mdi-close display-3"></r-icon>
            <r-progress-circular
                    :indeterminate=false
                    :modelValue="uploadPercentage"
                    :width="2"
                    class="image-progress"
                    size="50"
            >
                {{ `% ${uploadPercentage}` }}
            </r-progress-circular>
            <r-btn @click.prevent="$helper.copy(fileLink)" class="image-copy" icon>
                <r-icon class="mdi-content-copy"></r-icon>
            </r-btn>
            <img :class="`image ${imageStatus} `" :src="getUrl(item)" v-if="isImg()">
            <r-icon class="mdi-file color-three-text display-2 file" v-else></r-icon>
        </div>
        <r-icon @click.prevent.stop="pickFile" class="image-icon color-three-text mdi-plus-circle-outline display-2"
                v-if="showAdd"></r-icon>
        <input :accept="accept"
               @change="addFile()"
               ref="file"
               style="display: none"
               type="file"
               v-if="showFile"
        >
    </div>
</template>

<script>
    export default {
        name: 'inputFile',
        props: {
            accept: {
                default: '*',
                type: String
            },
            uploadLink: {
                type: String,
                required: true
            },
            modelValue: {
                default: null,
                type: String
            }
        },
        data() {
            return {
                showAdd: true,
                files: [],
                uploadPercentage: 0,
                showFile: true,
                imageStatus: 'inProgress',
                CancelTokenSource: this.$axios.CancelToken.source(),
                fileLink: ''
            }
        },
        created() {
            this.setValue()
        },
        methods: {
            setValue() {
                if (this.modelValue) {
                    this.fileLink = this.modelValue
                    this.showAdd = false
                    this.files[0] = []
                    this.imageStatus = 'finished'
                    this.uploadPercentage = 100
                    this.$emit('file-link', this.modelValue)
                }
            },
            addFile() {
                this.CancelTokenSource = this.$axios.CancelToken.source()
                this.$emit('select', true)
                this.files = this.$refs.file.files
                this.saveImage()
                this.showAdd = false
            },
            pickFile() {
                this.$refs.file.click()
            },
            fileDelete() {
                this.CancelTokenSource.cancel()
                this.deleteImage()
                this.showFile = false
                this.$nextTick(() => {
                    this.showFile = true
                })
                this.files = []
                this.uploadPercentage = 0
                this.showAdd = true
                this.$emit('delete', true)
                this.$emit('file-link', null)
            },
            getUrl(value) {
                if (this.modelValue) {
                    return (process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_production_URL : process.env.VUE_APP_API_URL) + '/' + this.modelValue
                } else {
                    return URL.createObjectURL(value)
                }
            },
            isImg() {
                let image = this.accept.split('/')
                return image[0] === 'image'
            },
            deleteImage() {
                this.$axios.delete(this.uploadLink,
                    {
                        data: {link: this.fileLink}
                    }
                )
            },
            saveImage() {
                this.imageStatus = 'inProgress'
                let fileData = new FormData()
                fileData.append('file', this.files[0])
                this.$axios.post(this.uploadLink, fileData,
                    {
                        headers: {'Content-Type': 'multipart/form-data'},
                        onUploadProgress: function (progressEvent) {
                            this.uploadPercentage = Math.min(parseInt(Math.floor((progressEvent.loaded * 100) / progressEvent.total)), 98)
                        }.bind(this),
                        cancelToken: this.CancelTokenSource.token
                    }
                )
                    .then((res) => {
                        this.fileLink = res.data.link
                        this.uploadPercentage = 100
                        this.$emit('file-link', res.data.link)
                        this.imageStatus = 'finished'
                    }, () => {
                        this.imageStatus = 'fails'
                        this.uploadPercentage = 0
                    })
            }

        }
    }
</script>

<style lang="scss">
    @import "../../../style/include";

    .image-card {
        position: relative;
        width: auto;
        min-width: 150px;
        height: 200px;
        overflow: hidden;
        @include dark() {
            background-color: #3a3e3a;
        }
        @include light() {
            background-color: white;
        }

        .fails {
            -webkit-filter: grayscale(100%);
            filter: grayscale(100%);
        }

        .inProgress {
            -webkit-filter: blur(2px);
            filter: blur(2px);
        }

        .finished {
            -webkit-filter: blur(0px);
            filter: blur(0px);
        }

        .file {
            left: 0;
            right: 0;
            position: absolute;
            top: 0;
            bottom: 0;
        }

        .image {
            width: auto;
            min-width: 150px;
            height: 200px;
            z-index: -2;
            opacity: 0.8;
        }

        .image-icon {
            top: 70px;
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            position: absolute;
            cursor: pointer;
        }

        .image-canvas {
            width: auto;
            min-width: 150px;
            height: 200px;
            position: relative;
            background-image: linear-gradient(to top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
        }

        .image-close {
            cursor: pointer;
            position: absolute;
            left: 5px;
            top: 5px;
            z-index: 1;
        }

        .image-progress {
            z-index: 1;
            position: absolute;
            right: 5px;
            top: 5px;
            color: white;
        }

        .image-copy {
            z-index: 1;
            position: absolute;
            left: 5px;
            bottom: 5px;
        }
    }
</style>
