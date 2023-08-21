define(['dialog', 'flash'], function (dialog, flash) {
    var exports = {};
    var COLORR = /(?:(["'\`])(?:(?!\1)[\w\W])*\1)|(\{)|(\})|((?:;?\n+|;(?!\n)))|((?:\/\*+(?:(?!\*\/)[\w\W])*\*\/)|(?:\/\/.*$))|(\/(?:\\\/|\/(?:[^,;]|[igm][,;])|(?!\/|\s).)+\/[igm]?)|(?=[^\w]|)(function|var|let|const|console|log|setTimeout|this|for|do|try|dialog|if|else|new[\s]*)(?=[^\w]+)|(?:(?=[^\w]|^)*((?:\([^()]*\)\s*=\>|\w+\([^()]*\)|function\s*(?:[\w]*\([^()]+\)|)))|(\]|\[|\(|\))|(=>|=)|(?:(\.\w+(?=\()|(?:\w+\.|)data))|(\w+)\s*(?=\:)|(arguments))/mg;
    var ATTR = /(?:\{[^\{\}]+\}|(?:[\:!*][\w!\.-]+|for)="(?:(?!\"(?:\s|>|\]|\/>)).)+")/g;//[:if="state ? "吸烟" : "戒烟""]
    var COLORS = {
        DEF: 'def'
    }
    var Count = {
        count: 0,
        '{': function () {
            this.count++;
        },
        '}': function () {
            this.count--;
        }
    }
    var COLOR = [
        'str',//COLORS.STR,
        'blockstart',
        'blockend',
        '', //newline
        'comment',//COLORS.comment,
        'regexp',//COLORS.regexp,
        'define',//COLORS.DEFINE,
        'function',//COLORS.FUNCTION,
        'block',//COLORS.BLOCK,
        'block',//COLORS.DEF,,
        'attr',
        'attr',
        'attr'
    ];
    exports.show = function (element, func) {
        // console.log(func)
        // console.log(this.on(func))
        var f = flash.run(element, {
            position: {
                target: element,
                position: 'top,right,left,bottom'
            },
            top: '100',
            mode: this.on(func, true).replace(/(\\){4}/g, '$1$1'),
            data: {

            },
            last() {
                this.room.css({
                    // width: 500,
                    'background-image': 'none'
                })
                this.room.addClass('dialog-confirm');
                this.room.addClass('code code-color')
            }
        });
        f.room.find('.str').each((k, v) => {
            source = v.innerHTML;
            source = source.replace(ATTR, (a) => {
                return '.attrs{?}'.on(a).buildHtml();
            })
            v.innerHTML = source;
        })
    }
    var PARTICULAR = /({|}|>|<|\(|\)|\.|\\|\+|\\n|\|)|(=)(>)/g
    exports.element = function (func) {
        var code = this.on(func), source;
        code = dialog.query(code, true);
        code.find('.str').each((k, v) => {
            source = v.innerHTML;
            source = source.replace(ATTR, (a) => {
                return '.attrs{?}'.on(a).buildHtml();
            })
            v.innerHTML = source;
        })
        return code;
    }
    exports.on = function (func, _export_simply) {
        Count.count = 0;
        var colorString = dialog.isString(func) ? func : func.toString();
        /* 替换 [{key: value},....] */
        /* .replace(/\[(?:\{[^\]\[]+\},*)+\]/g, '[...]') */
        colorString = colorString;/* .replace(/(?:(?:([;{]|(?:^\s*(?!\/\/).*|)\/\*)|((?:}|\*\/)(?!,|\)|\s*else\s+)))([^\n]))/g, '$1\n$2\n$3') */
        colorString = colorString.replace(COLORR, (source, ...list) => {
            if (Count[source]) {
                Count[source]();
            }
            var index = list.findIndex((v, i) => {
                if (v) return true
            })
            var k = COLOR[index] || COLORS.DEF;
            //console.log(source, k, index);
            var format = source.replace(PARTICULAR, '$2\\$1$3');
            var mo = ['((text:span.{0}{{1}}))', '((+div+.newline.newline{2}))'];
            if (/^[2-3]$/.test(index)) {
                if (index == 2) mo.length = 1;
                return mo.join('').on(k, format, Count.count)//.buildHtml()
            }
            return '((text:span.?{?}))'.on(k, format);
        })
        if (!_export_simply) colorString = colorString.replace(/text\:span/g, 'span');
        // console.log(colorString.buildHtml());
        return colorString
    }
    return exports;
})
define('code', ['dialog', 'color'], function (dialog, color) {
    'use strict';
    var render = dialog.render('div.test-title.code[:class="code-color:state"]{{color}}', {
        init(host) {
            var ret = dialog.each(host.children, function (k, v) {
                if (v.source == 'text') return dialog.picker(v, 'children.0.value=>v').v;
            })
            if (!ret) {
                return;
            }
            var code = color.element(ret);
            this.color = code;
        },
        data() {
            return {
                color: '',
                state: false
            }
        }
    });
    return render;
});