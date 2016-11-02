module.exports = function(grunt) {

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8888,
          base: '.',
        },
      },
    },
    mocha: {
      all:['test/*.html'],
      options: {
        run:true,
        log:true,
        timeout:10000
      }
    },
    uglify: {
      my_target: {
        files: {
          'validator.min.js': ['validator.js']
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'validator.min.css': ['validator.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('test', ['mocha']);
  grunt.registerTask('dest',['mocha','uglify','cssmin']);
  grunt.registerTask('default', ['test']);

};
