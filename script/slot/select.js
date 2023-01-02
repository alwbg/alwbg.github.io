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

define('tq', ['dialog'], (dialog) => {
    var tq = dialog.render(`
    div>(div.error-tips{天气搜索免责声明,如有侵权,联系删除...(alwbg@163.com)})+
    +(div.tip-msg{调用接口测试(接口,ICON来源来源www.tianqiapi.com)}+
        Select.city-items[:trigger="name" :data="citys" :current="citycur"]
    )+
    (
        Input[:value="value" :tips="请输入城市中文名" :fly="fly"]
    )
    +(
        div.tq>
            div.city{城市:{city}}
            +div.days>
                (
                    div.day-box[:for="data" :class="wea_img+''"]>
                        div.day>
                        (
                            img[:src="'./images/icons/'+wea_img+'.png'"]+
                            .day-title{{day}}
                            +div.date{{date}}
                            +div.rain>(span.t{降雨概率}+span{{rain}})
                            +div.tem>(span.t{实时温度}+span{{tem}℃})
                            +div.tem1>(span.t{高温}+span{{tem1}℃})
                            +div.tem2>(span.t{低温}+span{{tem2}}℃)
                            +div.humidity>(span.t{湿度}+span{{humidity}})
                            +div.air>(span.t{空气质量}+span{{air}})
                            +div.win_speed>(span.t{风速}+span{{win_speed}})
                            +div.air_level>(span.t{空气等级}+span{{air_level}})
                        )
                        +div.back>
                            (
                                img[:src="'./images/icons/'+wea_img+'.png'"]+
                                +div.sunrise>(span.t{日出}+span{{sunrise}})
                                +div.sunset>(span.t{日落}+span{{sunset}})
                                +div.moonPhrase>(span.t{月相}+span{{moonPhrase}})
                                +div.moonrise>(span.t{月出}+span{{moonrise}})
                                +div.moonset>(span.t{月落}+span{{moonset}})
                                +div.visibility>(span.t{能见度}+span{{visibility}})
                                +div.narrative{{narrative}}
                            )
                )
                +div.tip-msg.empty-search[:if="!data.length"]{{error}}
    )
        `, {
        slot: {
            Input: require('./script/slot/select#input'),
            Select: require('./script/slot/select')
        },
        data() {
            return {
                citycur: '',
                citys: [{name: '北京'}, {name: '深圳'}, {name: '沈阳'}, {name: '咸阳'}, {name: '上海'}, {name: '成都'}, {name: '拉萨'}, {name: '重庆'}, {name: '不存在'}],
                fly: false,
                data: [],
                city: '-',
                // // update_time: '-'
                value: null,
                t: 0,
                error: 'loading...'
            }
        },
        watch: {
            value(city) {
                clearTimeout(this.t);
                this.t = setTimeout(() => {
                    console.log(city)
                    // this.data = [];
                    require(_Qma.searchuri.on({ city: city || '' }), (data) => {
                        console.log(data)
                        this.error = 'loading...';
                        this.citycur = city;
                        dialog.merge(this, data, true);
                        if (data.data == undefined){
                            this.data = [];
                            this.error = '空空如也~~   请重新输入';
                            this.city = city;
                        }
                    })

                }, 1 * 1000)
            },
            citycur(city) {
                this.value = city;
                this.fly = true;
                console.log(city)
            }
        }
    });
    tq.data.data = []
    return tq
})