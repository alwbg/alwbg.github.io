
define('dsbridge', function () {
    var bridge = {
        default: this, call: function (b, a, c) { var e = ""; "function" == typeof a && (c = a, a = {}); a = { data: void 0 === a ? null : a }; if ("function" == typeof c) { var g = "dscb" + window.dscb++; window[g] = c; a._dscbstub = g } a = JSON.stringify(a); if (window._dsbridge) e = _dsbridge.call(b, a); else if (window._dswk || -1 != navigator.userAgent.indexOf("_dsbridge")) e = prompt("_dsbridge=" + b, a); return JSON.parse(e || "{}").data }, register: function (b, a, c) {
            c = c ? window._dsaf : window._dsf; window._dsInit || (window._dsInit = !0, setTimeout(function () { bridge.call("_dsb.dsinit") },
                0)); "object" == typeof a ? c._obs[b] = a : c[b] = a
        }, registerAsyn: function (b, a) { this.register(b, a, !0) }, hasNativeMethod: function (b, a) { return this.call("_dsb.hasNativeMethod", { name: b, type: a || "all" }) }, disableJavascriptDialogBlock: function (b) { this.call("_dsb.disableJavascriptDialogBlock", { disable: !1 !== b }) }
    };
    !function () {
        if (!window._dsf) {
            var b = {
                _dsf: { _obs: {} }, _dsaf: { _obs: {} }, dscb: 0, dsBridge: bridge, close: function () { bridge.call("_dsb.closePage") }, _handleMessageFromNative: function (a) {
                    var e = JSON.parse(a.data), b = { id: a.callbackId, complete: !0 }, c = this._dsf[a.method], d = this._dsaf[a.method], h = function (a, c) { b.data = a.apply(c, e); bridge.call("_dsb.returnValue", b) }, k = function (a, c) { e.push(function (a, c) { b.data = a; b.complete = !1 !== c; bridge.call("_dsb.returnValue", b) }); a.apply(c, e) }; if (c) h(c, this._dsf); else if (d) k(d, this._dsaf);
                    else if (c = a.method.split("."), !(2 > c.length)) { a = c.pop(); var c = c.join("."), d = this._dsf._obs, d = d[c] || {}, f = d[a]; f && "function" == typeof f ? h(f, d) : (d = this._dsaf._obs, d = d[c] || {}, (f = d[a]) && "function" == typeof f && k(f, d)) }
                }
            }, a; for (a in b) window[a] = b[a]; bridge.register("_hasJavascriptMethod", function (a, b) { b = a.split("."); if (2 > b.length) return !(!_dsf[b] && !_dsaf[b]); a = b.pop(); b = b.join("."); return (b = _dsf._obs[b] || _dsaf._obs[b]) && !!b[a] })
        }
    }();
    return bridge;
})
// 主模块
define(['dialog'], function (dialog) {
    var exports = {};
    function url2kv() {
        return dialog.url2kv(location.href)
    }
    var history = require('app#history')
    // hash改变调用
    dialog.query(window).on('hashchange', function (e) {
        var kv = url2kv();
        exports.init(kv)
        history.set(e.oldURL)
    })

    var pages = {
        def: '标题',
        mine: '我的推广'
    }
    // 初始化
    exports.init = function (kv) {
        var config = require('app#templete');
        kv || (kv = url2kv());
        kv.title = pages[dialog.picker(kv, 'page|bg|def=>page').page];
        var voter = config.init(kv);
        // 设置bar距离
        voter.data.top = 40;

        exports.loading(true);
        dialog.query(voter.node).appendTo('body')
    }
    // 设置loading
    exports.loading = function (del) {
        if (del) return dialog.query('.App,.loading').remove();
        if (dialog.query('.loading').length) return;
        dialog.query('.loading', true).appendTo('body')
    }
    return exports;
})

define('history', ['app#dsbridge'], function(dsBridge) {
    var URL = location.href;
    return {
        back() {
            if (location.href == URL) {
                dsBridge.call("yfyvideo.close", function (v) {
                    alert(v);
                }) 
                // alert(location.href)
                return;
            }
            history.go(-1);
            // URL = location.href;
        },
        set(url) {
            URL = url;
        }
    }
})

define('bar', ['dialog'], function (dialog) {
    var history = require('app#history');
    var Bar = dialog.render('(.goback[:onclick="back"]+div.title{{title}})', {
        data: {
            title: '标题'
        },
        events: {
            back() {
                history.back();
            }
        }
    });

    return Bar;
})

define('bar-click', ['dialog'], function (dialog) {
    var history = require('app#history');
    var host = require('app#host');
    var Bar = dialog.render('(.goback[:onclick="back"]+div.title{{title}}+.feedback[:onclick="feedback"]{反馈})', {
        data: {
            title: '标题',
            listen: null,
            top: 30
        },
        watch: {
            top(v) {
                dialog.query(this._el).stop(true, true).css({
                    'padding-top': v
                })
            }
        },
        events: {
            back() {
                history.back();
            },
            feedback() {
                host.feedback('反馈')
            }
        }
    });

    return Bar;
})
define('pay', ['dialog'], function (dialog) {
    var host = require('app#host');
    var Bar = dialog.render('(+>(div.info>(div.l-box>div.icon+div.text-name-box>(.name-box{{username}}+.tips[:onclick="share"]{邀请推广链接 复制})+.l{})+(div.r-box>div.qc[:onclick="qc"])+.l)+div.block{center}+div.block{center}+div.block{center})', {
        data: {
            username: ''
        },
        events: {
            share() {
                host.share('分享')
            },
            qc() {
                host.qc('邀请码')
            }
        }
    });

    return Bar;
})
define('mine-h', ['dialog'], function (dialog) {
    var host = require('app#host');
    var Bar = dialog.render('(+>(div.info>(div.l-box>div.icon+div.text-name-box>(.name-box{{username}}+.tips[:onclick="share"]{邀请推广链接 复制})+.l{})+(div.r-box>div.qc[:onclick="qc"])+.l)+Pay[:data="pay"]+div.block{center}+div.block{center})', {
        data: {
            username: '桃白白',
            pay: {}
        },
        slots: {
            Pay: require('app#pay')
        },
        events: {
            share() {
                host.share('分享')
            },
            qc() {
                host.qc('邀请码')
            }
        }
    });

    return Bar;
})
define('bottom', ['dialog'], function (dialog) {
    var Bar = dialog.render('.bottom[:if="show"]{}', {
        data: {
            show: false
        }
    });

    return Bar;
})
define('templete', ['dialog'], function (dialog) {
    var exports = {};
    exports.init = function (data) {
        var _data = {};
        dialog.merge(_data, data || {}, {
            title: '...',
            bottom: false,
            model: 'mine-h',
            bg: 'a',
            top: 30
        }, 'mix')
        return dialog.render('div.bar[:class="bg?bg:""" ]>Bar[:title="title" :top="top"])+Show+(Bottom[:show="bottom"]', {
            selector: 'App',
            data: _data,
            slot: {
                Bar: require('app#?'.on(_data.bg == "mine" ? "bar-click" : "bar")),
                Show: require('app#{!!model,model,show}'.format(_data)),
                Bottom: require('app#bottom')
            }
        });
    }
    return exports;
})

// 调用宿主方法
define('host', ['dsbridge', 'dialog'], function (dsBridge, dialog) {
    // var dsBridge = require('dsbridge');
    function tips(msg) {
        dialog.tips('点击了::?'.on(msg), 3, 'top right')
    }
    return {
        share(v) {
            document.title = v
            tips(v)
            //Call asynchronously
            dsBridge.call("yfyvideo.share", {
                title: 'test',
                username: 'xxxxxxx',
                url: location.href,
            }, function (v) {
                alert(v);
            })

            // //Register javascript API for Native
            // dsBridge.register('addValue',function(l,r){
            //     return l+r;
            // })
        },
        qc(v) {
            document.title = v
            tips(v)
            dsBridge.call("yfyvideo.showQrcode", {
                url: location.href,
            }, function (v) {
                alert(v);
            })
        },
        feedback(v) {
            document.title = v
            tips(v)
            dsBridge.call("yfyvideo.feedback", {
                type: '',
            }, function (v) {
                alert(v);
            })
        }
    }
})