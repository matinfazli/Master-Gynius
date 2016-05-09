module.exports = function(grunt) {

require('load-grunt-tasks')(grunt);

grunt.initConfig({
	sass: {
		dist: {
			options: {
				style: 'expanded',
				sourcemap: 'none',
				loadPath: require('node-neat').includePaths
			},
			files: {
				'src/stylesheets/main.css': 'src/stylesheets/scss/main.scss'
			}
		}
	},
	cssmin: {
		target: {
			files: {
				'public/stylesheets/main.min.css': ['src/stylesheets/main.css']
			}
		}
	},
	imagemin: {
		dist: {
			files: [{
				 expand: true,
				 cwd: 'src/images',
				 src: ['**/*.{png,jpg,jpeg,gif}'],
				 dest: 'public/images'
			}]
		 }
	},
    jshint: {
      	all: ['Gruntfile.js']
    },
    watch: {
    	options: {
			livereload: true
		},
      	express: {
        	files: ['**/*.js'],
        	tasks: ['jshint', 'express:dev'],
        	options: {
          		spawn: false
       		}
      	},
      	css: {
			files: 'src/stylesheets/scss/**/*.scss',
			tasks: ['sass', 'cssmin']
		},
		images: {
			files: ['src/images/**/*.{png,jpg,jpeg,gif}'],
			tasks: ['imagemin']
		}
    },
    env: {
      	dev: { src: ".env" },
    },
    express: {
      	dev: {
        	options: {
          		script: './bin/www'
        	}
      	}
    }
});

grunt.registerTask('server', [ 'env:dev', 'express:dev', 'watch' ]);

};