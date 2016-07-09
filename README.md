# karma-rollup-plugin

[![Build Status](https://travis-ci.org/Kflash/karma-rollup-plugin.svg?branch=master)](https://travis-ci.org/Kflash/karma-rollup-plugin)
[![npm version](https://img.shields.io/npm/v/karma-rollup-plugin.svg)](https://www.npmjs.org/package/karma-rollup-plugin)

> A Karma preprocessor plugin to offer seamless integration with [rollup](http://rollupjs.org/)

This plugin is a Karma preprocessor mainly used to bundle your spec entry point but might be useful in other cases as well.

# Features
  
  - supports Rollup by default
  - supports both Babel and Buble as the ES2015 compiler
  - sourceMap
  - recompiling of dependencies when files changes
  - ES3, ES5, ES2015, ES2016, and ES2017 (*with Babel*)

# Installation

The easiest way is to keep karma-rollup-plugin as a `devDependency`. You can simple do it by:

```js
npm i karma-rollup-plugin --save-dev
```

# Configuration

Following code shows the default configuration

```js
// karma.conf.js
module.exports = function (config) {
  config.set({
    preprocessors: {
      '**/**.js': ['rollup']
    },
    rollupPreprocessor: {
      // rollup settings. See Rollup documentation
      rollup: {
        plugins: [
          multiEntry(), // Allows specifying multiple entry points with rollup.
          buble() // ES2015 compiler by the same author as Rollup
            ]
          })
        ]
      },
      bundle: {
        sourceMap: 'inline'
      }
    }
  });
};
```

For further reference

- [Rollup documentation - JavaScript API](https://github.com/rollup/rollup/wiki/JavaScript-API)

# Why this plugin?

There exist a `karma-rollup-preprocessor` plugin for `Karma`, but it contains too many bugs, and doesn't seem to be maintained atm. 
This plugin try to stay true to the `Rollup ecosystem`.