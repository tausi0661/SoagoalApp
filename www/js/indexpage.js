var indexpage = new function() {
    var jqPage = null;
    var jqPanelMenu = null;
    var jqPanelMessager = null;

    this.init = function() {
        console.log('indexpage initing.....');
        jqPage = $('body > div#pgIndex');
        jqPanelMenu = $('div#panelMenu');
        jqPanelMessager = $('div#panelMessager');
        
        $('button', jqPanelMessager).click( handlePanelMessagerSubmit );
    };
    
    this.beforeshow = function() {
        if(document.URL.indexOf("http://") === -1 
            && document.URL.indexOf("https://") === -1) {
            console.log('=====is phone2=====');
        } else {
            console.log('=====is phone 000 =====');
            setTimeout('$.mobile.loading("hide"); $.mobile.changePage("login.html", { transition: "slide" });', 5000);
            //setTimeout('$.mobile.loading("hide"); $.mobile.changePage("teachervote.html", { transition: "slide" });', 5000);
        }
    };
    
    this.profileChecking = function() {
        console.log('-----profileChecking-------');
        readFromProfile(function() {
            console.log('-----begin profileChecking-------');
            gbl_mdl_ParentLogin = globalProfile;
            console.log('gbl_mdl_ParentLogin: ' + gbl_mdl_ParentLogin['ParentID'])
            if (gbl_mdl_ParentLogin && gbl_mdl_ParentLogin['Hash']) {
                console.log('-----begin to ajax-------');
                ajaxor.ajax('api', 'tim=wang',
                    function(oResult) {
                        console.log('-----api ajax done-------');
                        $.mobile.loading("hide");
                        
                        if (oResult.IsSuccessful) {
                            gbl_mdl_ParentLogin = oResult.ResultObj
                            initData();
                            writeToProfile(gbl_mdl_ParentLogin, function() {
                                $.mobile.changePage("home.html", { transition: "slide" });
                            });
                        } else {
                            commonUI.commonDialog('登录信息已过期', oResult.Message, function() {
                                $.mobile.changePage("login.html", { transition: "slide" });
                            }, true);
                        }
                    }, function() {
                        //ajax error:
                        $.mobile.changePage("login.html", { transition: "slide" });
                    }
                );
            }
        }, function() {
            //if there's any error when reading profile:
            $.mobile.loading("hide");
            $.mobile.changePage("login.html", { transition: "slide" });
        });
    };
    
    var initData = function() {
        if (gbl_mdl_ParentLogin) {
            $('#img_panelMenu_avatar', jqPanelMenu).attr('src', commonUtil.smallPic(gbl_mdl_ParentLogin['PhotoURL']));
            $('#span_panelMenu_studentname', jqPanelMenu).html(gbl_mdl_ParentLogin['RStudentName']);
            
            $('#sel_messager_object').empty().append('<option value="">请选择留言对象</option>' + gbl_mdl_ParentLogin['MsgReceiverHTML']).selectmenu('refresh', true);
        }
    };

    var handlePanelMessagerSubmit = function() {
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