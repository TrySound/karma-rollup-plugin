'use strict';

const rollup = require('rollup');
const debounce = require('debounce');
const dependencies = new Map();
const changedParents = new Set();
const WAIT = 25;
const touchParents = debounce(function () {
    const now = new Date();
    for (var idx = 0, lst = changedParents.values(); idx < lst.length; idx += 1) {
        fs.utimes(parent, now, now);
    }
    changedParents.clear();
}, WAIT)

/**
 * Main function
 * 
 * @param{Object} args  - Config object of custom preprocessor.
 * @param{Object} logger - Karma's logger.
 * @helper{Object} helper - Karma's helper functions.
 */
function createRollupPreprocessor (args, config, logger, helper) {
    var log = logger.create('preprocessor.rollup');
    config = config || {};

    var rollupConfig = createRollupOptions(config);
    var bundleConfig = createBundleOptions(config);

    function preprocess(content, file, done) {
        log.debug('Processing "%s".', file.originalPath);

        try {
            rollupConfig.entry = file.originalPath;

            rollup
                .rollup(rollupConfig)
                .then(function (bundle)
                {

                    // Map this file to the dependencies that Rollup just
                    // compiled.
                    dependencies.set(
                        file.originalPath,
                        bundle.modules
                            .map(function (b) { return b.id })
                            .filter(function (op) {
                                return op !== file.originalPath }))

                    // Work backwards from dependencies to see what
                    // relies on this file, then trigger a recompilation of
                    // it.
                    for (var i = 0, list = dependencies.entries(); i < list.length; i += 1) {
                        var entry = list[i];
                        var parent = entry[0];
                        var dependList = entry[1]
                        if (dependList.includes(file.originalPath)) {
                            log.debug(" \n%s depends on \n\t%s\n    Recompiling it.",
                                parent, file.originalPath);
                            changedParents.add(parent);
                            touchParents();
                        }
                    }

                    var generated = bundle.generate(bundleConfig);
                    var processed = generated.code;

                    if (bundleConfig.sourceMap === 'inline') {
                        var url = generated.map.toUrl();
                        processed += "\n" + '//# sourceMappingURL=' + url;
                    }

                    done(null, processed);
                })
                .catch(function (error)
                {
                    log.error('%s\n at %s\n%s', e.message, file.originalPath, e.stack);
                    done(error, null)
                });

        }
        catch (exception) {
            log.error('%s\n at %s', exception.message, file.originalPath);
            done(exception, null);
        }
    }

    return preprocess;
}

/**
 * Bundle options. Other config options can be set here as well.
 * 
 * @param{Object} config - Config object
 */
function createBundleOptions(config) {

    if (!config.hasOwnProperty('rollup')) {
        throw new Error('Rollup configuration is not found!');
    }
}

/**
 * Rollup options. Other config options can be set here as well.
 * 
 * @param{Object} config - Config object
 */
function createRollupOptions(config) {

    var rollupConfig = config.rollup || {}

    // Rollup config options can be set here

    return rollupConfig
}

createRollupPreprocessor.$inject = ['args', 'config.rollupPreprocessor', 'logger', 'helper'];

module.exports = {
    'preprocessor:rollup': ['factory', createRollupPreprocessor]
};
