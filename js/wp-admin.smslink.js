var UKMSMS = function($) {
    var mottakere = new Map();

    var self = {
        go: function(mobil, navn) {
            self.add(mobil, navn);
            self.submit();
        },
        add: function(mobil, navn) {
            if (!mottakere.has()) {
                mottakere.set(mobil, []);
            }
            if (navn == undefined) {
                navn = 'Ukjent';
            }
            if (!mottakere.get(mobil).includes(navn)) {
                mottakere.get(mobil).push(navn);
            }
        },
        submit: function() {
            // Konverter navneliste til skjema-data
            // list brukes for gamlemåten (csv)
            var list = '';
            mottakere.forEach(function(navneliste, mobil) {
                $('#UKMSMS_form').append(
                    $('<input type="hidden" name="recipients[' + mobil + ']" />')
                    .attr(
                        'value',
                        JSON.stringify(navneliste)
                    )
                );
                list += '[' + mobil + ', ' + navneliste  + ']' + ',';
            });

            list = list.substring(0, list.length - 1);

            $('#UKMSMS_to').attr('value', list);
            $('#UKMSMS_form').submit();
        },
        init: function() {
            $('body').append(
                $(
                    '<form action="' + window.location.href.split('?')[0] + '?page=UKMSMS_gui' + '" method="post" id="UKMSMS_form">' +
                    '<input type="hidden" name="UKMSMS_recipients" id="UKMSMS_to" value="" />' +
                    '</form>'
                )
            );
        },
        bind: function() {
            // Generer form onPageInit
            $(document).ready(function() {
                self.init();
            });
            // Klikk på enkeltnummer
            $(document).on('click', '.UKMSMS', function() {
                self.go(
                    $(this).attr('data-to'),
                    $(this).attr('data-navn')
                );
            });
            // Klikk for å sende til alle på siden
            $(document).on('click', '.UKMSMSsendToAll', function() {
                $('.UKMSMS').each(function() {
                    self.add(
                        $(this).attr('data-to'),
                        $(this).attr('data-navn')
                    )
                });
                self.submit();
            });
        }
    }

    self.bind();

    return self;
}(jQuery);