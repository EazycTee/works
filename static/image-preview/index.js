var util = {
    debounce: function(idle, action) {
        var last;
        return function() {
            var me = this;
            var args = arguments;
            clearTimeout(last);
            last = setTimeout(function() {
                action.apply(me, args);
            }, idle);
        }
    }
}

var vm = (function() {
    // 初始化时显示的图片数量
    var listFirstStepLength = 10; 

    // 数据源（list_result_data 通过 index.html 中的 script 载入）
    var listOrig = list_result_data.reverse();

    var listDefaultStepLength = 5;
    var statusMsgDefault = "点选一张图片随即自动拷贝链接，按“空格”或“回车”可预览选中的图片（数据源仅22张图片，作为功能展示，其余6000多张图片均是源文件里的拷贝）";
    var listResultUrl = listOrigUrl = [];

    return new Vue({
        el: "#main",
        data: {
            searchPhMsg: '搜索...',

            // 图床相关配置
            protocol: "http:",
            host: "oww4nskgw.bkt.clouddn.com",
            sep: '!', // 分隔符
            ss: { // styleString 图片样式
                tn: "tn", // thumbnail
                pv: "pv", // preview
                aw: "aw" // article with
            },

            // 辅助变量
            searchKeyword: '',
            statusMsg: statusMsgDefault,
            currentIndex: -1,
            list: [],
            listLength: 0,
            listLeft: 0
        },
        computed: {},
        mounted: function() {
            var me = this;

            me.fn_filter();
            me.fn_next(listFirstStepLength, true);

            // 绑定事件：点击 .tn 时，复制 data-clipboard-text 属性到剪贴板
            var clipboard = new Clipboard('.tn');

            // 按下回车时，如果选中了图片，则打开新窗口预览图片
            elmSearch = document.getElementById('search');
            document.body.onkeyup = function(e) {
                if ((e.code === 'Enter' || (e.code === 'Space' && e.target !== elmSearch)) && typeof listResultUrl[me.currentIndex] === 'string') {
                    window.open(listResultUrl[me.currentIndex] + me.sep + me.ss.pv);
                }
            }
        },
        methods: {
            onSearch: util.debounce(200, function() {
                var me = this;
                me.fn_filter(me.searchKeyword);
                me.fn_next(listFirstStepLength, true);
                me.currentIndex = -1;
                me.statusMsg = statusMsgDefault;
            }),
            onSelect: function(e) {
                var me = this;
                var elm = e.target;
                me.currentIndex = Number(elm.dataset.index);
                me.statusMsg = listOrig[me.currentIndex];
            },
            fn_filter: function(keyword) {
                var me = this;
                listResultUrl = [];
                if (keyword && keyword !== '') {
                    listOrig.forEach(function(val, i) {
                        if (val.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) > -1) {
                            listResultUrl.push(me.fn_origToUrl(val));
                        }
                    });
                } else if (listOrigUrl.length === 0) {
                    listOrig.forEach(function(val, i) {
                        listOrigUrl.push(me.fn_origToUrl(val));
                    });
                    listResultUrl = listOrigUrl;
                } else {
                    listResultUrl = listOrigUrl;
                }
                me.listLength = listResultUrl.length;
            },
            fn_origToUrl: function(orig) {
                var me = this;
                // return `${me.protocol}//${me.host}/${orig}`;
                return me.protocol + '//' + me.host + '/' + orig;
            },
            fn_next: (function() {
                var i;
                return function(num, isNewList) {
                    var me = this;
                    steplength = num ? num : listDefaultStepLength;
                    if (isNewList) {
                        i = 0;
                        me.list = [];
                    }
                    if (i <= me.listLength) {
                        me.list = me.list.concat(listResultUrl.slice(i, i + steplength));
                        i += steplength;
                        me.listLeft = i < me.listLength ? me.listLength - i : 0;
                    }
                }
            })()
        }
    });
})();
