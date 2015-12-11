var index = new function() {
    var jqPage = null;
    var jqPanelMenu = null;
    var jqPanelMessager = null;

    this.init = function() {
        console.log('indexpage initing.....');
        jqPage = $('body > div#pgIndex');
        jqPanelMenu = $('div#panelMenu');
        jqPanelMessager = $('div#panelMessager');
        console.log(jqPanelMessager);
        
        if (globalInit) {
            $('#panelMessager_SubmitMsg', jqPanelMessager).click( handlePanelMessagerSubmit );
            
            $.mobile.loading("show");
            
            if( window.isphone ) {
                readFromProfile(function() {
                    gbl_mdl_ParentLogin = globalProfile;
                    ajaxor.ajax('api', 
                        '',
                        function(oResult) {
                            $.mobile.loading("hide");
                            
                            if (oResult.IsSuccessful) {
                                $.mobile.changePage("home.html", { transition: "slide" });
                            } else {
                                commonUI.commonDialog('登录信息已过期', oResult.Message, function() {
                                    $.mobile.changePage("login.html", { transition: "slide" });
                                }, true);
                            }
                        }
                    );
                }, function() {
                    //if there's any error when reading profile:
                    $.mobile.loading("hide");
                    $.mobile.changePage("login.html", { transition: "slide" });
                });
            } else {
                setTimeout('$.mobile.loading("hide"); $.mobile.changePage("login.html", { transition: "slide" });', 5000);
                //setTimeout('$.mobile.loading("hide");', 5000);
            }
        }
    };
    
    var initData = function() {
        if (gbl_mdl_ParentLogin) {
            $('#img_panelMenu_avatar', jqPanelMenu).attr('src', commonUtil.smallPic(gbl_mdl_ParentLogin['PhotoURL']));
            $('#span_panelMenu_studentname', jqPanelMenu).html(gbl_mdl_ParentLogin['RStudentName']);
        }
    };
    
    this.initData = function() {
        initData();
    };

    var handlePanelMessagerSubmit = function() {
        console.log('handlePanelMessagerSubmit');
        commonUI.loading();
        commonUI.clearFormError(jqPanelMessager);

        //validation:
        var bValidation = true;
        var jqSelObject = jqPanelMessager.find('#sel_messager_object');
        var jqTxtSubject = jqPanelMessager.find('#txt_panelMessager_subject');
        var jqTxtContent = jqPanelMessager.find('#txt_panelMessager_content');
        if (jqSelObject.val() == '0') {
            commonUI.displayFormError(jqSelObject, '请选择留言对象');
            bValidation = false;
        }
        if (! jqTxtContent.val()) {
            commonUI.displayFormError(jqTxtContent, '请输入留言内容');
            bValidation = false;
        }

        commonUI.loaded();
        if (bValidation) {
            commonUI.commonDialog('留言发送成功', '留言发送成功, 服务最快会在24小时内有回复(视留言对象而定).', function() {
                console.log('dialog closed...');
                jqPanelMessager.panel('close');
            });
        }
    }
};