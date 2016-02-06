var del = require('del')
var exec = require('child_process').exec

var gulp = require('gulp')
var htmlmin = require('gulp-htmlmin')
var livereload = require('gulp-livereload')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var webpack = require('webpack-stream')

var paths = {
  src:{
    imba: 'src/imba/**/*.imba',
    js: 'src/js/**/*.js',
    // solContracts: 'src/sold/**/*.sold',
    // solTests: 'src/sold/**/*.sold',
    index: 'src/index.html'
  },
  tmp:{
    lib: 'tmp/lib/',
    imba:  'tmp/imba/',
    dapple: 'tmp/dapple/'
  },
  dist: {
    js: 'dist/js/',
    index: 'dist/'
  }
}

gulp.task('copy-index', function () {
  gulp.src(paths.src.index)
  .pipe(gulp.dest(paths.dist.index))
})

gulp.task('copy-js', function (){
  gulp.src(paths.src.js)
  .pipe(gulp.dest(paths.tmp.lib))
})

gulp.task('build-imba', function (cb) {
  exec('imba compile src/imba/ -o ' + paths.tmp.imba , function(err,res){
    if(err){ console.log(err) }
    cb()
  })
})

// TODO imeplement dapple ... ?
gulp.task('build-dapple', function (cb) {
  exec('dapple build', function(err,res){
    if(err){ console.log(err) }
    // not working
    gulp.src(paths.tmp.dapple+'js_module.js')
    .pipe(webpack())
    gulp.dest(paths.tmp.dapple)
    .on('end', function(){
      cb()
    })
  })
})


gulp.task('build-js', [/*'build-dapple',*/'build-imba', 'copy-js'], function(cb){
  // TODO cache stuff...
  var pipe = gulp.src([
    paths.tmp.lib+'**/*.js',
    paths.tmp.dapple+'**/*.js',
    paths.tmp.imba+'**/*.js'
  ])
  .pipe(concat('app.js'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.dist.js))
  .pipe(livereload())
  .on('end', function(){
    del.sync(['tmp/'])
    cb()
  })
})

gulp.task('clean', function () {
  del.sync(['dist/*'])
})

gulp.task('default', ['clean', 'build-js', 'copy-index'])


gulp.task('watch', ['default'], function() {
  livereload.listen()
  // gulp.watch(paths.src.dapple, ['build-dapple'])
  gulp.watch(paths.src.imba, ['build-imba'])
  gulp.watch(paths.src.js, ['copy-js'])
  gulp.watch(paths.src.index, ['copy-index'])
})