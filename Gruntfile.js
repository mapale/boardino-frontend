module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    jasmine : {
      src : 'src/app/**/*.js',
      options : {
        specs : 'spec/**/*.js',
        helpers: 'spec/**/*Helper.js',
        template: require('grunt-template-jasmine-requirejs'),
        templateOptions: {
          requireConfigFile: 'src/config.js',
          requireConfig: {
            baseUrl: '',
            paths: {
                "jquery": "src/assets/vendor/jquery",
                "backbone": "src/assets/vendor/backbone-min"
            },
            deps: ['jquery'],
            callback: function($) {
                console.log("Jquery Version", $.fn.jquery);
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
