#!/usr/bin/env node

'use strict'

const DatGateway = require('.')
const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')
const mkdirp = require('mkdirp')
const pkg = require('./package.json')

require('yargs')
  .version(pkg.version)
  .command({
    command: '$0',
    aliases: ['start'],
    builder: function (yargs) {
      yargs.options({
        port: {
          alias: 'p',
          description: 'Port for the gateway to listen on.'
        },
        config: {
          alias: 'c',
          description: 'Path to the config file',
          coerce: resolveHomedir,
          default: '~/.dat-portal.json',
          normalize: true
        },
        dir: {
          alias: 'd',
          description: 'Directory to use as a cache.',
          coerce: resolveHomedir,
          normalize: true
        },
        max: {
          alias: 'm',
          description: 'Maximum number of archives allowed in the cache.'
        },
        period: {
          description: 'Number of milliseconds between cleaning the cache of expired archives.'
        },
        ttl: {
          alias: 't',
          description: 'Number of milliseconds before archives expire.'
        }
      })
    },
    handler: function (argv) {
      const config = readConfig(argv.config)
      const opts = Object.assign(argv, config)

      assert.ok(opts.home, 'Portal requires a service to provide homepage')

      // set defaults
      if (!opts.dir) opts.dir = '~/.dat-gateway'
      if (!opts.port) opts.port = 3000
      if (!opts.max) opts.max = 20
      if (!opts.period) opts.period = 60 * 1000 // every minute
      if (!opts.ttl) opts.ttl = 10 * 60 * 1000 // ten minutes

      // make sure dir exists
      mkdirp.sync(opts.dir)

      const gateway = new DatGateway(opts)
      gateway
        .load()
        .then(() => {
          return gateway.listen(opts.port)
        })
        .then(function () {
          console.log('[dat-portal] Now listening on port ' + opts.port)
        })
        .catch(console.error)
    }
  })
  .alias('h', 'help')
  .config()
  .parse()

function readConfig (path) {
  try {
    return require(path)
  } catch (e) {
    console.warn("[dat-portal] Failed loading config file")
    console.warn(e.toString())
    return {}
  }
}

function resolveHomedir (value) {
  return path.resolve(value.replace('~', os.homedir()))
}
