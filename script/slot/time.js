define(['dialog', 'times'], function (dialog, time) {
    'use strict';
    var workers = dialog.render(`
        div.input-simply-text.input-style.date-slot[:data-tips="_tips"]
    `, {
        init() {
            var target = this._el;
            var tf = time.factory(target);
            var _target = dialog.query(target);
            var data = {};
            var dateslot = _target.find('.date-slot')
            // debugger
            dialog.merge(data, {
                target: dateslot,
                mode: 'YYYY-MM-DD' + (data.simply ? ' hh:mm:ss' : ''),
                tips: 'top,right',
                pos: 'bottom,right'
            })
            tf.init(data);
            _target.click((e) => {
                this._tips = '启动中...'
                setTimeout(() => {
                    tf.run();
                    this._tips = this.tips;
                }, 1)
            });

            this._tips = this.tips;
        },
        data() {
            return {
                _tips: '',
                tips: '请选择...'
            }
        },
        watch: {
        },
        events: {
        }
    });
    return workers;
});
