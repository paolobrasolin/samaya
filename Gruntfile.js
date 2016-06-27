module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    buildFolder: 'build',
    srcFolder: 'src',

    uglify: {
      files: { 
        src: '<%= srcFolder %>/*.js',
        dest: '<%= buildFolder %>/',
        expand: true,
        flatten: true,
        ext: '.js',
      },
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
        },
        files: [{
           cwd: '<%= srcFolder %>',
           src: '**/*.html',
           dest: '<%= buildFolder %>/',
           expand: true,
        }],
      },
    },

    jsbeautifier : {
      files : "<%= srcFolder %>/*",
      options : {
        js: {
          indentSize: 2,
          preserveNewlines: false,
        },
        css: {
          indentSize: 2,
        },
        html: {
          indentSize: 2,
          preserveNewlines: false,
        },
      },
    },

    jshint: {
      myFiles: ['<%= srcFolder %>/*.js'],
    },

    watch: {
      options: {
        livereload: true,
      },
      all: {
        files: '<%= srcFolder %>/*',
//        tasks: [ 'copy' ],
      },
//      scripts: {
//        files: ['js/*.js'],
//        tasks: ['uglify'],
//        options: {
//          spawn: false,
//        },
//      } 
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: '<%= srcFolder %>/',
            src: ['**'],
            dest: '<%= buildFolder %>/',
          },
        ],
      },
    },

    connect: {
      server: {
        options: {
          port: 1337,
          base: 'src',
          livereload: true,
          open: true,
        },
      },
    },

    'gh-pages': {
      options: {
        base: '<%= buildFolder %>',
        message: 'Grunt-generated commit',
      },
      src: ['**'],
    },


  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('serve', ['connect', 'watch']);
  grunt.registerTask('deploy', ['copy', 'gh-pages']);

};

