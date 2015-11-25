var studentinfo = new function() {
    var jqPage = null;
    var jqImageGallery = null;
    var jqGradeList = null;

    this.init = function() {
        console.log('studentinfo initing.....');
        jqPage = $('body > div#pgStudentInfo');
        jqImageGallery = $('div#div_studentinfo_img_gallery', jqPage);
        jqGradeList = $('div#div_studentinfo_grades_list');

        //grade/term change events:
        $('#sel_studentinfo_grade, #sel_studentinfo_term').change(handleGradeTermChange);

        //popup -> disable page scroll:
        $('div[data-role="popup"]', jqImageGallery).on({
           popupafteropen: function(){ $('body').on('touchmove', false); },
           popupafterclose: function(){ $('body').off('touchmove'); }
        });
    };

    var handleGradeTermChange = function() {
        commonUI.loading();
        setTimeout('commonUI.loaded();', 2000);
    };
};