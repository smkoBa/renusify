<template>
    <component v-bind="att"
               :is="route.tag"
               v-ripple="isLink&&isRipple">
        <slot></slot>
    </component>
</template>

<script>
    import {roots} from '../../tools/rootable';
    import Ripple from '../../directive/ripple/index';
    import './style.scss';

    export default {
        name: 'r-card',
        mixins: [roots],
        directives: {ripple: Ripple},
        props: {
            flat: Boolean,
            hover: Boolean,
            tile: Boolean,
            outlined: Boolean,
            isRipple: {
                type:Boolean,
                default:true
            },
        },
        computed: {
            att(){
                let res={'class':this.genClass}
                if(this.href){
                    res['href']=this.route.data.attrs.href
                }

                if(this.target){
                    res['rel']='noreferrer'
                    res['target']=this.route.data.attrs.target
                }
                if(this.to){
                    res['to']=this.route.data.props.to
                }
                return res
            },
            genClass() {
                let c = 'r-card';
                if (this.flat) {
                    c += ' card-flat';
                }else{
                    c += ' r-sheet';
                }
                if (this.hover) {
                    c += ' card-hover';
                }
                if (this.outlined) {
                    c += ' card-outlined';
                }
                if (this.tile) {
                    c += ' r-sheet-tile';
                }
                if (this.isLink) {
                    c += ' card-link';
                }
                return c;
            },
        },

    };
</script>
