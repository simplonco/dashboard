//message slider code
$("#messages div:gt(0)").hide();

setInterval(function(){
	$('#messages div:first')
	.fadeOut(2500).next().fadeIn(2500).end().appendTo("#messages");
}, 6000);