define(['dialog'], function (dialog) {
    'use strict';

    function move(signal, host) {
        var list = dialog.list;
        var id = dialog.picker(host, 'id').id;
        var index = 0;
        var lists = [], current = 0;
        var height = host.room.attr('offsetHeight') + 2
        dialog.each(list, (k, v) => {
            if (v.name != 'notice') return;
            if (v.id >= id) {
                current++;
                // return //true;
            }
            lists.push(v.id)
        });
        lists.sort((a, b) => 2 * (a < b) - 1);
        // console.log(lists, current, lists.length);
        dialog.each(lists, (k, v) => {
            v = list[v];
            if (v.id >= id) return;
            v.room.animate({
                top: '?=?'.on(signal, current + index++ > 1 ? 4 : height),
                // top: '?=?'.on(signal, 3),
                opacity: '?=?'.on(signal == '-' ? '+' : '-', 0.3)
                // left: '?=3'.on(signal == '-' ? '+' : '-'),
                // width: '?=10'.on(signal == '-' ? '+' : '-')
            }/* , '{600-1200}'.on() */)
            v._top = v.room.css('top', 'number');
        });
    }
    function closeall() {
        var list = dialog.list;
        dialog.each(list, (k, v) => {
            if (v.name != 'notice') return;
            v.remove()
        });
    }

    function Notice(config) {
        var SET = dialog.picker(config, 'm|mode=>mode,data,events,slot,watch');
        dialog.merge(SET, {
            mode: '{{text}}',
            data: {
                text: '内容~'
            }
        })
        var offsetlr, screen = dialog.screen(),
            min = config.min || 600,
            isMini = screen.width > min;
        if (isMini) {
            offsetlr = 'auto'
        } else {
            offsetlr = 20
        }
        return dialog.auto(SET, {
            name: 'notice',
            auto: {
                /* 参见参数cs */
                offset(data) {
                    data[2] = this._top || 2;
                }
            },
            cs: 'offset: ? 4 ? auto'.on(offsetlr),
            last() {//[notice,tips,error,white,black]
                this.addClass('dialog-tips notice-box {0,0,black}'.on(config.theme || 0));
                isMini && this.room.css({
                    minWidth: '600px',
                    // 'border-radius': '5'
                })
                move('+', this)
                this.onclose(() => {
                    move('-', this)
                })
            },
            position: !isMini ? '?'.on(config.position) : ''
        })
    }
    Notice.close = closeall;
    return Notice
});