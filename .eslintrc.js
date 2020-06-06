module.exports = {
    plugins: ['lodash', 'react-hooks'],
    extends: ['airbnb', 'plugin:lodash/canonical'],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/jsx-filename-extension': ['off', 'always'],
        'import/no-extraneous-dependencies': ['off', 'always'],
        'lodash/identity-shorthand': ['off', 'always'],
        'lodash/matches-prop-shorthand': ['off', 'always'],
        'lodash/matches-shorthand': ['off', 'always'],
        'lodash/prop-shorthand': ['off', 'always'],
        'react/destructuring-assignment': ['warn', 'always'],
        'no-use-before-define': 'off',
        'react/jsx-one-expression-per-line': ['off', 'always'],
        curly: ['error', 'all'],
        'space-before-function-paren': ['error', 'never'],
        'linebreak-style': ['error', 'unix'],
        'arrow-body-style': ['error', 'always'],
        'no-plusplus': [
            'error',
            {
                allowForLoopAfterthoughts: true,
            },
        ],
        'prefer-destructuring': [
            'warn',
            {
                array: false,
                object: true,
            },
        ],
        'react/jsx-wrap-multilines': ['off', 'always'],
        'react/jsx-indent': [
            'error',
            'space' | 4, // eslint-disable-line no-bitwise
        ],
        'react/jsx-indent-props': [
            'error',
            'space' | 4, // eslint-disable-line no-bitwise
        ],
        'react/jsx-props-no-spreading': ['off', 'always'],
        indent: ['error', 4],
        'max-len': [0],
    },
    parser: 'babel-eslint',
    env: {
        jest: true,
    },
    overrides: [
        {
            files: ['*.test.js'],
            globals: {
                document: false,
                window: false,
                event: false,
                cy: true,
                Cypress: true,
            },
        },
    ],
    settings: {
        "import/resolver": {
          "node": {
            "paths": ["src"]
          }
        }
    }
};
