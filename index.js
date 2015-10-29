var promisify = require('node-promisify')
var spritesmith = promisify(require('spritesmith'))
var thr = require('through2')
var gutil = require('gulp-util')
var File = gutil.File
var mix = require('util-mix')
var path = require('path')

module.exports = function (opts) {
  opts = mix({
    getFileOption: getFileOption,
    getSpriteName: getSpriteName,
    getIconName: getIconName,
  }, opts)

  var groups = {}

  return thr.obj(function (file, _, next) {
    if (!file.path) {
      return next(null, file)
    }
    var name = opts.getSpriteName(file.path)
    groups[name] = groups[name] || []
    groups[name].push(file.path)
    next()
  }, function (cb) {
    var names = Object.keys(groups)
    if (names.length === 0) {
      return cb()
    }
    Promise.all(names.map(
      create.bind(this, groups, opts)
    )).then(function () {
      cb()
    }, function (err) {
      cb(createPluginError(err))
    })
  })
}

function create(groups, opts, name) {
  var stream = this
  var icons = groups[name]
  var smithOpts = opts.spritesmith
  if (typeof smithOpts === 'function') {
    smithOpts = smithOpts(name, groups[name])
  }
  return spritesmith(mix({ src: icons }, smithOpts))
    .then(function (result) {
      stream.push(new File(opts.getFileOption({
        type: '.png',
        name: name,
        icons: icons,
        contents: Buffer(result.image, 'binary'),
      })))

      var meta = mix({}, result.properties, {
        name: name,
        coordinates: Object.keys(result.coordinates).reduce(function (o, iconFile) {
          var iconName = opts.getIconName(iconFile)
          o[iconName] = result.coordinates[iconFile]
          return o
        }, {}),
      })

      stream.push(new File(opts.getFileOption({
        type: '.json',
        name: name,
        icons: icons,
        contents: Buffer(JSON.stringify(meta, null, 2)),
      })))
      //result.image // Binary string representation of image
      //result.coordinates // Object mapping filename to {x, y, width, height} of image
      //result.properties // Object with metadata about spritesheet {width, height}
    })
}

function getFileOption(opts) {
  var dir = path.dirname(opts.icons[0])
  return {
    path: path.join(dir, opts.name + opts.type),
    base: dir,
    contents: opts.contents,
  }
}

function getSpriteName(file) {
  return path.basename(
    path.dirname(file)
  )
}

function getIconName(iconFile) {
  return path.basename(iconFile)
}

function createPluginError(err) {
  return new gutil.PluginError('gulp-spritesmith-meta', err)
}

