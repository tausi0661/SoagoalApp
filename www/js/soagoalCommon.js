//global variables:
var gbl_Domain = soagoalConfig.product1;
var gbl_PostDic = {};
var gbl_mdl_ParentLogin = null;
//global variables -end

//page init bindings:
$(document).on('pageinit','#pgIndex' ,function(e,data){ commonFooterUpdate(e, indexpage.init()); });
$(document).on('pageinit','#pgLogin' ,function(e,data){ commonFooterUpdate(e, loginpage.init()); });
$(document).on('pageinit','#pgHome' ,function(e,data){ commonFooterUpdate(e, homepage.init()); });
$(document).on('pageinit','#pgSchoolInfo' ,function(e,data){ commonFooterUpdate(e, schoolinfo.init()); });
$(document).on('pageinit','#pgStudentInfo' ,function(e,data){ commonFooterUpdate(e, studentinfo.init()); });
$(document).on('pageinit','#pgStudendLife' ,function(e,data){ commonFooterUpdate(e, studentlife.init()); });
$(document).on('pageinit','#pgAdvanceService' ,function(e,data){ commonFooterUpdate(e, advanceservice.init()); });
$(document).on('pageinit','#pgCommonPost' ,function(e,data){ commonpost.init(); });
$(document).on('pageinit','#pgTranscript' ,function(e,data){ transcript.init(); });
$(document).on('pageinit','#pgTeacherInfo' ,function(e,data){ teacherinfo.init(); });

$(document).on('pagebeforeshow','#pgIndex' ,function(e,data){ indexpage.beforeshow(); });
$(document).on('pagebeforeshow','#pgLogin' ,function(e,data){ loginpage.beforeshow(); });
$(document).on('pagebeforeshow','#pgHome' ,function(e,data){ homepage.beforeshow(); });
$(document).on('pagebeforeshow','#pgStudentInfo' ,function(e,data){ studentinfo.beforeshow(); });
$(document).on('pagebeforeshow','#pgSchoolInfo' ,function(e,data){ schoolinfo.beforeshow(); });
$(document).on('pagebeforeshow','#pgStudendLife' ,function(e,data){ studentlife.beforeshow(); });
$(document).on('pagebeforeshow','#pgAdvanceService' ,function(e,data){ advanceservice.beforeshow(); });
$(document).on('pagebeforeshow','#pgCommonPost' ,function(e,data){ commonpost.beforeshow(); });
$(document).on('pagebeforeshow','#pgTranscript' ,function(e,data){ transcript.beforeshow(); });
$(document).on('pagebeforeshow','#pgTeacherInfo' ,function(e,data){ teacherinfo.beforeshow(); });

function commonFooterUpdate(event, callback) {
    //update footer active one:
    var baseURI = event.target.baseURI;
    console.log('----baseURI:' + baseURI);
    $('div[data-role="footer"]>div>ul>li>a').each(function() {
        var jqThis = $(this);
        if (baseURI.indexOf(jqThis.attr('href')) > 0) {
            jqThis.addClass('ui-btn-active');
        } else {
            jqThis.removeClass('ui-btn-active');
        }
    });
}
//page init bindings -end

//html ready bindings:
var gbl_popupCommonTextPost = null;
$(function() {
    $( "body>#panelMessager" ).enhanceWithin().panel();
    $( "body>#panelMenu" ).enhanceWithin().panel();
    gbl_popupCommonTextPost = $( "body>#popupCommonTextPost" ).popup().enhanceWithin().on({
       popupafteropen: function(){ $('body').on('touchmove', false); },
       popupafterclose: function(){ $('body').off('touchmove'); }
    });
    $( "body>#popupCommonDialog" ).popup().enhanceWithin().on({
       popupafteropen: function(){ $('body').on('touchmove', false); },
       popupafterclose: function(){ $('body').off('touchmove');  }
    });
    $( "body>#popupAboutUs" ).popup().enhanceWithin().on({
       popupafteropen: function(){ $('body').on('touchmove', false); },
       popupafterclose: function(){ $('body').off('touchmove'); }
    });
});
//html bindings -end

function globalBodyOnLoad() {
    document.addEventListener("deviceready", function() {
        
        $.mobile.loading("show");
        
        var d = window.device;
        console.log('--------ondevice ready----------');
        console.log('model: ' + d.model);
        console.log('platform: ' + d.platform);
        console.log('version: ' + d.version);
        if (d.platform == 'iOS') {
            console.log('--------is iOS----------');
            $('<style type="text/css">div.ui-header-fixed {padding-top: 20px;} div.ui-header-fixed > a.ui-btn {margin-top: 20px;}</style>').appendTo("head");
        }
        initFileSystem();
    }, false);
}

//----global files handlers----
var currentMethod = '';
var globalProfileFileEntry = null;
var globalProfileFileEntry = null;
var globalProfile = {};
var globalLogFileEntry = null;

function initFileSystem() {
    currentMethod = 'initFileSystem';
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        currentMethod = 'gotFileSystem';
        console.log('----FileSystem got');
        fileSystem.root.getDirectory("Soagoal", {create: true, exclusive: false}, function(directoryEntry) {
            currentMethod = 'gotDirectory';
            console.log('----Directory got');
            
            //profile:
            directoryEntry.getFile("profile.txt", {create: true, exclusive: false}, function(fileEntry) {
                currentMethod = 'gotFileEntry';
                console.log('----FileEntry got');
                globalProfileFileEntry = fileEntry;
                
                //now we can let indexpage.js to read profile and check session:
                indexpage.profileChecking();
                
                fileEntry.createWriter(gotFileWriter, file_io_fail);
            }, file_io_fail);
            
            //log file:
            directoryEntry.getFile("logfile.txt", {create: true, exclusive: false}, function(fileEntry) {
                currentMethod = 'gotLogFileEntry';
                console.log('----FileEntry got');
                globalLogFileEntry = fileEntry;
                fileEntry.createWriter(gotFileWriter, file_io_fail);
            }, file_io_fail);
            
        }, file_io_fail);
        
    }, file_io_fail);

    console.log('--------initFileSystem done----------');
}

function gotFileWriter(writer) {
    currentMethod = 'gotFileWriter';
    console.log('----FileWriter got');
}

//always overwrite:
function writeToProfile(obj, callback, errorCallback) {
    currentMethod = 'writeToProfile';
    if (globalProfileFileEntry) {
        globalProfileFileEntry.createWriter(function(writer){
            console.log('----begin to write');
            writer.onwriteend = function(evt) {
            console.log('----write end');
                if (callback) callback();
            }
            writer.write(JSON.stringify(obj));
        }, file_io_fail);
    } else {
        if (callback) callback();
    }
}

function file_io_fail(error, callback) {
    console.log('--file_io_fail--' + currentMethod + '----' + error.code);
    if (callback) callback();
}

function readFromProfile(callback, errorCallback) {
    currentMethod = 'readFromProfile';
    console.log('----begin readFromProfile...');
    globalProfileFileEntry.file(function(file) {
        currentMethod = 'gotFileReader';
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            //console.log("----Read as text:" + reader.result);
            try {
                globalProfile = JSON.parse(reader.result);
                console.log('globalProfile["ParentID"]: ' + globalProfile["ParentID"]);
                if (callback) callback();
            } catch (e) { 
                console.log("----JSON.parse [ERROR]" + e.message + '--' + e.description + '--' + e.number);
                if (errorCallback) errorCallback();
            }
        };
        reader.readAsText(file);
    }, function(e) {
        file_io_fail(e, errorCallback);
    });
    console.log('----end readFromProfile...');
}

//----global files handlers----

var logger = new function() {
    
    var writeToLogFile = function(msg) {
        
        if (globalLogFileEntry) {
            globalLogFileEntry.createWriter(function(writer){
                writer.seek(writer.length);
                console.log('----begin to write log');
                writer.onwriteend = function(evt) {
                    console.log('----write log end');
                }
                writer.write(msg + '\n');
            }, file_io_fail);
        }
    }
    
    this.debug = function(msg) {
        currentMethod = 'logger.debug';
        
        console.log(msg);
        
        writeToLogFile(msg);
    }
    
    this.error = function(msg) {
        currentMethod = 'logger.error';
        
        console.log(msg);
        
        writeToLogFile(msg);
    }
};

var commonUI = new function() {

    var showOverlay = function() {
        $("body").append('<div class="common-background-overlay"></div>');
    };
    var hideOverlay = function() {
        $('body>div.common-background-overlay').remove();
    };
    
    this.showOverlay = function() {
        showOverlay();
    };
    this.hideOverlay = function() {
        hideOverlay();
    };
    this.loading = function () {
        showOverlay();
        $.mobile.loading("show");
    };

    this.loaded = function () {
        $.mobile.loading("hide");
        hideOverlay();
    };

    this.clearFormError = function(jqObj) {
        jqObj.find('div.common-form-error').remove();
    };

    this.displayFormError = function(jqInput, msg) {
        jqInput.parents('div.ui-field-contain').append('<div class="common-form-error">' + msg + '</div>');
    };

    this.commonDialog = function(title, msg, closeCallback, autoClose) {
        var jqDialog = $('#popupCommonDialog');
        jqDialog.one('popupafterclose', function() {
            hideOverlay();
            if (closeCallback) closeCallback();
        });
        jqDialog.find('h3').html(title);
        jqDialog.find('p').html(msg);
        jqDialog.popup('open');
        showOverlay();
        if (autoClose == true) {
            setTimeout("$('#popupCommonDialog').popup('close');", 5000);
        }
    };
};

var commonUtil = new function() {
    this.combineURL = function(path1, path2) {
        var url = '';
        if (path1 && path1.length > 0) {
            url = (soagoalConfig.https ? 'https://' : 'http://') + path1.replace('\\', '/').replace('http://', '').replace('https://', '');
            url = url.substr(-1, 1) == '/' ? url.substr(0, url.length -1) : url;
        }
        if (path2 && path2.length > 0) {
            path2 = path2.replace('\\', '/');
            url += (path2.substr(0, 1) == '/' ? '' : '/') + path2;
        }
        return url;
    };
    
    this.urlParam = function(key) {
        var value = '';
        var arr1 = $.mobile.activePage.data('url').split('?');
        if (arr1.length > 1) {
            var params = arr1[1].split('&');
            for (var i = 0; i < params.length; i++) {
                if (params[i].indexOf(key + '=') == 0) {
                    value = params[i].replace(key + '=', '');
                    break;
                }
            }
        }
        return value;
    };
    
    var imageNameReg = /^.+\.(jpg|png|gif|bmp)$/;
    this.smallPic = function(imageURL) {
        var newURL = imageURL;
        if (imageURL && imageURL.length > 0) {
            imageURL = imageURL.replace('\\', '/').toLowerCase();
            var imageName = imageURL.substr(imageURL.lastIndexOf('/') + 1);
            if (imageNameReg.test(imageName)) {
                newURL = imageURL.substr(0, imageURL.lastIndexOf('/')) + '/' + 'small_' + imageName;
            }
        }
        return newURL;
    };
};

var commonConst = new function() {
    this.period = function(v) {
        var s = '';
        switch (v + '') {
            case '1': s = '春季'; break;
            case '2': s = '秋季'; break;
        }
        return s;
    };
};

var ajaxor = new function() {
    
    var apiURL = commonUtil.combineURL(gbl_Domain, soagoalConfig.api);
    
    this.setProduct = function(productVal) {
        if (productVal && soagoalConfig[productVal]) gbl_Domain = soagoalConfig[productVal];
        apiURL = commonUtil.combineURL(gbl_Domain, soagoalConfig.api);
    };
    
    this.ajax = function(cmd, data, callback, errorCallback) {
        commonUI.loading();
        var param = (data && data.length > 0 ? data + '&' : '') + 'ajax=1&cmd=' + cmd;
        if (cmd != 'parentlogin') param += '&hash=' + encodeURIComponent(gbl_mdl_ParentLogin['Hash']) + '&parentid=' + gbl_mdl_ParentLogin['ParentID'];
        console.log('~~~~~ajax ready3~~~~~' + apiURL);
        $.ajax({
            url: apiURL,
            type: "POST",
            cache: false,
            data: param,
            dataType: "json",
            async: false,
            success: function (oResult) {
                if (oResult.SessionTimeout) {
                    $.mobile.changePage("index.html", { transition: "slideup" });
                } else {
                    if (callback) {
                        callback(oResult);
                    }
                }
            },
            error: function (xhr, status, errorThrown) {
                logger.error('errorThrown: ' + errorThrown);
                commonUI.commonDialog('未知错误', '服务器繁忙, 程序猿加班解决中, 请稍候重试.', function() {
                    if (errorCallback) errorCallback();
                }, true);
            },
            complete: function (xhr, status) { commonUI.loaded() }
        });
    };
};
