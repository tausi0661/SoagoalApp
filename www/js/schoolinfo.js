var schoolinfo = new function() {
    var jqPage = null;
    var jqTeacherMessager = null;

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