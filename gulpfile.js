var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass')(require('sass'));
var clean = require('gulp-clean');
var processhtml = require('gulp-processhtml');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var proxy = require('http-proxy-middleware');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

require('dotenv').config({ path: '.env.' + process.env.NODE_ENV });

// Clean
gulp.task('clean', function () {
	return gulp.src('dist', { read: false, allowEmpty: true }).pipe(clean());
});

// Process HTML
gulp.task('processhtml', function () {
	return gulp.src('index.html').pipe(processhtml()).pipe(gulp.dest('dist'));
});

// Sass
gulp.task('sass', function () {
	return gulp
		.src(['common/styles/application.scss', 'src/**/*.scss'])
		.pipe(
			sass({
				sourceMap: true,
				outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded',
				includePaths: ['node_modules']
			}).on('error', sass.logError)
		)
		.pipe(gulp.dest('src/styles'))
		.pipe(
			browserSync.stream({
				match: '**/*.css'
			})
		);
});

// Development Bundle
gulp.task('bundle:dev', function () {
	return browserify({
		entries: 'src/main.js',
		debug: true
	})
		.transform('sassify', {
			'auto-inject': true,
			base64Encode: false,
			sourceMap: true
		})
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(gulp.dest('dist/assets'))
		.pipe(browserSync.stream());
});

// Concat
gulp.task('concat', function () {
	return gulp.parallel(
		function js() {
			return gulp
				.src(['dist/index.js', 'common/js/**/*.js', 'src/**/*.js'])
				.pipe(concat('index.js'))
				.pipe(gulp.dest('dist/assets'));
		},
		function css() {
			return gulp
				.src(['dist/assets/style.css', 'src/**/*.css'])
				.pipe(concat('style.css'))
				.pipe(gulp.dest('dist/assets'));
		}
	);
});

// Minify CSS
gulp.task('cssmin', function () {
	return gulp.src('dist/assets/style.css').pipe(cssmin()).pipe(gulp.dest('dist/assets/style.min.css'));
});

// Optimize Images
gulp.task('imagemin', function () {
	return gulp.src('common/images/**/*.{png,jpg,gif}').pipe(imagemin()).pipe(gulp.dest('dist/assets/images'));
});

// Uglify JS
gulp.task('uglify', function () {
	return gulp.src('dist/assets/index.js').pipe(uglify()).pipe(gulp.dest('dist/assets/index.min.js'));
});

// Copy Files
gulp.task('copy', function () {
	return gulp.parallel(
		function fonts() {
			return gulp.src('common/fonts/**').pipe(gulp.dest('dist/assets/fonts'));
		},
		function templates() {
			return gulp.src('common/template/**').pipe(gulp.dest('dist/assets/template'));
		}
	);
});

// Compress
gulp.task('compress', function () {
	return gulp.src('dist/**').pipe(tar('dist.tar.gz')).pipe(gzip()).pipe(gulp.dest('.'));
});

// Development Server
gulp.task('server', function () {
	browserSync.init({
		server: {
			baseDir: './',
			index: 'index.html',
			middleware: [
				'/api',
				'/auth-user',
				'/auth-admin',
				'/auth-check',
				'/auth-sche',
				'/sso',
				'/dwr',
				'/logout',
				'/oauth2',
				'/login',
				'/auth-editor',
				'/engine-search-api',
				'/engine-snow'
			].map(function (context) {
				return proxy.createProxyMiddleware(context, {
					target: process.env.API_URL + ':13131',
					changeOrigin: true
				});
			})
		},
		port: 80,
		open: true
	});

	gulp.watch('src/**/*.{js,scss}', gulp.series('bundle:dev'));
	gulp.watch('*.html').on('change', browserSync.reload);
});

// Production Build
gulp.task('build:prod', function () {
	return gulp.series(
		'clean',
		'processhtml',
		'sass',
		gulp.parallel('concat', 'imagemin'),
		gulp.parallel('cssmin', 'uglify'),
		'copy',
		'compress'
	)();
});

// Development Build
gulp.task('build:dev', function () {
	return gulp.series('clean', 'processhtml', 'bundle:dev', 'copy')();
});

// Default Task (Development)
gulp.task('default', function () {
	if (process.env.NODE_ENV === 'production') {
		return gulp.series('build:prod')();
	}
	return gulp.series('build:dev', 'server')();
});
