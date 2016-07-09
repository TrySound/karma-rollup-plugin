const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
    plugins: [],

    'globals': {
        'document': true,
        'window': true,
        'spy': true,
        'mocha': true,
        'stub': true,
        'beforeEach': true,
        'useFakeTimers': true,
        'useFakeXMLHttpRequest': true,
        'useFakeServer': true
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    'ecmaFeatures': {
        'jsx': true,
        'modules': true
    },
    'env': {
        'es6': true,
        'browser': true,
        'mocha': true,
        'node': true
    },
    // prevent eslint from taking user's eslint config files that are higher
    // in the directory structure into consideration.
    root:true,
    rules: {
        'accessor-pairs': OFF,
        'brace-style': [ERROR, '1tbs'],
        'comma-dangle': [ERROR],
        'dot-location': [ERROR, 'property'],
        'dot-notation': ERROR,
        'eqeqeq': [ERROR, 'allow-null'],
        'jsx-quotes': [ERROR, 'prefer-double'],
        'no-cond-assign': [ERROR, 'except-parens'],
        'no-console': 0,
        'no-constant-condition': OFF,
        'no-debugger': WARNING,
        'no-bitwise': OFF,
        'no-multi-spaces': ERROR,
        'no-mixed-spaces-and-tabs': [ ERROR, 'smart-tabs' ],
        'no-restricted-syntax': [ERROR, 'WithStatement'],
        'no-shadow': ERROR,
        'no-unused-vars': [ERROR, {args: 'none'}],
        'no-dupe-keys': ERROR,
        'no-duplicate-case': ERROR,
        'no-empty-character-class': ERROR,
        'no-ex-assign': ERROR,
        'no-extra-semi': ERROR,
        'no-func-assign': ERROR,
        'no-inner-declarations': [ERROR, 'both'],
        'no-invalid-regexp': ERROR,
        'no-irregular-whitespace': ERROR,
        'no-negated-in-lhs': ERROR,
        'no-obj-calls': ERROR,
        'no-regex-spaces': ERROR,
        'no-sparse-arrays': ERROR,
        'no-unreachable': ERROR,
        'no-div-regex': ERROR,
        'no-eq-null': ERROR,
        'no-eval': ERROR,
        'no-return-assign': ERROR,
        'quotes': [ERROR, 'single', 'avoid-escape'],
        'semi-spacing': [ERROR, { 'after': true }],
        'semi': [ERROR, 'always'],
        'space-before-blocks': ERROR,
        'space-before-function-paren': [ERROR, {anonymous: 'never', named: 'never'}],
        'strict': [ERROR, 'global'],
        'keyword-spacing': ERROR,
        'space-infix-ops': ERROR,
        'space-unary-ops': [ERROR, { 'words': true 	}],
        'spaced-comment': [ERROR, 'always', { 'exceptions': ['*'] }],
        'wrap-regex': ERROR,
        'constructor-super': ERROR,
        'no-class-assign': ERROR,
        'no-const-assign': ERROR,
        'no-this-before-super': ERROR,
        'no-var': ERROR,
        'prefer-spread': ERROR
    }
};