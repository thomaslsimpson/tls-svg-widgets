//
// Require some modules we will need.
//
var Handlebars= require('handlebars');
var fs= require('fs');
var path= require('path');
var async= require('async');


// ------------------------------------------------------------------------
//
// Some of our settings.
//
var TEMPLATE_PATH_PREFIX= "templates/";

var OUTPUT_COLORS= {
	"white": "white", 
	"black": "black",
	"grey": "rgb(150,150,150)"
};

var OUTPUT_PATH_TEMPLATE= Handlebars.compile("svg/{{widget}}-{{color}}.svg");

var OUTPUT_LIST= { svgfiles: [] };


// ------------------------------------------------------------------------

function processTemplate(templatePath, processTemplateCallback){
	fs.readFile(templatePath, 'utf8', function(err,data){
		if(err){
			console.log("Error reading template file", err);
			processTemplateCallback(err);
		} else {
			var colorq= async.queue(function(task, callback){
				fs.writeFile(task.outputFilePath, task.outputText, function(err){
					if(err){
					} else {
						OUTPUT_LIST.svgfiles.push({file:task.outputFilePath,widget:task.widget});
					}
					callback(err);
				});
			});
			colorq.drain= processTemplateCallback;

			var templateBasename= path.basename(templatePath, '.hdb');
			var template= Handlebars.compile(data);
			for(var colorname in OUTPUT_COLORS){
				var colorvalue= OUTPUT_COLORS[colorname];
				var outputFilePath= OUTPUT_PATH_TEMPLATE({ color:colorname, widget:templateBasename });
				var outputText= template({color:colorvalue});
				colorq.push({
					widget:templateBasename,
					outputFilePath: outputFilePath,
					outputText: outputText
				});
			}
		}
	});
}


//
// Set up an async queue to fill full of template info to process.
//
var mainq= async.queue(function(task, callback){
	processTemplate(task.filepath, callback);
}, 1);


//
// This runs when we are all finished.
// 
mainq.drain= function(){
	fs.readFile('test/index.hdb', 'utf8', function(err,data){
		var testHTMLTemplate= Handlebars.compile(data);
		fs.writeFile('test/index.html', testHTMLTemplate(OUTPUT_LIST), function(err){
			console.log("All done");
		});
	});
};



//
//
//
fs.readdir(TEMPLATE_PATH_PREFIX, function(err, files){
	if(err){
		console.log("Error finding templates", err);
		callback(err);
	} else {
		files= files.filter(function(e){ return e.substr(-4) == '.hdb' });
		files.forEach(function(file){
			console.log(">> Adding: " + file);
			mainq.push({ 
				path: TEMPLATE_PATH_PREFIX,
				filename: file,
				filepath: TEMPLATE_PATH_PREFIX+file 
			}, function(err){
				console.log("<< Completed: " + file);
			});
		});
	}
});


