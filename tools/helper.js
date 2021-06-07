export function copy(text) {
    function copyTextToClipboard(text) {
        var textArea = document.createElement('textarea')
        textArea.value = text

        // Avoid scrolling to bottom
        textArea.style.top = '0'
        textArea.style.left = '0'
        textArea.style.position = 'fixed'

        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
            var successful = document.execCommand('copy')
            var msg = successful ? 'successful' : 'unsuccessful'
            console.log('helper copy: Copying text command was ' + msg)
        } catch (err) {
            console.error('helper copy: unable to copy', err)
        }

        document.body.removeChild(textArea)
    }

    if (!navigator.clipboard) {
        copyTextToClipboard(text)
        return
    }

    navigator.clipboard.writeText(text).then(function () {
        window.app.$toast('copy_text_to_clipboard', {type: 'success'})
    }, function () {
        window.app.$toast('text_not_copied!', {type: 'error'})
    })
}

export function cleanXss(text) {
    text = htmlDecode(text)
    const el = document.createElement('div')
    el.innerHTML = text
    return cleanDom(el).innerHTML
}

export function cleanText(text) {
    text = htmlDecode(text)
    const el = document.createElement('div')
    el.innerHTML = text
    return el.innerText
}

export function cleanDom(html, blockTag = ['script'], allowAttrs = ['class', 'href', 'src', 'target']) {
    if (blockTag.includes(html.tagName)) {
        return document.createElement('div')
    }
    const el = document.createElement(html.tagName)
    el.innerHTML = html.innerHTML
    for (let i in allowAttrs) {
        if (html.getAttribute(allowAttrs[i])) {
            el.setAttribute(allowAttrs[i], html.getAttribute(allowAttrs[i]))
        }
    }
    for (let i in el.children) {
        if (hasKey(el.children, i)) {
            let dom = cleanDom(el.children[i], blockTag, allowAttrs)
            el.replaceChild(dom, el.children[i])
        }
    }
    return el
}

export function hasKey(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

export function uniqArray(a) {
    var prims = {boolean: {}, number: {}, string: {}};
    var objs = [];

    return a.filter(function (item) {
        var type = typeof item;
        if (type in prims) {
            return hasKey(prims[type], item) ? false : (prims[type][item] = true);
        } else {
            const k = Object.keys(item)[0]
            if (searchArray(objs, k, item[k]) !== false) {
                return false
            } else {
                return objs.push(item)
            }
        }
    });
}

export const isMobile = (() => {
    const userAgentInfo = navigator.userAgent.toLowerCase();
    const agents = ['Android', 'iPhone',
        'SymbianOS', 'Windows Phone',
        'iPad', 'iPod'];
    let flag = false;
    for (let v = 0; v < agents.length; v++) {
        if (userAgentInfo.indexOf(agents[v].toLowerCase()) > 0) {
            flag = true;
            break;
        }
    }
    return flag;
})();

export function isArray(input) {
    if (Array.prototype.isArray) {
        return Array.isArray(input);
    }
    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}

export function keys(o) {
    return Object.keys(o);
}

export function searchArray(arr, key, value) {
    if (!arr) {
        return false
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === value) {
            return i;
        }
    }
    return false;
}

export function replacer(string = null, find = ' ', replace = '-') {
    if (!string) {
        return string;
    }

    return string.toString().split(find).join(replace);
}

export function ifHas(object = null, rtrn = false, ...childs) {
    let o;
    if (!object) {
        return rtrn;
    }
    o = object;
    for (let i = 0; i < childs.length; i++) {
        if (o[childs[i]] === undefined || o[childs[i]] === null) {
            return rtrn;
        }
        o = o[childs[i]];
    }
    return o;
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function width(el = null) {
    if (el !== null) {
        return this.$refs.el.clientWidth;
    } else {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }
}

export function limiter(string, length) {
    if (!string) {
        return '';
    }
    return string.length > length
        ? string.substring(0, length - 3) + '...'
        : string;
}

export function url() {
    return process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_production_URL : process.env.VUE_APP_API_URL;
}

export function cleanArray(actual) {
    const newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

export function highlightSetup(text, highlight) {
    if (typeof text !== 'string' || typeof highlight !== 'string') {
        return text;
    }
    highlight = highlight.trim();
    if (highlight.length === 0) {
        return text;
    }
    let keywords = cleanArray(highlight.split(' '));
    keywords = keywords.join('|');
    return text.replace(new RegExp(keywords, 'gi'), '<span class="color-warning-text">$&</span>');
}

export function htmlEncode(str) {
    return str.replace(/[\u00A0-\u9999<>]/gim, function (i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
}

export function decodeSingle(str) {
    if (typeof str !== 'string') {
        return null;
    }
    str = htmlEncode(str);
    const element = document.createElement('div');
    element.innerHTML = str;
    str = element.textContent;
    element.textContent = '';

    return str;
}

export function htmlDecode(text) {
    if (text === undefined || text === null) {
        return null;
    }
    if (typeof text === 'string') {
        return decodeSingle(text);
    } else if (isArray(text)) {
        const a = [];
        text.forEach((t) => {
            if (typeof t === 'string') {
                a.push(decodeSingle(t));
            } else {
                a.push(htmlDecode(t))
            }

        });
        return a;
    } else if (typeof text === 'object') {
        const a = {};
        for (let k in text) {
            if (hasKey(text, k)) {
                if (typeof text[k] === 'string') {
                    a[decodeSingle(k)] = decodeSingle(text[k])
                } else {
                    a[decodeSingle(k)] = htmlDecode(text[k])
                }

            }
        }
        return a;
    } else {
        return text;
    }
}

export function base64encode(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

export function base64decode(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

export function size(obj) {
    let size = 0;
    let key;
    for (key in obj) {
        if (hasKey(obj, key)) size++;
    }
    return size;
}

export function log(txt, type = 'log', on = 'development') {
    if (process.env.NODE_ENV === on) {
        if (type === 'log') {
            console.log(txt);
        } else if (type === 'warn') {
            console.warn(txt);
        } else if (type === 'error') {
            console.error(txt);
        }
    }
}

export function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    a.sort()
    b.sort()

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

export function hash(str, seed = 0) {
    str = str.toString()
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}