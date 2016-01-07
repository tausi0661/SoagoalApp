var teachervote = new function() {
    var jqPage = null;
    var jqTeachers = null;
    var jqTeacherVoteItems = null;
    var jqTeacherVoteClassName = null;
    
    var mdl_studentRealClassList = null;
    var mdl_voteItems = null;
    
    this.init = function() {
        logger.debug('teachervote initing.....');
        jqPage = $('body > div#pgTeacherVote');
        jqTeachers = $('#ul_teachervote_teachers', jqPage);
        jqTeacherVoteItems = $('#div_teachervote_items', jqPage);
        jqTeacherVoteClassName = $('#div_teachervote_className', jqPage);
        
        $('#btn_teachervote_submit', jqPage).on('click', submitVote);
    };
    
    this.beforeshow = function() {
        logger.debug('teachervote beforeshow.....');
        ajaxor.ajax('teachervoteinfo', 
            'tim=w',
            function(oResult) {
                if (oResult.IsSuccessful) {
                    mdl_studentRealClassList = oResult.ResultObj.StudentRealClassList;
                    mdl_voteItems = oResult.ResultObj.VoteItems;
                    initData();
                } else {
                    commonUI.commonDialog('读取数据失败', oResult.Message, function() { $.mobile.back(); }, true);
                }
            }
        );
    };
    
    var selopt = '<option value="0">分数</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>';
    var initData = function() {
        if (mdl_studentRealClassList && mdl_studentRealClassList.length > 0) {
            var sHTML = '', sHTML2 = '';
            
            jqTeachers.children('li.li_teachervote_teachername').remove();
            jqTeacherVoteItems.children('ul.ul_teachervote_items').remove();
            
            for (var k = 0; k < mdl_studentRealClassList.length; k++) {
                var oClass = mdl_studentRealClassList[k];
                var tid = oClass['RTeacherID'];
                sHTML += '<li class="li_teachervote_teachername" tid="' + tid + '" cname="' + oClass['RRealClassName'] + '">' + oClass['RTeacherName'] + '</li>';
                
                sHTML2 = '<ul class="ul_teachervote_items" tid="' + tid + '" val="" id="ul_teachervote_items_' + tid + '" data-role="listview" data-inset="true" data-divider-theme="c">';
                for (var i = 0; i < mdl_voteItems.length; i++) {
                    var oItem1 = mdl_voteItems[i];
                    sHTML2 += '<li data-role="list-divider">' + oItem1['Name'] + '</li>';
                    for (var j = 0; j < oItem1.Item2List.length; j++) {
                        var oItem2 = oItem1.Item2List[j];
                        var itemval = tid + '_' + oClass['RealClassID'] + '_' + oItem2['ID'];
                        sHTML2 += '<li class="ui-field-contain">'
                               + '  <label for="select-choice-' + i + '_' + j + '">' + oItem2['Name'] + '</label>'
                               + '  <select id="select-choice-' + i + '_' + j + '" data-mini="true" data-theme="c" tid="' + tid + '" val="' + itemval + '">'
                               +    selopt
                               + '  </select>'
                               + '</li>';
                    }
                }
                sHTML2 += '</ul>';
                jqTeacherVoteItems.append(sHTML2);
            }
            jqTeachers.append(sHTML);
            $('li.li_teachervote_teachername').click(teacherSelect);
            jqTeachers.listview().listview('refresh');
            
            jqTeacherVoteItems.children('ul.ul_teachervote_items').listview().listview('refresh');
            jqTeacherVoteItems.find('select').selectmenu().selectmenu('refresh', true);
            
            $('li.li_teachervote_teachername:first').click();
        }
    };
    
    var teacherSelect = function() {
        var jqthis = $(this);
        jqTeachers.children('li.li_teachervote_teachername').removeClass('current-select');
        jqthis.addClass('current-select');
        jqTeacherVoteItems.children('ul.ul_teachervote_items:visible').hide();
        jqTeacherVoteItems.children('#ul_teachervote_items_' + jqthis.attr('tid')).show();
        jqTeacherVoteClassName.html(jqthis.attr('cname'));
    };
    
    var ddd = true;
    var submitVote = function() {
        if (gbl_mdl_ParentLogin['IsFromPreview']) {
            commonUI.commonDialog('注意!', '此处是App的预览页面, 请不要执行此操作!');
            return false;
        }
        
        var allVoted = true;
        var ajaxParam = {};
        jqTeacherVoteItems.children('ul.ul_teachervote_items').each(function() {
            var jqThis = $(this);
            var thisVoted = true;
            jqThis.find('select').each(function() {
                var jqThis = $(this);
                
                //if (ddd) jqThis.val((Math.floor(Math.random() * 100) % 5 ) + 1).selectmenu('refresh'); //random 1~5
                //if (ddd) jqThis.val(4).selectmenu('refresh'); //random 1~5
                
                ajaxParam['val_' + jqThis.attr('val')] = jqThis.val();
                if (jqThis.val() == '0') { thisVoted = false; }
            });
            
            if (thisVoted) {
                jqTeachers.children('li.li_teachervote_teachername[tid="' + jqThis.attr('tid') + '"]').removeClass('not-all-voted');
            } else {
                jqTeachers.children('li.li_teachervote_teachername[tid="' + jqThis.attr('tid') + '"]').addClass('not-all-voted');
                allVoted = false;
            }
        });
        
        if (allVoted) {
            ajaxor.ajax('vote', ajaxParam,
                function(oResult) {
                    if (oResult.IsSuccessful) {
                        commonUI.commonDialog('评价已发送', '感谢您的配合, 您的评价已成功发送.', function() { $.mobile.back(); }, true);
                    } else {
                        commonUI.commonDialog('读取数据失败', oResult.Message, function() { $.mobile.back(); }, true);
                    }
                }
            );
        } else {
            commonUI.commonDialog('打分信息不完整', '请将所有教师打分项填好后再提交.\n未完成打分的教师已红色标注.', null, true);
        }
    };
};