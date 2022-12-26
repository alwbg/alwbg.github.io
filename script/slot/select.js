define(['dialog'], function (dialog) {
    'use strict';
    var Nil;
    var workers = dialog.render(`
        <label :for="data" class="radio" :class.cur="select" :onclick="click">
            <span class="el-i">
                <i></i>
            </span>
            <span class="el-name">{name}</span>
        </label>
    `, {
        data() {
            return {
                // 数据
                data: null,
                // 是否多选
                multi: false,
                // 当前默认值
                current: null,
                // 选中集合
                selects: {},
                // 分隔符
                split: ',',
                // 先关属性
                trigger: 'id'
            }
        },
        init() {
            console.log('INIT::', this, ...arguments)
        },
        watch: {
            current(data, prev) {
                console.log('CURRENT::', ...arguments)
                // if (data == prev) return;
                var Map;
                var _new = {};
                dialog.each((data + '').split(this.split), (k, v) => {
                    _new[v] = ''
                })
                dialog.differ(_new, this.selects, function (v, has) {
                    if (!has) delete this[v];
                    else this[v] = has
                }, Map = this.selects);

                dialog.each(this.data, function (k, v, _, Map) {
                    var data = v[this.trigger];
                    v.select = data in Map;
                }, this, Map);
            },
            select: function (data, prev) {
                console.log('SELECT::', this.$idx, ...arguments)
                // if (this.lock) return;
                var k = this.data[this.$idx][this.trigger];
                if (data == false) {
                    delete this.selects[k];
                } else {
                    if (this.selects[k]) return;
                    this.selects[k] = true;
                }

                if (this.multi) {
                    var pi = [];
                    dialog.each(this.selects, function (_) {
                        _ && this.push(_);
                    }, pi)
                    this.current = pi.join(this.split);
                } else {
                    this.current = k;
                }
            }
        },
        events: {
            click() {
                if (!this.multi && this.current != Nil) {
                    this.selects = {};
                }
                this.select = !this.select;
            }
        }
    });
    return workers;
});

define('onoff', ['dialog'], function (dialog) {
    'use strict';
    var Nil;
    var workers = dialog.render(`
        <span :class="show ? '_open': '_close'" class="i-state" :onclick="show"></span>
    `, {
        data() {
            return {
                show: true,
                data: []
            }
        },
        watch: {
            data() {
                console.log(...arguments)
            }
        },
        events: {
            show: function () {
                this.show = !this.show
            }
        }
    });
    return workers;
});

define('link', ['dialog'], function (dialog) {
    'use strict';
    var Nil;
    var workers = dialog.render(`
    <span :class="show ? '_open': '_close'" class="i-state" :onclick="show"></span>{name}
    `, {
        data() {
            return {
                show: true,
                name: ''
            }
        },
        watch: {
            name() {
                console.log(...arguments)
            },
            show() {
                console.log(...arguments, this.name)
            }
        },
        events: {
            show: function () {
                this.show = !this.show
            }
        }
    });
    return workers;
});

define('input', ['dialog'], function (dialog) {
    'use strict';
    var Nil;
    var workers = dialog.render(`
    <style>
    .input-line {
        margin-bottom: 18px;
        padding: 7px;
        height: 40px;
        position: relative;
    }
    
    .input-line input{
        height:100%;
        width: 100%;
        display:block;
        outline: none;
        padding: 5px;
        font-size: 12px;
        font-weight: bold;
        border: 0;
        border-radius: 0.3rem;
    }
    
    span.input-tips {
        position: absolute;
        display: block;
        width: 100%;
        color: #979797;
        line-height: 40px;
    }

    .input-fly>span {
        animation: input-fly-m 0.3s;
        animation-fill-mode: forwards;
    }
    @keyframes input-fly-m {
        to {
            color: #fff;
            padding-left: 0;
            top: -25px;
            font-size: 12px;
            width: auto;
            font-weight: bold
        }
        from{
            top: 7px;
        }
    }
    .input-fly-back>span {
        animation: input-fly-back-m 0.3s;
        animation-fill-mode: forwards;
    }
    @keyframes input-fly-back-m {
        from{
            top: -25px;
            font-size: 12px;
        }
        to {
            font-size: 14px;
            padding-left: 10px;
            top: 7px;
        }
    }
    </style>
    <div class="input-line" :class="fly ? 'input-fly' : 'input-fly-back'">
        <span class="input-tips" :onclick="tofly">{tips}</span>
        <input class="" :value="value" :type="type"  :onblur="blur"/>
    </div>
    `, {
        init(_, target) {
        },
        data() {
            return {
                fly: false,
                value: '',
                tips: '',
                type: 'text'
            }
        },
        watch: {
        },
        events: {
            blur() {
                this.fly = !/^\s*$/.test(this.value);
            },
            tofly() {
                this.fly = true;
                dialog.query('input', this._el).trigger('focus');
            }
        }
    });
    return workers;
});

define('button', ['dialog'], (dialog) => {
    return dialog.render(`
    <style>
    .input-line {
        margin-bottom: 18px;
        padding: 7px;
        height: 40px;
        position: relative;
    }
    </style>
    <button :onclick="ink">
        Click\\ me\\ {count * 3}
    </button>
`, {
        data: function () {
            return {
                count: 0
            }
        },
        events: {
            ink() {
                this.count++;
            }
        }
    })
})