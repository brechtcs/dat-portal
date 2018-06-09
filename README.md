# dat-portal

A configurable in-memory [Dat](https://datproject.org/)-to-HTTP gateway, so you can visit Dat archives from your browser.

If you want a browser that can visit Dat archives, check out [Beaker](https://beakerbrowser.com/).

## Install

To get the `dat-portal` command for running your own gateway, use [npm](https://www.npmjs.com/):

```
npm i -g dat-portal
```

## Usage

You can run `dat-portal` to start a gateway server that listens on port 3000. You can also configure it! You can print usage information with `dat-portal -h`:

```
$ dat-portal -h
dat-portal

Options:
  --version       Show version number                                  [boolean]
  --config        Path to JSON config file
  --port, -p      Port for the gateway to listen on.             [default: 3000]
  --dir, -d       Directory to use as a cache.
                                            [string] [default: "~/.dat-portal"]
  --max, -m       Maximum number of archives allowed in the cache. [default: 20]
  --period        Number of milliseconds between cleaning the cache of expired
                  archives.                                     [default: 60000]
  --ttl, -t       Number of milliseconds before archives expire.
                                                               [default: 600000]
  -h, --help      Show help                                            [boolean]
```

Due to limitations in how URLs work, the dat key will be converted to it's base32 representation instead of hexadecimal using [this library](https://github.com/RangerMauve/hex-to-32)

The gateway will peer archives until they expire from the cache, at which point it proactively halts them and deletes them from disk.

The gateway also supports replicating a hyperdrive instance using [websockets](https://github.com/maxogden/websocket-stream)

```javascript
const Websocket = require('websocket-stream')
const hyperdrive = require('hyperdrive')

const key = 'c33bc8d7c32a6e905905efdbf21efea9ff23b00d1c3ee9aea80092eaba6c4957'
const url = `ws://localhost:3000/${key}`

const archive = hyperdrive('./somewhere', key)

archive.once('ready', () => {
  const socket = websocket(url)

  // Replicate through the socket
  socket.pipe(archive.replicate()).pipe(socket)
})
```


## License

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)
