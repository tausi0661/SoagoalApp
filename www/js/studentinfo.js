var studentinfo = new function() {
    var jqPage = null;
    var jqImageGallery = null;
    var jqGradeList = null;
    
    var mdl_StudentInfo = null;

    this.init = function() {
        logger.debug('studentinfo init.....');
        jqPage = $('body > div#pgStudentInfo');
        jqImageGallery = $('div#div_studentinfo_img_gallery', jqPage);
        jqGradeList = $('div#div_studentinfo_grades_list');

        //grade/term change events:
        $('#sel_studentinfo_grade, #sel_studentinfo_term').change(handleGradeTermChange);

        //popup -> disable page scroll:
        $('div[data-role="popup"]', jqImageGallery).on({
           popupafteropen: function(){ $('body').on('touchmove', false); },
           popupafterclose: function(){ $('body').off('touchmove'); }
        });
    };

    this.beforeshow = function() {
        logger.debug('studentinfo beforeshow.....');
        ajaxor.ajax('liststudentinfopage', 
            '',
            function(oResult) {
                if (oResult.IsSuccessful) {
                    mdl_StudentInfo = oResult.ResultObj;
                    initData();
                } else {
                    commonUI.commonDialog('读取数据失败', oResult.Message, null, true);
                }
            }
        );
    };
    
    var initData = function() {
        if (gbl_mdl_ParentLogin) {
            $('#h2_student_name', jqPage).attr('src', gbl_mdl_ParentLogin['RStudentName'] + ' - ' + gbl_mdl_ParentLogin['EnglishName']);
            $('#span_enroll_year_period', jqPage).html(gbl_mdl_ParentLogin['RYear'] + '年' + commonConst.period(gbl_mdl_ParentLogin['RPeriod']));
            $('#span_student_group', jqPage).html(gbl_mdl_ParentLogin['GroupName']);
        }
        
        if (mdl_StudentInfo) {
        
            //ͼƬgallery:
            if (mdl_StudentInfo['PictureList'] && mdl_StudentInfo['PictureList'].length > 0) {
                var pictureList = mdl_StudentInfo['PictureList'];
                for (var i = 0; i < mdl_StudentInfo['PictureList'].length; i++) {
                    
                }
            }
        }
    };

    var handleGradeTermChange = function() {
        commonUI.loading();
        setTimeout('commonUI.loaded();', 2000);
    };
};