module.exports = function(grunt) {
  'use strict';
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
                "jquery": "static/assets/vendor/jquery",
                "backbone": "static/assets/vendor/backbone-min",
                "underscore": "static/assets/vendor/underscore-min",
                "paper": "static/assets/vendor/paper",
                "io": "static/assets/vendor/socket.io.min",
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
        tasks: ['build'],
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

    requirejs: {
        compile: {
            options: {
                baseUrl: "src/",
                mainConfigFile: "src/config.js",
                /*paths: {
                    jquery: 'src/assets/vendor/jquery'
                },*/
                name: 'app/app',
                //include: ['app/app'],
                out: "output/application.js",
                optimize: 'none'
            }
        }
    },

    uglify: {
      dist: {
        src: "output/application.js",
        dest: "release/application.min.js"
      }
    },

    copy: {
      main: {
        src: "output/*",
        dest: '../boardino/static/js/application.js',
        filter: 'isFile'
      },
      prod: {
        src: "release/*",
        dest: '../boardino/static/js/application.min.js'
      }
    }

  });
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('test', ['jshint', 'jasmine']);

  grunt.registerTask('default', ['test']);
  
  grunt.registerTask('build', ['test','clean','concat','copy:main']);

  grunt.registerTask('deploy', ['test', 'clean','concat','uglify','copy:prod']);

};
