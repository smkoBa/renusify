import rApp from './app/index'
import rMeta from './meta/index.js'
import rContent from './content/index'
import rContainer from './container/index'
import rRow from './container/row'
import rCol from './container/col'
import rSpacer from './container/spacer'
import rDivider from './container/divider'
import rBtn from './button/index'
import rIcon from './icon/index'
import rFormCreator from './formCreator/index'
import rCard from './card/index'
import rModal from './modal/index'
import rForm from './form/form'
import rInput from './form/input'
import rTextInput from './form/text-input'
import rTel from './form/inputTel/index'
import rSwitch from './form/switch'
import rChip from './chip/index'
import rList from './list/index'
import rTable from './table/index'
import rTableManage from './table/manage'
import rMessage from './message/index'
import rTimeAgo from './timeAgo/index'
import rConfirm from './confirm/index'
import rMaskInput from './form/mask-input'
import rProgressCircular from './progress/circular'
import rProgressLiner from './progress/liner'
import rImg from './img'
import chart from "./chart/chart";
import datePicker from './datePicker'
import btnGroup from './button/buttonGroup'
import searchInput from './form/search-input'
import textArea from './form/text-area'
import address from './form/address'
import checkInput from './form/check-input'
import uniqueFeild from './form/uniqueFeild'
import fileUploader from './form/fileUploader'
import select from './form/select'
import range from './form/range'
import number from './form/number'
import rating from './form/rating'
import textEditor from './form/text-editor'
import textEditorPreview from './form/text-editor/preview'
import avatar from './avatar'
import toolbar from './bar/toolbar'
import navbar from './bar/navbar'
import bottomNav from './bar/bottomNav'
import breadcrumb from './breadcrumb'
import bredcrumbItem from './breadcrumb/bredcrumbItem'
import countdown from './countdown'
import slider from './slider'
import swiper from './swiper'
import tabs from './tabs'
import group from './group'
import infinite from './infinite'
import infinitePage from './infinite/page'
import infiniteDiv from './infinite/div'
import iframe from './iframe'
import menu from './menu'
import jsonEditor from './json-editor'
import JsonView from './json-editor/JsonView'
import ArrayView from './json-editor/ArrayView'
import reviews from './reviews'
import tree from './tree'
import float from './float'
import bgLive from './bgLive'
import timeline from './timeline'
import password from "./form/password";
import colorPicker from "./colorPicker";

const list = {
    'r-app': rApp,
    'r-content': rContent,
    'r-meta': rMeta,
    'r-container': rContainer,
    'r-row': rRow,
    'r-col': rCol,
    'r-spacer': rSpacer,
    'r-divider': rDivider,
    'r-btn': rBtn,
    'r-icon': rIcon,
    'r-form-creator': rFormCreator,
    'r-card': rCard,
    'r-modal': rModal,
    'r-form': rForm,
    'r-input': rInput,
    'r-text-input': rTextInput,
    'r-tel': rTel,
    'r-switch': rSwitch,
    'r-chip': rChip,
    'r-list': rList,
    'r-table': rTable,
    'r-table-manage': rTableManage,
    'r-message': rMessage,
    'r-time-ago': rTimeAgo,
    'r-confirm': rConfirm,
    'r-mask-input': rMaskInput,
    'r-progress-circular': rProgressCircular,
    'r-progress-liner': rProgressLiner,
    'r-img': rImg,
    'r-chart': chart,
    'r-date-picker': datePicker,
    'r-btn-group': btnGroup,
    'r-search-input': searchInput,
    'r-text-area': textArea,
    'r-address': address,
    'r-check-input': checkInput,
    'r-unique-feild': uniqueFeild,
    'r-file-uploader': fileUploader,
    'r-select': select,
    'r-range': range,
    'r-number': number,
    'r-rating': rating,
    'r-text-editor': textEditor,
    'r-text-editor-preview': textEditorPreview,
    'r-avatar': avatar,
    'r-toolbar': toolbar,
    'r-navbar': navbar,
    'r-bottom-navigation': bottomNav,
    'r-breadcrumbs': breadcrumb,
    'r-breadcrumbs-item': bredcrumbItem,
    'r-count-down': countdown,
    'r-slider': slider,
    'r-swiper': swiper,
    'r-tabs': tabs,
    'r-group': group,
    'r-infinite-div': infiniteDiv,
    'r-infinite-page': infinitePage,
    'r-infinite-box': infinite,
    'r-iframe': iframe,
    'r-menu': menu,
    'r-json-editor': jsonEditor,
    'r-json-view': JsonView,
    'r-array-view': ArrayView,
    'r-reviews': reviews,
    'r-tree': tree,
    'r-float': float,
    'r-bg-live': bgLive,
    'r-timeline': timeline,
    'r-password': password,
    'r-color-picker': colorPicker,
}

export const register = (app, components) => {
    if (components.length === 0) {
        for (let c in list) {
            if (list.hasOwnProperty(c)) {
                app.component(c, list[c])
            }
        }
    } else {
        components.forEach((c) => {
            app.component(c, list[c])
        })
    }
}