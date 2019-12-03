var UKMresources = {};

/**
 * Fade-collapsible
 */
jQuery(document).on('click', '.fade-collapsible .actions', function() {
    var collapsible = $(this).parents('.fade-collapsible');
    var content = collapsible.find('.content');

    content.toggleClass('-expanded');

    if (content.hasClass('-expanded')) {
        collapsible.find('.actions .icon')
            .removeClass('dashicons-arrow-down-alt2')
            .addClass('dashicons-arrow-up-alt2');
    } else {
        collapsible.find('.actions .icon')
            .removeClass('dashicons-arrow-up-alt2')
            .addClass('dashicons-arrow-down-alt2');
    }
});

/**
 * Sett opp en jobb-liste
 * 
 * Options.elementHandler( elementID )
 * Må returnere emitter, og støtte emit('success',data)
 * 
 * @param String queue_id 
 * @param {*} options
 */
UKMresources.workQueue = function(queue_id, options) {
    var worker = -1;
    var items = [];

    var statusCount = new Map();
    var queue_emitter = new UKMresources.emitter(queue_id);

    var self = {
        length: items.length,
        execute: options.elementHandler,

        /**
         * Legg til element-ID
         * @param String id 
         * @return Void
         */
        add: function(id) {
            items.push(id);
            self.length = items.length;
        },

        /**
         * @alias add
         * @param String id 
         * @return Void
         */
        push: function(id) {
            self.add(id);
        },

        /**
         * Utfør neste element i listen
         * @return Void
         */
        next: function() {
            worker++;
            if (worker >= items.length) {
                return self.done();
            }
            var result = self.execute(items[worker]);
            self.bind(result);
        },

        /**
         * Binder opp interne listeners for å håndere
         * videre fremdrift, og varslig av lyttere
         * @param Any result 
         * @return void
         */
        bind: function(result) {
            result.on('success', self.handleSuccess);
            result.on('success', self.count);
            result.on('success', self.next);
            result.on('error', self.handleError);
            result.on('error', self.next);
        },

        /**
         * Teller hvor mange status av hver sort vi har fått som resultat
         * 
         * options.filterCountData(status) kan filtrere gitt status før videre behandling
         * 
         * @param String|{*} status 
         * @emits 'status_update', [Map statusCount, Int current job, String|Any status]
         */
        count: function(status) {
            if (self.filterCountData !== undefined) {
                var status = self.filterCountData(status);
            }
            if (statusCount.has(status)) {
                statusCount.set(status, statusCount.get(status) + 1);
            } else {
                statusCount.set(status, 1);
            }
            queue_emitter.emit('status_update', [statusCount, worker + 1, status]);
        },

        /**
         * Legg til lytter. Forwarder for intern emitter
         * 
         * @param String id 
         * @param Callable callback 
         */
        on: function(id, callback) {
            queue_emitter.on(id, callback);
        },

        /**
         * Start behandling av køen
         * @emits 'start'
         */
        start: function() {
            queue_emitter.emit('start');
            self.next();
        },

        /**
         * Køen er behandlet
         * @emits 'done'
         */
        done: function() {
            queue_emitter.emit('done', [worker, self.length]);
        },

        /**
         * options.elementHandler har emittet handleSuccess. Videreformidle
         * 
         * @param {*} data 
         * @emits 'success', data
         */
        handleSuccess: function(data) {
            queue_emitter.emit('success', data);
        },

        /**
         * options.elementHandler har emittet handleError. Videreformidle
         * @param {*} data 
         * @emits 'error', data
         */
        handleError: function(message, raw_data) {
            queue_emitter.emit('error', raw_data);
        }
    };

    if (options.filterCountData !== undefined) {
        self.filterCountData = options.filterCountData;
    }

    return self;
}

UKMresources.GUI = function($) {

    return function(options) {
        /*
        var options = {
            containers: {
                loading: '#username_loading',
                success: '#username_available',
                error: '#username_exists',
                fatalError: '#fatalErrorContainer',
                main: '#formContainer'
            }
        }
        */
        var self = {
            handleFatalError: function(message) {
                $(options.containers.main).slideUp();
                $(options.containers.fatalError)
                    .html('Beklager, en kritisk feil har oppstått. ' +
                        'Kontakt <a href="mailto:support@ukm.no">support</a>' +
                        '<br />' +
                        'Server sa: ' + message
                    )
                    .slideDown();
            },

            handleError: function(message, raw_response) {
                $(options.containers.error).fadeIn();
            },

            handleSuccess: function(response) {
                $(options.containers.success).fadeIn();
            },

            showLoading: function() {
                $(options.containers.success).stop().hide();
                $(options.containers.error).stop().hide();
                $(options.containers.loading).stop().fadeIn();
            },

            hideLoading: function() {
                $(options.containers.loading).stop().hide();
            },


        };

        return self;
    }
}(jQuery);


UKMresources.Request = function($) {
    var count = 0;

    return function(options) {
        var GUI = UKMresources.GUI(options);

        var self = {
            handleResponse: function(response) {
                if (response.success) {
                    self.handleSuccess(response);
                } else {
                    self.handleError(response.message, response);
                }
                return true;
            },

            handleSuccess: function(response) {
                if (response.count < count) {
                    return true;
                }

                GUI.handleSuccess(response);
                options.handleSuccess(response);
            },

            handleError: function(message, raw_response) {
                GUI.handleError(message, raw_response);
                options.handleError(message, raw_response);
            },

            do: function(data) {
                count++;
                GUI.showLoading();

                data.action = options.action; //'UKMresources_ajax';
                data.module = options.module;
                data.controller = options.controller;
                data.count = count;

                $.post(ajaxurl, data, function(response) {
                        GUI.hideLoading();
                        try {
                            self.handleResponse(response);
                        } catch (error) {
                            GUI.handleFatalError('En ukjent feil oppsto: ' + error);
                        }
                    })
                    .fail(function(response) {
                        GUI.hideLoading();
                        GUI.handleFatalError('En ukjent server-feil oppsto');
                    });
            }

        };

        return self;
    }
}(jQuery);


UKMresources.emitter = function(_navn) {
    var _events = [];
    var _onetimeEvents = [];
    var debug = false;
    var navn = (_navn !== undefined && _navn !== null) ? _navn.toUpperCase() : 'UKJENT';

    var self = {
        /* EVENT HANDLERS */
        emit: function(event, data) {

            if (debug) {
                console.info(navn + '::emit(' + event + ')', data);
            }
            if (_events[event] != null) {
                _events[event].forEach(function(_event) {
                    if (!Array.isArray(data)) {
                        data = [data];
                    }
                    _event.apply(null, data);
                });
            }

            if (_onetimeEvents[event] != null) {
                _onetimeEvents[event].forEach(function(_event, index) {
                    if (!Array.isArray(data)) {
                        data = [data];
                    }
                    _event.apply(null, data);
                    _onetimeEvents[event].splice(index, 1);
                });
            }
            return self;
        },

        on: function(event, callback) {
            if (_events[event] == null) {
                _events[event] = [callback];
                return;
            }
            _events[event].push(callback);
            return self;
        },

        enableDebug: function() {
            debug = true;
        },

        /**
         * Onetime event listeners.
         * Auto-deletes after running once
         * @param {*} event 
         * @param {*} callback 
         */
        once: function(event, callback) {
            if (_onetimeEvents[event] == null) {
                _onetimeEvents[event] = [callback];
                return;
            }
            _onetimeEvents[event].push(callback);
            return self;
        }
    };

    return self;
}

UKMresources.radioButtons = function($) {
    $(document).on('click', '.radioButtons > button', function(e) {
        var radioButtons = $(e.target).parents('.radioButtons');
        $(e.target).siblings().removeClass('btn-primary selected').addClass('btn-default');
        $(e.target).addClass('btn-primary').removeClass('btn-default');
        $('#radioButtonValue_' + radioButtons.attr('data-name')).val(
            $(e.target).val()
        ).change();
    });

    $(document).ready(function() {
        $('.radioButtons').each(
            function(index, item) {
                var name = $(item).attr('data-name');
                $(item).parents('form').append(
                    $('<input type="hidden" name="' + name + '" id="radioButtonValue_' + name + '" data-radiobutton="true" />')
                );
                $(item).find('.selected').click();
            }
        );
    });
}(jQuery);


UKMresources.optionCard = function($) {
    var groups = new Map();
    var currentValue = new Map();

    var emitter = UKMresources.emitter('optionCard');
    //emitter.enableDebug();

    var group = function(group_id) {
        var groupSelector = '.optionCard[data-group="' + group_id + '"]';

        $('.optionCard').parents('form').append(
            $('<input type="hidden" name="' + group_id + '" id="input_' + group_id + '" data-optiongroup="true" />')
        );

        var that = {
            value: null,

            val: function() {
                return that.value;
            },

            select: function(value) {
                $(groupSelector).removeClass('selected');
                $('.optionCard[data-value="' + value + '"]').addClass('selected');
                that.value = value;
                $('#input_' + group_id).val(value);
                emitter.emit(group_id, value);
                currentValue.set(group_id, value);
            },

            init: function() {
                $(groupSelector).each(
                    function(index, item) {
                        if ($(item).hasClass('selected')) {
                            that.select($(item).attr('data-value'));
                        }
                    }
                );
            }
        };
        return that;
    };

    var self = {
        init: function() {
            $('.optionCard').each(
                function(index, item) {
                    var group_id = $(item).attr('data-group');
                    if (!groups.has(group_id)) {
                        groups.set(group_id, new group(group_id));
                    }
                }
            );
            groups.forEach(function(group) {
                group.init();
            });

            self.bind();
        },

        click: function(e) {
            if ($(e.target).hasClass('optionCard')) {
                var clicked = $(e.target);
            } else {
                var clicked = $(e.target).parents('.optionCard');
            }
            groups.get(
                clicked.attr('data-group')
            ).select(clicked.attr('data-value'));
        },

        bind: function() {
            $(document).on('click', '.optionCard', self.click);
        },

        on: function(event, callback) {
            emitter.on(event, callback);
        },
        pullStatus: function(group_id) {
            emitter.emit(group_id, currentValue.get(group_id));
        }

    };

    return self;
}(jQuery);


/**
 * UKMresources.filter(filter_container);
 * 
 * @emits: change(number_of_visible_items)
 * 
 * Works automagically, but requires following HTML structure
 * <div class="UKMfilter" id="[filter_container]">
 *  <input name="search" />
 *  <div class="items">
 *    <div class="item" data-filter="[filter_value]"></div>
 *  </div>
 * </div>
 */
UKMresources.filter = function($) {
    return function(filter_container) {
        var emitter = new UKMresources.emitter(filter_container);
        //emitter.enableDebug();
        var numVisible = 0;

        var selector = {
            getSearch: function() {
                return filter_container + ' input[name="search"]';
            },
            getNoneFound: function() {
                return filter_container + ' .noneFound';
            },
            getItem: function() {
                return filter_container + ' .items .item';
            },
        };

        var self = {
            bind: function() {
                $(document).on('keyup', selector.getSearch(), self.filter);
                $(document).ready(function() {
                    self.count();
                });
            },

            filter: function() {
                var words = $(selector.getSearch()).val().toLowerCase().split(' ');

                if ($(selector.getSearch()).val() == '') {
                    emitter.emit('reset');
                }
                $(selector.getItem()).hide();

                $(selector.getItem()).filter(function(index, element) {
                    var searchIn = $(element).attr('data-filter').toLowerCase();
                    var found = false;
                    words.forEach(function(word) {
                        if (searchIn.indexOf(word) !== -1) {
                            found = true;
                            return; // bryter ut av forEach
                        }
                    });
                    return found; // faktisk resultat
                }).show();

                self.count();
                self.addCountHelper();
                self.toggleNoneFound();
            },

            count: function() {
                numVisible = $(selector.getItem() + ':visible').length;
                return numVisible;
            },
            getCount: function() {
                return numVisible;
            },
            getItemCount: function() {
                return $(selector.getItem()).length;
            },

            toggleNoneFound: function() {
                $(selector.getNoneFound()).stop();
                if (self.getCount() == 0) {
                    $(selector.getNoneFound()).fadeIn(200);
                } else {
                    $(selector.getNoneFound()).hide();
                }
            },

            addCountHelper: function() {
                $(filter_container).removeClass('found-none found-few found-many').attr('data-count', self.getCount());
                if (self.getCount() == 0) {
                    $(filter_container).addClass('found-none');
                } else if (self.getCount() < 5) {
                    $(filter_container).addClass('found-few');
                } else {
                    $(filter_container).addClass('found-many');
                }
                emitter.emit('change', self.getCount());
            },

            on: function(event, callback) {
                emitter.on(event, callback);
            },
            once: function(event, callback) {
                emitter.once(event, callback);
            }
        }

        self.bind();

        return self;
    }
}(jQuery);

UKMresources.tid = function(_seconds) {
    var hours = Math.floor(_seconds / 3600);
    var minutes = Math.floor(_seconds % 3600 / 60);
    var seconds = Math.floor((_seconds % 3600) % 60);

    var military = false;

    var template_long = {
        hour: '%h time',
        hours: '%h timer',
        minute: '%m minutt',
        minutes: '%m minutter',
        second: '%s sekund',
        seconds: '%s sekunder',
        comma: ', ',
        and: ' og '
    };

    var template_short = {
        hour: '%ht',
        hours: '%ht',
        minute: '%mm',
        minutes: '%mm',
        second: '%ss',
        seconds: '%ss',
        comma: ' ',
        and: ' '
    };

    var template = template_long;

    var self = {
        __toString: function() {
            return self.render();
        },

        useShort: function() {
            template = template_short;
            military = false;
            return self;
        },
        useLong: function() {
            template = template_long;
            military = false;
            return self;
        },
        useMilitary: function() {
            military = true;
            return self;
        },

        render: function() {
            var string = '';

            if (military) {
                if (hours > 0) {
                    string = '%h:';
                }
                string += '%m:%s'

                return string
                    .replace('%h', String(hours).padStart(2, '0'))
                    .replace('%m', String(minutes).padStart(2, '0'))
                    .replace('%s', String(seconds).padStart(2, '0'))
            }

            if (hours == 1) {
                string += template.hour.replace('%h', 1);
            } else if (hours > 1) {
                string += template.hours.replace('%h', hours);
            }

            if (minutes > 0 && hours > 0) {
                if (seconds == 0) {
                    string += template.and;
                } else {
                    string += template.comma;
                }
            } else if (minutes == 0 && seconds > 0) {
                string += template.and;
            }

            if (minutes == 1) {
                string += template.minute.replace('%m', minutes);
            } else if (minutes > 1) {
                string += template.minutes.replace('%m', minutes);
            }

            if (minutes > 0 && seconds > 0) {
                string += template.and;
            }

            if (seconds == 1) {
                string += template.second.replace('%s', 1);
            } else if (seconds > 1) {
                string += template.seconds.replace('%s', seconds);
            }

            return string;
        }
    }

    return self;
}

jQuery(document).ready(function() {
    UKMresources.optionCard.init();
});