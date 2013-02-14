var ping = {
	

	getWidgetOptionsContent: function(widget) {
		var content = 'Type a host to ping';
		content += '<br /><input type="text" id="hostToPing' + widget.id + '" />';
		return content;
	},

	getWidgetOptions: function(widget) {
		return $('#hostToPing' + widget.id).val();
	},

	getWidgetContent: function(widget) {
		return 'ping widget !';
	},

	setWidgetContent: function(data, widget) {

		var content = "Ping result for host \"<b>" + data.host + "</b>\" :<br />";
		if (data.alive) {
			content += "<img src='./img/ok.png' alt='Host is alive' />";
		} else {
			content += "<img src='./img/alert.png' width='50' height='50' alt='Host is down' />";
		}
		content += "<br />(Last refresh : " + data.time + ")";
		return content;
	}
};

Modules.ping = ping;