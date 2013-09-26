jQuery(document).ready(function(){
	number = jQuery(this).html();
	jQuery('.UKMSMS').html( '<a href="javascript:alert(\'kommer snart \')">'+ number + '</a>');
});