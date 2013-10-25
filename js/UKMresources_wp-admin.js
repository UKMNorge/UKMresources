jQuery(document).ready(function(){
	jQuery('#hugesubmit').click(function(){
		jQuery(this).find('#lagre').html('Lagrer...');
		jQuery(this).parents('form').find('input[type=submit]').click();
	});

	jQuery.urlParam = function(name){
	    var results = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
	    return results[1] || 0;
	}
});
