'use strict';

var gulp = require('gulp');
var del = require('del');
var path = require('path');

var rename = require('gulp-rename');

var htmlmin = require('gulp-htmlmin');
var htmlreplace = require('gulp-html-replace');

var nunjucks = require('gulp-nunjucks-html');
var nunjucksConfig = require('./nunjucks.config.js');
var data = require('gulp-data');

var sass = require('gulp-sass')(require('sass'));
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

var svgstore = require('gulp-svgstore');
var svgo = require('gulp-svgo');

var uglify = require('gulp-uglify');

var fs = require('fs');
var server = require('browser-sync').create();

var paths = {
  build: './build',
  data: './data',

  src: './src',
  views: './src/views',
  styles: './src/scss',
  js: './src/js'
};

gulp.task('styles', function () {
  var processors = [
    autoprefixer()
  ];

  return gulp.src([
      paths.styles + '/style.scss'
    ])
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest(paths.build + '/css/'))
    .pipe(postcss([
      cssnano()
    ]))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.build + '/css/'))
    .pipe(server.stream());
});

gulp.task('render-view', function () {
  let v = + new Date();

  return gulp.src([
      paths.views + '/*.jinja',
    ])
    .pipe(nunjucks(nunjucksConfig))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(htmlreplace({
      'js': 'js/scripts.min.js?v=' + v,
      'css': 'css/style.min.css?v=' + v
    }))
    .pipe(htmlmin({
      collapseWhitespace: false,
      // collapseWhitespace: true,
      // conservativeCollapse: true,
      removeComments: true
    }))
    .pipe(gulp.dest(paths.build))
    .pipe(server.stream());
});

gulp.task('clean', function () {
  return del(paths.build);
});

gulp.task('copy', function() {
  return gulp.src([
      paths.src + '/fonts/**/*',
      paths.src + '/img/**/*'
    ], {
      base: paths.src
    })
    .pipe(gulp.dest(paths.build));
});

gulp.task('copy-js', function() {
  return gulp.src([
      paths.js + '/**/*'
    ], {
      base: paths.js
    })
    .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('svg-store', function () {
  return gulp.src(paths.src + '/img/svg/*.svg')
    .pipe(svgo({
      plugins: [{
        removeDoctype: true
      }, {
        removeComments: true
      }, {
        cleanupNumericValues: {
          floatPrecision: 2
        }
      }, {
        removeViewBox: false
      }]
    }))
    .pipe(svgstore())
    .pipe(gulp.dest(paths.src + '/img/'));
});

gulp.task('build-dev', gulp.series('clean', gulp.parallel('styles', 'render-view'), 'copy', 'copy-js'));

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'render-view'), 'copy', 'copy-js'));

gulp.task('server', function () {
  server.init({
    server: paths.build,
    notify: false,
    open: true,
    ui: false
  })

  gulp.watch(paths.styles + '/**/**/**/*.scss', gulp.series('styles'));
  gulp.watch(paths.views + '/**/**/*.jinja', gulp.series('render-view'));
  gulp.watch(paths.src + '/img/**/*', gulp.series('copy'));
  gulp.watch(paths.src + '/fonts/**/*', gulp.series('copy'));

  gulp.watch(paths.js + '/**/*', gulp.series('copy-js'));

  gulp.watch(paths.src + '/img/svg/*', gulp.series('svg-store', 'copy'));
});

gulp.task('default', gulp.series('build-dev', 'server'));

gulp.task('prod', gulp.series('build'));
gulp.task('serve', gulp.series('default'));
