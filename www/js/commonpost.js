var commonpost = new function() {
    var jqPage = null;

    this.init = function() {
        logger.debug('commonpost initing.....');
        jqPage = $('body > div#pgCommonPost');
    };
    
    this.beforeshow = function() {
        logger.debug('commonpost beforeshow.....');
        var postid = commonUtil.urlParam('postid');
        var oPost = gbl_PostDic[parseInt(postid)];
        if (oPost && oPost['ID'] > 0) {
            $('#h3_commonpost_title', jqPage).html(oPost['Title']);
            $('#div_commonpost_postdate', jqPage).html(oPost['CreateTime']);
            $('#div_commonpost_body', jqPage).html(oPost['ContentBody']);
        } else {
            $.mobile.back();
        }
    };
};