'use strict';

// Dependencies
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// Local environment
var jsLocal = {
    'src': 'pub/src/js/**/',
    'compiled': 'pub/dist/js/min/',
};

var cssLocal = {
    'src': 'pub/src/sass/',
    'compiled': 'pub/dist/css/'
};

var imgLocal = {
    'src': 'pub/src/images/**/',
    'compiled': 'pub/dist/images/'
};

var fontsLocal = {
    'src': 'pub/src/fonts/**/',
    'compiled': 'pub/dist/css/fonts/'
};

// Tasks
function swallowError(error) {

    // If you want details of the error in the console
    console.log(error.toString())

    this.emit('end')
}

// Run this to move js files that should be enqueued seperately (not concatenate)
gulp.task('singlejs', function() {
    gulp.src([jsLocal.src + 'singleEnqueue/**/*.js'])
        .pipe($.uglify())
        .pipe(gulp.dest(jsLocal.compiled));
});

// Concatenate and minify js  and copy to dist folder for production
gulp.task('jscript', function() {
    //Normal
    gulp.src([jsLocal.src + 'libs/**/*.js', jsLocal.src + 'global/*.js', jsLocal.src + 'modules/*.js', jsLocal.src + 'global.js', '!' + jsLocal.src + 'admin/**'])
        .pipe($.concat('local.min.js'))
        .pipe($.uglify())
        .pipe($.stripDebug())
        .pipe(gulp.dest(jsLocal.compiled));

    gulp.start('singlejs'); 
});

// Concatenate js and copy to dist folder unminified for development
gulp.task('jscriptdev', function() {
    gulp.src([jsLocal.src + 'libs/**/*.js', jsLocal.src + 'global/*.js', jsLocal.src + 'modules/*.js', jsLocal.src + 'global.js', '!' + jsLocal.src + 'admin/**'])
        .pipe($.sourcemaps.init())
        .pipe($.filelog())
        .pipe($.concat('local.min.js'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(jsLocal.compiled))
        .pipe($.livereload());

    gulp.start('singlejs');
});

// Compile and minify sass and copy to dist folder for production
gulp.task('sass', function() {
    //Normal
    gulp.src([cssLocal.src + 'templates/*.scss', cssLocal.src + 'main.scss'])
        .pipe($.compass({
            css: 'pub/dist/css',
            sass: 'pub/src/sass'
        }))
        .pipe($.cssmin())
        .pipe($.autoprefixer())
        .pipe(gulp.dest(cssLocal.compiled))
        .on('error', swallowError)
        .pipe($.livereload());
});

// Compile sass and copy to dist folder unminified for development
gulp.task('sassdev', function() {
    //Normal
    gulp.src([cssLocal.src + 'templates/*.scss', cssLocal.src + 'main.scss'])
        .pipe($.compass({
            css: 'pub/dist/css',
            sass: 'pub/src/sass',
            sourcemap: true
        }))
        .pipe(gulp.dest(cssLocal.compiled))
        .on('error', swallowError)
        .pipe($.livereload());
});

// Copy Foundation CSS and JS to dist folder
gulp.task('foundation', function() {
    gulp.src('pub/src/css/foundation/*.css')
        .pipe($.cssmin())
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(cssLocal.compiled));

    gulp.src('pub/src/js/libs/foundation/**')
        .pipe($.concat('foundation.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(jsLocal.compiled));
});

// Copy Foundation CSS and JS to dist folder
gulp.task('modernizr', function() {
    gulp.src('pub/src/js/libs/modernizr/*.js')
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(jsLocal.compiled));
});

// Copy images to dist folder
gulp.task('image', function() {
    gulp.src('pub/src/images/**')
        .pipe(gulp.dest('pub/dist/images'));
});

// Copy fonts to dist folder
gulp.task('fonts', function() {
    gulp.src('pub/src/fonts/**')
        .pipe(gulp.dest('pub/dist/fonts'));
});

// Watch for sass and js changes
gulp.task('watch', function() {
    $.livereload.listen();
    gulp.watch(jsLocal.src + '*.js', ['jscriptdev']);
    gulp.watch(cssLocal.src + '**/*.scss', ['sassdev'])
        .on('error', swallowError);;
});

// Remove dist folder prior to build
gulp.task('clean', function () {
    return gulp.src('pub/dist/', {read: false})
    .pipe($.clean());
});

// Task to build dist for development
gulp.task('dev', function() {
    return gulp.start('modernizr', 'foundation', 'sassdev', 'jscriptdev', 'image', 'fonts', 'watch');
});

// Task to build dist for production
gulp.task('production', ['clean'], function() {
    return gulp.start('modernizr', 'foundation', 'sass', 'jscript',  'image', 'fonts');
});