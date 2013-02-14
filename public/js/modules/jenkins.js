var jenkins = {
	

	getWidgetOptionsContent: function(widget) {
		var content = 'Choose a job to monitor (on ' + widget.options.server + ')';
 		content += "<select id='jobList" + widget.id + "'>";
 		var jobs = widget.options.jobs;
 		for (var jobId in jobs) {
 			content += "<option>" + jobs[jobId] + "</option>";
 		}
 		content += "</select>";
		return content;
	},

	getWidgetOptions: function(widget) {
		return {job: $('#jobList' + widget.id).val()};
	},

	getWidgetContent: function(widget) {
		return 'jenkins widget !';
	},

	setWidgetContent: function(data, widget) {

		var content = "Build status for job \"<b>" + data.result.name + "</b>\"<br />";
		content += "<img src='./img/" + data.result.status + ".png' alt='" + data.result.status +"' />";
		content += "<br />(Last refresh : " + data.time + ")";
		return content;
	}
};

Modules.jenkins = jenkins;