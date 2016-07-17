'use strict'

const spiderDetector = require('spider-detector')
const jsdom = require('jsdom')
const MutationObserver = require('./mutationObserver')

module.exports = function seoFactory (config) {
  return function seo (req, res, next) {
    if (!spiderDetector.isSpider(req.get('user-agent')) || !req.accepts('html')) {
      return next()
    }
    config = validateAndFillConfig(config)
    const domConfig = {
      url: req.protocol + '://' + req.get('host') + req.originalUrl,
      created: onCreated,
      onload: onLoad,
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"],
        SkipExternalResources: false
      }
    }
    if (config.debug) {
      domConfig.virtualConsole = jsdom.createVirtualConsole().sendTo(console)
    }
    jsdom.env(domConfig)

    function onCreated (err, window) {
      if (err) {
        throw err
      }
      window.MutationObserver = window.MutationObserver || MutationObserver(window)
    }

    function onLoad (window) {
      setTimeout(respondWithHTML, config.timeout, window)
    }

    function respondWithHTML (window) {
      const scripts = window.document.getElementsByTagName('script')
      for (const script of scripts) {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      }
      res.end(window.document.documentElement.outerHTML)
      window.close()
    }
  }
}

function validateAndFillConfig (config) {
  if (config === undefined) {
    config = {}
  }
  if (typeof config !== 'object') {
    throw new TypeError('config must be undefined or an object')
  }
  if (config.timeout === undefined) {
    config.timeout = 0
  }
  if (typeof config.timeout !== 'number') {
    throw new TypeError('config.timeout must be a number or undefined')
  }
  if (config.debug === undefined) {
    config.debug = false
  }
  if (typeof config.debug !== 'boolean') {
    throw new TypeError('config.debug must be a boolean or undefined')
  }
  return config
}
