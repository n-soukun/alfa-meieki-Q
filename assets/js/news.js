$(function(){
    
    const storage = localStorage;
    if(storage.status != "news")$(".black_in").hide();

    $("#notice").on("click", function(){
        $("#story_guide").hide();
        $('#notice_body').toggle();
    });

    setTimeout(function(){
        $("#story_guide").fadeIn();
		storage.setItem("status", "chat");
    },15000);
});

$(window).on("load", function() {
    $(".black_in").fadeOut();
});