/**
 * Grunt 설정 파일
 * @module Gruntfile
 */

module.exports = function (grunt) {
	'use strict';

	// Load all Grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Load environment variables
	require('dotenv').config({ path: '.env.' + process.env.NODE_ENV });

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/**
		 * 웹 서버 설정
		 * @type {Object}
		 */
		connect: {
			server: {
				options: {
					port: 80,
					hostname: '*',
					livereload: true,
					open: true,
					base: '.',
					middleware: function (connect, options, middlewares) {
						var proxy = require('grunt-middleware-proxy/lib/Utils').getProxyMiddleware();
						middlewares.unshift(proxy);
						return middlewares;
					}
				},
				proxies: ['/auth-user', '/auth-admin'].map(function (context) {
					return {
						context: context,
						host: process.env.PROXY_URL,
						port: 13131,
						https: false,
						rewriteHost: false
					};
				})
			}
		},

		/**
		 * 파일 변경 감지 설정
		 * @type {Object}
		 */
		watch: {
			scss: {
				files: ['src/**/*.scss'],
				tasks: ['sass', 'postcss'],
				options: {
					livereload: true
				}
			},
			configFiles: {
				files: ['Gruntfile.js', '*.config.js'],
				options: {
					reload: true
				}
			}
		},

		/**
		 * dist 폴더 정리 설정
		 * @type {Object}
		 */
		clean: {
			build: ['dist']
		},

		/**
		 * HTML 파일 처리 설정
		 * @type {Object}
		 */
		processhtml: {
			dist: {
				files: {
					'dist/index.html': ['index.html']
				}
			}
		},

		/**
		 * Sass 컴파일 설정
		 * @type {Object}
		 */
		sass: {
			options: {
				implementation: require('node-sass'),
				sourceMap: true,
				outputStyle: 'expanded',
				includePaths: ['node_modules']
			},
			dist: {
				files: {
					'src/styles/style.css': ['src/styles/style.scss']
				}
			}
		},

		/**
		 * SCSS 파일 전처리를 위한 PostCSS 설정
		 * @type {Object}
		 */
		postcss: {
			options: {
				map: true,
				config: 'postcss.config.js'
			},
			dist: {
				src: 'src/styles/style.css',
				dest: 'src/styles/style.css'
			}
		},

		/**
		 * JavaScript 번들링 설정
		 * @type {Object}
		 */
		browserify: {
			dist: {
				files: {
					'dist/assets/index.js': ['src/index.js']
				}
			}
		},

		/**
		 * EJS 템플릿 변환 설정
		 * @type {Object}
		 */
		ejs: {
			all: {
				options: {
					env: process.env.NODE_ENV
				},
				src: ['src/pages/**/*.ejs'],
				dest: 'dist/',
				expand: true,
				ext: '.html'
			}
		},

		/**
		 * 파일 병합 설정
		 * @type {Object}
		 */
		concat: {
			js: {
				src: ['dist/assets/index.js', 'src/**/*.js'],
				dest: 'dist/assets/index.js'
			},
			css: {
				src: ['src/**/*.css'],
				dest: 'dist/assets/style.css'
			}
		},

		/**
		 * CSS 압축 설정
		 * @type {Object}
		 */
		cssmin: {
			main: {
				src: 'dist/assets/style.css',
				dest: 'dist/assets/style.min.css'
			}
		},

		/**
		 * JavaScript 압축 설정
		 * @type {Object}
		 */
		uglify: {
			main: {
				src: 'dist/assets/index.js',
				dest: 'dist/assets/index.min.js'
			}
		},

		/**
		 * 이미지 최적화 설정
		 * @type {Object}
		 */
		imagemin: {
			main: {
				files: [
					{
						expand: true,
						cwd: 'src/assets/images',
						src: ['**/*.{png,jpg,gif}'],
						dest: 'dist/assets/images'
					}
				]
			}
		},

		/**
		 * 폰트 파일 복사 설정
		 * @type {Object}
		 */
		copy: {
			build: {
				files: [
					{
						expand: true,
						cwd: 'src/assets/fonts',
						src: '**',
						dest: 'dist/assets/fonts'
					}
				]
			}
		},

		/**
		 * 최종 빌드 압축 설정
		 * @type {Object}
		 */
		compress: {
			main: {
				options: {
					archive: 'dist.tar.gz',
					mode: 'tgz'
				},
				files: [{ expand: true, cwd: 'dist/', src: '**' }]
			}
		}
	});

	/**
	 * 개발 서버 실행 태스크
	 * 프록시 설정, 서버 실행, 파일 감시를 동시에 수행
	 */
	grunt.registerTask('server', ['sass', 'postcss', 'setupProxies:server', 'connect:server', 'watch']);

	/**
	 * 프로덕션 빌드 태스크
	 * 다음 순서로 실행:
	 * 1. dist 폴더 정리
	 * 2. HTML 파일 처리
	 * 3. SCSS 전처리
	 * 4. Sass 컴파일
	 * 5. JavaScript 번들링
	 * 6. EJS 템플릿 변환
	 * 7. 파일 병합
	 * 8. CSS 압축
	 * 9. 이미지 최적화
	 * 10. JavaScript 압축
	 * 11. 폰트 파일 복사
	 * 12. 최종 빌드 압축
	 */
	grunt.registerTask('build', [
		'clean',
		'processhtml',
		'sass',
		'postcss',
		'browserify',
		'ejs',
		'concat',
		'cssmin',
		'uglify',
		'imagemin',
		'copy',
		'compress'
	]);
};
