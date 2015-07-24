var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var bower = require('main-bower-files');

////////////////////
// build
////////////////////
gulp.task('build', ['compile-sass', 'bootlint', 'jshint']);

////////////////////
// default
////////////////////
gulp.task('default', $.taskListing.withFilters(null, 'default'));

////////////////////
// preen bower_components
////////////////////
gulp.task('bower', function() {
  return gulp.src(bower(), {base: __dirname + '/bower_components'})
      .pipe(gulp.dest(__dirname + '/www/lib/'));
});

////////////////////
// compile-sass
////////////////////
gulp.task('compile-sass', function() {
  return gulp.src(__dirname + '/scss/**/*.scss')
    .pipe(plumber())
    .pipe($.sass())
    .pipe($.autoprefixer('> 1%', 'last 2 version', 'ff 12', 'ie 8', 'opera 12', 'chrome 12', 'safari 12', 'android 2'))
    .pipe(gulp.dest(__dirname + '/www/css/'))
    .pipe(browserSync.reload({stream:true}));
});

////////////////////
// bootlint
////////////////////
gulp.task('bootlint', function() {
    return gulp.src('/www/index.html')
        .pipe($.bootlint());
});

////////////////////
// jshint
////////////////////
gulp.task('jshint', function() {
  return gulp.src([__dirname + '/www/*.js', __dirname + '/www/js/**/*.js'])
    .pipe(plumber())
    .pipe($.cached('jshint'))
    .pipe($.jshint())
    .pipe(jshintNotify())
    .pipe($.jshint.reporter('jshint-stylish'));
});

////////////////////
// serve
////////////////////
gulp.task('serve', ['build', 'browser-sync'], function() {
  gulp.watch(
    [__dirname + '/scss/**/*.scss'],
    {debounceDelay: 1000},
    ['compile-sass']
  );

  gulp.watch(
    [__dirname + '/www/index.html'],
    {debounceDelay: 1000},
    ['bootlint']
  );

  gulp.watch(
    [__dirname + '/www/*.js', __dirname + '/www/js/**/*.js'],
    {debounceDelay: 1000},
    ['jshint']
  );
});

////////////////////
// browser-sync
////////////////////
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: __dirname + '/www/',
      directory: true
    },
    ghostMode: false,
    notify: false,
    debounce: 1000,
    port: 8901,
    startPath: 'index.html'
  });

  gulp.watch([
    __dirname + '/www/**/*.{js,html,svg,png,gif,jpg,jpeg}'
  ], {
    debounceDelay: 1000
  }, function() {
    browserSync.reload();
  });
});


// utils
function plumber() {
  return $.plumber({errorHandler: $.notify.onError()});
}

function jshintNotify() {
  return $.notify(function(file) {
    if (file.jshint.success) {
      return false;
    }

    var errors = file.jshint.results.map(function (data) {
      return data.error ? '(' + data.error.line + ':' + data.error.character + ') ' + data.error.reason : '';
    }).join('\n');

    return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
  });
}

