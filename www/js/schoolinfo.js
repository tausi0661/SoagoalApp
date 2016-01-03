var schoolinfo = new function() {
    var jqPage = null;
    var jqTeacherMessager = null;
    
    var mdl_TeacherList = null;
    var mdl_AroundSchoolPosts = null;
    
    var b_teacherlist_inited = false;
    var b_around_school_inited = false;

    this.init = function() {
        logger.debug('schoolinfo initing.....');
        jqPage = $('body > div#pgSchoolInfo');
        jqTeacherMessager = $('div#div_schoolinfo_teachers_messager', jqPage);

        //top 3 navbar init & click event bind:
        var jqBarBtns = $('#ul_schoolinfo_navbar > li > a', jqPage);
        var jqContents = $('div.tim-main-content', jqPage);
        jqBarBtns.each(function(i) {
            $(this).click(function() {
                jqBarBtns.removeClass('ui-btn-active');
                /*commonUI.loading();
                setTimeout(function() {
                    commonUI.loaded();
                    $(jqContents[i]).show();
                }, 2000);*/
                jqContents.hide(function() {
                    $(jqContents[i]).show();
                });
                $(this).addClass('ui-btn-active');
                return false;
            });
        });

        //teacher messager:
        $('button', jqTeacherMessager).click( handleTeacherMessagerSubmit );

        //popup -> disable page scroll:
        jqTeacherMessager.on({
           popupafteropen: function(){ $('body').on('touchmove', false); },
           popupafterclose: function(){ $('body').off('touchmove'); }
        });
        
        b_teacherlist_inited = false;
        b_around_school_inited = false;
    };
    
    this.beforeshow = function() {
        ajaxor.ajax('schoolinfopage', 
            'aroundschoolpostsummarylength=' + soagoalConfig.aroundschoolpostsummarylength + '&aroundschoolpostcount=' + soagoalConfig.aroundschoolpostcount,
            function(oResult) {
                if (oResult.IsSuccessful) {
                    mdl_TeacherList = oResult.ResultObj['TeacherList'];
                    mdl_AroundSchoolPosts = oResult.ResultObj['AroundSchoolPosts'];
                    initData();
                } else {
                    commonUI.commonDialog('读取数据失败', oResult.Message, null, true);
                }
            }
        );
    };
    
    var htmltag_id = /#id#/g;
    var htmltag_href = '#href#';
    var htmltag_img = '#img#';
    var htmltag_src = '#src#';
    var htmltag_name = '#name#';
    var htmltag_desc = '#desc#';
    var htmltag_comment = '#comment#';
    var htmltag_timestamp = '#timestamp#';
    var html_Teacher = '<li class="liTeacherItem"><a href="teacherinfo.html?tid=#id#">'
                + '<img src="#src#" /><h2>#name#</h2><p>#desc#</p>'
                + '<a class="tim-schoolinfo-teacher-msg" tid="#id#" href="#" data-rel="popup" data-position-to="window" data-transition="pop">留言</a>'
                + '</a></li>';
    var html_post = '<li class="liAroundSchoolPost"><a href="commonpost.html?postid=#id#">'
                + '#img#<h2>#name#</h2><p>#timestamp#</p><p>#desc#</p></a></li>';
    var initData = function() {
        //if (false) {
        if (mdl_TeacherList && mdl_TeacherList.length > 0 && b_teacherlist_inited == false) {
            var sHTML = '', sOptHTML = '', jqTeacherList = $('#ul_schoolinfo_teachers', jqPage);
            for (var i = 0; i < mdl_TeacherList.length; i++) {
                var oTeacher = mdl_TeacherList[i];
                sHTML += html_Teacher.replace(htmltag_id, oTeacher['ID'])
                        .replace(htmltag_src, commonUtil.smallPic(oTeacher['PhotoURL']))
                        .replace(htmltag_name, oTeacher['Name'])
                        .replace(htmltag_desc, oTeacher['Description']);
                
                sOptHTML += '<option value="' + oTeacher['ID'] + '">' + oTeacher['Name'] + '</option>';
            }
            
            jqTeacherList.children('li.liTeacherItem').remove();
            jqTeacherList.append(sHTML).listview('refresh');
            
            $('a.tim-schoolinfo-teacher-msg', jqTeacherList).on('click', showTeacherMsgDialog);
            
            sOptHTML = '<option value="0">请选择留言教师</option>' + sOptHTML;
            $('#sel_schoolinfo_teachers_object', jqTeacherMessager).html(sOptHTML).selectmenu('refresh', true);
            
            b_teacherlist_inited = true;
        }
        
        if (mdl_AroundSchoolPosts && mdl_AroundSchoolPosts.length > 0 && b_around_school_inited == false) {
            var sHTML = '', jqPostList = $('#ul_schoolinfo_aroundschool', jqPage);
            for (var i = 0; i < mdl_AroundSchoolPosts.length; i++) {
                var oPost = mdl_AroundSchoolPosts[i];
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
            jqPostList.children('li.liAroundSchoolPost').remove();
            jqPostList.append(sHTML).listview('refresh');
            b_around_school_inited = true;
        }
    };
    
    var showTeacherMsgDialog = function() {
        $('#sel_schoolinfo_teachers_object', jqTeacherMessager).val($(this).attr('tid')).selectmenu('refresh');
        jqTeacherMessager.popup('open');
    };

    var handleTeacherMessagerSubmit = function() {

        commonUI.loading();
        commonUI.clearFormError(jqTeacherMessager);

        //validation:
        var bValidation = true;
        var jqSelTeacher = jqTeacherMessager.find('#sel_schoolinfo_teachers_object');
        var jqTxtContent = jqTeacherMessager.find('#txt_schoolinfo_teachers_content');
        if (jqSelTeacher.val() == '0' || jqSelTeacher.val() == '') {
            commonUI.displayFormError(jqSelTeacher, '请选择想要留言的老师');
            bValidation = false;
        }
        if (! jqTxtContent.val()) {
            commonUI.displayFormError(jqTxtContent, '请输入留言内容');
            bValidation = false;
        }

        commonUI.loaded();
        if (bValidation) {
            ajaxor.ajax('postteachermessage',
                'tid=' + jqSelTeacher.val() + '&body=' + jqTxtContent.val(),
                function(oResult) {
                    if (oResult.IsSuccessful) {
                        jqTeacherMessager.one('popupafterclose', function(){
                            commonUI.commonDialog('留言发送成功', '留言发送成功, 我们会尽快处理您的留言.');
                        }).popup('close');
                    } else {
                        commonUI.commonDialog('留言发送失败', oResult.Message, null, true);
                    }
                }
            );
        }
    }
};