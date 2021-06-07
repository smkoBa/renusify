/* eslint-disable */
import Translate from '../trans/Translate'

class Validate {
  required() {
    let msg = Translate.get('required_error');
    return (v) => !!(v !== undefined && v !== null && v !== '') || msg
  }

  requiredArray() {
    return (v) => (v !== undefined && v !== null && v.length > 0) || Translate.get('required_error');
  }

  email() {
    return (v) => (v && v.length > 0 ? /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) : true) || Translate.get('validate_email');
  }

  url() {
    return (v) => (v && v.length > 0 ? /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/.test(v) : true) || Translate.get('validate_url');
  }

  match(val) {
    return (v) => {
      if (v == val) {
        return true
      } else {
        return Translate.get('validate_match', [val]);
      }
    }
  }

  phone() {
    return (v) => (v && v.length > 0 ? /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/.test(v) : true) || Translate.get('validate_phone');
  }

  number() {
    return (v) => (v && v.length > 0 ? /^([0-9])\d*$/.test(v) : true) || Translate.get('numeric_error');
  }

  min_len(num) {
    return v => (v && v.length > 0 ? v.length >= parseInt(num)?true: Translate.get('min_len_error', [num,v.length]) : true)
  }

  max_len(num) {
    return v => (v && v.length > 0 ? v.length <= parseInt(num)?true: Translate.get('max_len_error', [num,v.length]) : true)
  }

  len(num) {
    return v => (v && v.length > 0 ? v.length === parseInt(num)?true: Translate.get('len_error', [num,v.length]) : true) || msg
  }

  min(num) {
    return v => (v ? parseFloat(v) >= parseFloat(num)?true: Translate.get('min_error', [num,parseFloat(v)]) : true)
  }

  max(num) {
    return v => (v ? parseFloat(v) <= parseFloat(num)?true: Translate.get('max_error', [num,parseFloat(v)]) : true)
  }

  eq(num) {
    return v => (v ? parseFloat(v) === parseFloat(num) : true) || Translate.get('validate_eq', [num]);
  }

  notDefined(name) {
    return v => Translate.get('validate_notDefined', [name]);
  }

  checkType(names) {
    let filters = [];
    if (typeof names === 'object') {
      names.forEach((name) => {
        let res = name.split(':');
        let par1 = res[1] ? res[1] : null;
        let par2 = res[2] ? res[2] : null;
        let par3 = res[3] ? res[3] : null;
        if (this[res[0]]) {
          if (par3 === null && par2 === null) {
            filters.push(this[res[0]](par1))
          } else if (par3 === null) {
            filters.push(this[res[0]](par1, par2))
          } else {
            filters.push(this[res[0]](par1, par2, par3))
          }
        } else {
          filters.push(this.notDefined(name))
        }
      })
    }
    return filters
  }
}

export default new Validate()
