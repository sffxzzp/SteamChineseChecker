// ==UserScript==
// @name         Steam Chinese Checker
// @namespace    https://github.com/sffxzzp
// @version      0.05
// @description  Show Chinese patch info if the game has 3rd-party Chinese translations.
// @author       sffxzzp
// @match        *://store.steampowered.com/app/*
// @icon         https://store.steampowered.com/favicon.ico
// @resource     data https://cdn.jsdelivr.net/gh/sffxzzp/SteamChineseChecker/data.json
// @downloadURL  https://cdn.jsdelivr.net/gh/sffxzzp/SteamChineseChecker/steamchinesechecker.user.js
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
            var langpanel = rightcol.querySelector('div#LanguagesHeader').parentNode;
            var newpanel = util.createElement({
                node: 'div',
                html: `<div class="block responsive_apppage_details_right heading">汉化信息</div><div class="block underlined_links"><div class="block_content"><div class="block_content_inner"><div class="details_block"><b>${data.description}</b></div><a href="${data.link}" class="linkbar" style="margin-top: 14px;" target="_blank">查看更多 <img src="https://steamstore-a.akamaihd.net/public/images/v5/ico_external_link.gif" border="0" align="bottom"></a></div></div></div>`
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
