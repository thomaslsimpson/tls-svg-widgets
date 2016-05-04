module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		execute: {
			target: {
				src: ['build.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-execute');
};

