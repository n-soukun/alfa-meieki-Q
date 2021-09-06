$(function(){
    ScrollReveal().reveal('.headline', { delay: 500, duration: 1000});
    ScrollReveal().reveal('.box_left', { delay: 500, distance: "20px", origin: "right", duration: 800});
    ScrollReveal().reveal('.box_right', { delay: 500, distance: "20px", origin: "left", duration: 800});

    let headNav = $("header");

    $(window).on('load scroll', function () {
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
	});
});