jQuery(document).ready(function() {
    jQuery('#hugesubmit').click(function() {
        jQuery(this).find('#lagre').html('Lagrer...');
        jQuery(this).parents('form').find('input[type=submit]').click();
    });
});

jQuery(document).on('click', '.toggle', function(e) {
    //	console.log('TOGGLE: ' + jQuery(this).attr('data-toggle'));
    e.preventDefault();
    if (jQuery(this).attr('data-action') == undefined || jQuery(this).attr('data-action') == 'show') {
        jQuery(jQuery(this).attr('data-toggle')).slideDown();
        jQuery(this).attr('data-action', 'hide');
    } else {
        jQuery(this).attr('data-action', 'show');
        jQuery(jQuery(this).attr('data-toggle')).slideUp();
    }
});

jQuery(document).ready(function() {
    jQuery.datepicker.regional['no'] = {
        closeText: 'Lukk',
        prevText: '&laquo;Forrige',
        nextText: 'Neste&raquo;',
        currentText: 'I dag',
        monthNames: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
        ],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun',
            'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'
        ],
        dayNamesShort: ['S&oslash;n', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'L&oslash;r'],
        dayNames: ['S&oslash;ndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'L&oslash;rdag'],
        dayNamesMin: ['S&oslash;', 'Ma', 'Ti', 'On', 'To', 'Fr', 'L&oslash;'],
        weekHeader: 'Uke',
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    jQuery.datepicker.setDefaults(jQuery.datepicker.regional['no']);
});

jQuery.extend({
    getUrlVars: function() {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function(name) {
        return jQuery.getUrlVars()[name];
    }
});


jQuery(document).ready(function() {
    jQuery(".datepicker_kommune").datepicker({ minDate: new Date(SEASON, 0, 1), maxDate: new Date(SEASON + 2, 11, 31), dateFormat: 'dd.mm.yy' });
    jQuery(".datepicker_fylke").datepicker({ minDate: new Date(SEASON, 0, 1), maxDate: new Date(SEASON + 2, 11, 30), dateFormat: 'dd.mm.yy' });
    jQuery(".datepicker_fylke_forward").datepicker({ minDate: new Date(SEASON, 0, 1), maxDate: new Date(SEASON + 2, 11, 30), dateFormat: 'dd.mm.yy' });
    jQuery(".datepicker_land").datepicker({ minDate: new Date(SEASON, 0, 1), maxDate: new Date(SEASON + 2, 11, 31), dateFormat: 'dd.mm.yy' });
});


// Bind input value to html-tag
jQuery(document).ready(function() {
    jQuery('.bind').each(function(index, element) {
        var bind = jQuery(element);
        var trigger = jQuery(bind.attr('data-bind'));
        bind.attr('data-default', bind.html());

        jQuery(document).on('change keyup', bind.attr('data-bind'), function() {
            if (trigger.val() == '') {
                bind.html(bind.attr('data-default'));
            } else {
                bind.html(trigger.val());
            }
        });
        trigger.change();
    });
});