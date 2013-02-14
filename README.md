## Hi, I'm Captain Control!
I'm a dashboard to monitor almost whatever you want.  
You have a library of widgets that will grab informations on services you chose and display the way you want the information on a dashboard.  
The core is made in Javascript using Node.js.  
The client part is a javascript library called dashboard.js.  
Persistence is made using a redis DB.  
You can add your own module and extend the widget library.  
I'm Captain Control, but my friends call me CapCon.  
My creators built me during a ShipIt day at Zanox.de AG. They are:
-	Nicolas Ritouet
-	Soner Dastan
-	Harro Harten
-	Ahmet Boyraz
-	Richard Müller


##	Modules ideas :
-	JBoss monitoring
-	Jira query (needs to login to Jira first)
-	Flow tests
-	Hardware monitoring
-	Highcharts with json input from url
	*	Example 1: VU Meter: http://jsfiddle.net/pWbNh/


## HOWTO BUILD A MODULE
#	server-side
To add a module, you just have to add a .js file in the /modules directory.  
All .js files in the /modules directory will automatically be included (after a restart of the node.js application) in the Node.js core file (app.js).  

Every server-side module is composed of 2 public methods : getOptions and getValues.  
getOptions is called when opening the options window of the module and will return an JSON object containing possible options for the module.  
getValues will fetch the data for the module with the options defined by the user and will return a JSON object containing the values to display.  
To build the module, we use Common.js module pattern (http://dailyjs.com/2010/10/18/modules/)  

Every module can use a few global objects:
	*	logger: a winston object (https://github.com/flatiron/winston)
	*	serverEventPool: an event pool, but it's not used yet
	*	moduleList: every module must add itself in this object
	
#	Client-side
Every module has a client-side part, where we decide how we're going to display the information relative to this module.  
Currently, we push every module into an array (Modules). We can access each method by doing this : Modules['ping'].getOptionsContent(widget)


## Changelog
0.0.1:
	-	First open source release
	-	Features currently available:
		*	Create and name a dashboard
		*	Add a widget, select the desired options and display it on the dashboard
		*	Save the dashboard
		*	Module system (pull only)
		*	Redis, MongoDB and local array (demo purpose) support

## Copyright & License
Copyright (c) 2013 Zanox.de AG licensed under the Apache 2.0 license (see LICENSE file) 
