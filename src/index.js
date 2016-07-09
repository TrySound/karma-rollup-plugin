let fs = require('fs');
let rollup = require('rollup').rollup;
let debounce = require('debounce');
let dependencies = new Map();
let changedParents = new Set();
let WAIT = 25;

// Workaround for nodejS 0.12 -> don't use ES1015 for this function
const touchParents = debounce(function() {
    let now = new Date();
    for (let idx = 0, lst = changedParents.values(); idx < lst.length; idx += 1) {
        fs.utimes(lst[idx], now, now);
    }
    changedParents.clear();
}, WAIT);

function createPreprocessor(args, config = {}, logger, helper) {

    let log = logger.create('preprocessor.rollup');

    // Don't continue if there is no rollup configuration
    if (config.rollup) {

        let options = helper.merge({
            format: 'es' // default to 'es' format
        }, config.bundle || {});

        return (content, file, done) => {

            log.debug(' 🗞  Rollup of "%s".', file.originalPath);

            try {
                config.rollup.entry = file.originalPath;

                rollup(config.rollup)
                    .then(bundle => {
                        // Map this file to the dependencies that Rollup just
                        // compiled.
                        dependencies.set(
                            file.originalPath,
                            bundle.modules.map(b => b.id).filter((op) => op !== file.originalPath));
                        // Work backwards from dependencies to see what
                        // relies on this file, then trigger a recompilation of
                        // it.
                        for (let i = 0, list = dependencies.entries(); i < list.length; i += 1) {
                            let entry = list[i];
                            let parent = entry[0];
                            let dependList = entry[1];

                            if (dependList.includes(file.originalPath)) {
                                log.debug(' \n%s depends on \n\t%s\n    Recompiling it.',
                                    parent, file.originalPath);
                                changedParents.add(parent);
                                touchParents();
                            }
                        }

                        let generated = bundle.generate(options);
                        let processed = generated.code;

                        if (options.sourceMap === 'inline') {
                            processed += `# sourceMappingURL=${generated.map.toUrl()}`;
                        }

                        done(null, processed);
                    })
                    .catch(error => {
                        log.error('Failed to process "%s".\n  %s', file.originalPath, error.message);
                        done(error, null);
                    });

            } catch (e) {
                log.error('%s\n at %s\n%s', e.message, file.originalPath, e.stack);
                done(e, null);
            }
        };
    }
}

createPreprocessor.$inject = ['args', 'config.rollupPreprocessor', 'logger', 'helper'];

// PUBLISH DI MODULE
export default {
    'preprocessor:rollup': ['factory', createPreprocessor]
};