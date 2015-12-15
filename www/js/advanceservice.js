var advanceservice = new function() {
    var jqPage = null;
    var jqPopupPickUp = null;
    var jqPopupInvitation = null;
    var jqPopupApplication = null;
    
    var mdl_MsgList = null;
    var mdl_VoteItems = null;

    this.init = function() {
        console.log('advanceservice initing.....');
        jqPage = $('body > div#pgAdvanceService');
        jqPopupPickUp = $('div#div_advanceservice_pickup', jqPage);
        jqPopupInvitation = $('div#div_advanceservice_invitation', jqPage);
        jqPopupApplication = $('div#div_advanceservice_application', jqPage);

        $('button', jqPopupPickUp).click( handlePickUpFormSubmit );
        $('button', jqPopupInvitation).click( handleInvidationFormSubmit );
        $('button', jqPopupApplication).click( handleApplicationFormSubmit );

        //popup -> disable page scroll:
        jqPopupPickUp.on({
           popupafteropen: function(){ $('body').on('touchmove', false); },
           popupafterclose: function(){ $('body').off('touchmove'); }
        });
        jqPopupInvitation.on({
           popupafteropen: function(){ $('body').on('touchmove', false); },
           popupafterclose: function(){ $('body').off('touchmove'); }
        });
        jqPopupApplication.on({
           popupafteropen: function(){ $('body').on('touchmove', false); },
           popupafterclose: function(){ $('body').off('touchmove'); }
        });
    };
    
    this.beforeshow = function() {
        ajaxor.ajax('listmsg', 
            'msgcount=' + soagoalConfig.msgcount + '&msgsummarylength=' + soagoalConfig.msgsummarylength,
            function(oResult) {
                if (oResult.IsSuccessful) {
                    mdl_MsgList = oResult.ResultObj.MessageList;
                    mdl_VoteItems = oResult.ResultObj.VoteItems;
                    initData();
                } else {
                    commonUI.commonDialog('读取数据失败', oResult.Message, null, true);
                }
            }
        );
    };
    
    var sHTMLItem = '<li class="msg_item">'
                  + ' <a href="#" msgidx="#msgidx#" data-rel="popup" data-position-to="window" data-transition="pop" class="a_advanceservice_msg_notice">'
                  + '  <h4>-#title#</h4>'
                  + '  <p class="msg_timestamp">#timestamp#</p>'
                  + '  <p>#summary#</p>'
                  + ' </a>'
                  + '</li>';
    var initData = function() {
        var sHTML = '';
        if (mdl_MsgList && mdl_MsgList.length > 0) {
            for (var i = 0; i < mdl_MsgList.length; i++) {
                var oMsg = mdl_MsgList[i];
                sHTML += sHTMLItem.replace('#msgidx#', i)
                            .replace('#title#', oMsg['Subject'])
                            .replace('#timestamp#', oMsg['CreateTime'])
                            .replace('#summary#', oMsg['ReplyShort'] ? '[回复]: ' + oMsg['ReplyShort'] : '暂未回复, 请耐心等待.');
            }
        } else {
            sHTML = '<li class="msg_item"><a>没有消息</a></li>';
        }
        
        var jqUL = $('#ul_advanceservice_list', jqPage);
        jqUL.find('li.msg_item').remove();
        jqUL.append(sHTML).listview('refresh').find('a.a_advanceservice_msg_notice').on('click', showMsgDetail);
        
    };
    
    var showMsgDetail = function() {
        if (mdl_MsgList && mdl_MsgList.length > 0) {
            var idx = parseInt($(this).attr('msgidx'));
            var oMsg = mdl_MsgList[idx];
            if (oMsg) {
                $('#popupCommonTextPost_Title', gbl_popupCommonTextPost).html(oMsg['Subject']);
                $('#popupCommonTextPost_Time', gbl_popupCommonTextPost).html(oMsg['CreateTime']);
                $('#popupCommonTextPost_Body', gbl_popupCommonTextPost).html(oMsg['ReplyBody']);
                gbl_popupCommonTextPost.popup('open');
            }
        }
    };

    var handlePickUpFormSubmit = function() {
        console.log('handlePickUpFormSubmit');
        
        commonUI.loading();
        commonUI.clearFormError(jqPopupPickUp);

        //validation:
        var bValidation = true;
        // var jqTxtName = jqPopupPickUp.find('#txt_advanceservice_pickup_name');
        // var jqTxtFlight = jqPopupPickUp.find('#txt_advanceservice_pickup_flight');
        // var jqTxtDate = jqPopupPickUp.find('#txt_advanceservice_pickup_date');
        // var jqTxtPhone = jqPopupPickUp.find('#txt_advanceservice_pickup_phone');

        var jqArrays = $('input[type="text"]', jqPopupPickUp);
        for (var i = 0; i < jqArrays.length; i++) {
            if (validateRequired($(jqArrays[i])) == false) {
                bValidation = false;
            }
        }

        commonUI.loaded();
        if (bValidation) {
            jqPopupPickUp.one('popupafterclose', function(){
                commonUI.commonDialog('接机申请发送成功', '接机申请发送成功, 系统管理员会在处理您的申请后与您联系.', function() {
                    console.log('dialog closed...');
                });
            }).popup('close');
        }
    };

    var handleInvidationFormSubmit = function() {
        commonUI.loading();
        commonUI.clearFormError(jqPopupInvitation);

        //validation:
        var bValidation = true;

        var jqArrays = $('input[type="text"]', jqPopupInvitation);
        for (var i = 0; i < jqArrays.length; i++) {
            if (validateRequired($(jqArrays[i])) == false) {
                bValidation = false;
            }
        }

        commonUI.loaded();
        if (bValidation) {
            jqPopupInvitation.one('popupafterclose', function(){
                commonUI.commonDialog('邀请函申请发送成功', '邀请函申请发送成功, 系统管理员会在处理您的申请后与您联系.', function() {
                    console.log('dialog closed...');
                });
            }).popup('close');
        }
    };

    var handleApplicationFormSubmit = function() {
        commonUI.loading();
        commonUI.clearFormError(jqPopupApplication);

        //validation:
        var bValidation = true;

        var jqArrays = $('input[type="text"]', jqPopupApplication);
        for (var i = 0; i < jqArrays.length; i++) {
            if (validateRequired($(jqArrays[i])) == false) {
                bValidation = false;
            }
        }

        commonUI.loaded();
        if (bValidation) {
            jqPopupApplication.one('popupafterclose', function(){
                commonUI.commonDialog('申请指导发送成功', '申请指导发送成功, 系统管理员会在处理您的申请后与您联系.', function() {
                    console.log('dialog closed...');
                });
            }).popup('close');
        }
    };

    var validateRequired = function(jqObj, msg) {
        var value = jqObj.val();
        var result = true;
        if (! value) {
            result = false;
            commonUI.displayFormError(jqObj, (msg ? msg : '此项不能为空.'));
        }
        return result;
    };
};