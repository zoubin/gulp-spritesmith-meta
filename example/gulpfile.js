var gulp = require('gulp')
var del = require('del')
var smith = require('..')

var path = require('path')
var fixtures = path.resolve.bind(path, __dirname)

gulp.task('clean', function () {
  return del(fixtures('build'))
})

gulp.task('spritesmith', ['clean'], function () {
  var opts = {
    spritesmith: function (name) {
      if (name === 'two') {
        return { padding: 4 }
      }
      return { algorithm: 'alt-diagonal' }
    },
  }
  return gulp.src(['**/*.png', '**/*.jpg'], { cwd: fixtures('src'), read: false })
    .pipe(smith(opts))
    .pipe(gulp.dest('build'))
})

gulp.task('default', ['clean'], function () {
  return gulp.src(['**/*.png', '**/*.jpg'], { cwd: fixtures('src'), read: false })
    .pipe(smith())
    .pipe(gulp.dest('build'))
})

gulp.task('getSpriteName', ['clean'], function () {
  var opts = {
    getSpriteName: function (file) {
      return 'sp-' + path.basename(path.dirname(file))
    },
  }
  return gulp.src(['**/*.png', '**/*.jpg'], { cwd: fixtures('src'), read: false })
    .pipe(smith(opts))
    .pipe(gulp.dest('build'))
})

gulp.task('getFileOption', ['clean'], function () {
  var opts = {
    getFileOption: function (opts) {
      var dir = path.dirname(opts.icons[0])
      return {
        path: path.join(dir, 'sp', opts.name + opts.type),
        base: dir,
        contents: opts.contents,
      }
    },
  }
  return gulp.src(['**/*.png', '**/*.jpg'], { cwd: fixtures('src'), read: false })
    .pipe(smith(opts))
    .pipe(gulp.dest('build'))
})

gulp.task('getIconName', ['clean'], function () {
  var opts = {
    getIconName: function (iconFile) {
      return path.basename(iconFile).toUpperCase()
    },
  }
  return gulp.src(['**/*.png', '**/*.jpg'], { cwd: fixtures('src'), read: false })
    .pipe(smith(opts))
    .pipe(gulp.dest('build'))
})

