const rollup = require('rollup');
const debounce = require('debounce');
const dependencies = new Map();
const changedParents = new Set();
const WAIT = 25;

const touchParents = debounce(function () {
    let now = new Date();
    for (let idx = 0, lst = changedParents.values(); idx < lst.length; idx += 1) {
        fs.utimes(parent, now, now);
    }
    changedParents.clear();
}, WAIT)

// @param args {Object} - Config object of custom preprocessor.
// @param config {Object} - Config object of rollupPreprocessor.
// @param logger {Object} - Karma's logger.
// @helper helper {Object} - Karma's helper functions.
function createPreprocessor (args, config, logger, helper)
{
    var log = logger.create('preprocessor.rollup');

    config = config || {};

    // Don't continue if there is no rollup configuration
    if (config.rollup) {
        var rollupConfig = config.rollup || {};
        var bundleConfig = config.bundle || {};

        function preprocess (content, file, done)
        {
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
                        for (let i = 0, list = dependencies.entries(); i < list.length; i += 1) {
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

                        if (!bundleConfig.hasOwnProperty('format')) {
                            bundleConfig.format = 'es';
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
}

createPreprocessor.$inject = ['args', 'config.rollupPreprocessor', 'logger', 'helper'];

module.exports = {
    'preprocessor:rollup': ['factory', createPreprocessor]
};
