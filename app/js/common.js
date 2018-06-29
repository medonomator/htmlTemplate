$(function() {

	$('.hamburger').click(function() {
		$(this).toggleClass("change");
		$('.main-menu').slideToggle();
	});


	$('.photo-container').masonry({
		itemSelector: '.photo',
		fitWidth: true,
	});

	$('.photo-container').css("justify-content", "center")
});
