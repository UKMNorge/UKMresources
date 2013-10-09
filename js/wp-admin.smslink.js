jQuery(document).ready(function(){
	var url = window.location.href.split('?')[0] + '?page=UKMSMS_gui';
	var form = jQuery('<form action="' + url + '" method="post" id="UKMSMS_form">' +
						 '<input type="hidden" name="UKMSMS_recipients" id="UKMSMS_to" value="" />' +
					  '</form>');
	jQuery('body').append(form);



	registerUKMSMS('body');
	
	jQuery(document).on('click', '.UKMSMS_link', function() {
		jQuery('#UKMSMS_to').val(jQuery(this).attr('data-to'));
		jQuery('#UKMSMS_form').submit();
	});
});


function registerUKMSMS(selector) {
	jQuery(selector).find('.UKMSMS').each(function(){
		jQuery(this).html( '<a href="#" class="UKMSMS_link" data-to="'+jQuery(this).html()+'">'+ jQuery(this).html() + '</a>');
	});
}