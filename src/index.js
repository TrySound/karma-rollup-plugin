'use strict';

const { rollup } = require('rollup');
const { readFileSync } = require('fs');
const debounce = require('debounce');
const dependencies = new Map();
const changedParents = new Set();
const SOURCEMAPPING_URL = 'sourceMappingURL';
const pkg = JSON.parse( readFileSync( 'package.json', 'utf-8' ) );
const WAIT = 25;
const touchParents = debounce(() => {
    const now = Date.now(); // gives better performance then new Date()
    for (let idx = 0, lst = changedParents.values(); idx < lst.length; idx += 1) {
        fs.utimes(parent, now, now);
    }
    changedParents.clear();
}, WAIT);

function createRollupPreprocessor (args, options = {}, logger, helper) {
    let log = logger.create('preprocessor.rollup');

    // Avoid Rollup from throwing "You must supply options.moduleName for UMD bundles"
    // on 'UMD' format without module name
    if (options.format === 'umd' && !options.moduleName) {
        options.moduleName = pkg.name;
    }

    return (content, file, done) => {
        log.debug('Processing "%s".', file.originalPath);

        try {
            options.entry = file.originalPath;

            rollup(options)
                .then(bundle => {

                    // Map this file to the dependencies that Rollup just
                    // compiled.
                    dependencies.set(
                        file.originalPath,
                        bundle.modules
                            .map(b => b.id)
                            .filter(op => op !== file.originalPath)
                    );

                    // Work backwards from dependencies to see what
                    // relies on this file, then trigger a recompilation of
                    // it.
                    for (let i = 0, list = dependencies.entries(); i < list.length; i += 1) {
                        const entry = list[i];
                        const parent = entry[0];
                        const dependList = entry[1];
                        if (dependList.includes(file.originalPath)) {
                            log.debug(" \n%s depends on \n\t%s\n    Recompiling it.", parent, file.originalPath);
                            changedParents.add(parent);
                            touchParents();
                        }
                    }

                    let { code, map } = bundle.generate(options);

                    if (options.sourceMap === 'inline') {
                        code += '\n//# ' + SOURCEMAPPING_URL + '=' + map.toUrl();
                    }

                    done(null, code);
                })
                .catch(error => {
                    log.error('%s\n at %s\n%s', error.message, file.originalPath, error.stack);
                    done(error);
                });

        }
        catch (error) {
            log.error('%s\n at %s', error.message, file.originalPath);
            done(error);
        }
    };
}

createRollupPreprocessor.$inject = ['args', 'config.rollupPreprocessor', 'logger', 'helper'];

module.exports = { 'preprocessor:rollup': ['factory', createRollupPreprocessor] };
