var settings = new function() {
    var jqPage = null;
    
    this.init = function() {
        logger.debug('settings initing.....');
        jqPage = $('body > div#pgSettings');
        
        $('#btn_changepassword_submit', jqPage).on('click', changepasswordSubmit);
        $('#btn_logout_submit', jqPage).on('click', logout);
        $('#btn_checkupdate_submit', jqPage).on('click', checkUpdate);
    };
    
    this.beforeshow = function() {
        logger.debug('settings beforeshow.....');
    };
    
    var changepasswordSubmit = function() {
        var jqPanel = $('#div_settings_changepassword', jqPage);
        var jqOld = $('#txt_settings_password_old', jqPanel);
        var jqNew = $('#txt_settings_password_new', jqPanel);
        var jqNew2 = $('#txt_settings_password_new2', jqPanel);
        
        //validation:
        var bValidation = true;
        if (jqOld.val()) {
            //
        } else {
            commonUI.displayFormError(jqOld, '请输入旧密码');
            bValidation = false;
        }
        if (jqNew.val()) {
            if (jqNew.val().length > 20) {
                commonUI.displayFormError(jqNew, '密码不能超过20个字符.');
                bValidation = false;
            } else if (jqNew.val() != jqNew2.val()) {
                commonUI.displayFormError(jqNew, '两次输入的新密码不一致.');
                bValidation = false;
            }
        } else {
            commonUI.displayFormError(jqNew, '请输入新密码');
            bValidation = false;
        }

        if (bValidation) {
            ajaxor.ajax('updatepassword',
                'passwordold=' + jqOld.val() + '&passwordnew=' + jqNew.val(),
                function(oResult) {
                    if (oResult.IsSuccessful) {
                        commonUI.commonDialog('密码更新成功', '您的密码已经更新成功, 请重新登录.', logout, true);
                    } else {
                        commonUI.commonDialog('密码更新失败', oResult.Message, null, true);
                    }
                }
            );
        }
    };
    
    var logout = function() {
        gbl_mdl_ParentLogin = {};
        writeToProfile(gbl_mdl_ParentLogin, function() {
            $.mobile.changePage("login.html", { transition: "slide" });
        }, function() {
            //
        });
    };
    
    var checkUpdate = function() {
        ajaxor.ajax('checkversion',
            'tim=tim',
            function(oResult) {
                if (oResult.IsSuccessful) {
                    if (oResult.ResultObj == gbl_version) {
                        commonUI.commonDialog('版本检查', '当前已是最新版本', null, true);
                    } else {
                        commonUI.commonDialog('版本检查', '当前版本已过期, 最新版本为[' + oResult.ResultObj + ']', null, true);
                    }
                } else {
                    commonUI.commonDialog('版本检查失败', oResult.Message, null, true);
                }
            }
        );
    };
};