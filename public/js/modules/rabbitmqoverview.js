var rabbitmqoverview = {
	

	getWidgetOptionsContent: function(widget) {
		var content = 'Sorry, this module is not implemented yet';
		return content;
	},

	getWidgetOptions: function(widget) {
		return $('#jobList' + widget.id).val();
	},

	getWidgetContent: function(widget) {
		return 'rabbitmqoverview widget !';
	},

	setWidgetContent: function(data, widget) {

		var content = "Build status for job \"<b>" + data.result.name + "</b>\"<br />";
		content += "<img src='./img/" + data.result.status + ".png' alt='" + data.result.status +"' />";
		content += "<br />(Last refresh : " + data.time + ")"
		return content;
	}
};

Modules.rabbitmqoverview = rabbitmqoverview;