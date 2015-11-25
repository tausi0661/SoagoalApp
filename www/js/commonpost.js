var commonpost = new function() {
    var jqPage = null;

    this.init = function() {
        console.log('commonpost initing.....');
        jqPage = $('body > div#pgCommonPost');
    };
};