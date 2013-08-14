module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    jasmine : {
      src : 'src/app/javascripts/modules/*.js',
      options : {
        specs : 'spec/**/*.js',
        helpers: 'spec/**/*Helper.js',
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          requireConfigFile: 'src/config.js',
          requireConfig: {
            baseUrl: './src/app/javascripts/',
            paths: {
                "jquery": "./vendor/jquery",
                "backbone": "./vendor/backbone"
            }
          }
        }
      }
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'src/app/**/*.js',
        'spec/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['jshint', 'jasmine']);

  grunt.registerTask('default', ['test']);

};
