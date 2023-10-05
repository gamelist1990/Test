function header_f() {
    var d0 = new Date(), d1 = new Date(2022, 9 - 1, 30);
    var n = ' <span style="font-size:11px;color: #333333">8/17</span> ';
    if (d1.getTime() - d0.getTime() > 0) { n += '<img src="http://typingx0.net/img/new_w.gif" width="28" height="9" alt=""/>'; }
    var html = "";
    html += '<div id="logo"><a href="https://neutralx0.net/"><img src="http://typingx0.net/img/logo.gif" width="120" height="40" alt=""/></a></div>';
    html += '<div id="header_menu"><ul>';
    html += '<li><p><a href="https://neutralx0.net" style=color:#333>HOME</a></p></li>';
    html += '<li><p><a href="http://typingx0.net/">笘�ち繧､繝斐Φ繧ｰ</a></p></li>';
    html += '<li><p><a href="https://neutralx0.net/room/">笘�┳蜃ｺ繧ｲ繝ｼ繝�</a></p></li>';
    html += '<li><p><a href="https://neutralx0.net/mini/sakusaku/">笘�Α繝九ご繝ｼ繝�</a></p></li>';
    html += '<li><p><a href="https://neutralx0.net/tools/">笘�Web繝��繝ｫ</a></p></li>';
    html += '<li><p><a href="https://neutralx0.com/" target="_blank" class="topmenu">螳滄ｨ灘ｮ､</a></p></li>';
    html += '<li><p><a href="https://youtube.com/@neutralx" target="_blank" class="topmenu">Youtube</a></p></li>';
    html += '<li><p><a href="http://info.neutralx0.com/" target="_blank" class="topmenu">繝倥Ν繝�</a></p></li>';
    html += '<li><p><a href="https://twitter.com/neutral_info" target="_blank" style="color:#333">譖ｴ譁ｰ' + n + '</a></p></li>';
    html += '</ul></div>';
    document.getElementById('header').innerHTML = html;
}

function footer_f() {
    var html = '<div id="page_top"><a href="#top">&#9650;</a></div>';
    html += '<div id="footer_main">';
    html += '<p><a href="https://neutralx0.net/about.html" target="_blank">縺泌茜逕ｨ隕冗ｴ��繝励Λ繧､繝舌す繝ｼ繝昴Μ繧ｷ繝ｼ</a></p>';
    html += '<p>&copy; 2005 Neutral.</p>';
    html += '</div>';
    document.getElementById('footer').innerHTML = html;
}

function sns_f() {
    var html = '<ul>';
    //tw
    html += '<li><a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false">Tweet</a></li>';
    //fb
    var url = encodeURIComponent(location.href);
    html += '<li><iframe src="https://www.facebook.com/plugins/like.php?href=' + url + '&width=90&layout=button&action=like&size=small&share=false&height=65&appId" width="90" height="65" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></li>';


    html += '</ul>';
    document.getElementById('sns').innerHTML = html;

    var e = document.createElement("script");
    e.src = "https://platform.twitter.com/widgets.js";
    e.charset = "utf-8";
    document.body.appendChild(e);

    e = document.createElement("script");
    e.src = "https://b.st-hatena.com/js/bookmark_button.js";
    e.charset = "utf-8";
    e.async = "async"
    document.body.appendChild(e);
}