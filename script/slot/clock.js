define(['dialog', 'time'], function (dialog, time) {
    // 'use strict';
    var MODE = 'YYYY-MM-DD (子|丑|丑|寅|寅|卯|卯|辰|辰|巳|巳|午|午|未|未|申|申|酉|酉|戌|戌|亥|亥|子)时 24h:mm:ss';
    var
        ms = new time(MODE);
    function timer(Host) {
        Host.timemark = setTimeout(() => {
            if (Host.index % 2 == 0) return clearTimeout(Host.timemark)
            Host.date = ms.fire(+Date.now());
            timer(Host);
        }, 1000)
    }
    // console.log(ms)
    var self = arguments.callee;
    var render = dialog.render(
        `
    ((span[:class="index%2 ? '_open': '_close'" class="i-state" :onclick="click"]))
    (({时间{index%2?"开启":"关闭"}}))
    index%2=((span{{index%2}}))(index={index})
    ((+span[:class="isShow ? '_open': '_close'" class="i-state" :onclick="color"]+{{!isShow ? "查看":"隐藏"}该区域源码}))
    ((div.color-box.date[:class="color-box-gray:state" :onclick="click" style="font-size:18px;height:30px;line-height:30px;text-align:center;margin-bottom:10px"]{- {date} -}))
    ((div.test-title.code.code-color[:if="isShow"]{{color}}))
 `, {
        data: () => {
            return { date: 'text data!', index: 0, state: !true, color: '', isShow: false, showstate: false, mode: '' }
        },
        watch: {
            index(data) {
                this.state = !(data % 2);
            },
            mode(data) {
                ms.remode(data || MODE);
            }
        },
        events: {
            color() {
                this.isShow = !this.isShow;
                if (!this.showstate)
                    require('color', (color) => {
                        this.showstate = true;
                        var code = color.element(self);
                        this.color = code;
                    })
            },
            click() {
                this.index++
                timer(this);
            }
        }
    });

    return render;
});