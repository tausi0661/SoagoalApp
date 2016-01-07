var indexpage = new function() {
    var jqPage = null;
    var jqAboutUs = null;
    var jqPanelMenu = null;
    var jqPanelMessager = null;

    this.init = function() {
        logger.debug('indexpage initing.....');
        jqPage = $('body > div#pgIndex');
        jqAboutUs = $('div#popupAboutUs');
        jqPanelMenu = $('div#panelMenu');
        jqPanelMessager = $('div#panelMessager');
        
        $('button', jqPanelMessager).click( handlePanelMessagerSubmit );
        
        $('#popupAboutUs_Title', jqAboutUs).html(soagoalConfig.apptitle);
        $('#popupAboutUs_Version', jqAboutUs).html(gbl_version);
        
    };
    
    this.beforeshow = function() {
        if(document.URL.indexOf("http://") === -1 
            && document.URL.indexOf("https://") === -1) {
            //nothing to do
        } else {
            logger.debug('=====is phone 000 =====');
            if (gbl_mdl_ParentLogin && gbl_mdl_ParentLogin['ParentID'] > 0) {
                setTimeout('indexpage.initData();$.mobile.changePage("home.html", { transition: "slide" });', 1000);
            } else {
                setTimeout('$.mobile.loading("hide"); $.mobile.changePage("login.html", { transition: "slide" });', 5000);
            }
        }
    };
    
    this.initData = function() {
        initData();
    };
    
    var initData = function() {
        if (gbl_mdl_ParentLogin) {
            $('#img_panelMenu_avatar', jqPanelMenu).attr('src', commonUtil.smallPic(gbl_mdl_ParentLogin['PhotoURL']));
            $('#span_panelMenu_studentname', jqPanelMenu).html(gbl_mdl_ParentLogin['RStudentName']);
            
            //$('#sel_messager_object').empty().append('<option value="">请选择留言对象</option>' + gbl_mdl_ParentLogin['MsgReceiverHTML']).selectmenu('refresh', true);
        }
    };

    var handlePanelMessagerSubmit = function() {
        if (gbl_mdl_ParentLogin['IsFromPreview']) {
            commonUI.commonDialog('注意!', '此处是App的预览页面, 请不要执行此操作!');
            return false;
        }
        
        commonUI.loading();
        commonUI.clearFormError(jqPanelMessager);

        //validation:
        var bValidation = true;
        var jqSelObject = jqPanelMessager.find('#sel_messager_object');
        var jqTxtSubject = jqPanelMessager.find('#txt_panelMessager_subject');
        var jqTxtContent = jqPanelMessager.find('#txt_panelMessager_content');
        if (jqSelObject.val() == '0' || jqSelObject.val() == '') {
            commonUI.displayFormError(jqSelObject, '请选择留言对象');
            bValidation = false;
        }
        if (jqTxtSubject.val()) {
            if (jqTxtSubject.val().length > 20) {
                commonUI.displayFormError(jqTxtSubject, '标题不能超过20个字符.');
                bValidation = false;
            }
        } else {
            commonUI.displayFormError(jqTxtSubject, '请输入标题');
            bValidation = false;
        }
        
        if (! jqTxtContent.val()) {
            commonUI.displayFormError(jqTxtContent, '请输入留言内容');
            bValidation = false;
        }

        commonUI.loaded();
        if (bValidation) {
            ajaxor.ajax('postadminmessage',
                'rid=' + jqSelObject.val() + '&body=' + jqTxtContent.val() + '&subject=' + jqTxtSubject.val(),
                function(oResult) {
                    if (oResult.IsSuccessful) {
                        commonUI.commonDialog('留言发送成功', '留言发送成功, 我们会尽快处理您的留言.', function() {
                            jqPanelMessager.panel('close');
                        });
                    } else {
                        commonUI.commonDialog('留言发送失败', oResult.Message, null, true);
                    }
                }
            );
        }
    }
};