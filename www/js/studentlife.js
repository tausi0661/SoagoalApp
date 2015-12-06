var studentlife = new function() {
    var jqPage = null;
    
    var mdl_PostLists = null;

    this.init = function() {
        console.log('studentlife initing.....');
        jqPage = $('body > div#pgStudendLife');
    };
    
    this.beforeshow = function() {
        ajaxor.ajax('listlifeposts', 
            'studentinfopostcount=' + soagoalConfig.studentinfopostcount + '&studentinfopostsummarylength=' + soagoalConfig.studentinfopostsummarylength,
            function(oResult) {
                if (oResult.IsSuccessful) {
                    mdl_PostLists = oResult.ResultObj;
                    initData();
                } else {
                    commonUI.commonDialog('读取数据失败', oResult.Message, null, true);
                }
            }
        );
    };
    
    var htmltag_id = '#id#';
    var htmltag_img = '#img#';
    var htmltag_name = '#name#';
    var htmltag_desc = '#desc#';
    var htmltag_timestamp = '#timestamp#';
    var html_post = '<li class="liStudentLifePost"><a href="commonpost.html?postid=#id#">'
                + '#img#<h2>#name#</h2><p>#timestamp#</p><p>#desc#</p></a></li>';
    var initData = function() {
        if (mdl_PostLists && mdl_PostLists.length > 0) {
            var sHTML = '', jqPostList = $('#ul_studentlive_activities', jqPage);
            for (var i = 0; i < mdl_PostLists.length; i++) {
                var oPost = mdl_PostLists[i];
                if (oPost && oPost['ID'] > 0) {
                    //add it into the global posts cache:
                    gbl_PostDic[oPost['ID']] = oPost;
                    
                    sHTML += html_post.replace(htmltag_id, oPost['ID'])
                            .replace(htmltag_img, oPost['ThumbnailFullPath'] ? '<img src="' + oPost['ThumbnailFullPath'] + '" />' : '')
                            .replace(htmltag_name, oPost['Title'])
                            .replace(htmltag_timestamp, oPost['CreateTime'])
                            .replace(htmltag_desc, oPost['Summary']);
                }
            }
            jqPostList.children('li.liStudentLifePost').remove();
            jqPostList.append(sHTML).listview('refresh');
        }
    };
};