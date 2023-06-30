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
            ((span[:class="theme ? '_open': '_close'" class="i-state" :onclick="theme"]))
            ((span.color-box[:class=" theme ? 'color-box-green' : ''"]{{!theme?"暗色":"亮色"}}))
            ((br+br+br))((div.line>{时间插件测试项}+Timebox[:tips="请选择区间日期"]))
            ((
                div.line.clock[:onclick="showtime"]{日期}
            ))
            ((
                div.line.wea>
                div.inline-block>span[:class="showtq ? '_open': '_close'" class="i-state" :onclick="showtq"]+span.color-box[:class=" showtq ? 'color-box-green' : 'color-box-gray'"]{{showtq ? "天气模块状态为打开" : "已隐藏天气模块"}}+div[:if="showtq"]>Wea[:value="searchcity" :showday="showday" :fly="inputs" :onclick="showinfo"]
            ))
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
        var flash = require('flash');
        var times = require('time');
        var worker = render(modeString, {
            selector: 'rainbox',
            slot: {
                // Test: require('./script/slot/list.test'),
                Wea: require('./script/slot/select#tq'),
                Onoff: require('./script/slot/select#onoff'),
                Select: require('./script/slot/select'),
                Timebox: require('./script/slot/time')
            },
            data: {
                themeState: null,
                theme: !true,
                // 天气模块开关
                showtq: true,
                showday: _Qma.dv || 'v9',
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
                },
                theme(data) {
                    if (this.themeState) {
                        if (!data) {
                            this.themeState.remove()
                        }
                    }
                    var _this = this;
                    if (data) {
                        require('./css/white.css', function () {
                            _this.themeState = this;
                        });
                    }
                }
            },
            events: {
                showtime(){
                    var TR = new times('MM');
                    // console.log(TR, TR.days(1/* 星期一显示的偏移量 */, 0/* 0:中文, 1:英文, 2:日文 *//* 标记start所在年月,默认显示 */))
                    flash.run(this._el, {
                        data: {
                            times: TR.days(1/* 星期一显示的偏移量 */, 0/* 0:中文, 1:英文, 2:日文 *//* 标记start所在年月,默认显示 */),
                            day: +TR.fire()
                        },
                        mode: '((div.month-bg[data-txt="月"]{{day}}))<span :for="times" :class="title + "-month"" :onclick="trigger" :class="$1 = start && start.year==year && start.month==month && start.day==day, $2 = end && end.year==year && end.month==month && end.day==day, $1 == $2 && $1 == true || $2 ? "hover cur": $1 ? "cur":""" :class.beteen.hover="bh" :class.cur="select" :class.beteen="show && title!="title"" :class.hover="hover" :class.cur="cur==true" :onmouseover="hover" :onmouseout="out" :class.forbidden="forbidden">{day}</span>',
                        top: 'auto'
                    })
                },
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
                showtq: function () {
                    this.showtq = !this.showtq
                    dialog.resize()
                },
                click1: function () {
                    this.$idx += 1;
                    return false;
                },
                theme() {
                    this.theme = !this.theme;
                }
            }
        });
        console.log(worker);
        arguments.callee.toString().colors();
        var T = require('time');
        var TS = new T('hh:mm:ss');
        return {
            run() {
                dialog.auto(worker.node, {
                    // cs: 'offset:2 2 33 2;inner: 0 0 0 0 .rainbox',
                    cs: 'offset:2 2 2 2;inner: 0 0 0 0 .rainbox',
                    scroll: () => {
                        if (dialog.current() != this.confirm) dialog.resize();
                    },
                    center: false,
                    last(...args) {
                        // console.log(this)
                        // worker.data.searchcity = '';
                        // setTimeout(() => {
                        //     worker.data.searchcity = ''
                        // }, 1000)
                        // worker.data.hx = 10
                        // setTimeout(() => {
                        dialog.auto({
                            mode: `
                                ((
                                    div.clockbox[:onclick="show"]>.h[:style.backgroundPositionY="hx * -100+"px""]+.m[:style.backgroundPositionY="mx * -100+"px""]+.s[:style.backgroundPositionY="sx * -100+"px""]
                                    )
                                ))`,
                            data: {

                                hx: 0,
                                mx: 0,
                                sx: 0,
                            },
                            events: {
                                show() {
                                    dialog.notice('((div.clocktipstitle{表}))复刻2007年左右写的表盘((br))((div.mark|测试))', 100, {
                                        target: this._el,
                                        position: 'bottom,left'
                                    })//.addClass('black')
                                }
                            }
                        }, {
                            position: {
                                // target: this.room.find('.clock'),
                                position: 'top,bottom'
                            },
                            cs: 'offset: auto 20 20 auto',
                            center: false,
                            last() {
                                // console.log(this)
                                setInterval(() => {
                                    var a = TS.fire(Date.now());
                                    var t = dialog.picker(a.split(':'), '0=>hx,1=>mx,2=>sx', true)
                                    // console.log(t)
                                    dialog.merge(this.render.data, t, true);
                                    // worker.data.searchcity = ''
                                }, 1000)
                                this.bg.remove()
                            }
                        })
                        var ts = [], tms;
                        dialog.between(0, 59, (i, f) => {
                            tms = (f - i) % 5 == 0 ? ((f - i) / 5) || 12 : '';
                            tms = /^(3|6|9|12)$/.test(tms) ? tms : '';
                            ts.push({ name: tms, k: '-' })
                        })

                        var ROOM;
                        dialog.auto({
                            mode: `
                                ((
                                    div.clockboxnew[:class.initshow="initshow" :onclick="show"]>
                                    .h[:style.transform=""rotate\\("+(hx*360/12-90)+"deg\\)""]+
                                    .m[:style.transform=""rotate\\("+(mx*360/60-90)+"deg\\)""]+
                                    .s[:style.transform=""rotate\\("+(sx*360/60-90)+"deg\\)""]+
                                    div.time-text[:for="t" :data-v="name"]{{k}}+
                                    )
                                ))`,
                            data: {
                                hx: 0,
                                mx: 0,
                                sx: 0,
                                t: ts,
                                state: true,
                                el: null,
                                initshow: true
                            },
                            events: {
                                show() {
                                    this.state = !this.state;
                                    var el = this.el || (this.el = dialog.query('.clockboxnew', this._el));
                                    el.stop(true, true).animate({
                                        'zoom': this.state ? 2 : 0.6
                                    })
                                    ROOM.find('.content').stop(true, true).animate({
                                        right: 180,
                                        width: 'auto'
                                    })
                                }
                            }
                        }, {
                            cs: 'offset: auto 20 180 auto',
                            // center: false,
                            last() {
                                ROOM = this.root;
                                setInterval(() => {
                                    var a = TS.fire(Date.now());
                                    var t = dialog.picker(a.split(':'), '0=>hx,1=>mx,2=>sx', true);
                                    dialog.merge(this.render.data, t, true);
                                }, 1000)
                                setTimeout(() => {
                                    this.render.data.initshow = false;
                                }, 3200);
                                this.bg.remove()
                            }
                        })
                        // }, 1000)
                        worker.data.theme = true
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