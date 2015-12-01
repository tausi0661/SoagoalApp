var indexpage = new function() {
    var jqPage = null;
    var jqPanelMessager = null;

    this.init = function() {
        console.log('indexpage initing.....');
        jqPage = $('body > div#pgIndex');
        jqPanelMessager = $('div#panelMessager');

        $('#btn_index_login', jqPage).click(function() {
            var mobile = $('#txt_index_login_username', jqPage).val();
            var password = $('#txt_index_login_password', jqPage).val();
            if (mobile && mobile.length > 0 && password && password.length > 0) {
                ajaxor.ajax('parentlogin', 'mobile=' + mobile + '&password=' + password, function(oResult) {
                    if (oResult.IsSuccessful) {
                        mdl_ParentLogin = oResult.ResultObj;
                        $.mobile.changePage("home.html", { transition: "slideup" });
                    } else {
                        commonUI.commonDialog('登录失败', oResult.Message, null, true);
                    }
                });
            } else {
                commonUI.commonDialog('提示', '请输入正确的手机号及密码.', null, true);
            }
        });
        $('#btn_index_login2', jqPage).click(function() {
            alert('hello2');
            $.mobile.changePage("/home.html", { transition: "slideup" })
        });
        $('#btn_index_login3', jqPage).click(function() {
            alert('hello13');
            $.mobile.changePage("../home.html", { transition: "slideup" })
        });
        $('#btn_index_login4', jqPage).click(function() {
            alert('hello14');
            window.href="../home.html";
        });
        $('#btn_index_login5', jqPage).click(function() {
            alert('hello15');
            window.href="/www/home.html";
        });
        $('#btn_index_login6', jqPage).click(function() {
            alert('hello16');
            window.href="/www/home.html";
        });

        $('button', jqPanelMessager).click( handlePanelMessagerSubmit );
    };

    var handlePanelMessagerSubmit = function() {
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