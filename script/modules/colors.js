define(['dialog', 'flash'], function (dialog, flash) {
    var exprots = {};

    var COLORR = /(?:(["'\`])(?:(?!\1)[\w\W])*\1)|(\{)|(\})|((?:;?\n+|;(?!\n)))|((?:\/\*+(?:(?!\*\/).)*\*\/)|(?:\/\/.*$))|(\/(?:(?!\/|\s).)+\/[igm]?)|(?:(?=[^\w]|^)*((?:\([^()]*\)\s*=\>|\w+\([^()]*\)|function\s*(?:[\w]*\([^()]+\)|)))|(?=[^\w]|)(function|var|let|const|console|log|setTimeout|this|for|do|return|try|dialog|if|else|new[\s])(?=[^\w]+)|(\]|\[|\(|\))|(=>|=)|(?:(\.\w+(?=\()|(?:\w+\.|)data))|(\w+)\s*(?=\:)|(arguments))/mg;
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
        'function',//COLORS.FUNCTION,
        'define',//COLORS.DEFINE,
        'block',//COLORS.BLOCK,
        'block',//COLORS.DEF,,
        'attr',
        'attr',
        'attr'
    ];
    exprots.show = function (element, func) {
        // console.log(func)
        // console.log(this.on(func))
        var f = flash.run(element, {
            position: {
                target: element,
                position: 'top,right,left,bottom'
            },
            top: '100',
            mode: this.on(func).replace(/(\\){4}/g, '$1$1'),
            data: {

            },
            last() {
                // this.removeClass('fade')
                this.room.css({
                    // width: 500,
                    'background-image': 'none'
                })
                this.room.addClass('dialog-confirm');
                this.room.addClass('code')
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
    exprots.on = function (func) {
        Count.count = 0;
        var colorString = dialog.isString(func) ? func : func.toString();
        /* 替换 [{key: value},....] */
        /* .replace(/\[(?:\{[^\]\[]+\},*)+\]/g, '[...]') */
        colorString = colorString;
        //.replace(/\n{1,}|;{1,}/g, '\n')
        // console.log(colorString);
        // debugger;
        // colorString.match(COLORR)
        colorString = colorString.replace(COLORR, (source, ...list) => {
            if (Count[source]) {
                Count[source]();
                /* if (source == '\\}') Count[source](); */
            }
            var index = list.findIndex((v, i) => {
                if (v) return true
            })
            var k = COLOR[index] || COLORS.DEF;
            // console.log(source, k);
            var format = source.replace(/({|}|>|<|\(|\)|\.|\\|\+|\\n|\|)|(=)(>)/g, '$2\\$1$3');
            var mo = ['((text:span.{0}{{1}}))', '((+div+.newline.newline{2}))']
            if (/^[2-3]$/.test(index)) {
                if (index == 2) mo[1] = ''//mo.reverse();
                // if(k == 'def' && format == '\n') mo[1] = '';
                return mo.join('\n').on(k, format, Count.count)//.buildHtml()
            }
            /* l.push(k); */
            // if (index === 0/* ==0 @see COLORR正则 */ && ATTR.test(source)) {
            //     // source = source.replace(/\<(style)(?:(?!\<\1)[\w\W])+\<\/\1\>/g, '<$1>...</$1>');
            //     source = '((text:code>{?}))'.on(source)/* .buildHtml() *//* .replace(ATTR, (a) => {
            //         return '.attrs{?}'.on(a).buildHtml();
            //     }) */
            // }
            // console.log(k, source);
            return '((text:span.?{?}))\n'.on(k, format)//.buildHtml();
        })
        // console.log(colorString);
        return colorString
    }
    return exprots;
})