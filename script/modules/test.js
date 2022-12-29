String.prototype.color = function () {
    return 'color:#{r}{r}{r}{r}{r}{r}'.exec({
        r: () => {
            return (+'{0-15}'.exec()).toString(16)
        }
    }
    )
}
var RP = /(?:(["'\`])(?:(?!\1)[\w\W])*\1)|((?:\/\*+(?:[^*]|\*[^\/])*\*\/)|(?:[^\/'":]\/\/.*$)[\r\n]*)|(?:(?=[^\w]|^)*((?:\([^()]*\)\s*=\>|\w+\([^()]*\)|function\s*(?:[\w]*\([^()]+\)|)))|(var|let|const|console|log|setTimeout|this|for|do|return|try|dialog|if|else)(?=[^\w])|(\]|\}|\[|{|\(|\))|(=>|=)|(?:(\.\w+(?=\()|(?:\w+\.|)data))|(\w+)\s*(?=\:)|(arguments))/mg;
var ATTR = /(?:\{[^\{\}]+\}|(?:[\:!*][\w!\.-]+|for)="(?:(?!\"(?:\s|>|\]|\/>)).)+")/g;//[:if="state ? "吸烟" : "戒烟""]
var COLORS = {
    BLOCK: 'color:#5f6900',
    DEFINE: 'color:#9682cf',//'#F4B072',
    STR: 'color:#bacc1e',
    DEF: 'color:#ccc',
    FUNCTION: 'color:#e91e63',
    ATTR: 'color:#5f6900;background:#cddc39;padding:3px;border-radius:7px;margin:3px;font-size:10px;border: 3px solid rgba(255, 255, 255, 0.1764705882) !important;'
}
var COLOR = [COLORS.STR, 'color:#757b7f', COLORS.FUNCTION, COLORS.DEFINE, COLORS.BLOCK, COLORS.DEF, 'clor:#F4B072', 'color:#fff', 'color:#73bfd5'];
String.prototype.colors = function () {
    var l = [];
    var colorString = this
        /* 替换 [{key: value},....] */
        .replace(/\[(?:\{[^\]\[]+\},*)+\]/g, '[...]')
        .replace(RP, (source, ...list) => {
            // var [a,b,c,d,e] = list;
            // console.log(a,b,c,d,e)
            var index = list.findIndex((v, i) => {
                if (v) return true
            })
            var k = COLOR[index] || COLORS.DEF;
            l.push(k);
            if (index === 0/* ==0 @see RP正则 */ && ATTR.test(source)) {
                source = source.replace(/\<(style)(?:(?!\<\1)[\w\W])+\<\/\1\>/g, '<$1>...</$1>')
                source = source.replace(ATTR, (a) => {
                    l.push(COLORS.ATTR, k);
                    return '%c{0}%c'.exec([a]);
                })
            }
            l.push(COLORS.DEF);
            return '%c{0}%c'.exec([source]);
        })
    // console.clear();
    // console.log(colorString)
    console.log(colorString, ...l);
    // console.log(l)
    return colorString
}
define('di', ['dialog'], function (dialog) {
    // 'use strict';
    var { render/* , isEmpty, runer: iRuner, each, merge, picker: iPicker, css: iCss, attr: iAttr, is: iElementIs, query: iQuery, clazz: iClass  */ } = dialog;
    try {
        var modeString =
            `
            ((div.line>Wea[:value="searchcity" :fly="inputs"]))
((
    (div.line>(
        +div{测试Array.length}+
        div.color-box.button[:onclick="fillTestList"]{填充TESTLIST}+
        {LENGTH = }+
        div.color-box.button.red{{testlist.length}}
        (
            div[:for="testlist"].text-list-room>
                {{name}}+
                Onoff:span.onoff[!show="shows" :class.lines="shows"]+
                .color-box.color-box-yellow[:onclick="testlistClick" :if="!shows"]{删除}
        )+
        div.line[:if="!testlist.length"]{空空如也~~}
    )+)
    +(div.line>
        {{show?"多选" : "单选"}}+
        (div.inline-block>span[:class="show ? '_open': '_close'" class="i-state" :onclick="show"])+
        {({sele.data.id})}+
        Select[:trigger="name" :multi="show" :data="select" :split="," :current="sele.data.id" :onclick="click1"]+
        input.input-style[:value="sele.data.id"]
    )+
    div.line>(
        {单选}+
        Select[:data="select" :current="selcurs"]
    )
))
((
    div.line>div>(
        div.uppercase>(
            {操作项列表当}+
            span.color-box{show}+
            {值为}+
            span.color-box[:class=" show ? 'color-box-yellow' : 'color-box-red'"]{{show}}+
            {时}+
            span.color-box[:class=" show ? 'color-box-green' : 'color-box-gray'"]{{show ? "显示" : "隐藏"}}
        )+
        (div>span[:class="show ? '_open': '_close'" class="i-state" :onclick="show"])+
        div>(
            {{!show?'隐藏':'显示'}}{{SPACE}}{:::this.show\\=}+span.uppercase{{show}}
        )+
        div.line[:if="show"]>div>(
            span[:class="!visible ? '_open': '_close'" class="i-state" :onclick="hide"]+
            div>(
                {{visible?'隐藏':'显示'}}{{SPACE}}{:::this.visible\\=}+span.uppercase{{!visible}}
            )+
            span[:class="visible ? '_open': '_close'" class="i-state" :onclick="hide"]
        )
    )
))
`;
        var worker = render(modeString, {
            selector: 'rainbox',
            slot: {
                // Test: require('./script/slot/list.test'),
                Wea: require('./script/slot/select#tq'),
                Onoff: require('./script/slot/select#onoff'),
                Select: require('./script/slot/select')
            },
            data: {
                inputs: false,
                searchcity: '',
                // uploadurl: '//i.com:8889/file',
                // 开启享元模式, 只限于for内部
                _share__: true,
                visible: !true,
                show: true,
                selcurs: '开启',
                sele: {
                    name: '删除',
                    names: '23',
                    data: {
                        id: '开启'
                    }
                },
                testlist: [],
                select: [
                    {
                        id: 1,
                        name: '开启'
                    }, {
                        id: 2,
                        name: '关闭'
                    }, {
                        id: 3,
                        name: '待确认'
                    }, {
                        id: 4,
                        name: '已关闭'
                    }, {
                        id: 5,
                        name: '待关闭'
                    }, {
                        id: 6,
                        name: '待删除'
                    }, {
                        id: 7,
                        name: '删除'
                    }
                ],
                selects: {}
            },
            watch: {
                testlist() {
                    console.log(...arguments, '--MARK')
                },
                show(cur, last) {//console.log(cur, last)
                    // dialog.query('.windows')[cur ? 'hide' : 'show']()
                    cur || (this.sele.data.id = (this.sele.data.id + '').replace(/^.*,([^,]+)$/, '$1'))
                }
            },
            events: {
                fillTestList() {
                    this.testlist.push({ name: '{100-2000}'.format(), shows: true })
                    dialog.resize();
                    console.log(this);
                },
                testlistClick() {
                    console.log(this);
                    this.remove();
                },
                hide: function () {
                    this.visible = !this.visible;
                    dialog.resize()
                    // this.show = !this.show
                },
                show: function () {
                    this.c = !this.c;
                    this.show = !this.show
                    // this.message2 += 1;
                    dialog.resize()
                },

                click1: function () {
                    this.$idx += 1;
                    return false;
                }
            }
        });
        console.log(worker);
        arguments.callee.toString().colors()
        return {
            run() {
                dialog.auto(worker.node, {
                    // cs: 'offset:2 2 33 2;inner: 0 0 0 0 .rainbox',
                    cs: 'offset:2 2 2 2;inner: 0 0 0 0 .rainbox',
                    last(...args) {
                        // console.log(this)
                        // worker.data.searchcity = '';
                        // setTimeout(() => {
                        //     worker.data.searchcity = ''
                        // }, 1000)
                        this.addClass('ios');
                        // this.addClass('ios simply');
                        dialog.query('.confirm-cancel.close[data-bind="c"]{×}', true).appendTo(this.room).click(() => {
                            this.remove()
                        });
                        this.room.addClass('dialog-confirm')
                        this.room.find('.rainbox').css({
                            overflow: 'scroll',
                            'border-radius': '10px 0 10px 10px'
                        });
                        this.room.css({
                            padding: '10px'
                        })
                        this.onclose(() => {
                            this.room.find('.content').html('')
                        })

                    }
                })
            }
        }
    } catch (e) {
        console.log(e)
    }


})