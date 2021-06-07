<template>
    <div :class="`r-avatar ${!flat?'elevation-'+elevation:''} ${tile?'avatar-tile':''}`"
         :style="`height:${size}px;width:${size}px;`">
        <div class="avatar-content" :key="k">
            <slot></slot>
        </div>
        <r-btn :loading="loading" v-if="editable" @click.prevent.stop="pickFile" icon class="avatar-edit color-one">
            <r-icon class="mdi-camera"></r-icon>
        </r-btn>
        <input v-if="editable" accept="image/*"
               @change="addFile()"
               ref="file"
               style="display: none"
               type="file"
        >
    </div>
</template>

<script>
    import './style.scss'

    export default {
        name: 'r-avatar',
        props: {
            size: {
                type: [Number, String],
                default: 48
            },
            elevation: {
                type: String,
                default: 'none'
            },
            editable: {
                type: String
            },
            flat: Boolean,
            tile: Boolean
        },
        data() {
            return {
                k:0,
                files: [],
                loading: false
            }
        },
        methods: {
            addFile() {
                this.CancelTokenSource = this.$axios.CancelToken.source()
                this.files = this.$refs.file.files
                this.saveImage()
            },
            pickFile() {
                this.$refs.file.click()
            },
            saveImage() {
                this.loading = true
                let fileData = new FormData()
                fileData.append('file', this.files[0])
                this.$axios.post(this.editable, fileData,
                    {
                        headers: {'Content-Type': 'multipart/form-data'},
                        onUploadProgress: function (progressEvent) {
                            this.uploadPercentage = Math.min(parseInt(Math.floor((progressEvent.loaded * 100) / progressEvent.total)), 98)
                        }.bind(this),
                        cancelToken: this.CancelTokenSource.token
                    }
                )
                    .then(() => {
                        this.loading = false
                        this.k+=1
                    }, () => {
                        this.loading = false
                    })
            }

        }

    }
</script>
