import Axios from 'axios';

class Translate {
    constructor() {
        this._count = 0;
        this._messages = {};
        this._local = 'en';
        this._package = null;
    }

    get messages() {
        return this._messages;
    }

    get local() {
        return this._local;
    }

    set local(value) {
        this._local = value;
    }

    set package(value) {
        this._package = value;
    }

    setMessages(value, local) {
        this._messages[local] = value;
    }

    add(key, value) {
        this._messages[this._local][key] = value;
    }

    replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    }

    get(key, array = []) {
        if (!this._local) {
            return key;
        }
        if (!this._messages[this._local]) {
            return key;
        }
        if (this._messages[this._local][key]) {
            let val = this._messages[this._local][key];
            for (let i = 0; i < array.length; i++) {
                val = this.replaceAll(val, '{' + i + '}', array[i]);
            }
            if (val === null || val === '') {
                return key;
            }
            return val;
        } else if (/*process.env.NODE_ENV === 'development' &&*/ this._package && this._count < 20 && !/\s/.test(key)) {
            let url = '/translate/' + this._package + '/' + key + '?v=';
            for (let i = 0; i < array.length; i++) {
                url += '{' + i + '}';
            }
            Axios.post(url);
            this._count++;
            return key;
        } else {
            return key;
        }
    }
}

export default new Translate();
