jQuery(document).ready(function(){
	jQuery('.UKMSMS').each(function(){
		jQuery(this).html( '<a href="javascript:alert(\'kommer snart \')">'+ jQuery(this).html() + '</a>');
	});
});