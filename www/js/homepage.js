var homepage = new function() {
    var jqPage = null;

    this.init = function() {
        logger.debug('homepage initing.....');
        jqPage = $('body > div#pgHome');
    };

    this.beforeshow = function() {
        var newDate = new Date();
        newDate.setHours(newDate.getHours() - 14);
        var ushours = newDate.getHours();
        var usminutes = newDate.getMinutes();
        var shours = ushours < 10 ? ('0' + ushours) : ushours;
        var sminutes = usminutes < 10 ? ('0' + usminutes) : usminutes;
        $('#span_home_US_time').html((ushours < 12 ? ' 上午 ' : ' 下午 ') + shours + ':' + sminutes);
        
        initData();
    };
    
    var htmltag_title = '#title#';
    var htmltag_postid = '#postid#';
    var htmltag_imgsrc = '#imgsrc#';
    var htmltag_summary = '#summary#';
    var html_announcement = '<li><a href="commonpost.html?postid=#postid#" class="a_home_msg_notice">-#title#</a></li>';
    var html_studies = '<li><a href="commonpost.html?postid=#postid#"><img src="#imgsrc#" /><h2>#title#</h2><p>#summary#</p></a></li>';
    var html_news = '<li><a href="commonpost.html?postid=#postid#" class="a_home_school_news">-#title#</a></li>';
    var initData = function() {
        //数据加载成功:
        if (mdl_ParentLogin) {
            $('#span_home_header_student_name', jqPage).html(mdl_ParentLogin['RStudentName']);
            $('#div_home_header_datetime_text', jqPage).html(mdl_ParentLogin['LastLoginTime']);
            
            //posts:
            if (mdl_ParentLogin['PostDic']) {
                var postDic = mdl_ParentLogin['PostDic'];
                if (postDic['Announcement'] && postDic['Announcement'].length > 0) {
                    var jqListView = $('#ul_home_msg_notice', jqPage);
                    $('li>a.a_home_msg_notice', jqListView).parent().remove();
                    var html = '';
                    for (var i = 0; i < postDic['Announcement'].length; i++) {
                        var oPost = postDic['Announcement'][i];
                        gbl_PostDic[oPost['ID']] = oPost;
                        html += html_announcement.replace(htmltag_title, oPost['Title'])
                            .replace(htmltag_postid, oPost['ID']);
                    }
                    jqListView.append(html).listview('refresh');
                }
                if (postDic['Studies'] && postDic['Studies'].length > 0) {
                    var jqListView = $('#ul_home_activities', jqPage);
                    jqListView.find('li>a').parent().remove();
                    var html = '';
                    for (var i = 0; i < postDic['Studies'].length; i++) {
                        var oPost = postDic['Studies'][i];
                        gbl_PostDic[oPost['ID']] = oPost;
                        html += html_studies.replace(htmltag_title, oPost['Title'])
                            .replace(htmltag_imgsrc, commonUtil.combineURL(gbl_Domain, oPost['ThumbnailFullPath']))
                            .replace(htmltag_postid, oPost['ID'])
                            .replace(htmltag_summary, oPost['Summary']);
                    }
                    jqListView.append(html).listview('refresh');
                }
                if (postDic['News'] && postDic['News'].length > 0) {
                    var jqListView = $('#ul_home_school_news', jqPage);
                    jqListView.find('li>a.a_home_school_news').parent().remove();
                    var html = '';
                    for (var i = 0; i < postDic['News'].length; i++) {
                        var oPost = postDic['News'][i];
                        gbl_PostDic[oPost['ID']] = oPost;
                        html += html_news.replace(htmltag_title, oPost['Title'])
                            .replace(htmltag_postid, oPost['ID']);
                    }
                    jqListView.append(html).listview('refresh');
                }
            }
        }
    };
}