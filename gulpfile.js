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

var js_config_json = require('./js_config.json');

var js_config = js_config_json;




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

// // Concatenate and minify js  and copy to assets folder for production
// gulp.task('jscript', function() {
//     //Normal
//     gulp.src([jsLocal.src + 'libs/**/*.js', jsLocal.src + 'global/*.js', jsLocal.src + 'modules/*.js', jsLocal.src + 'global.js', '!' + jsLocal.src + 'admin/**'])
//         .pipe($.concat('local.min.js'))
//         .pipe($.uglify())
//         .pipe($.stripDebug())
//         .pipe(gulp.dest(jsLocal.compiled));

//     gulp.start('singlejs');
// });

// // Concatenate js and copy to assets folder unminified for development
// gulp.task('jscriptdev', function() {
//     gulp.src([jsLocal.src + 'libs/**/*.js', jsLocal.src + 'global/*.js', jsLocal.src + 'modules/*.js', jsLocal.src + 'global.js', '!' + jsLocal.src + 'admin/**'])
//         .pipe($.sourcemaps.init())
//         .pipe($.filelog())
//         .pipe($.concat('local.min.js'))
//         .pipe($.sourcemaps.write())
//         .pipe(gulp.dest(jsLocal.compiled))
//         .pipe($.livereload());

//     gulp.start('singlejs');
// });

function globalScripts(env) {
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


// function contentTypes(env, cb) {

//     var isProd = (env === 'prod') ? true : false;
//     gulp.src(jsLocal.src + 'contentTypes/**/*.js', { base: 'pub' })
//         .pipe(gulpif(!isProd, $.sourcemaps.init()))
//         .pipe($.concat('contentTypes.js'))
//         .pipe(gulpif(!isProd, $.sourcemaps.write()))
//         .pipe(gulpif(isProd, $.uglify()))
//         .pipe(gulpif(isProd, $.stripDebug()))
//         .pipe(gulp.dest(jsLocal.compiled));


//         cb();
// }



function compileScript(src, env) {

    // console.log('js_config');
    // console.log(js_config); 

    var deps = [];
    deps = js_config[src].deps;
    var isProd = (env === 'prod') ? true : false;

    if (changed === false) {
        for (var i = 0; i < deps.length; i++) {
            if (deps[i] != 'contentTypes') {
                deps[i] = jsLocal.src + deps[i] + '.js';
            } else {
                deps[i] = jsLocal.src + 'contentTypes/**/*.js';
                console.log(deps[i]);
            }
        }
    }

    console.log('DEPS');
    console.log(deps);

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


var changed = false;

var env;

gulp.task('scriptCompiler', ['contentTypes'], function() {

    console.log('scriptCompiler task');
    // console.log(js_config);
    env = 'dev';
    globalScripts(env);

    for (var src in js_config) {
        compileScript(src, env);
    }
    changed = true;

});


gulp.task('scriptCompilerProd', ['contentTypesProd'], function() {
    env = 'prod';
    globalScripts(env);
    changed = false;
    for (var src in js_config) {
        compileScript(src, env);
    }

});



gulp.task('contentTypes', function() {
    console.log('contentTypes task');
    env = 'dev';
    var isProd = (env === 'prod') ? true : false;
    gulp.src(jsLocal.src + 'contentTypes/**/*.js', { base: 'pub' })
        .pipe(gulpif(!isProd, $.sourcemaps.init()))
        .pipe($.concat('contentTypes.js'))
        .pipe(gulpif(!isProd, $.sourcemaps.write()))
        .pipe(gulpif(isProd, $.uglify()))
        .pipe(gulpif(isProd, $.stripDebug()))
        .pipe($.filelog())
        .pipe(gulp.dest(jsLocal.compiled));

})



gulp.task('contentTypesProd', function() {
    console.log('contentTypes task');
    env = 'prod';

    var isProd = (env === 'prod') ? true : false;
    gulp.src(jsLocal.src + 'contentTypes/**/*.js', { base: 'pub' })
        .pipe($.concat('contentTypes.js'))
        .pipe($.uglify())
        .pipe($.stripDebug())
        .pipe($.filelog())
        .pipe(gulp.dest(jsLocal.compiled));

})





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
        console.log('changed');
        console.log('File ' + event.path + ' was ' + event.type);
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
    return gulp.start('modernizr', 'foundation', 'sassdev', 'scriptCompiler', 'image', 'fonts', 'watch');
});

// Task to build assets for production
gulp.task('production', function() {
    return gulp.start('modernizr', 'foundation', 'sass', 'scriptCompilerProd', 'image', 'fonts');
});
