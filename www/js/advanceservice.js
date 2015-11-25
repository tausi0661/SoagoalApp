var advanceservice = new function() {
    var jqPage = null;
    var jqPopupPickUp = null;
    var jqPopupInvitation = null;
    var jqPopupApplication = null;

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