import gulp from 'gulp'
import path from 'path'

import browserSync from 'browser-sync'
import postcss from 'gulp-postcss'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'

// postcss processors
import autoprefixer from 'autoprefixer'
import nested from 'postcss-nested'
import extend from 'postcss-extend'
import color from 'postcss-color-function'
import simpleVars from 'postcss-simple-vars'
import cssImport from 'postcss-import'
import cssnano from 'cssnano'

const PROJECT_ROOT = './croquis/'
const TEMPLATE_DIR = path.join(PROJECT_ROOT, 'templates')
const SOURCE_DIR = path.join(PROJECT_ROOT, 'static/src')
const DEST_DIR = path.join(PROJECT_ROOT, 'static/build')
// -------------------------
// PostCSS
// -------------------------
gulp.task('css', () => {
  return gulp.src(path.join(SOURCE_DIR, 'css', 'style.css'))
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(postcss([
      cssImport,
      simpleVars,
      extend,
      nested,
      color,
      autoprefixer({browsers: ['last 2 versions', 'android 4.0']}),
      cssnano
    ]))
    .pipe(gulp.dest(path.join(DEST_DIR, 'css')))
    .pipe(browserSync.stream())
})
// -------------------------
// Browser Sync
// -------------------------
gulp.task('browser-sync', () => {
  browserSync.init({
    proxy: 'localhost:8000'
  })
})
// -------------------------
// Watch Task
// -------------------------
gulp.task('watch', ['css', 'browser-sync'], () => {
  gulp.watch(path.join(SOURCE_DIR, 'css/**/*.css'), ['css'])
  gulp.watch(path.join(TEMPLATE_DIR, '**/*.html')).on('change', browserSync.reload)
})

gulp.task('default', ['watch'])
