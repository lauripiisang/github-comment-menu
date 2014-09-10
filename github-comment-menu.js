// ==UserScript==
// @name Github Comment Menu
// @namespace http://iknowur.name/
// @version 0.1
// @description Adds a quick-link menu to comments in commit view
// @match https://github.com/*/commit/*
// @copyright 2014+, Lauri Piisang
// @downloadURL https://raw.githubusercontent.com/lauripiisang/github-comment-menu/master/github-comment-menu.js
// @updateURL https://raw.githubusercontent.com/lauripiisang/github-comment-menu/master/github-comment-menu.js
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==
$(document).ready(function () {
    var commentMenuHtml;
    commentMenuHtml = '<li id="comment-menu-list" class="subscription">\
<div class="select-menu js-menu-container js-select-menu">\
<a class="social-count js-social-count" id="comment-count" href="#">\
X\
</a>\
<a href="#" id="comment-menu" class="minibutton select-menu-button with-count js-menu-target" role="button" tabindex="0" aria-haspopup="true">\
<span class="js-select-button">\
    <span class="octicon octicon-comment-discussion"></span>\
Comments\
</span>\
</a>\
<div class="select-menu-modal-holder">\
    <div class="select-menu-modal subscription-menu-modal js-menu-content" aria-hidden="true">\
        <div class="select-menu-list js-navigation-container" role="menu">\
        </div>\
    </div>\
</div>\
</div>\
</li>';
    var menuItemHtml = '<a class="select-menu-item js-navigation-item" role="menuitem" tabindex="INDEXHOLDER" href="LINKHOLDER">\
    <span class="select-menu-item-icon octicon octicon-comment"></span>\
    <div class="select-menu-item-text">\
        <span class="float: right" style="padding-right: 10px;">FILELINEHOLDER</span>\
        <h4>NAMEHOLDER</h4>\
        <span class="small">TIMEHOLDER</span>\
        <span class="description">EXCERPTHOLDER</span>\
    </div>\
</a>';
    var comments = $('.comment.timeline-comment:visible');
    var commentCount = comments.length;
    //Let's create the menu
    $('.pagehead-actions').prepend(commentMenuHtml);
    $('#comment-count').text(commentCount);
    var submenu = $('#comment-menu-list .select-menu-list');
    var realItemHtml;
    var fileline;
    var comment;
    for (var i = 0; i < commentCount; i++) {
        comment = comments[i];
        //First up, replace placeholders with actual values
        realItemHtml = menuItemHtml.toString();
        realItemHtml = realItemHtml.replace("INDEXHOLDER", i.toString());
        realItemHtml = realItemHtml.replace("LINKHOLDER", $(comment).find('a.timestamp').attr('href'));
        realItemHtml = realItemHtml.replace("TIMEHOLDER", $(comment).find('time').text());
        realItemHtml = realItemHtml.replace("NAMEHOLDER", $(comment).find('.author').text());
        excerpt = $(comment).find('.comment-body').text();
        excerpt = excerpt.substr(0, excerpt.lastIndexOf(' ', 75)) + '...';
        realItemHtml = realItemHtml.replace("EXCERPTHOLDER", excerpt.toString());
        fileline = $(comment).parents('tr').prev().data('path');
        if (!fileline || fileline == "undefined")
            fileline = "commit general";
        else {
            var filePathPart = fileline.split('/');
            var fileName = filePathPart[filePathPart.length - 1];
            fileline = fileName + ':' + $(comment).parents('tr').prev().data('line');
        }

        realItemHtml = realItemHtml.replace("FILELINEHOLDER", fileline);

        submenu.append(realItemHtml);
        realItemHtml = "";
    }
});
