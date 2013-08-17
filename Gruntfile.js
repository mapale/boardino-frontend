var config = require('./config');
module.exports = function(grunt) {
  'use strict';
  var path = config.django_path;
  // Project configuration.
  grunt.initConfig({

    clean : {
      src: ['output']
    },

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
                "backbone": "src/assets/vendor/backbone-min",
                "underscore": "src/assets/vendor/underscore-min",
                "paper": "src/assets/vendor/paper",
                "io": "src/assets/vendor/socket.io.min",
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
    },

    watch: {
      scripts: {
        files: ['src/app/**/*.js'],
        tasks: ['jshint'],
        options: {
          spawn: false,
        },
      }
    },

    concat: {
      foo: {
        files: [ 
          {src: ['src/config.js','src/app/**/*.js'], dest: 'output/application.js'}
        ]
      }
    },

    uglify: {
      dist: {
        src: "output/application.js",
        dest: "output/application.min.js"
      }
    },

    copy: {
      main: {
        src: "output/*",
        dest: path + 'application.js',
        filter: 'isFile'
      }
    }

  });
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('test', ['jshint', 'jasmine']);

  grunt.registerTask('default', ['test']);
  
  grunt.registerTask('build', ['clean','concat','copy:main']);

  grunt.registerTask('deploy', ['clean','concat','uglify']);

};
