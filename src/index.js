'use strict';

var ref = require('rollup');
var rollup = ref.rollup;
var debounce = require('debounce');
var dependencies = new Map();
var changedParents = new Set();
var SOURCEMAPPING_URL = 'sourceMappingURL';
var WAIT = 25;
var touchParents = debounce(function () {
    var now = new Date();
    for (var idx = 0, lst = changedParents.values(); idx < lst.length; idx += 1) {
        fs.utimes(parent, now, now);
    }
    changedParents.clear();
}, WAIT);

function createRollupPreprocessor (args, config, logger, helper) {
    config = config || {};

     var rollupConfig = config.rollup || {};
     var bundleConfig = config.bundle || {};
     var log = logger.create('preprocessor.rollup');

    function preprocess (content, file, done) {
        log.debug('Processing "%s".', file.originalPath);

        try {
            rollupConfig.entry = file.originalPath;

            rollup(rollupConfig)
                .then(function (bundle) {

                    // Map this file to the dependencies that Rollup just
                    // compiled.
                    dependencies.set(
                        file.originalPath,
                        bundle.modules
                            .map(function (b) { return b.id; })
                            .filter(function (op) { return op !== file.originalPath; })
                    );

                    // Work backwards from dependencies to see what
                    // relies on this file, then trigger a recompilation of
                    // it.
                    for (var i = 0, list = dependencies.entries(); i < list.length; i += 1) {
                        var entry = list[i];
                        var parent = entry[0];
                        var dependList = entry[1];
                        if (dependList.includes(file.originalPath)) {
                            log.debug(" \n%s depends on \n\t%s\n    Recompiling it.", parent, file.originalPath);
                            changedParents.add(parent);
                            touchParents();
                        }
                    }

                    var ref = bundle.generate(bundleConfig);
                    var code = ref.code;
                    var map = ref.map;

                    if (bundleConfig.sourceMap === 'inline') {
                        code += '\n//# ' + SOURCEMAPPING_URL + '=' + map.toUrl();
                    }

                    done(null, code);
                })
                .catch(function (error) {
                    log.error('%s\n at %s\n%s', error.message, file.originalPath, error.stack);
                    done(error);
                });

        }
        catch (error) {
            log.error('%s\n at %s', error.message, file.originalPath);
            done(error);
        }
    }

    return preprocess;
}

createRollupPreprocessor.$inject = ['args', 'config.rollupPreprocessor', 'logger', 'helper'];

module.exports = {
    'preprocessor:rollup': ['factory', createRollupPreprocessor]
};