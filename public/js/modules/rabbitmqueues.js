var rabbitmqueues = {
	

	getWidgetOptionsContent: function(widget) {
		var content = 'Choose a queue to monitor (on ' + widget.options.server + ')';
 		content += "<select id='queueList" + widget.id + "'>";
 		var queues = widget.options.queues;
 		for (var queueId in queues) {
 			content += "<option>" + queues[queueId] + "</option>";
 		}
 		content += "</select>";
		return content;
	},

	getWidgetOptions: function(widget) {
		return {queue: $('#queueList' + widget.id).val()};
	},

	getWidgetContent: function(widget) {
		return 'rabbitmqueues widget !';
	},

	setWidgetContent: function(data, widget) {
		var queueData = JSON.parse(data.result.data);
		var content = "Monitored Queue: \"<b>" + data.result.name + "</b>\"<br />";
		content += "Memory: " + queueData.memory +"<br />";
		content += "Messages: " + queueData.messages +"<br />";
		content += "Message ready: " + queueData.messages_ready +"<br />";
		content += "(Last refresh : " + data.time + ")";
		return content;
	}
};

Modules.rabbitmqueues = rabbitmqueues;