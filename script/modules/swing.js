define(['dialog'], function (dialog) {
    var exports = {}
    var duration = 700;

    exports.run = function () {
        var config = dialog.picker(arguments, '0.duration=>duration,0.*=>*');
        dialog.query(document.documentElement).on('click', config.selector || '', (e) => {
            // return show(e)
            var target = e.target;
            var swing = dialog.query('div.swing', true).appendTo(target);
            target = dialog.query(target);
            var offset = dialog.picker(e, 'offsetX|layerX=>x,offsetY|layerY=>y');

            var scale = (target.attr('clientWidth') / 100 * 8) >> 0;
            var css = swing.css('height,width', 'number');

            var top = offset.y - css.height / 2, left = offset.x - css.width / 2;
            // swing.attr('style', 'opacity:1');
            swing.attr('style', 'opacity:0;transition-duration:?ms;transform:scale(?);top:?px;left:?px'.on(duration, scale, top, left));
            // debugger
            setTimeout(function () {
                swing.remove();
            }, config.duration || duration)
        })
    }
    return exports
})