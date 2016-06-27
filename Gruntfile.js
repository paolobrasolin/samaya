module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    srcFolder: 'src',
    distFolder: 'dist',

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
        },
        files: [{
           cwd: '<%= distFolder %>',
           src: '*.html',
           dest: '<%= distFolder %>',
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
        tasks: [ 'build' ],
      },
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: '<%= srcFolder %>',
            src: '*.json',
            dest: '<%= distFolder %>',
          },
        ],
      },
    },

    connect: {
      server: {
        options: {
          port: 1337,
          base: 'dist',
          livereload: true,
          open: true,
        },
      },
    },

    'gh-pages': {
      options: {
        base: '<%= distFolder %>',
        message: 'Grunt-generated commit',
      },
      src: ['**'],
    },

    inline: {
      dist: {
        options:{
          uglify: true,
          cssmin: true,
        },
        src: 'src/index.html',
        dest: 'dist/index.html',
      }
    },


  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-inline');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsbeautifier');

  grunt.loadNpmTasks('grunt-gh-pages');


  grunt.registerTask('build', ['copy', 'inline', 'htmlmin']);
  grunt.registerTask('serve', ['connect', 'watch']);
  grunt.registerTask('deploy', ['build', 'gh-pages']);

};

