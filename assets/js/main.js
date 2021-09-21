$(function(){

	let game_start = new Vue({
		el:'#game_start',
		data:{
			userName:''
		}
	});

    let headNav = $("header");

	$(window).on("load", function() {
		setTimeout(finish_loading, 1000);
		move_header();
	});

    $(window).on("scroll", function () {
		move_header();
	});

	$("#button_start").click(start);

	function finish_loading(){
		$(".loading").fadeOut();
		$("body").css("overflow", "initial");
		ScrollReveal().reveal('.top_content', { delay: 240, distance: "40px",origin: "bottom", duration: 1400});
		ScrollReveal().reveal('.headline', { delay: 500, duration: 1000});
		ScrollReveal().reveal('.box_left', { delay: 500, distance: "20px", origin: "right", duration: 800});
		ScrollReveal().reveal('.box_right', { delay: 500, distance: "20px", origin: "left", duration: 800});
	}

	function move_header(){
		//現在の位置が500px以上かつ、クラスfixedが付与されていない時
		if($(this).scrollTop() > 500 && headNav.hasClass('fixed') == false) {
			//位置を0に設定し、アニメーションのスピードを指定
			headNav.addClass("fixed");
			headNav.animate({"top": 0},600);
		}
		//現在の位置が300px以下かつ、クラスfixedが付与されている時にfixedを外す
		else if($(this).scrollTop() < 500 && headNav.hasClass('fixed') == true){
			headNav.removeClass("fixed");
			headNav.animate({"top": "-100px"},300);
		}
	}

	function start(){
		if(game_start.userName == ""){
			window.alert("ニックネームを入力してください");
			return;
		}
		const storage = localStorage;
		storage.clear();
		storage.setItem("name", game_start.userName);
		storage.setItem("status", "news");
		$(".black_out").fadeIn();
		setTimeout(function(){
			window.location.href = './news/';
		},1000);
	}
});