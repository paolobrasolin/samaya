module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    srcFolder: "src",
    distFolder: "dist",

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [
          {
            cwd: "<%= distFolder %>",
            src: "*.html",
            dest: "<%= distFolder %>",
            expand: true
          }
        ]
      }
    },

    watch: {
      options: {
        livereload: true
      },
      all: {
        files: "<%= srcFolder %>/*",
        tasks: ["build"]
      }
    },

    connect: {
      server: {
        options: {
          port: 1337,
          base: "dist",
          livereload: true,
          open: true
        }
      }
    },

    "gh-pages": {
      options: {
        base: "<%= distFolder %>",
        message: "Grunt-generated commit"
      },
      src: ["**"]
    },

    inline: {
      dist: {
        options: {
          // uglify: true, // NOTE: does not support ES6
          cssmin: true
        },
        src: "src/index.html",
        dest: "dist/index.html"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-inline");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-connect");

  grunt.loadNpmTasks("grunt-gh-pages");

  grunt.registerTask("build", ["inline", "htmlmin"]);
  grunt.registerTask("serve", ["connect", "watch"]);
  grunt.registerTask("deploy", ["build", "gh-pages"]);
};
