// ==UserScript==
// @name         Steam Chinese Checker
// @namespace    https://github.com/sffxzzp
// @version      0.02
// @description  Show Chinese patch info if the game has 3rd-party Chinese translations.
// @author       sffxzzp
// @match        *://store.steampowered.com/app/*
// @icon         https://store.steampowered.com/favicon.ico
// @resource data https://cdn.jsdelivr.net/gh/sffxzzp/SteamChineseChecker/data.json
// @updateURL    https://cdn.jsdelivr.net/gh/sffxzzp/SteamChineseChecker/steamchinesechecker.user.js
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
    var util = (function () {
        function util() {}
        util.createElement = function (data) {
            var node;
            if (data.node) {
                node = document.createElement(data.node);
                if (data.content) {this.setElement({node: node, content: data.content});}
                if (data.html) {node.innerHTML = data.html;}
            }
            return node;
        };
        util.setElement = function (data) {
            if (data.node) {
                for (let name in data.content) {data.node.setAttribute(name, data.content[name]);}
                if (data.html!=undefined) {data.node.innerHTML = data.html;}
            }
        };
        return util;
    })();
    var steamcc = (function () {
        function steamcc() {};
        steamcc.prototype.insert = function (data) {
            var rightcol = document.querySelector('div.game_meta_data');
            var langpanel = document.querySelector('table.game_language_options').parentNode.parentNode;
            var newpanel = util.createElement({
                node: 'div',
                html: '<div class="block responsive_apppage_details_right"><div class="block_title">汉化信息：</div><p><b>'+data.description+'</b></p><p><a target="_blank" style="float: right;" href="'+data.link+'">查看更多</a></p><br /></div>'
            });
            rightcol.insertBefore(newpanel, langpanel);
        }
        steamcc.prototype.run = function () {
            var appid = parseInt(/\d+/.exec(location.href)[0]);
            var data = JSON.parse(GM_getResourceText('data'));
            if (data[appid] !== undefined) {
                this.insert(data[appid]);
            }
        };
        return steamcc;
    })();
    var script = new steamcc();
    script.run();
})();
