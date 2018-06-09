# dat-portal

A configurable in-memory [Dat](https://datproject.org/)-to-HTTP gateway, so you can visit Dat archives from your browser.

If you want a browser that can visit Dat archives, check out [Beaker](https://beakerbrowser.com/).

## Install

To get the `dat-portal` command for running your own gateway, use [npm](https://www.npmjs.com/):

```
npm install -g dat-portal
```

## Usage

Run `dat-portal` to start a gateway server that listens on port 3000. You can also configure it! Print usage information with `dat-portal -h`:

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

Visit `http://${datKey-base32}.localhost` to view any dat available on the network. The key has to be converted to its [base32](https://en.wikipedia.org/wiki/Base32) representation because the maximum length of a DNS subdomain is 63 characters. The standard hexadecimal dat keys are 64 characters long.

The gateway will peer archives until they expire from the cache, at which point it proactively halts them and deletes them from disk.


## License

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)
