const path = require('path');
const assign = require('object-assign');
const expect = require('chai').expect;
const Server = require('karma').Server;
const buble = require('rollup-plugin-buble');
const karmaMocha = require('karma-mocha');
const karmaChai = require('karma-chai');
const karmaPhantomjsLauncher = require('karma-phantomjs-launcher');
const rollupPlugin = require('../');

/**
 * Helper functions
 */
function revert (promise, reason = 'Unexpected resolved Promised') {
    return promise
        .then(
            () => {
                throw new Error(reason);
            },
            () => {}
        );
}

function runKarma (config) {
    return new Promise((resolve, reject) => {
        new Server(config, exitCode => {
            if (exitCode) {
                reject(`Karma has exited with ${exitCode}`);
            } else {
                resolve();
            }
        }).start();
    });
}

function runServer (file, options = {}) {
    return runKarma({
        basePath: '../',
        files: [path.resolve('test/fixtures/' + file)],
        plugins: [rollupPlugin, karmaMocha, karmaChai, karmaPhantomjsLauncher],
        browsers: ['PhantomJS'],
        frameworks: ['mocha', 'chai'],
        preprocessors: {
            'fixtures/**': ['rollup']
        },
        rollupPlugin: {
            rollup: {
                plugins: [
                    buble()
                ]
            }
        },
        autoWatch: false,
        singleRun: true
    });
}

function runFixture (fixture, options = {}) {
    const loggerMock = {
        create: () => ({
            debug: () => {},
            error: () => {}
        })
    };
    const config = {
        rollup: assign({
            plugins: [
                buble()
            ]
        }, options.rollup),
        bundle: assign({}, options.bundle)
    };
    const createPreprocessor = rollupPlugin['preprocessor:rollup'][1];
    const preprocessor = createPreprocessor(config, loggerMock);
    const file = {
        originalPath: path.resolve(__dirname, 'fixtures/' + fixture)
    };

    return new Promise((resolve, reject) => {
        preprocessor(null, file, (error, code) => {
            if (error) {
                reject(error);
            } else {
                resolve(code);
            }
        });
    }).then(code => {
        new Function('expect', code)(expect);
        return code;
    });
}

/**
 * Tests
 */
describe('karma-rollup-plugin', () => {

    it('should be karma preprocessor', () => {
        expect(rollupPlugin).to.be.an.object;
        expect(rollupPlugin['preprocessor:rollup']).to.be.an.array;
        expect(rollupPlugin['preprocessor:rollup'][1]).to.be.a.function;
    });

  /*  it('should bundle es2015 modules', () => runFixture('module.js').then(code => {
        expect(code).to.not.contain('//# sourceMappingURL');
    }));

    it('should transpile es2015 syntax', () => runFixture('es2015.js'));

    it('should fail when a syntax error is found', () => runFixture('error-syntax-error.js').catch(error => {
        expect(error.message).to.contain('Error transforming');
        expect(error.message).to.contain('error-syntax-error.js');
    }));

    it('should fail when an import is not found', () => runFixture('error-import-not-found.js').catch(error => {
        expect(error.message).to.contain('Could not resolve');
        expect(error.message).to.contain('error-import-not-found.js');
    }));

    it('should add inline source map', () => runFixture('es2015.js', {
        bundle: {
            sourceMap: 'inline'
        }
    }).then(code => {
        expect(code).to.contain('//# sourceMappingURL');
    }));
*/
    // TODO: test karma specific stuff like watching dependency changes
    // touchParents function is weird and buggy
});
