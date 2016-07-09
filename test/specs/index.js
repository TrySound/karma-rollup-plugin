import { join, resolve } from 'path';
import { expect } from 'chai';
import { rollup } from 'rollup';
import multiEntry from 'rollup-plugin-multi-entry';
import buble from 'rollup-plugin-buble';
import karmaMocha from 'karma-mocha';
import karmaChai from 'karma-chai';
import karmaPhantomjsLauncher from 'karma-phantomjs-launcher';
import { revert, runKarma } from './helpers';
import rollupPluginKarma from '../../dist/rollup-plugin-karma.js';

function run(files, options = {}) {

    const testFile = resolve('test/fixtures/' + files);

    return runKarma({
        basePath: '../../',
        frameworks: ['mocha', 'chai'],
        files: [testFile],
        preprocessors: {
            testFile: ['rollup']
        },
        rollupPluginKarma: {
            rollup: {
                plugins: [
                    multiEntry(),
                    buble()
                ]
            }
        },
        plugins: [karmaMocha, karmaChai, karmaPhantomjsLauncher, rollupPluginKarma],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        autoWatch: false,
        browsers: ['PhantomJS'],
        captureTimeout: 60000,
        singleRun: true
    });
}

describe('rollup-plugin-karma', () => {

    it('should exists', () => expect(rollupPluginKarma).to.exist);

    it('should be an object', () => expect(rollupPluginKarma).to.be.an.object);

    it('should processes .js files', () => run('mocha.js'));

    it('should processes .js files', () => run('karma.js'));

    it('should generate source maps', () => run('karma.js', {
        sourceMap: true
    }));

    it('should allow to include external paths', () => run(
        'karma.js', {
            includePaths: ['test//fixtures']
        }
    ));

    it('should fail when a syntax error is found', () => revert(run(['error-syntax-error.js'])));

    it('should fail when an import is not found', () => revert(run(['error-import-not-found.js'])));
});