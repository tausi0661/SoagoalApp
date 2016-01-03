var loginpage = new function() {
    var jqPage = null;
    var jqPanelMenu = null;

    this.init = function() {
        logger.debug('loginpage initing.....');
        jqPage = $('body > div#pgLogin');
        jqPanelMenu = $('div#panelMenu');

        $('#btn_index_login', jqPage).click(function() {
            var productVal = $('#sel_index_product', jqPage).val();
            //ajaxor.setProduct(productVal);
            
            var mobile = $('#txt_index_login_username', jqPage).val();
            var password = $('#txt_index_login_password', jqPage).val();
            if (mobile && mobile.length > 0 && password && password.length > 0) {
                ajaxor.ajax('parentlogin', 
                    'mobile=' + mobile + '&password=' + password + '&postsummarylength=' + soagoalConfig.postsummarylength, 
                    function(oResult) {
                        if (oResult.IsSuccessful) {
                            gbl_mdl_ParentLogin = oResult.ResultObj;
                            
                            //写文件到profile
                            writeToProfile(gbl_mdl_ParentLogin, function() {
                                $.mobile.changePage("home.html", { transition: "slide" });
                            });
                            initData();
                        } else {
                            commonUI.commonDialog('登录失败', oResult.Message, null, true);
                        }
                    }
                );
            } else {
                commonUI.commonDialog('提示', '请输入正确的手机号及密码.', null, true);
            }
        });
        $('#btn_index_login2', jqPage).click(function() {
            alert('hello2');
            $.mobile.changePage("/home.html", { transition: "slide" })
        });
        $('#btn_index_login3', jqPage).click(function() {
            alert('hello13');
            $.mobile.changePage("../home.html", { transition: "slide" })
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
    };
    
    this.beforeshow = function() {
    };
    
    var initData = function() {
        if (gbl_mdl_ParentLogin) {
            $('#img_panelMenu_avatar').attr('src', commonUtil.smallPic(gbl_mdl_ParentLogin['PhotoURL']));
            $('#span_panelMenu_studentname').html(gbl_mdl_ParentLogin['RStudentName']);
            
            $('#sel_messager_object').empty().append('<option value="">请选择留言对象</option>' + gbl_mdl_ParentLogin['MsgReceiverHTML']).selectmenu('refresh', true);
        }
    };
};