$(document).on('pageinit','#pgIndex' ,function(e,data){ indexpage.init(); });
$(document).on('pageinit','#pgHome' ,function(e,data){ homepage.init(); });
$(document).on('pageinit','#pgSchoolInfo' ,function(e,data){ schoolinfo.init(); });
$(document).on('pageinit','#pgStudentInfo' ,function(e,data){ studentinfo.init(); });
$(document).on('pageinit','#pgStudendLife' ,function(e,data){ studentlife.init(); });
$(document).on('pageinit','#pgAdvanceService' ,function(e,data){ advanceservice.init(); });
$(document).on('pageinit','#pgCommonPost' ,function(e,data){ commonpost.init(); });

$(document).on('pagebeforeshow','#pgHome' ,function(e,data){ homepage.beforeshow(); });

$(function() {
    $( "body>#panelMessager" ).enhanceWithin().panel();
    $( "body>#panelMenu" ).enhanceWithin().panel();
    $( "body>#popupCommonTextPost" ).popup().enhanceWithin().on({
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

$(document).ready(function() {
    // are we running in native app or in a browser?
    window.isphone = false;
    if(document.URL.indexOf("http://") === -1 
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true;
    }

    if( window.isphone ) {
        document.addEventListener("deviceready", function() {
            console.log('onDeviceReady');
            var d = window.device;
            console.log('--------ondevice ready----------');
            console.log('model: ' + d.model);
            console.log('platform: ' + d.platform);
            console.log('version: ' + d.version);
            if (d.platform == 'iOS') {
                console.log('--------is iOS----------');
                $('<style type="text/css">div.ui-header-fixed {padding-top: 20px;} div.ui-header-fixed > a.ui-btn {margin-top: 20px;}</style>').appendTo("head");
            }
            onDeviceReady();
        }, false);

    } else {
        onDeviceReady();
    }
});

var currentMethod = '';
var globalProfileFileEntry = null;
var globalProfileFileEntry = null;
var globalProfile = {};
var globalLogFileEntry = null;

function onDeviceReady() {
    currentMethod = 'onDeviceReady';
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

    global_init();
    console.log('--------global_init done----------');
}

function gotFileWriter(writer) {
    currentMethod = 'gotFileWriter';
    console.log('----FileWriter got');
    writer.write("some sample text");
}

//always overwrite:
function writeToProfile(obj, callback) {
    currentMethod = 'writeToProfile';
    globalProfileFileEntry.createWriter(function(writer){
        console.log('----begin to write');
        writer.onwriteend = function(evt) {
        console.log('----write end');
            if (callback) callback();
        }
        writer.write(JSON.stringify(obj));
    }, file_io_fail);
}

function file_io_fail(error) {
    console.log('----' + currentMethod + '----' + error.code);
}

function readFromProfile(callback) {
    currentMethod = 'readFromProfile';
    globalProfileFileEntry.file(function(file) {
        currentMethod = 'gotFileReader';
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("----Read as text" + reader.result);
            globalProfile = JSON.parse(reader.result);
            if (callback) callback();
        };
        reader.readAsText(file);
    }, file_io_fail);
}

function global_init() {
    $(document).on("pageshow",function(event) {
        console.log('pageload------');

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

        // init current page:
        // var targetPageID = event.target.id;
        // var targetPage = null;
        // console.log('----targetPageID:' + targetPageID);
        // switch (targetPageID) {
        //     case 'pgIndex': targetPage = indexpage; break;
        //     case 'pgHome': targetPage = homepage; break;
        //     case 'pgSchoolInfo': targetPage = schoolinfo; break;
        //     case 'pgStudentInfo': targetPage = studentinfo; break;
        //     case 'pgStudendLife': targetPage = studentlife; break;
        //     case 'pgAdvanceService': targetPage = advanceservice; break;
        //     case 'pgCommonPost': targetPage = commonpost; break;
        // }
        // targetPage.init();
    });
}

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
}

var commonUI = new function() {

    var showOverlay = function() {
        $("body").append('<div class="common-background-overlay"></div>');
    };
    var hideOverlay = function() {
        $('body>div.common-background-overlay').remove();
    }
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
}

var ajaxor = new function() {
    
    this.ajax = function(cmd, data, callback) {
        commonUI.loading();
        var param = (data && data.length > 0 ? '&' : '') + 'ajax=1&cmd=' + cmd;
        $.ajax({
            url: soagoal.config.product1,
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
                logger.error(errorThrown);
                commonUI.commonDialog('未知错误', '服务器繁忙, 程序猿加班解决中, 请稍候重试.', null, true);
            },
            complete: function (xhr, status) { commonUI.loaded() }
        });
    };
}

var mdl_ParentLogin = null;