var studentinfo = new function() {
    var jqPage = null;
    var jqImageGallery = null;
    var jqGradeList = null;
    var jqYearSelect = null;
    var jqPeriodSelect = null;
    var jqImageShow = null;
    
    var mdl_StudentInfo = null;
    
    var html_SelectYear_FirstOpt = '<option value="">选择年份</option>';
    var html_SelectPeriod_FirstOpt = '<option value="">选择学期</option>';
    this.init = function() {
        logger.debug('studentinfo init.....');
        
        jqImageGallery = $('div#div_studentinfo_img_gallery', jqPage).on('swipeleft', function() {
            logger.debug('swipeleft..........');
        });
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
        
        jqImageShow = $('#imgShow', jqPage).popup().enhanceWithin().on({
           popupafteropen: function(){ $('body').on('touchmove', false); },
           popupafterclose: function(){ $('body').off('touchmove');  }
        });
        
        $('#imgShow_Previous', jqImageShow).on('click', function() {
            var imgidx = $('#imgShowContent > img', jqImageShow).attr('imgidx');
            showImg(parseInt(imgidx) - 1, true);
        });
        
        $('#imgShow_Next', jqImageShow).on('click', function() {
            var imgidx = $('#imgShowContent > img', jqImageShow).attr('imgidx');
            showImg(parseInt(imgidx) + 1, true);
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
    var html_image = '<a href="#" data-rel="popup" data-position-to="window" data-transition="fade"><img class="photothumbnail" src="#src#" alt="#alt#" imgidx="#idx#" /></a>';
    
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
                var sHTML = '';
                var jqDiv = $('#div_studentinfo_img_gallery_panel', jqImageGallery);
                jqDiv.find('img.photothumbnail').remove();
                jqDiv.find('div.photoviewpanel').remove();
                for (var i = 0; i < pictureList.length; i++) {
                    var oPicture = pictureList[i];
                    sHTML += html_image.replace(htmltag_href, 'galleryphoto_' + i)
                                        .replace('#idx#', i)
                                        .replace(htmltag_src, oPicture['V_ThumbnailFullPath'])
                                        .replace(htmltag_alt, oPicture['ALT']);
                }
                jqDiv.append(sHTML);
                
                $('img.photothumbnail', jqDiv).on('click', function() {
                    showImg($(this).attr('imgidx'));
                });
            }
            
            //成绩单
            initTranscript(mdl_StudentInfo['TranscriptList']);
            
        }
    };
                
    var showImg = function(idx, isNav) {
        var oPicture = mdl_StudentInfo['PictureList'][idx];
        if (oPicture && oPicture['FullPath']) {
            commonUI.showOverlay();
            $('#imgShow_Header', jqImageShow).html(oPicture['ALT']);
            var oImg = $('#imgShowContent > img', jqImageShow).one('load', function() {
                if (isNav) {
                    jqImageShow.popup("reposition", {positionTo: 'window'}).popup("reposition", {positionTo: 'window'}).popup("reposition", {positionTo: 'window'}).popup("reposition", {positionTo: 'window'}).popup("reposition", {positionTo: 'window'});
                } else {
                    jqImageShow.popup('open').one('popupafterclose', function() {
                        commonUI.hideOverlay();
                    });
                }
            }).attr('src', oPicture['FullPath']).attr('imgidx', idx);
            
        }
    };
    
    var initTranscript = function(transcriptList) {
        
        var sHTML1 = '';
        var jqListView = $('#div_studentinfo_transcriptlist > ul', jqGradeList);
        jqListView.children('li').remove();
        for (var i = 0; i < transcriptList.length; i++) {
            var oTranscript = transcriptList[i];
            sHTML1 += html_transcript.replace(htmltag_id, oTranscript['ID'])
                                .replace(htmltag_name, oTranscript['Name']);
        }
        jqListView.append(sHTML1).listview('refresh');
    };
};