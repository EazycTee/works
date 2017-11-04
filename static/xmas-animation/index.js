var util = {

    // 依次循环执行传入的函数
    // 参数：任意个函数
    toggleFn: function() {
        var fns = Array.prototype.slice.call(arguments); // 参数转换成数组
        var step = -1;

        // 调用：不带参数调用时执行下一个函数；可带1个 number 类型的参数，执行对应的函数
        // 返回：本次所执行函数的 index
        return function(num) {
            if (num && !fns[num]) {
                console.warn('not an expected argement: ' + num)
            } else {
                step = (num && fns[num]) ? num : step + 1;
                step = (step < fns.length) ? step : 0;
                fns[step]();
            }
            return step;
        }
    },
};


var player = (function() {
    // 缓存元素
    var $frame = $('.frame');
    var $xmas = $('#xmas');

    // 参数设置
    var x0 = -400; // 水平初始位置（相对于左上角）
    var y0 = 60; // 垂直初始位置（相对于左上角）
    var v_s = 80; // 水平速度（向右）
    var a_s = 80; // 水平向右加速度（向右）
    var v_h = 200; // 垂直速度（向下）
    var a_h = -50; // 垂直加速度（向下）
    var moveStep = 10; // 移动的切换时间（毫秒，数值越小，动画越平滑，但移动速度越慢）
    var switchStep = 200; // 动作的切换时间（毫秒）
    var flashBackTime = 4; // 动画循环时间（秒）
    var switchHeight = $xmas.css('top'); // 图片中两个动作的相对高度（根据图片设置）

    var moverID, switcherID;
    var t, s, h;

    // 暴露接口
    return {
        init: function() {
            var me = this;
            t = s = h = 0;

            // 设置出现位置
            $frame.css({
                left: x0 + 'px',
                top: y0 + 'px'
            });

            $xmas[0].src = './images/fatherChristmas.png';
            $xmas[0].onload = function() {
                // 开始动画
                me.toggleMove();
                me.toggleSwitch();
            }

            $('.button').on('click', function(e) {
                var $tg = $(e.target);
                if ($tg.hasClass('button1')) {
                    me.toggleMove();
                } else {
                    me.toggleSwitch();
                }
            });
        },

        // 开始或暂停移动
        toggleMove: util.toggleFn(
            function() {
                moverID = setInterval(function() {
                    t = (t <= flashBackTime) ? (t + moveStep / 1000) : 0; // 时间累加
                    s = Math.round(x0 + (v_s * t) + (a_s * t * t)); // 距离公式 s = vt + at^2
                    h = Math.round(y0 + (v_h * t) + (a_h * t * t));
                    $frame.css({
                        left: s + 'px',
                        top: h + 'px'
                    });
                }, moveStep);
            },
            function() {
                clearInterval(moverID);
            }
        ),

        // 开始或暂停动作切换
        toggleSwitch: util.toggleFn(
            function() {
                switcherID = setInterval(util.toggleFn(function() {
                    $xmas.css({ top: 0 });
                }, function() {
                    $xmas.css({ top: switchHeight });
                }), switchStep);
            },
            function() {
                clearInterval(switcherID);
            }
        )
    }
})().init();