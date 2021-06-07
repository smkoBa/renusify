import Ripple from './ripple/index'
import clickOutside from './clickOutSide/index'
import scroll from './scroll/index'
import Title from "renusify/directive/title";
import Sortable from "renusify/directive/sortable";

const list={
  'ripple':Ripple,
  'click-outside':clickOutside,
  'scroll':scroll,
  'title':Title,
  'sortable':Sortable
}
export const registers = (app,directives) => {
  directives.forEach((item)=>{
    app.directive(item, list[item])
  })
}
