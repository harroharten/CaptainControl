var zxDashboard = (function () {

	var self = this;

	// Private variables
	var _widgets = []
		, _prefix = "zxDash"
		, _titleContainer = {}
		, _widgetsContainer = {}
		, _container = {}
		, _widgetCount = 0;

	// Private methods
	_appendTitle = function(titleParam) {
		// Insert the title in the container
		_titleContainer = document.getElementById("titleContainer");
		_titleContainer.innerHTML = titleParam;
	};

	_initDashboard = function() {
		this.widgets = [];
        $('.column').sortable({
            items:'> li',
            connectWith:'.column',
            handle: '.widget-head',
            placeholder: 'widget-placeholder',
            forcePlaceholderSize: true,
            revert: 300,
            delay: 100,
            opacity: 0.8,
            containment: 'document',
            start: function (e,ui) {
                $(ui.helper).addClass('dragging');
            },
            stop: function (e,ui) {
                $(ui.item).css({width:''}).removeClass('dragging');
                $('.column').sortable('enable');
            }
        });

	}

	// public properties
	this.title;
	this.widgets = [];

	// Public methods
	return {

		createDashboard : function(titleParam) {
			this.title = titleParam;

			_initDashboard();

			_appendTitle(titleParam);

			return this;
		},

		addWidget: function(widget) {
			
			this.renderNewWidget(widget, false, _widgetCount);
			_widgetCount++;
			if (typeof this.widgets === 'undefined') {
				console.log("widgets is undefined !!!");
				this.widgets = [];
			}
			this.widgets.push(widget);
			return this;
		},

		renderNewWidget: function(widget, first, widgetId) {

			var columnNumber = widgetId % 4; // because we want 4 columns

			widgetContainer = $('#column' + columnNumber).createElement('li#' + _prefix + 'WidgetContainer' + widget.id + ".widget.color-blue");

			var widgetContainerHeader = widgetContainer.createElement('div.widget-head').html("<h3>" + widget.moduleName + " Widget</h3>");
			var widgetContainerBody = widgetContainer.createElement('div.widget-content#' + widget.id).html('Loading ...').css('height', '100px');
                
			return this;

		},

		restoreDashboard: function(dashboard) {

			_initDashboard();
			if (typeof dashboard.widgets === 'undefined') {
				console.log("1 widgets is undefined !!!");
				_widgetCount = 0;
			} else {
				_widgetCount = dashboard.widgets.length;
			}
			this.title = dashboard.title;
			this.widgets = dashboard.widgets;
			_appendTitle(this.title);
			for (var widget in this.widgets) {
				if (widget == 0) {
					this.renderNewWidget(this.widgets[widget], true, widget);
				} else {
					this.renderNewWidget(this.widgets[widget], false, widget);
				}
			}

			return this;
		},

		removeWidget: function(widget) {
			this.widgets.remove(widget);

		},

		removeDashboard: function() {
			$('#column0').empty();
			$('#column1').empty();
			$('#column2').empty();
			$('#column3').empty();
			// Do a real destroy, remove all the widgets in the this.widgets object
			//_container.removeChild();
			// this.destroy();
			// Delete the record in the DB
			// Sent an event when it's done
		}
	};
}());