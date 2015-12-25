var transcript = new function() {
    var jqPage = null;
    var jqTbl = null;
    var mdl_TranscriptAndScoreEntries = null;
    
    this.init = function() {
        logger.debug('transcript initing.....');
        jqPage = $('body > div#pgTranscript');
        jqTbl = $('#tbl_transcript', jqPage);
    };
    
    this.beforeshow = function() {
        logger.debug('transcript beforeshow.....');
        var tid = commonUtil.urlParam('tid');
        ajaxor.ajax('gettranscriptdetail', 
            'tid=' + tid,
            function(oResult) {
                if (oResult.IsSuccessful) {
                    mdl_TranscriptAndScoreEntries = oResult.ResultObj;
                    initData();
                } else {
                    commonUI.commonDialog('读取数据失败', oResult.Message, function() { $.mobile.back(); }, true);
                }
            }
        );
    };
    
    var initData = function() {
        var oTranscript = mdl_TranscriptAndScoreEntries['Transcript'];
        var arrScoreEntryList = mdl_TranscriptAndScoreEntries['ScoreEntryList'];
        
        $('#h3_transcript_title', jqPage).html(oTranscript['Name']);
        $('#div_transcript_postdate', jqPage).html(oTranscript['Timestamp']);
        
        var sHTML = '';
        for (var i = 0; i < arrScoreEntryList.length; i++) {
            var oScoreEntry = arrScoreEntryList[i];
            sHTML += '<tr class="transcriptScoreEntry">'
                   + '  <td>' + oScoreEntry['RRealClassName'] + '</td>'
                   + '  <td>' + oScoreEntry['Level'] + '</td>'
                   + '  <td>' + oScoreEntry['Score'] + '</td>'
                   + '  <td><a href="teacherinfo.html?tid=' + oScoreEntry['RTeacherID'] + '" data-transition="slide">' + oScoreEntry['RTeacherName'] + ' </a> ></td>'
                   + '</tr>'
                   + '<tr class="transcriptScoreEntry transcriptScoreEntry-Comment">'
                   + '  <td colspan="4"><span>评语: </span>' + oScoreEntry['Comment'] + '</td>'
                   + '</tr>'
                   + '<tr class="transcriptScoreEntry transcriptScoreEntry-Comment">'
                   + '  <td colspan="4">&nbsp;</td>'
                   + '</tr>';
        }
        
        if (oTranscript['Comment'] != '') {
            sHTML += '<tr class="transcriptScoreEntry">'
                   + ' <td colspan="4"><b>综合评价:</b></td>'
                   + '</tr>'
                   + '<tr class="transcriptScoreEntry">'
                   + ' <td colspan="4">' + oTranscript['Comment'] + '</td>'
                   + '</tr>'
        }
        //jqTbl.find('tr.transcriptScoreEntry').remove();
        jqTbl.children('tbody').empty().html(sHTML);
    };
};