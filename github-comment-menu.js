// ==UserScript==
// @name Github Comment Menu
// @namespace http://iknowur.name/
// @version 0.1.2
// @description Adds a quick-link menu to comments in commit view
// @match https://github.com/*/commit/*
// @copyright 2014+, Lauri Piisang
// @downloadURL https://raw.githubusercontent.com/lauripiisang/github-comment-menu/master/github-comment-menu.js
// @updateURL https://raw.githubusercontent.com/lauripiisang/github-comment-menu/master/github-comment-menu.js
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==
$(document).ready(function () {
    var comments = $('.comment.timeline-comment:visible');
    var commentCount = comments.length;
    
    //If there are no comments, do not waste time
    if(!commentCount)
        return;
        
    //Let's create the menu
    
    var commentMenuHtml = '<li id="comment-menu-list" class="subscription">\
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
    
    $('.pagehead-actions').prepend(commentMenuHtml);
    $('#comment-count').text(commentCount);
    var submenu = $('#comment-menu-list .select-menu-list');
    var realItemHtml;
    var fileline;
    var comment;
    var excerpt;
    
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
        
        //This selects the previous line of code. Lines of code have a 'b' element that contains related information as data
        var commentData = $($(comment).parents('tr.inline-comments')[0]).prev('tr').find('b').data();
        
        if (typeof commentData == "undefined" || !commentData)
            fileline = "commit general";
        else {
            var filePath = commentData.path;
            var filePathPart = filePath.split('/');
            var fileName = filePathPart[filePathPart.length - 1];
            fileline = fileName + ':' + commentData.line;
        }

        realItemHtml = realItemHtml.replace("FILELINEHOLDER", fileline);

        //"real item" is constructed, add it to our menu.
        submenu.append(realItemHtml);
        //reset to start fresh.
        realItemHtml = "";
    }
});
