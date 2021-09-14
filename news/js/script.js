$(function(){
    $("#notice").on("click", function(){
        $("#story_guide").hide();
        $('#notice_body').toggle();
    });

    setTimeout(function(){
        $("#story_guide").fadeIn();
    },7000);
});