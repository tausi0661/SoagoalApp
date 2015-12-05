var schoolinfo = new function() {
    var jqPage = null;
    var jqTeacherMessager = null;
    
    var mdl_TeacherList = null;

    this.init = function() {
        console.log('schoolinfo initing.....');
        jqPage = $('body > div#pgSchoolInfo');
        jqTeacherMessager = $('div#div_schoolinfo_teachers_messager', jqPage);

        //top 3 navbar init & click event bind:
        var jqBarBtns = $('#ul_schoolinfo_navbar > li > a', jqPage);
        var jqContents = $('div.tim-main-content', jqPage);
        jqBarBtns.each(function(i) {
            $(this).click(function() {
                jqBarBtns.removeClass('ui-btn-active');
                commonUI.loading();
                setTimeout(function() {
                    commonUI.loaded();
                    $(jqContents[i]).show();
                }, 2000);
                jqContents.hide();
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
    };
    
    this.beforeshow = function() {
        ajaxor.ajax('listteachers', 
            'teacherinfolength=' + soagoalConfig.teacherinfolength, 
            function(oResult) {
                if (oResult.IsSuccessful) {
                    mdl_TeacherList = oResult.ResultObj;
                    initData();
                } else {
                    commonUI.commonDialog('读取数据失败', oResult.Message, null, true);
                }
            }
        );
    };
    
    var htmltag_id = '#id#';
    var htmltag_href = '#href#';
    var htmltag_src = '#src#';
    var htmltag_name = '#name#';
    var htmltag_desc = '#desc#';
    var htmltag_comment = '#comment#';
    var html_Teacher = '<li class="liTeacherItem"><a href="teacherinfo.html?tid=#id#">'
                + '<img src="#src#" /><h2>#name#</h2><p>#desc#</p>'
                + '<a class="tim-schoolinfo-teacher-msg" href="#div_schoolinfo_teachers_messager" data-rel="popup" data-position-to="window" data-transition="pop">留言</a>'
                + '</a></li>';
    
    var initData = function() {
        //if (false) {
        if (mdl_TeacherList && mdl_TeacherList.length > 0) {
            var sHTML = '', jqTeacherList = $('#ul_schoolinfo_teachers', jqPage);
            for (var i = 0; i < mdl_TeacherList.length; i++) {
                var oTeacher = mdl_TeacherList[i];
                sHTML += html_Teacher.replace(htmltag_id, oTeacher['ID'])
                        .replace(htmltag_src, commonUtil.smallPic(oTeacher['PhotoURL']))
                        .replace(htmltag_name, oTeacher['Name'])
                        .replace(htmltag_desc, oTeacher['Description']);
            }
            jqTeacherList.children('li.liTeacherItem').remove();
            jqTeacherList.append(sHTML).listview('refresh');
        }
    };

    var handleTeacherMessagerSubmit = function() {

        commonUI.loading();
        commonUI.clearFormError(jqTeacherMessager);

        //validation:
        var bValidation = true;
        var jqSelTeacher = jqTeacherMessager.find('#sel_schoolinfo_teachers_object');
        var jqTxtContent = jqTeacherMessager.find('#txt_schoolinfo_teachers_content');
        if (jqSelTeacher.val() == '0') {
            commonUI.displayFormError(jqSelTeacher, '请选择想要留言的老师');
            bValidation = false;
        }
        if (! jqTxtContent.val()) {
            commonUI.displayFormError(jqTxtContent, '请输入留言内容');
            bValidation = false;
        }

        commonUI.loaded();
        if (bValidation) {
            jqTeacherMessager.one('popupafterclose', function(){
                commonUI.commonDialog('留言发送成功', '留言发送成功, 服务最快会在48小时内有回复(视留言对象而定).', function() {
                    console.log('dialog closed...');
                });
            }).popup('close');
        }
    }
};