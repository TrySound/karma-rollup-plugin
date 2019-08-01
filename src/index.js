'use strict';

const { rollup } = require('rollup');
const SOURCEMAPPING_URL = 'sourceMappingURL';

function createRollupPreprocessor (args, options = {}, logger) {
    const log = logger.create('preprocessor.rollup');

    return (content, file, done) => {
        log.debug('Processing "%s".', file.originalPath);

        try {
            options.entry = file.originalPath;

            rollup(options).then(async bundle => {
                let { code, map } = await bundle.generate(options);

                if (options.sourceMap === 'inline') {
                    code += '\n//# ' + SOURCEMAPPING_URL + '=' + map.toUrl();
                }

                if (options.sourceMap) {
                    file.sourceMap = map;
                }

                done(null, code);
            }).catch(error => {
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

createRollupPreprocessor.$inject = ['args', 'config.rollupPreprocessor', 'logger'];

module.exports = { 'preprocessor:rollup': ['factory', createRollupPreprocessor] };
