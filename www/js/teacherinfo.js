var teacherinfo = new function() {
    var jqPage = null;
    var jqTeacherInfo = null;
    var mdl_TeacherInfo = null;
    
    this.init = function() {
        logger.debug('teacherinfo initing.....');
        jqPage = $('body > div#pgTeacherInfo');
        jqTeacherInfo = $('#div_teacherinfo_detail', jqPage);
    };
    
    this.beforeshow = function() {
        logger.debug('teacherinfo beforeshow.....');
        var tid = commonUtil.urlParam('tid');
        ajaxor.ajax('getteacherinfo', 
            'tid=' + tid,
            function(oResult) {
                if (oResult.IsSuccessful) {
                    mdl_TeacherInfo = oResult.ResultObj;
                    initData();
                } else {
                    commonUI.commonDialog('读取数据失败', oResult.Message, function() { $.mobile.back(); }, true);
                }
            }
        );
    };
    
    var initData = function() {
        var oTeacher = mdl_TeacherInfo['Teacher'];
        var arrGroups = mdl_TeacherInfo['Groups'];
        
        $('#img_teacherinfo_photo', jqTeacherInfo).attr('src', oTeacher['PhotoURL']);
        $('#span_teacherinfo_desc', jqTeacherInfo).html('<b>' + oTeacher['Name'] + ' - </b>' + oTeacher['Description']);
        
        var sHTML = '<li data-role="list-divider">所授课程及成绩信息</li>';
        if (arrGroups && arrGroups.length > 0) {
            for (var i = 0; i < arrGroups.length; i++) {
                var oGroupInfo = arrGroups[i];
                sHTML += '<li data-role="list-divider" class="li_teacherinfo_groups_classname">' + oGroupInfo['RealClassName'] + '</li>'
                       + '<li class="li_teacherinfo_groups_item">';
                
                if (oGroupInfo['ScoreEntries'] && oGroupInfo['ScoreEntries'].length > 0) {
                    for (var j = 0; j < oGroupInfo['ScoreEntries'].length; j++) {
                        var oScoreEntry = oGroupInfo['ScoreEntries'][i];
                        sHTML += '<table><tr><td colspan="4">' + oScoreEntry['RTranscriptName'] + '</td></tr><tr>'
                               + '  <th>分数</th><td>' + oScoreEntry['Score'] + '</td>'
                               + '  <th>分层</th><td>' + oScoreEntry['Level'] + '</td>'
                               + '</tr><tr>'
                               + '  <th>评语</th><td colspan="3">' + oScoreEntry['Comment'] + '</td>'
                               + '</tr><tr>'
                               + '  <!--<th>成绩单</th><td colspan="3">' + oScoreEntry['RTranscriptName'] + '</td>-->'
                               + '</tr></table>';
                    }
                } else {
                    sHTML += '没有成绩信息或尚未录入.';
                }
                
                sHTML += '</li>';
            }
        } else {
            sHTML += '<li class="li_teacherinfo_groups_item">没有成绩信息.</li>';
        }
        //jqTbl.find('tr.transcriptScoreEntry').remove();
        $('#ul_teacherinfo_groups', jqPage).empty().append(sHTML).listview('refresh');
    };
};