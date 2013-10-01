jQuery('#hugesubmit').click(function(){
	jQuery(this).find('#lagre').html('Lagrer...');
	jQuery(this).parents('form').submit();
});