var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var htmlmin = require('gulp-htmlmin');
var htmlreplace = require('gulp-html-replace');

var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  ''
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function () {

  // Bootstrap
  gulp.src([
    './node_modules/bootstrap/dist/**/*',
    '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
    '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
  ])
    .pipe(gulp.dest('./vendor/bootstrap'))

  // Font Awesome
  gulp.src([
    './node_modules/font-awesome/**/*',
    '!./node_modules/font-awesome/{less,less/*}',
    '!./node_modules/font-awesome/{scss,scss/*}',
    '!./node_modules/font-awesome/.*',
    '!./node_modules/font-awesome/*.{txt,json,md}'
  ])
    .pipe(gulp.dest('./vendor/font-awesome'))

  // jQuery
  gulp.src([
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js'
  ])
    .pipe(gulp.dest('./vendor/jquery'))

  // jQuery Easing
  gulp.src([
    './node_modules/jquery.easing/*.js'
  ])
    .pipe(gulp.dest('./vendor/jquery-easing'))

  // Magnific Popup
  gulp.src([
    './node_modules/magnific-popup/dist/*'
  ])
    .pipe(gulp.dest('./vendor/magnific-popup'))

  // Scrollreveal
  gulp.src([
    './node_modules/scrollreveal/dist/*.js'
  ])
    .pipe(gulp.dest('./vendor/scrollreveal'))

});

// Compile SCSS
gulp.task('css:compile', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function () {
  return gulp.src([
    './css/*.css',
    '!./css/*.min.css'
  ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify']);

// Minify JavaScript
gulp.task('js:minify', function () {
  return gulp.src([
    './js/*.js',
    '!./js/*.min.js'
  ])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
});

// JS
gulp.task('js', ['js:minify']);

// Default task
gulp.task('default', ['css', 'js', 'vendor']);

// Configure the browserSync task
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});


const DEPLOY_DIR = "./deploy"

gulp.task('build', ['css', 'js', 'vendor'], function () {

  // gulp.src([
  //   "./**/*.min.css",
  //   "!./node_modules/**/*.min.css",
  // ]).
  // pipe(gulp.dest(DEPLOY_DIR));

  // gulp.src([
  //   "./vendor/**/*.min.js",
  //   "./js/**/*.min.js"
  // ]).
  //   pipe(concat('bundle.js')).
  //   pipe(gulp.dest(DEPLOY_DIR));

  // gulp.src('./index.html')
  //   .pipe(htmlreplace({
  //     'js': 'bundle.js'
  //   })).
  //   pipe(htmlmin({ collapseWhitespace: true })).
  //   pipe(gulp.dest(DEPLOY_DIR));

  gulp.src([
    "./**/*.min.js",
    "./**/*.min.css",
    "!./node_modules/**/*.min.js",
    "!./node_modules/**/*.min.css",
  ]).
  pipe(gulp.dest(DEPLOY_DIR));

  gulp.src("./img/**/*")
    .pipe(gulp.dest(DEPLOY_DIR + "/img"));

  gulp.src("./vendor/font-awesome/fonts/*")
    .pipe(gulp.dest(DEPLOY_DIR + "/vendor/font-awesome/fonts"));

  gulp.src("./index.html").
  pipe(htmlmin({ collapseWhitespace: true })).
  pipe(gulp.dest(DEPLOY_DIR))



})

// Dev task
gulp.task('dev', ['css', 'js', 'browserSync'], function () {
  gulp.watch('./scss/*.scss', ['css']);
  gulp.watch('./js/*.js', ['js']);
  gulp.watch('./*.html', browserSync.reload);
});
