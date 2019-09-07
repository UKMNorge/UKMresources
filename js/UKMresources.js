var UKMresources = {};

/**
 * Sett opp en jobb-liste
 * 
 * Options.elementHandler( elementID )
 * Må returnere emitter, og støtte emit('success',data)
 * 
 * @param String queue_id 
 * @param {*} options
 */
UKMresources.workQueue = function (queue_id, options) {
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
        add: function (id) {
            items.push(id);
            self.length = items.length;
        },

        /**
         * @alias add
         * @param String id 
         * @return Void
         */
        push: function (id) {
            self.add(id);
        },

        /**
         * Utfør neste element i listen
         * @return Void
         */
        next: function () {
            worker++;
            if (worker >= items.length) {
                return self.done();
            }
            var result = self.execute(items[worker] );
            self.bind(result);
        },

        /**
         * Binder opp interne listeners for å håndere
         * videre fremdrift, og varslig av lyttere
         * @param Any result 
         * @return void
         */
        bind: function (result) {
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
        count: function (status) {
            if( self.filterCountData !== undefined ) {
                var status = self.filterCountData( status );
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
        on: function (id, callback) {
            queue_emitter.on(id, callback);
        },

        /**
         * Start behandling av køen
         * @emits 'start'
         */
        start: function () {
            queue_emitter.emit('start');
            self.next();
        },

        /**
         * Køen er behandlet
         * @emits 'done'
         */
        done: function () {
            queue_emitter.emit('done', [worker, self.length]);
        },

        /**
         * options.elementHandler har emittet handleSuccess. Videreformidle
         * 
         * @param {*} data 
         * @emits 'success', data
         */
        handleSuccess: function (data) {
            queue_emitter.emit('success', data);
        },

        /**
         * options.elementHandler har emittet handleError. Videreformidle
         * @param {*} data 
         * @emits 'error', data
         */
        handleError: function (message, raw_data) {
            queue_emitter.emit('error', raw_data);
        }
    };

    if( options.filterCountData !== undefined ) {
        self.filterCountData = options.filterCountData;
    }

    return self;
}

UKMresources.GUI = function ($) {

    return function (options) {
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
            handleFatalError: (message) => {            
                $(options.containers.main).slideUp();
                $(options.containers.fatalError)
                    .html('Beklager, en kritisk feil har oppstått. ' +
                        'Kontakt <a href="mailto:support@ukm.no">support</a>' +
                        '<br />' +
                        'Server sa: ' + message
                    )
                    .slideDown();
            },

            handleError: (message, raw_response) => {
                $(options.containers.error).fadeIn();
            },

            handleSuccess: (response) => {
                $(options.containers.success).fadeIn();
            },

            showLoading: () => {
                $(options.containers.success).stop().hide();
                $(options.containers.error).stop().hide();
                $(options.containers.loading).stop().fadeIn();
            },

            hideLoading: () => {
                $(options.containers.loading).stop().hide();
            },


        };

        return self;
    }
}(jQuery);


UKMresources.Request = function ($) {
    var count = 0;

    return function (options) {
        var GUI = UKMresources.GUI(options);

        var self = {
            handleResponse: (response) => {
                if (response.success) {
                    self.handleSuccess(response);
                } else {
                    self.handleError(response.message, response);
                }
                return true;
            },

            handleSuccess: (response) => {
                if (response.count < count) {
                    return true;
                }

                GUI.handleSuccess(response);
                options.handleSuccess(response);
            },

            handleError: (message, raw_response) => {
                GUI.handleError(message, raw_response);
                options.handleError(message, raw_response);
            },

            do: (data) => {
                count++;
                GUI.showLoading();

                data.action = options.action;//'UKMresources_ajax';
                data.module = options.module;
                data.controller = options.controller;
                data.count = count;

                $.post(ajaxurl, data, function (response) {
                    GUI.hideLoading();
                    try {
                        self.handleResponse(response);
                    } catch (error) {
                        GUI.handleFatalError('En ukjent feil oppsto: '+ error);
                    }
                })
                    .fail((response) => {
                        GUI.hideLoading();
                        GUI.handleFatalError('En ukjent server-feil oppsto');
                    });
            }

        };

        return self;
    }
}(jQuery);


UKMresources.emitter = function( _navn ) {
	var _events = [];
	
	var navn = (_navn !== undefined && _navn !== null) ? _navn.toUpperCase() : 'UKJENT';
	
	var self = {
		/* EVENT HANDLERS */
		emit: function( event, data ) {
			
			//console.info( navn + '::emit('+event+')', data);
			if( _events[event] != null ) {
				_events[event].forEach( function( _event ) {
                    if( !Array.isArray( data ) ) {
                        data = [data];
                    }
                    _event.apply(null, data );
				});
			}
			return self;
		},
		
		on: function( event, callback ) {
			if( _events[event] == null ) {
				_events[ event ] = [callback];
				return;
			}
			_events[ event ].push( callback );
			return self;
		}
	};
	
	return self;
}

UKMresources.radioButtons = function($) {
    $(document).on('click', '.radioButtons > button', (e) => {
        var radioButtons = $(e.target).parents('.radioButtons');
        $(e.target).siblings().removeClass('btn-primary selected').addClass('btn-default');
        $(e.target).addClass('btn-primary').removeClass('btn-default');
        $('#radioButtonValue_'+ radioButtons.attr('data-name')).val(
            $(e.target).val()
        ).change();
    });
    
    $(document).ready(()=>{
        $('.radioButtons').each(
            (index, item) => {
                var name = $(item).attr('data-name');
                $(item).parents('form').append(
                    $('<input type="hidden" name="'+ name +'" id="radioButtonValue_'+ name +'" />')
                );
                $(item).find('.selected').click();
            }
        );
    });
}(jQuery);


UKMresources.optionCard = function ($) {
    var groups = new Map();

    var emitter = UKMresources.emitter('optionCard');

    var group = function (group_id) {
        var groupSelector = '.optionCard[data-group="' + group_id + '"]';

        $('.optionCard').parents('form').append(
            $('<input type="hidden" name="'+ group_id +'" id="input_'+ group_id +'" />')
        );

        var that = {
            value: null,

            val: function () {
                return that.value;
            },

            select: function (value) {
                $(groupSelector).removeClass('selected');
                $('.optionCard[data-value="' + value + '"]').addClass('selected');
                that.value = value;
                $('#input_'+ group_id).val( value );
                emitter.emit(group_id, value);
            },

            init: function () {
                $(groupSelector).each(
                    (index, item) => {
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
        init: function () {
            $('.optionCard').each(
                (index, item) => {
                    var group_id = $(item).attr('data-group');
                    if (!groups.has(group_id)) {
                        groups.set(group_id, new group(group_id));
                    }
                }
            );
            groups.forEach((group) => {
                group.init();
            });

            self.bind();
        },

        click: function (e) {
            if ($(e.target).hasClass('optionCard')) {
                var clicked = $(e.target);
            } else {
                var clicked = $(e.target).parents('.optionCard');
            }
            groups.get(
                clicked.attr('data-group')
            ).select(clicked.attr('data-value'));
        },

        bind: () => {
            $(document).on('click', '.optionCard', self.click);
        },

        on: function(event, callback) {
            emitter.on(event,callback);
        }

    };

    return self;
}(jQuery);