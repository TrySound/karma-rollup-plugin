# karma-rollup-plugin [![Build Status](https://travis-ci.org/TrySound/karma-rollup-plugin.svg?branch=master)](https://travis-ci.org/TrySound/karma-rollup-plugin)

> A Karma preprocessor plugin to offer seamless integration with [rollup](http://rollupjs.org/)

This plugin is a Karma preprocessor to compile and bundle your spec entry point on the fly. It works seamless with all Rollup plugins.

# Features

  - supports Rollup by default
  - supports both Babel and Buble as the ES2015 compiler
  - sourceMap
  - recompiling of dependencies when files changes
  - ES3, ES5, ES2015, ES2016, and ES2017 (*with Babel or Buble*)

# Installation

The easiest way is to keep karma-rollup-plugin as a `devDependency`. You can simple do it by:

```js
npm i karma-rollup-plugin --save-dev
```

# Configuration

*Note!* As a rule of thumb, use of `umd` format doesn't make sense in tests, and will throw a warning without a module name.

Following code shows the default configuration

```js
// karma.conf.js
module.exports = function (config) {
  config.set({
    preprocessors: {
     'test/**/*.js': ['rollup']
    },
    rollupPreprocessor: {
      // rollup settings. See Rollup documentation
      plugins: [
        buble() // ES2015 compiler by the same author as Rollup
      ],
      // will help to prevent conflicts between different tests entries
      format: 'iife',
      sourceMap: 'inline'
    }
  });
};
```

See [Rollup documentation - JavaScript API](https://github.com/rollup/rollup/wiki/JavaScript-API) for more details.
