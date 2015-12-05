var studentinfo = new function() {
    var jqPage = null;
    var jqImageGallery = null;
    var jqGradeList = null;
    var jqYearSelect = null;
    var jqPeriodSelect = null;
    
    var mdl_StudentInfo = null;
    
    var html_SelectYear_FirstOpt = '<option value="">选择年份</option>';
    var html_SelectPeriod_FirstOpt = '<option value="">选择学期</option>';
    this.init = function() {
        logger.debug('studentinfo init.....');
        jqPage = $('body > div#pgStudentInfo');
        jqImageGallery = $('div#div_studentinfo_img_gallery', jqPage);
        jqGradeList = $('div#div_studentinfo_grades_list');
        jqYearSelect = $('#sel_studentinfo_grade', jqGradeList);
        jqPeriodSelect = $('#sel_studentinfo_term', jqGradeList);

        //popup -> disable page scroll:
        $('div[data-role="popup"]', jqImageGallery).on({
           popupafteropen: function(){ $('body').on('touchmove', false); },
           popupafterclose: function(){ $('body').off('touchmove'); }
        });
        
        //year/period init:
        if (gbl_mdl_ParentLogin) {
            jqYearSelect.empty().append(html_SelectYear_FirstOpt + gbl_mdl_ParentLogin['YearOptHTML']).selectmenu('refresh', true).change(yearPeriodChanged);
            jqPeriodSelect.empty().append(html_SelectPeriod_FirstOpt + gbl_mdl_ParentLogin['PeriodOptHTML']).selectmenu('refresh', true).change(yearPeriodChanged);
        }
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
    
    var yearPeriodChanged = function() {
        logger.debug(jqYearSelect.val() + '-' + jqPeriodSelect.val());
        var newlist = [], sYear = jqYearSelect.val(), sPeriod = jqPeriodSelect.val();
        
        if (mdl_StudentInfo['TranscriptList'] && mdl_StudentInfo['TranscriptList'].length > 0) {
            if (sYear == '') {
                newlist = mdl_StudentInfo['TranscriptList'];
            } else {
                for (var i = 0; i < mdl_StudentInfo['TranscriptList'].length; i++) {
                    if (mdl_StudentInfo['TranscriptList'][i]['Year'] + '' == sYear
                        && (sPeriod == '' || sPeriod == mdl_StudentInfo['TranscriptList'][i]['Period'] + '')) {
                            newlist.push(mdl_StudentInfo['TranscriptList'][i]);
                    }
                }
            }
        }
        
        initTranscript(newlist);
    };
    
    var htmltag_href = '#href#';
    var htmltag_src = '#src#';
    var htmltag_alt = '#alt#';
    var html_image1 = '<a href="##href#" data-rel="popup" data-position-to="window" data-transition="fade"><img class="photothumbnail" src="#src#" alt="#alt#"></a>';
    var html_image2 = '<div class="photoviewpanel" data-role="popup" id="#href#" data-overlay-theme="g" data-theme="b" data-corners="false"><h4>#alt#</h4><a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a><img class="popphoto" src="#src#" alt="#alt#"></div>';
    
    var htmltag_id = '#id#';
    var htmltag_name = '#name#';
    var html_transcript = '<li><a href="transcript.html?tid=#id#" data-transition="slide">#name#</a></li>';
    var initData = function() {
        if (gbl_mdl_ParentLogin) {
            $('#img_studentinfo_avatar', jqPage).attr('src', gbl_mdl_ParentLogin['PhotoURL']);
            $('#h2_student_name', jqPage).html(gbl_mdl_ParentLogin['RStudentName'] + ' - ' + gbl_mdl_ParentLogin['EnglishName']);
            $('#span_enroll_year_period', jqPage).html(gbl_mdl_ParentLogin['RYear'] + '年' + commonConst.period(gbl_mdl_ParentLogin['RPeriod']));
            $('#span_student_group', jqPage).html(gbl_mdl_ParentLogin['GroupName']);
        }
        
        if (mdl_StudentInfo) {
        
            //图片gallery:
            if (mdl_StudentInfo['PictureList'] && mdl_StudentInfo['PictureList'].length > 0) {
                var pictureList = mdl_StudentInfo['PictureList'];
                var sHTML1 = '', sHTML2 = '';
                var jqDiv = $('#div_studentinfo_img_gallery_panel', jqImageGallery);
                jqDiv.find('img.photothumbnail').remove();
                jqDiv.find('div.photoviewpanel').remove();
                for (var i = 0; i < pictureList.length; i++) {
                    var oPicture = pictureList[i];
                    sHTML1 += html_image1.replace(htmltag_href, 'galleryphoto_' + i)
                                        .replace(htmltag_src, oPicture['V_ThumbnailFullPath'])
                                        .replace(htmltag_alt, oPicture['ALT']);
                    sHTML2 += html_image2.replace(htmltag_href, 'galleryphoto_' + i)
                                        .replace(htmltag_src, oPicture['FullPath'])
                                        .replace(htmltag_alt, oPicture['ALT']);
                }
                jqDiv.append(sHTML1 + sHTML2);
                jqDiv.find('div.photoviewpanel').enhanceWithin().popup();
            }
            
            //成绩单
            initTranscript(mdl_StudentInfo['TranscriptList']);
            
        }
    };
    
    var initTranscript = function(transcriptList) {
        if (transcriptList && transcriptList.length > 0) {
            var sHTML1 = '';
            var jqListView = $('#div_studentinfo_transcriptlist > ul', jqGradeList);
            jqListView.children('li').remove();
            for (var i = 0; i < transcriptList.length; i++) {
                var oTranscript = transcriptList[i];
                sHTML1 += html_transcript.replace(htmltag_id, oTranscript['ID'])
                                    .replace(htmltag_name, oTranscript['Name']);
            }
            jqListView.append(sHTML1).listview('refresh');
        }
    };
};