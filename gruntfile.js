module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      ignore_warning: { //https://github.com/jshint/jshint/blob/2.1.4/src/shared/messages.js
        options: {
          '-W083': true, //I sure don't care about that.
          '-W061': true //eval can be harmful, but the alternatives are much worse
        },
        src: ['js/script.js']
        } 
    },

jst: {
  compile: {
    options: {
      namespace: 'templates',
      processContent: function(src) {
    return src.replace(/(^\s+|\s+$)/gm, '');
  },
  processName: function(filepath) {
    var t = filepath.replace('templates/','').replace('.htm','');
    console.log(t);
    return t;
  }
    },
    files: {
      "templates/_templates.js": ["templates/*.htm"]
    }
  }
},
replace: {
  example: {
    src: ["templates/_templates.js"],             // source files array (supports minimatch)
    dest: 'templates/templates.js',             // destination directory or file
    replacements: [{
      from: ', __e = _.escape',                   // string replacement
      to: ''
    }]
    }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
           /* map css deps */
          'css/style.min.css': [
          'bower_components/leaflet/dist/leaflet.css',
          'bower_components/jquery-ui/themes/base/jquery-ui.min.css',
          'style.css'
          ]
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      script: {
      files: {'js/script.min.js':
        [
      'bower_components/leaflet/dist/leaflet.js',
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/jquery-ui/jquery-ui.min.js',
      'bower_components/highcharts/highcharts.js',
      'trailcountsAll_2015.js',
      'main.js'
        ]
      }
      }
    },
    copy: {
      main: {
        files: [
           {expand: true,flatten: true, src: ['bower_components/jquery-ui/themes/base/images*'], dest: 'css/images/', filter: 'isFile' },
           {expand: true,flatten: true, src: ['bower_components/leaflet/dist/images/*'], dest: 'css/images/', filter: 'isFile' }
        ]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  // Default task(s).
  grunt.registerTask('default', ['jshint', 'jst', 'replace', 'uglify', 'cssmin', 'copy']);

};