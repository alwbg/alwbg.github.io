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
((
    (
        span.color-box[:class=" theme ? 'color-box-green' : ''"]{{!theme?"暗色":"亮色"}}
    )+div.tips{(点击切换样式~)}))
((br+br+br))((div.line>div.test-title{时间插件测试项}+Timebox[:tips="请选择区间日期"]))
((
    div.line.clock[:onclick="showDate"]>div.test-title{测试下弹式日期}+{日期}+.tips{(点击测试层叠窗口~~)}
))
((
    div.line>
        .test-title{测试不同方向出现的通知}+
        (
            div{Notice通知}>
                span[:class="notice ? '_open': '_close'" class="i-state" :onclick="notice"]+.tips{(点击测试两个通知~)}
        )
        +div{{noticemsg}}
        +div>(span.color-box[class="color-box-green button" :onclick="addnew"]{新增通知~}+.tips{(点击测试新增通知~)})
        +div>(span.color-box[class="color-box-red button" :onclick="delall"]{删除所有通知}+.tips{(点击测试删除所有通知~)})
))
((
    div.line.wea>
    div.inline-block>span[:class="showtq ? '_open': '_close'" class="i-state" :onclick="showtq"]+span.color-box[:class=" showtq ? 'color-box-green' : 'color-box-gray'"]{{showtq ? "天气模块状态为打开" : "已隐藏天气模块"}}+div[:if="showtq"]>Wea[:value="searchcity" :showday="showday" :fly="inputs" :onclick="showinfo"]
))
((
    (div.line>(
        +div.test-title{测试Array.length}+
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
        div.test-title{{show?"多选" : "单选"}}+
        (div.inline-block>span[:class="show ? '_open': '_close'" class="i-state" :onclick="show"])+
        {({sele.data.id})}+
        Select[:trigger="name" :multi="show" :data="select" :split="," :current="sele.data.id" :onclick="click1"]+
        input.input-style[:value="sele.data.id"]
    )+
    div.line>(
        div.test-title{单选}+
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
        // 测试
        function Notice(config) {
            return new Promise((resolve, reject) => {
                require('notice', (notice) => {
                    arguments.callee.host = notice;
                    resolve(notice(config))
                })
            })
        }
        Notice.close = () => {
            dialog.runer(dialog.picker(Notice, 'host.close=>c').c, Notice.host)
        }
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
                autonotice: 1,
                themeState: null,
                theme: !true,
                notice: !true,
                noticemsg: '',
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
                selects: {},
                autonoticelist: []
            },
            watch: {
                testlist() {
                    console.log(...arguments, '--MARK')
                },
                show(cur, last) {
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
                },
                notice(data) {
                    if (data) {
                        require('test#showlocalip', (ip) => {
                            ip.show(data, this);
                        })
                    } else {
                        dialog.each(this.autonoticelist, (k, v) => {
                            v.remove()
                        })
                        this.autonoticelist = [];
                    }
                },
                autonotice(data) {
                    this.autonoticelist.push(data)
                }
            },
            events: {
                delall() {
                    Notice.close();
                },
                addnew() {
                    Notice({
                        theme: '[notice,tips,error,white,black]'.on(),
                        position: '[left,right,top]'.on(),
                        mode: '(div[:onclick="go"]>(div.tips-title{通知!}+div{点击打开地址}+div{{url}}))+.close[:onclick="close"]{x}',
                        data: {
                            url: '/product'
                        },
                        events: {
                            close() {
                                this._dialog.remove();
                            },
                            go() {
                                open(this.url);
                                this._dialog.remove();
                            }
                        }
                    })
                },
                notice() {
                    this.notice = !this.notice;
                },
                showDate() {
                    require('test#date', (r) => r.show(this))
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
                    dialog.resize(this._el);
                },
                showtq: function () {
                    this.showtq = !this.showtq
                    dialog.resize(this._el)
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
        // console.log(worker);
        arguments.callee.toString().colors();
        return {
            run() {
                dialog.auto(worker.node, {
                    model: true,
                    // cs: 'offset:2 2 33 2;inner: 0 0 0 0 .rainbox',
                    cs: 'offset:2 2 2 2;inner: 0 0 0 0 .rainbox',
                    scroll: () => {
                        // if (dialog.current() != this.confirm) dialog.resize();
                    },
                    center: false,
                    last(...args) {
                        require('test#clock', () => { });
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
define('date', ['dialog', 'time', 'script/slot/calendar', 'flash', 'notice'], function (dialog, times, calendar, flash, notice) {
    return {
        show(host) {
            var TR = new times('MM');
            // console.log(TR, TR.days(1/* 星期一显示的偏移量 */, 0/* 0:中文, 1:英文, 2:日文 *//* 标记start所在年月,默认显示 */))
            var days = TR.days(1/* 星期一显示的偏移量 */, 0/* 0:中文, 1:英文, 2:日文 *//* 标记start所在年月,默认显示 */);

            dialog.each(days, function (k, v) {
                k = calendar.solar2lunar(v.year, TR.lt10(v.month), v.day);
                v.lu = k.lDay == 1 ? k.IMonthCn : k.IDayCn
            })
            var fbox = flash.run(host._el, {
                data: {
                    times: days,
                    day: +TR.fire(),
                    tips: null,
                    ap: 1
                },
                inner: 'inner: 0 0 0 0 .content',
                mode: '((div.month-bg[data-txt="月"]{{day}}))<span :for="times" :class="title + "-month"" :onclick="trigger" :class="$1 = start && start.year==year && start.month==month && start.day==day, $2 = end && end.year==year && end.month==month && end.day==day, $1 == $2 && $1 == true || $2 ? "hover cur": $1 ? "cur":""" :class.beteen.hover="bh" :class.cur="select" :class.beteen="show && title!="title"" :class.hover="hover" :class.cur="cur==true" :onmouseover="hover" :onmouseout="out" :class.forbidden="forbidden" :data-lu="lu">{day}</span>',
                top: '300',
                events: {
                    trigger() {
                        var pos = '[left,right,bottom,top]'.on();
                        var iM = {
                            left: '[top,bottom,center]',
                            right: '[top,bottom,center]',
                            top: '[left,right,center]',
                            bottom: '[left,right,center]'
                        }
                        dialog.auto({
                            mode: 'div>(span[style="font-weight:bold"]{{y}年{month}月}+br+{{ap}日})+.confirm-cancel.close[:onclick="close"]{×}',
                            data: {
                                ap: this.day,
                                month: TR.lt10(this.month),
                                y: this.year
                            },
                            events: {
                                close() {
                                    this._dialog.remove();
                                }
                            }
                        }, {//;animate : true -=24 +=24;
                            cs: 'offset:2 2 50 2',
                            last() {
                                this.addClass('ios simply');
                                this.proxy('bg', () => {
                                    this.remove()
                                })
                            },
                            position: '?'.on(pos)
                        }).link = this.tips = dialog['[notice,tips,error]'.on()]({
                            nodeType: 1,
                            mode: 'div>(div.tips-title{通知!}+span[style="font-weight:bold"]{点击了{y}年{month}月{ap}日})+.close{x}',
                            data: {
                                ap: this.day,
                                month: TR.lt10(this.month),
                                y: this.year
                            }
                        }, null, '? ?'.on(iM[pos].on(), dialog.opposite(pos)));
                    }
                }
            })
            var N = notice({
                theme: '[white,black,error]'.on(),
                mode: '(div>(div.tips-title{提示!}+div>div{点击日期}+[text="打开新的"]+{测试窗口~}))+.close[:onclick="close"]{x}',
                data: {
                },
                events: {
                    close() {
                        this._dialog.remove();
                    }
                }
            })
            fbox.onclose(() => {
                N.remove()
            })
        }
    }
})
define('clock', ['dialog', 'time'], function (dialog, time) {

    var TS = new time('hh:mm:ss');
    // console.log(this)
    // worker.data.searchcity = '';
    // setTimeout(() => {
    //     worker.data.searchcity = ''
    // }, 1000)
    // worker.data.hx = 10
    // setTimeout(() => {
    // dialog.auto({
    //     mode: `
    //         ((
    //             div.clockbox[:onclick="show" data-bind="aaaaaaaa"]>.h[:style.backgroundPositionY="hx * -100+"px""]+.m[:style.backgroundPositionY="mx * -100+"px""]+.s[:style.backgroundPositionY="sx * -100+"px""]
    //             )
    //         ))`,
    //     data: {

    //         hx: 0,
    //         mx: 0,
    //         sx: 0,
    //     },
    //     events: {
    //         show() {
    //             dialog.notice('((div.clocktipstitle{表}))复刻2007年左右写的表盘((br))((div.mark|测试))', 100, {
    //                 target: this._el,
    //                 position: 'bottom,left'
    //             })//.addClass('black')
    //         }
    //     }
    // }, {
    //     position: {
    //         // target: this.room.find('.clock'),
    //         position: 'top,bottom'
    //     },
    //     cs: 'offset: auto 20 20 auto',
    //     center: false,
    //     last() {
    //         // console.log(this)
    //         setInterval(() => {
    //             var a = TS.fire(Date.now());
    //             var t = dialog.picker(a.split(':'), '0=>hx,1=>mx,2=>sx', true)
    //             // console.log(t)
    //             dialog.merge(this.render.data, t, true);
    //             // worker.data.searchcity = ''
    //         }, 1000)
    //         this.bg.remove()
    //     }
    // })
    // }, 1000)
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
                .h[:style.transform=""rotate\\("+(hx*360/12 - 90)+"deg\\)""]+
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
        model: true,
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
})
define('showlocalip', ['dialog', 'notice'], function (dialog, Notice) {
    return {
        show: function (data, host) {
            if (data) {

            } else {
                return //dialog.destroy(host.autonotice);
            }
            var count = true;
            var RTCPeerConnection = dialog.picker(window, 'RTCPeerConnection|webkitRTCPeerConnection|mozRTCPeerConnection=>rtc').rtc;
            if (RTCPeerConnection) {
                var rtc = new RTCPeerConnection({ iceServers: [] });
                rtc.createDataChannel('', { reliable: false });

                rtc.addEventListener('icecandidate', (evt) => {
                    if (evt.candidate) {
                        var address = evt.candidate.address;
                        if (!/^(localhost|127.0.0.1)$/.test(location.hostname) || address == location.hostname || !/^(?:\.?\d{1,3}){4}$/.test(address)) {
                            if (!count) return;
                            count = false;
                            host.noticemsg = '非localhost/127.0.0.1'

                            host.autonotice = Notice({
                                mode: '(div[:onclick="go"]>(div.tips-title{通知!}+div{点击打开地址}+div{{url}}))+.close[:onclick="close"]{x}',
                                data: {
                                    url: '/app/#bg=mine&local=true'
                                },
                                events: {
                                    close() {
                                        this._dialog.remove();
                                    },
                                    go() {
                                        open(this.url);
                                        this._dialog.remove();
                                    }
                                }
                            }).onclose(() => {
                                host.notice = false;
                            })
                            host.autonotice = Notice({
                                mode: '(div[:onclick="go"]>(div.tips-title{通知!}+div{点击打开地址}+div{{url}}))+.close[:onclick="close"]{x}',
                                data: {
                                    url: '/product'
                                },
                                events: {
                                    close() {
                                        this._dialog.remove();
                                    },
                                    go() {
                                        open(this.url);
                                        this._dialog.remove();
                                    }
                                }
                            }).onclose(() => {
                                host.notice = false;
                            })
                            return
                        };

                        host.noticemsg = '';
                        var url = 'http://?:??'.on(address, location.port || 80, location.pathname);
                        host.autonotice = Notice({
                            mode: '(div[:onclick="go"]>(div.tips-title{通知!}+div{点击打开地址}+div{{url}}))+.close[:onclick="close"]{x}',
                            data: {
                                url: url
                            },
                            events: {
                                close() {
                                    this._dialog.remove();
                                },
                                go() {
                                    open(this.url);
                                    this._dialog.remove();
                                }
                            }
                        }).onclose(() => {
                            host.notice = false;
                        })
                    }
                })
                console.log(rtc)
                rtc.createOffer().then((...args) => {
                    return rtc.setLocalDescription(...args);
                }).then((...args) => {
                    console.log(...args);
                });
            }
        }
    }
})