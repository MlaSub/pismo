import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactNative from 'eslint-plugin-react-native';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRedux from 'eslint-plugin-react-redux';
import importPlugin from 'eslint-plugin-import';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            react,
            'react-native': reactNative,
            'react-hooks': reactHooks,
            'react-redux': reactRedux,
            'import': importPlugin,
        },
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                project: './mobile/tsconfig.json',
            },
            globals: {
                __DEV__: 'readonly',
                fetch: 'readonly',
                FormData: 'readonly',
                navigator: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
            },
        },
        rules: {
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            'react/prop-types': 'off',
            'react/jsx-no-duplicate-props': 'error',
            'react/jsx-no-undef': 'error',
            'react/jsx-pascal-case': 'error',
            'react/no-children-prop': 'error',
            'react/no-danger': 'warn',
            'react/no-danger-with-children': 'error',
            'react/no-deprecated': 'warn',
            'react/no-direct-mutation-state': 'error',
            'react/no-unescaped-entities': 'warn',
            'react/no-unknown-property': 'error',
            'react/require-render-return': 'error',
            'react/self-closing-comp': 'warn',
            'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
            'react/jsx-boolean-value': ['warn', 'never'],
            'react/jsx-fragments': ['warn', 'syntax'],
            'react/jsx-no-useless-fragment': 'warn',
            'react/jsx-key': 'error',
            'react/jsx-no-bind': 'warn',
            'react/no-unstable-nested-components': 'error',
            'react/jsx-no-constructed-context-values': 'error',
            'react/no-array-index-key': 'warn',
            'react/jsx-no-leaked-render': 'error',
            'react/jsx-no-target-blank': 'error',

            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            'react-native/no-unused-styles': 'error',
            'react-native/no-inline-styles': 'warn',
            'react-native/no-color-literals': 'error',
            'react-native/split-platform-components': 'warn',
            'react-native/no-single-element-style-arrays': 'error',

            'react-redux/connect-prefer-named-arguments': 'error',
            'react-redux/useSelector-prefer-selectors': 'error',
            'react-redux/no-unused-prop-types': 'warn',
            'react-redux/prefer-separate-component-file': 'warn',

            'import/no-unresolved': 'off',
            'import/order': ['warn', {
                'groups': [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index'
                ],
                'newlines-between': 'always',
                'alphabetize': {
                    'caseInsensitive': true
                }
            }],
            'import/no-duplicates': 'error',

            'no-unused-vars': 'off',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'require-await': 'warn',
            'no-param-reassign': 'error',
            'eqeqeq': ['warn', 'always'],
            'no-nested-ternary': 'warn',
            'no-loop-func': 'error',
            'no-await-in-loop': 'warn',
            'no-promise-executor-return': 'error',
            'no-async-promise-executor': 'error',
            'prefer-promise-reject-errors': 'error',
            'max-depth': ['error', 3],
            'default-case': 'error',
            'no-shadow': 'off',
            'no-magic-numbers': ['warn', {
                ignore: [0, 1, -1],
                ignoreArrayIndexes: true,
                ignoreDefaultValues: true,
                enforceConst: true
            }],
            'no-use-before-define': 'off',
            'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'no-return-await': 'off',
            'no-throw-literal': 'off',
            'complexity': ['warn', 10],
            'no-fallthrough': 'error',
            'no-unreachable': 'error',
            'no-duplicate-imports': 'off',
            'consistent-return': 'warn',
            'no-return-assign': 'error',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            '@typescript-eslint': tseslint,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                project: './mobile/tsconfig.json',
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', {
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_',
                'caughtErrorsIgnorePattern': '^_',
                'ignoreRestSiblings': true
            }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/prefer-nullish-coalescing': 'warn',
            '@typescript-eslint/prefer-optional-chain': 'warn',
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-use-before-define': ['error', {
                functions: false,
                classes: true,
                variables: false,
                enums: true,
                typedefs: true
            }],
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/no-misused-promises': ['error', {
                checksVoidReturn: false
            }],
            '@typescript-eslint/return-await': ['warn', 'in-try-catch'],
            '@typescript-eslint/only-throw-error': 'error',
            '@typescript-eslint/consistent-type-imports': ['warn', {
                prefer: 'type-imports',
                disallowTypeAnnotations: false
            }],
            '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
            '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
            '@typescript-eslint/naming-convention': ['warn', {
                selector: 'interface',
                format: ['PascalCase'],
                custom: {
                    regex: '^I[A-Z]',
                    match: false
                }
            }],
            '@typescript-eslint/no-unnecessary-condition': 'warn',
            '@typescript-eslint/prefer-as-const': 'warn',
            '@typescript-eslint/ban-ts-comment': ['error', {
                'ts-expect-error': 'allow-with-description',
                'ts-ignore': true,
                'ts-nocheck': true,
                'ts-check': false,
                minimumDescriptionLength: 10
            }],
            '@typescript-eslint/no-empty-function': 'warn',
            '@typescript-eslint/no-inferrable-types': 'warn',
        },
    },
    {
        ignores: [
            'node_modules/',
            'dist/',
            'build/',
            '.expo/',
            '.expo-shared/',
            'android/',
            'ios/',
            '*.config.js',
            '*.config.mjs',
            'babel.config.js',
            'metro.config.js',
        ],
    },
];