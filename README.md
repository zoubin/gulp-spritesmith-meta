# gulp-spritesmith-meta
gulp plugin for creating sprites and their meta files using [spritesmith](https://github.com/Ensighten/spritesmith)

[![npm](https://nodei.co/npm/gulp-spritesmith-meta.png?downloads=true)](https://www.npmjs.org/package/gulp-spritesmith-meta)

[![version](https://img.shields.io/npm/v/gulp-spritesmith-meta.svg)](https://www.npmjs.org/package/gulp-spritesmith-meta)
[![status](https://travis-ci.org/zoubin/gulp-spritesmith-meta.svg?branch=master)](https://travis-ci.org/zoubin/gulp-spritesmith-meta)
[![dependencies](https://david-dm.org/zoubin/gulp-spritesmith-meta.svg)](https://david-dm.org/zoubin/gulp-spritesmith-meta)
[![devDependencies](https://david-dm.org/zoubin/gulp-spritesmith-meta/dev-status.svg)](https://david-dm.org/zoubin/gulp-spritesmith-meta#info=devDependencies)

It creates a sprite and a JSON file, which includes coordinates of the icons.

## Example

See [examples](https://github.com/zoubin/gulp-spritesmith-meta/tree/master/example)

input:

```
⌘ tree src/
src/
├── one
│   ├── sprite1.png
│   ├── sprite2.jpg
│   └── sprite3.png
└── two
    ├── sprite1.png
    ├── sprite2.jpg
    └── sprite3.png

```

output:
```
⌘ tree build/
build/
├── one.json
├── one.png
├── two.json
└── two.png

```

one.json:

```json
{
  "width": 150,
  "height": 200,
  "name": "one",
  "coordinates": {
    "sprite1.png": {
      "x": 100,
      "y": 0,
      "width": 50,
      "height": 50
    },
    "sprite3.png": {
      "x": 0,
      "y": 0,
      "width": 100,
      "height": 200
    },
    "sprite2.jpg": {
      "x": 100,
      "y": 50,
      "width": 50,
      "height": 50
    }
  }
}

```


## Options

### spritesmith

Type: `Function`, `Object`

Default: `null`

Options passed to [spritesmith](https://github.com/Ensighten/spritesmith)

If `Function`,
it receives the sprite name,
and the file paths of all the icons the sprite contains.
Should return an object.


### getSpriteName(iconPath)

Specify which group the given icon should be put into

Receives the file path of the icon.

Should return a group id.
By Default, id is the name of directory where it lie.

### getFileOption(opts)

Specify the options to create the File object for the sprite or the meta file.

options:

#### name
The id of the sprite.

Type: `String`

#### type
`.png` for the sprite, and `.json` for the meta file.

#### icons
File paths of the icons in a sprite

Type: `Array`

#### contents
File contents for the sprite or the meta file.

Type: `Buffer`

### getIconName(iconPath)

Specify the key in the meta file for the given icon.

The basename is used by default.

