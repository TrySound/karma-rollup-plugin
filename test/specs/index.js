const path = require('path');
const expect = require('chai').expect;
const Server = require('karma').Server;
const buble = require('rollup-plugin-buble');
const karmaMocha = require('karma-mocha');
const karmaChai = require('karma-chai');
const karmaPhantomjsLauncher = require('karma-phantomjs-launcher');
const karmaRollupPlugin = require('../../');

/**
 * Helper functions
 */
function revert (promise, reason = 'Unexpected resolved Promised') {
    return promise
        .then(() => {
            throw new Error(reason);
        })
        .catch(() => {});
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

function run (files, options = {}) {

    const testFile = path.resolve('test/fixtures/' + files);

    return runKarma({
        basePath: '../../',
        frameworks: ['mocha', 'chai'],
        files: [testFile],
        preprocessors: {
            testFile: ['rollup']
        },
        karmaRollupPlugin: {
            rollup: {
                plugins: [
                    buble()
                ]
            }
        },
        plugins: [karmaMocha, karmaChai, karmaPhantomjsLauncher, karmaRollupPlugin],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        autoWatch: false,
        browsers: ['PhantomJS'],
        captureTimeout: 60000,
        singleRun: true
    });
}

/**
 * Tests
 */
describe('karma-rollup-plugin', () => {

    it('should exists', () => expect(karmaRollupPlugin).to.exist);

    it('should be an object', () => expect(karmaRollupPlugin).to.be.an.object);

    it('should processes .js files', done => {
        run('mocha.js');
        done();
    });

    it('should work perfectly with Mocha', done => {
        run('karma.js', {
            sourceMap: true
        });
        done();
    });

    it('should fail when a syntax error is found', () => revert(run(['error-syntax-error.js'])));

    it('should fail when an import is not found', () => revert(run(['error-import-not-found.js'])));

    // TODO! We should have tested generators, but this is only suppored in Babel, and not buble.
    // Need to fix a workaround!
});
