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
        log:true
      }
    },
    uglify: {
      my_target: {
        files: {
          'validator.min.js': ['validator.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', ['mocha']);
  grunt.registerTask('dest',['mocha','uglify']);
  grunt.registerTask('default', ['test']);

};
