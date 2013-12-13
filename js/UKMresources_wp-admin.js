jQuery(document).ready(function(){
	jQuery('#hugesubmit').click(function(){
		jQuery(this).find('#lagre').html('Lagrer...');
		jQuery(this).parents('form').find('input[type=submit]').click();
	});
});

jQuery(document).on('click','.toggle', function(e){
//	console.log('TOGGLE: ' + jQuery(this).attr('data-toggle'));
	e.preventDefault();
    if(jQuery(this).attr('data-action') == undefined || jQuery(this).attr('data-action') == 'show') {
        jQuery( jQuery(this).attr('data-toggle') ).slideDown();
        jQuery(this).attr('data-action', 'hide');
    } else {
        jQuery(this).attr('data-action', 'show');
        jQuery( jQuery(this).attr('data-toggle') ).slideUp();
    }
});

jQuery.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++){
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return jQuery.getUrlVars()[name];
  }
});