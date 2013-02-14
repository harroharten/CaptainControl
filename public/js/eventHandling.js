var l = document.location
	, socket = io.connect(l.protocol + '//' + l.host);


// Array containing all the modules
Modules = [];


$(document).ready( function() {
	var selectDashboardDialog = $('<div></div>').dialog({
		modal: true,
	    autoOpen: false,
	    height: 400,
	    width: 600
	});

	socket.on('connect', function () {
		var dashboard;
		var widgetOptionWindow = $('<div></div>').dialog({
			modal: true,
		    autoOpen: false,
		    height: 255,
		    width: 300,
		    buttons: {
		    	'Add this widget': function() {
		    		widget.options = Modules[widget.moduleName].getWidgetOptions(widget);
					widget.content = Modules[widget.moduleName].getWidgetContent(widget);

					dashboard.addWidget(widget, false);
					widgetOptionWindow.dialog('close');
					socket.emit('addWidget', {dashboard: dashboard, widget:widget});
		    		$( this ).dialog( "close" );
	            },
	            Cancel: function() {
	                $( this ).dialog( "close" );
	            }
		    }
		});

		// ****************
		// Initialization
		// ****************
		// Loading the list of existing dashboards
		socket.on('initDashboardList', function(values) {
			loadDashboardWindow(values);		
		});

		// Loading the list of existing Modules and importing JS files for each module
		socket.on('initModuleList', function(data) {
			for (var id in data) {
				var module = data[id];
				$('#addWidgetList').createElement('li').attr('data-module', module.name).createElement('a').attr('href', '#').html(module.title);
				includeJavascriptFile('js/modules/' + module.name + '.js?' + guidGenerator());
			}
		});


		// ***************************
		// DOM event handling
		// ***************************

		// Loading the dashboardList window
		$('#addDashboardButton').on('click', function() {
			socket.emit('loadDashboardWindow');
		});
		
		// Creating a dashboard
		$('#createDashboardButton').live('click', function() {
			var _title = prompt("Choose a title for your dasboard","");
			if (_title) {
				dashboard = zxDashboard.createDashboard(_title);
				selectDashboardDialog.dialog('close');
				socket.emit('saveDashboard', dashboard);
				$('#addWidgetListContainer').show();
			}
		});

		// Adding a widget
		$("#addWidgetList").on("click", "li", function() {
			var moduleName = $(this).attr('data-module');
			widget = {};
			widget.id = guidGenerator();
			widget.moduleName = moduleName;

			widgetOptionWindow.id = "optionContainer" + widget.id;
			widgetOptionWindow.dialog('option', 'title', 'Options for ' + $(this).find('a').html());
			widgetOptionWindow.dialog('open');
			widgetOptionWindow.html("Loading...");
			console.log("sending a getOptions event with : ", widget);
			socket.emit("getOptions", widget);
		});

		// Loading the Options window
	 	socket.on('setOptions', function(widget) {
	 		console.log(widget);
	 		var content = Modules[widget.moduleName].getWidgetOptionsContent(widget);
	 		widgetOptionWindow.html(content);
		});

		socket.on('widgetValues', function(data, widget) {
			var content = Modules[widget.moduleName].setWidgetContent(data, widget);

			$('#' + widget.id).html(content);
		});

	 	socket.on('buildDashboard', function (data) {
			// destroy the current dashboard before loading the next one
			zxDashboard.removeDashboard();
			dashboard = zxDashboard.restoreDashboard(data);
			for (var id in data.widgets) {
				socket.emit('addWidget', {dashboard: data, widget:data.widgets[id]});
			}
			$('#addWidgetListContainer').show();
		});

		$('#loadDashboardButton').live('click', function() {
			selectDashboardDialog.dialog('close');
			socket.emit('loadDashboard', $(this).html());
		});

		$('#deleteDashboardButton').live('click', function() {

			var answer = confirm("Are you sure ?");
			if (answer) {
				var dashboardTitle =  $(this).attr('data-dashboard-key');
				selectDashboardDialog.dialog('close');
				socket.emit('deleteDashboard', dashboardTitle);
			}
		});

		socket.on('dashboardDeleted', function(dashboardTitle) {
			socket.emit('loadDashboardWindow');
		});

		socket.on('sendToConsole', function(message) {
			$('#console').html(message + '<br />' + $('#console').html());
		})
	});

	var loadDashboardWindow = function (values) {
		var dashboardList = "<ul>";
		for (var id in values) {
			var jsonValues = values[id];
			dashboardList += "<li>";
			dashboardList += "<a href='#' id='loadDashboardButton'>" + jsonValues.title + "</a>";
			dashboardList += " [<a href='#' id='deleteDashboardButton' data-dashboard-key='" + jsonValues.title + "'>Delete</a>]</li>";
		}
		dashboardList += "</ul>";

		selectDashboardDialog.html('<a href="#" id="createDashboardButton">Create a new dashboard</a><br /><br />List of existing Dashboard :<br />' + dashboardList)
	 	.dialog('open');
	}

});