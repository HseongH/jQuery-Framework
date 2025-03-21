// Core
var gulp = require('gulp');

// Server
var browserSync = require('browser-sync').create();
var proxy = require('http-proxy-middleware');

// Clean
var clean = require('gulp-clean');

// Styles
var sass = require('gulp-sass')(require('sass'));
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

// Templates
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');

// Scripts
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

// Assets
var imagemin = require('gulp-imagemin');

// Archive
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');

require('dotenv').config({ path: '.env.' + process.env.NODE_ENV });

/**
 * Development server task
 * @description 개발 서버를 실행하고 파일 변경을 감지합니다.
 */
gulp.task('serve', function () {
	browserSync.init({
		server: {
			baseDir: './',
			middleware: ['/auth-user', '/auth-admin'].map(function (context) {
				return proxy.createProxyMiddleware(context, {
					target: process.env.PROXY_URL + ':13131',
					changeOrigin: true
				});
			})
		},
		port: 80,
		open: true
	});

	gulp.watch('src/**/*.scss', gulp.series('sass'));
});

/**
 * Clean task
 * @description 빌드 결과물을 제거합니다.
 */
gulp.task('clean', function () {
	return gulp.src('dist', { read: false, allowEmpty: true }).pipe(clean());
});

/**
 * Sass task
 * @description SCSS 파일을 처리합니다.
 */
gulp.task('sass', function () {
	var plugins = process.env.NODE_ENV === 'production' ? [autoprefixer(), cssnano()] : [autoprefixer()];
	var dest = process.env.NODE_ENV === 'production' ? 'dist/assets' : 'src/styles';

	return gulp
		.src('src/styles/style.scss')
		.pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(postcss(plugins))
		.pipe(gulp.dest(dest))
		.pipe(process.env.NODE_ENV === 'production' ? gulp.noop() : browserSync.stream());
});

/**
 * EJS task
 * @description 프로덕션 환경에서 EJS 템플릿을 HTML로 변환합니다.
 */
gulp.task('ejs', function () {
	return gulp
		.src(['src/pages/**/*.ejs', '!src/partials/**/*.ejs'])
		.pipe(
			ejs({
				env: process.env.NODE_ENV
			})
		)
		.pipe(rename({ extname: '.html' }))
		.pipe(gulp.dest('dist'));
});

/**
 * Bundle task
 * @description 프로덕션 환경에서 JavaScript 파일을 번들링하고 압축합니다.
 */
gulp.task('bundle', function () {
	return browserify({
		entries: 'src/index.js',
		debug: false
	})
		.bundle()
		.pipe(source('index.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets'));
});

/**
 * Assets task
 * @description 정적 파일을 처리합니다.
 */
gulp.task('assets', function () {
	return gulp.parallel(
		function images() {
			return gulp.src('src/assets/images/**/*').pipe(imagemin()).pipe(gulp.dest('dist/assets/images'));
		},
		function fonts() {
			return gulp.src('src/assets/fonts/**/*').pipe(gulp.dest('dist/assets/fonts'));
		}
	)();
});

/**
 * Compress task
 * @description 빌드 결과물을 압축합니다.
 */
gulp.task('compress', function () {
	return gulp.src('dist/**').pipe(tar('dist.tar')).pipe(gzip()).pipe(gulp.dest('.'));
});

/**
 * Build task
 * @description 프로덕션 빌드를 수행합니다.
 */
gulp.task('build', gulp.series('clean', gulp.parallel('ejs', 'sass', 'bundle'), 'assets', 'compress'));

/**
 * Default task
 * @description 환경에 따라 개발 서버 실행 또는 프로덕션 빌드를 수행합니다.
 */
gulp.task('default', function () {
	if (process.env.NODE_ENV === 'production') {
		return gulp.series('build')();
	}
	return gulp.series('sass', 'serve')();
});
