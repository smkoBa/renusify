<template>
    <div class="r-img" :class="{'img-hoverZoom':hoverZoom,'img-hoverDark':hoverDark,'img-hoverTitle':hoverTitle}" ref="rImg">
        <div v-if="hoverTitle" class="title color-white-text img-title w-full"
              :class="{
            'title-hs':titleHs,
            'title-hc':titleHc,
            'title-he':titleHe,
            'title-vs':titleVs,
            'title-vc':titleVc,
            'title-ve':titleVe
        }"
        >{{alt}}</div>
        <img v-if="load" :src="link" :alt="alt" draggable="false" v-bind="attr"/>
    </div>
</template>
<script>
    export default {
        name: 'r-img',
        props: {
            src: {
                type: String,
                required: true
            },
            alt: {
                type: String,
                required: true
            },
            width: {
                type: [String, Number]
            },
            height: {
                type: [String, Number]
            },
            query: String,
            autoSize: Boolean,
            hoverZoom: Boolean,
            hoverDark: Boolean,
            hoverTitle: Boolean,
            titleHs: Boolean,
            titleHc: Boolean,
            titleHe: Boolean,
            titleVs: Boolean,
            titleVc: Boolean,
            titleVe: Boolean,
            wPerh: {
                type: Number,
                default: 1
            },
        },
        data() {
            return {
                load: false
            }
        },
        mounted() {
            this.activate()
        },
        computed: {
            getSize() {
                let res={width:0,height:0}
                if(this.width){
                    res["width"]=this.width
                }
                if(this.height){
                    res["height"]=this.height
                }
                if(res['width']!==0 && res['height']===0){
                    res['height']=res['width']/ this.wPerh
                }
                if(res['width']===0 && res['height']!==0){
                    res['width']=res['height']* this.wPerh
                }
                if(res['width']!==0){
                    return res
                }
                if (this.$refs.rImg && this.$refs.rImg.clientWidth > 0) {
                    return {width: this.$refs.rImg.clientWidth, height: this.$refs.rImg.clientWidth / this.wPerh}
                }
                return false

            },
            attr() {
                let res = {}
                if (this.width) {
                    res['width'] = this.width
                }
                if (this.height) {
                    res['height'] = this.height
                }
                return res
            },
            link() {
                let res = this.src
                if(this.query){
                    res+='?'+this.query
                }else{
                    res+='?'
                }
                if (this.autoSize && this.getSize && this.getSize.width > 0) {
                    res += `w=${this.getSize.width}&h=${this.getSize.height}`
                } else if (this.width) {
                    res += `w=${this.width}&h=${this.height}`
                }
                return res
            }
        },
        methods: {
            activate() {
                if (this.getSize) {
                    this.load = true
                } else {
                    setTimeout(() => {
                        this.activate()
                    }, 500)
                }

            }
        }
    }
</script>
<style lang="scss">
    @import "../../style/include";

    .#{$prefix}img {
        position: relative;
        display: flex;
        width: 100%;
        max-width: 100%;
        overflow: hidden;
        z-index: 0;
        img{
            transition: 0.3s all ease-in-out;
        }
        &.img-hoverZoom{
            &:hover{
                img{
                    transform: scale(1.1);
                }
            }
        }
        &.img-hoverDark{
            &:hover{
                background-color: black;
                img{
                    opacity: 0.5;
                }
            }
        }
        &.img-hoverTitle{
            &:hover{
                .img-title{
                    max-width: 100%;
                }
            }
        }
        .img-title{
            position: absolute;
            z-index: 1;
            max-width: 0;
            overflow: hidden;
            &.title-hs{
                text-align: start;
            }
            &.title-hc{
                text-align: center;
            }
            &.title-he{
                text-align: end;
            }
            &.title-vs{
                top:10px
            }
            &.title-vc{
                top:50%
            }
            &.title-ve{
                bottom:10px
            }

        }
    }
</style>