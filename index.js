import {reactive} from 'vue'
import * as helper from './tools/helper';
import Translate from './plugins/trans/Translate';
import DateTime from './plugins/trans/DateTime';
import Currency from './plugins/trans/Currency';
import Notify from './components/notify/notify.js';
import valid from './plugins/validation/Validate';
import Toast from './components/toast/toast.js';
import event from './plugins/event';
import {register} from './components';
import {registers} from './directive';

window.renusifyBus = event;
export default {
    install: (app, options = {}) => {
        // renusify application
        app.config.globalProperties.$r = reactive(Object.assign({}, {
            dark: false,
            rtl: false,
            lang: 'en',
            package: false,
            store: {},
        }, options))
        // renusify notify
        app.config.globalProperties.$notify = function (message = null) {
            if (message === null) {
                Notify.hide();
            } else {
                Notify.show(message);
            }
        }
        // renusify toast
        app.config.globalProperties.$toast = function (message, options) {
            Toast.show(message, options);
        }
        // renusify helper
        app.config.globalProperties.$helper = helper
        // renusify translate
        app.config.globalProperties.$translate = Translate
        app.config.globalProperties.$t = (key, array = []) => Translate.get(key, array)
        app.config.globalProperties.$d = (value, key = 'long', local = null) => DateTime.formatLocal(value, key, local)
        app.config.globalProperties.$n = (value) => Currency.formatLocal(value)
        // renusify validation
        app.config.globalProperties.$v = (names) => valid.checkType(names)

        // install components
        register(app,options['components']||[]);

        // install directives
        registers(app,options['directives']||[]);
    }
};
