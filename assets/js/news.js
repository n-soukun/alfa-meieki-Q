$(function(){
    
    const storage = localStorage;
    if(storage.status != "news")$(".black_in").hide();

    $(".notice_button").on("click", function(){
        $("#story_guide").hide();
        $('#notice_body').toggleClass("active");
    });

    setTimeout(function(){
        $("#story_guide").fadeIn();
		storage.setItem("status", "chat");
    },15000);
});

$(window).on("load", function() {
    $(".black_in").fadeOut();
});