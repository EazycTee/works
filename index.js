var tpl = function(items) {
    var result = items.map(function(i) {
        var codeUrlStatus = '';
        i.imgUrl = i.imgUrl ? i.imgUrl : '';
        if (!i.codeUrl) {
            i.codeUrl = 'javascript:;';
            codeUrlStatus = ' disable';
        }
        var item = 
            '<li>' + 
                '<div class="imgWrap">' +
                    '<image src="' + i.imgUrl + '" title="' + i.title + '" alt="图 ' + i.title + '">' +
                '</div>' +
                '<div class="ctWrap">' +
                    '<p class="title">' + i.title + '</p>' +
                    '<p class="desc">' + i.desc + '</p>' +
                '</div>' +
                '<div class="btnWrap clearfix">' +
                    '<a class="btn page fl" target="_blank" href="' + i.pageUrl + '">浏览页面</a>' +
                    '<a class="btn code fr' + codeUrlStatus + '" target="_blank" href="' + i.codeUrl + '">查看代码</a>' +
                '</div>' +
            '</li>'
        ;
        return item;
    }).join('');
    return result;
}

document.getElementById('catalog').innerHTML = tpl(catalog);