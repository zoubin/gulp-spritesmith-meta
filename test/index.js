var test = require('tape')
var path = require('path')
var fs = require('fs')
var smith = require('..')
var gulp = require('gulp')
var del = require('del')
var promisify = require('node-promisify')
var run = promisify(require('callback-sequence').run)

var fixtures = path.resolve.bind(path, __dirname, 'fixtures')

test('spritemith', function(t) {
  return run([
    clean,
    task({
      spritesmith: function (name) {
        if (name === 'two') {
          return { padding: 4 }
        }
        return { algorithm: 'alt-diagonal' }
      },
    }),
    compare.bind(null, 'spritesmith', '', null, t),
  ])
})

test('getFileOption', function(t) {
  return run([
    clean,
    task({
      getFileOption: function (opts) {
        var dir = path.dirname(opts.icons[0])
        return {
          path: path.join(dir, 'sp', opts.name + opts.type),
          base: path.join(dir),
          contents: opts.contents,
        }
      },
    }),
    compare.bind(null, 'getFileOption/sp', 'sp', null, t),
  ])
})

test('getIconName', function(t) {
  return run([
    clean,
    task({
      getIconName: function (iconFile) {
        return path.basename(iconFile).toUpperCase()
      },
    }),
    compare.bind(null, 'getIconName', '', null, t),
  ])
})

test('getSpriteName', function(t) {
  return run([
    clean,
    task({
      getSpriteName: function (file) {
        return 'sp-' + path.basename(path.dirname(file))
      },
    }),
    compare.bind(null, 'getSpriteName', '', [
      'sp-one.png', 'sp-one.json', 'sp-two.png', 'sp-two.json',
    ], t),
  ])
})

function compare(expectedDir, buildDir, files, t) {
  files = files || ['one.png', 'one.json', 'two.png', 'two.json']
  files.forEach(function (file) {
    var expectedFile = fixtures('expected', expectedDir, file)
    var buildFile = fixtures('build', buildDir, file)
    t.equal(fs.readFileSync(buildFile, 'utf8'), fs.readFileSync(expectedFile, 'utf8'))
  })
}

function clean() {
  return del(fixtures('build'))
}

function task(opts) {
  return function () {
    return gulp.src(['**/*.png', '**/*.jpg'], { cwd: fixtures('src'), read: false })
      .pipe(smith(opts))
      .pipe(gulp.dest(fixtures('build')))
  }
}
