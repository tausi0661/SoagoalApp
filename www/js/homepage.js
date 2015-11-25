var homepage = new function() {
    var jqPage = null;

    this.init = function() {
        logger.debug('homepage initing.....');
        jqPage = $('body > div#pgHome');
        
        $('#btn_test_here', jqPage).click(test);
        logger.debug(jqPage);
    };
    
    var test = function() {
        logger.debug('----test begin...');
        readFromProfile(function() {
            commonUI.commonDialog('this is title', globalProfile.Image + '\r\n<br/>' + globalProfile.Name);
        });
    };

    this.beforeshow = function() {
        var newDate = new Date();
        newDate.setHours(newDate.getHours() - 14);
        var ushours = newDate.getHours();
        var usminutes = newDate.getMinutes();
        var shours = ushours < 10 ? ('0' + ushours) : ushours;
        var sminutes = usminutes < 10 ? ('0' + usminutes) : usminutes;
        $('#span_home_US_time').html((ushours < 12 ? ' 上午 ' : ' 下午 ') + shours + ':' + sminutes);
        
        $.getJSON('http://192.168.1.100:8988/Test1.aspx', function(abc) {
            console.log('http://192.168.1.100:8988' + abc.Image);
            $('#h2_home_header_logo > img').attr('src', 'http://192.168.1.100:8988' + abc.Image);
            writeToProfile(abc, function() {
                logger.debug('got abc...');
            });
        });
    };
}