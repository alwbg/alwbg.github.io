define(['dialog'], function (dialog) {
    'use strict';

    // 第一次打开时的动画 可以被覆盖 @see dialog.push('auto', 'animate', Function)
    dialog.push('auto', 'in', function (host, start, end, up) {
        var startcss = { opacity: 0.7 };
        var endcss = { opacity: 1 };
        start = start || '+=10';
        end = end || '-=10';
        if (up == 'auto') {
            startcss.bottom = end;
            endcss.bottom = start;
        } else {
            startcss.top = start;
            endcss.top = end;
        }
        host.room.stop(true, true).css(startcss).stop(true, true).animate(endcss, {
            speed: 200,
            easing: function (x) {
                return x
            }
        });
    });

    var exports = {};
    var offsetTop = 20;
    var offsetLeft = 10;
    var STEP = {
        width: '-=?'.on(offsetLeft * 2),
        top: '+=?'.on(offsetTop),
        left: '+=?'.on(offsetLeft),
        'border-top-left-radius': '+=10',
        'border-top-right-radius': '+=10',
        // transform: 'rotateX(10deg)'
    }
    var STEPOUT = {

        // transform: 'rotateX(0deg)'
    };
    dialog.each(STEP, function (k, v) {
        this[k] = v.replace.apply(v, /^width$/.test(k) ? [/^\-/, '+'] : [/^\+/, '-']);
    }, STEPOUT);
    function toGoIn(host, old) {
        if (isDeskTop) return;
        var init = dialog.picker(old, 'border-top-left-radius,border-top-right-radius');
        host.room.stop().css(init).animate(STEP, {
            speed: 400,
            easing: function (x) {
                return x
            }
        })
    }
    var isDeskTop;
    /**
     * 
     * @param {*} host 
     * @param {*} config 
     */
    exports.run = function (host, config) {
        var RO = host.room;
        if (dialog.isEmpty(RO)) {
            var host = dialog.query(host).parent('.windows');
            var id = host.attr('id');
            host = dialog.list[id];
            RO = host.room;
        }
        // host.root.css({
        //     perspective: '700px'
        // })
        var OLD = RO.css('width,top,left,border-top-left-radius,border-top-right-radius', 'number');
        var SET = dialog.picker(config, 'm|mode=>mode,data,events,slot,watch');
        var OffsetTop = dialog.picker(config, 'top').top || 60;
        dialog.merge(SET, {
            mode: '{{text}}',
            data: {
                text: '内容~'
            }
        })
        var screen = dialog.screen();
        isDeskTop = screen.width > 600;
        toGoIn(host, OLD);
        // alert(screen.width)
        dialog.auto(SET, {
            cs: (isDeskTop ? 'in: +=40 -=40' : 'offset:2 ? 2 0;in: +=40 -=40 ?;inner: 0 0 0 0 .content').on(OffsetTop),
            last: function () {
                var tips = null;
                isDeskTop || setTimeout(() => {
                    tips = dialog.notice('((div>div{点击头部空间关闭~}+[text="{top}"]+div{所在容器距离头部空间}))'.on(config), 8, {
                        target: this.room,//.find('img'),
                        position: 'top'
                    })
                }, 300)
                this.addClass(config.selector || 'fade')

                this.onresize(() => {
                    toGoIn(host, OLD);
                })
                this.onclose(() => {
                    dialog.destroy(tips);
                    isDeskTop || host.room.stop(true, true).animate(STEPOUT, {
                        speed: 400,
                        easing: function (x) {
                            return 1 - Math.pow(1 - x, 5);
                        }
                    })
                })
                this.proxy('bg', () => {
                    this.remove()
                })
            },
            end: !isDeskTop,
            destroy: {
                css: {
                    top: '+=30px',
                    opacity: 0
                },
                speed: 400
            }
        })
    }
    return exports
});