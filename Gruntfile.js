/**
 * Grunt 설정 파일
 * @module Gruntfile
 */

module.exports = function (grunt) {
	('use strict');

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
					base: 'dist',
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
				tasks: ['sass'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['src/**/*.js'],
				tasks: ['browserify'],
				options: {
					livereload: true
				}
			},
			template: {
				files: ['src/pages/*.html'],
				tasks: ['template'],
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
					'dist/assets/style.css': ['src/styles/style.scss']
				}
			}
		},

		/**
		 * 파일 병합 설정
		 * @type {Object}
		 */
		concat: {
			css: {
				src: [
					'dist/assets/style.css',
					'node_modules/datatables.net-*/css/*.css',
					'!node_modules/datatables.net-*/css/*.min.css' // .min.css 파일 제외
				],
				dest: 'dist/assets/style.css'
			}
		},

		/**
		 * SCSS 파일 전처리를 위한 PostCSS 설정
		 * @type {Object}
		 */
		postcss: {
			options: {
				map: true,
				processors: [require('autoprefixer')()]
			},
			dist: {
				src: 'dist/assets/style.css',
				dest: 'dist/assets/style.css'
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
		 * HTML 템플릿 처리 설정
		 * @type {Object}
		 */
		template: {
			options: {
				layout: 'src/partials/layout.html'
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: 'src/pages',
						src: ['**/*.html'],
						dest: 'dist/',
						ext: '.html',
						flatten: false
					}
				]
			}
		},

		/**
		 * HTML 파일 처리 설정
		 * @type {Object}
		 */
		processhtml: {
			dist: {
				files: [
					{
						expand: true,
						cwd: 'dist/',
						src: ['**/*.html'],
						dest: 'dist/',
						ext: '.html'
					}
				]
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
	 * HTML 템플릿 처리 태스크
	 */
	grunt.registerTask('template', 'Process HTML templates with layout', function () {
		var fs = require('fs');
		var path = require('path');
		var _ = require('underscore');
		var done = this.async();

		// 레이아웃 템플릿 읽기
		var layoutPath = grunt.config('template.options.layout');
		var layoutContent = fs.readFileSync(layoutPath, 'utf8');

		// 페이지 파일 목록 가져오기
		var files = grunt.config('template.dist.files')[0];
		var pages = grunt.file.expand({ cwd: files.cwd }, files.src);

		var completed = 0;
		var total = pages.length;

		pages.forEach(function (page) {
			try {
				// 레이아웃에 페이지 내용 삽입 (HTML 이스케이프 방지)
				var finalContent = _.template(layoutContent)({
					current: page,
					contents: fs.readFileSync(path.join(files.cwd, page), 'utf8')
				});

				// 출력 경로 생성
				var destPath = path.join(files.dest, page);

				// 디렉토리 생성
				grunt.file.mkdir(path.dirname(destPath));

				// 파일 저장
				fs.writeFileSync(destPath, finalContent);

				grunt.log.ok('Processed: ' + page);
			} catch (err) {
				grunt.log.error('Error processing ' + page + ': ' + err.message);
			}

			completed++;
			if (completed === total) {
				done();
			}
		});

		if (total === 0) {
			grunt.log.writeln('No HTML files to process.');
			done();
		}
	});

	/**
	 * 개발 서버 실행 태스크
	 * 1. dist 폴더 정리
	 * 2. Sass 컴파일
	 * 3. JavaScript 번들링
	 * 4. 프록시 서버 설정
	 * 5. 개발 서버 실행
	 * 6. 파일 변경 감지
	 */
	grunt.registerTask('server', [
		'clean',
		'sass',
		'concat',
		'browserify',
		'template',
		'setupProxies:server',
		'connect:server',
		'watch'
	]);

	/**
	 * 프로덕션 빌드 태스크
	 * 다음 순서로 실행:
	 * 1. dist 폴더 정리
	 * 2. SCSS 컴파일
	 * 3. PostCSS 처리
	 * 4. JavaScript 번들링
	 * 5. HTML 템플릿 처리
	 * 6. HTML 파일 처리
	 * 7. CSS 파일 병합
	 * 8. CSS 압축
	 * 9. JavaScript 압축
	 * 10. 이미지 최적화
	 * 11. 폰트 파일 복사
	 * 12. 최종 빌드 압축
	 */
	grunt.registerTask('build', [
		'clean',
		'sass',
		'postcss',
		'browserify',
		'template',
		'processhtml',
		'concat',
		'cssmin',
		'uglify',
		'imagemin',
		'copy',
		'compress'
	]);
};
