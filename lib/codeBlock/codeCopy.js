$(function () {
    var $copyIcon = $('<i class="fa fa-copy code_copy" title="复制代码" aria-hidden="true"></i>');
    $('.table-container').prepend($copyIcon);
new ClipboardJS('.fa-copy', {
    target: function (trigger) {
        return trigger.nextElementSibling;
    }
});

});