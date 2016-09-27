# mmws
[![Build Status](https://travis-ci.org/millette/mmws.svg?branch=master)](https://travis-ci.org/millette/mmws)
[![Coverage Status](https://coveralls.io/repos/github/millette/mmws/badge.svg?branch=master)](https://coveralls.io/github/millette/mmws?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/millette/mmws.svg)](https://gemnasium.com/github.com/millette/mmws)
> Mattermost websocket client.

## Install
```
$ npm install --save mmws
```

## Now with update-notifier
The cli now uses [update-notifier][] to let the user know about updates to this program.

Users have the ability to opt-out of the update notifier by changing
the optOut property to true in ~/.config/configstore/update-notifier-rollodeqc-gh-user-streak.json.
The path is available in notifier.config.path.

Users can also opt-out by setting the environment variable NO_UPDATE_NOTIFIER
with any value or by using the --no-update-notifier flag on a per run basis.

## Usage
```js
const mmws = require('mmws')

mmws('unicorns')
//=> 'unicorns & rainbows'
```

## API
### mmws(input, [options])
#### input
Type: `string`

Lorem ipsum.

#### options
##### foo
Type: `boolean`<br>
Default: `false`

Lorem ipsum.

## CLI
```
$ npm install --global mmws
```

```
$ mmws --help

  Usage
    mmws [input]

  Options
    --foo  Lorem ipsum. [Default: false]

  Examples
    $ mmws
    unicorns & rainbows
    $ mmws ponies
    ponies & rainbows
```


## License
AGPL-v3 © [Robin Millette](http://robin.millette.info)

[update-notifier]: <https://github.com/yeoman/update-notifier>
