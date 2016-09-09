'use strict';

// Dependencies
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var gulpif = require('gulp-if');

// Local environment
var jsLocal = {
    'src': 'pub/src/js/**/',
    'compiled': 'pub/assets/js/min/',
};

var cssLocal = {
    'src': 'pub/src/sass/',
    'compiled': 'pub/assets/css/'
};

var imgLocal = {
    'src': 'pub/src/images/**/',
    'compiled': 'pub/assets/images/'
};

var fontsLocal = {
    'src': 'pub/src/fonts/**/',
    'compiled': 'pub/assets/css/fonts/'
};

var js_config = require('./js_config.json');

// default watch var
var changed = false;

// global environment var
var env;


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

// Bundle all scripts in the global folder
function globalScripts() {
    var isProd = (env === 'prod') ? true : false;
    gulp.src([jsLocal.src + 'global/*.js', jsLocal.src + 'global.js'], { base: 'pub' })
        .pipe($.sourcemaps.init())
        .pipe($.filelog())
        .pipe($.concat('local.min.js'))
        .pipe(gulpif(isProd, $.uglify()))
        .pipe(gulpif(isProd, $.stripDebug()))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(jsLocal.compiled));
}


// loop through dependencies from js_config and append jsLocal.src path and .js
// run gulp tasks on newly created deps[] array
function compileScript(src) {
    var deps = [];
    deps = js_config[src].deps;

    // global environment variable env defined in dev/production tasks
    var isProd = (env === 'prod') ? true : false;

    // if function fired by watch task do not append jsLocal.src again
    if (changed === false) {
        for (var i = 0; i < deps.length; i++) {
            deps[i] = jsLocal.src + deps[i] + '.js';
        }
    }
    console.log('DEPS');
    console.log(deps);
    // deps array of newly created path strings
    // conditional gulpif statements depending on env variable
    gulp.src(deps, { base: 'pub' })
        .pipe(gulpif(!isProd, $.sourcemaps.init()))
        .pipe($.concat(src + '.js'))
        .pipe(gulpif(!isProd, $.sourcemaps.write()))
        .pipe(gulpif(isProd, $.uglify()))
        .pipe(gulpif(isProd, $.stripDebug()))
        .pipe(gulp.dest(jsLocal.compiled))
        .pipe($.filelog())
        .pipe($.livereload())
};

// Run globalScripts() to bundle global scripts
// Loop through js_config and run the compileScript() function
gulp.task('scriptCompiler', function() {
    globalScripts();
    for (var src in js_config) {
        compileScript(src);
    }
    // reset changed variable for watch task - fixes globbing error
    changed = true;
});


// Compile and minify sass and copy to assets folder for production
gulp.task('sass', function() {
    //Normal
    gulp.src([cssLocal.src + 'templates/*.scss', cssLocal.src + 'main.scss'])
        .pipe($.compass({
            css: 'pub/assets/css',
            sass: 'pub/src/sass'
        }))
        .pipe($.cssmin())
        .pipe($.autoprefixer())
        .pipe(gulp.dest(cssLocal.compiled))
        .on('error', swallowError)
        .pipe($.livereload());
});

// Compile sass and copy to assets folder unminified for development
gulp.task('sassdev', function() {
    //Normal
    gulp.src([cssLocal.src + 'templates/*.scss', cssLocal.src + 'main.scss'])
        .pipe($.compass({
            css: 'pub/assets/css',
            sass: 'pub/src/sass',
            sourcemap: true
        }))
        .pipe(gulp.dest(cssLocal.compiled))
        .on('error', swallowError)
        .pipe($.livereload());
});

// Copy Foundation CSS and JS to assets folder
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

// Copy Foundation CSS and JS to assets folder
gulp.task('modernizr', function() {
    gulp.src('pub/src/js/libs/modernizr/*.js')
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(jsLocal.compiled));
});

// Copy images to assets folder
gulp.task('image', function() {
    gulp.src('pub/src/images/**')
        .pipe(gulp.dest('pub/assets/images'));
});

// Copy fonts to assets folder
gulp.task('fonts', function() {
    gulp.src('pub/src/fonts/**')
        .pipe(gulp.dest('pub/assets/fonts'));
});

// Watch for sass and js changes
gulp.task('watch', function() {
    $.livereload.listen();
    gulp.watch(jsLocal.src + '*.js').on('change', function(event) {
        changed = true;
        gulp.start('scriptCompiler');
    });
    gulp.watch(cssLocal.src + '**/*.scss', ['sassdev'])
        .on('error', swallowError);;
});

// Remove assets folder prior to build
gulp.task('clean', function() {
    return gulp.src('pub/assets/', { read: false })
        .pipe($.clean());
});


// Task to build assets for development
gulp.task('dev', function() {
    env = 'dev';
    return gulp.start('modernizr', 'foundation', 'sassdev', 'scriptCompiler', 'image', 'fonts', 'watch');
});

// Task to build assets for production
gulp.task('production', ['clean'], function() {
    env = 'prod';
    return gulp.start('modernizr', 'foundation', 'sass', 'scriptCompiler', 'image', 'fonts');
});
