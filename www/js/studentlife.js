var studentlife = new function() {
    var jqPage = null;

    this.init = function() {
        console.log('studentlife initing.....');
        jqPage = $('body > div#pgStudendLife');
    };
};