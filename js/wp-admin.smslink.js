jQuery(document).ready(function(){
	registerUKMSMS('body');
});


function registerUKMSMS(selector) {
	jQuery(selector).find('.UKMSMS').each(function(){
		jQuery(this).html( '<a href="javascript:alert(\'kommer snart \')">'+ jQuery(this).html() + '</a>');
	});
}