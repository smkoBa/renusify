import Translate from './Translate'
import DateTime from './DateTime'
import Currency from './Currency'

export default {

  install (app, options) {
    // Add $plugin instance method directly to Vue components
    app.config.globalProperties.$translate = Translate
    app.config.globalProperties.$t = (key, array = []) => Translate.get(key, array)
    app.config.globalProperties.$d = (value, key = 'long') => DateTime.formatLocal(value, key)
    app.config.globalProperties.$n = (value) => Currency.formatLocal(value)
  }
}
