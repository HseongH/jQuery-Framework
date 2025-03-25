var globals = require('globals');
var pluginJs = require('@eslint/js');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: 'commonjs', // CommonJS 모듈 시스템 사용
			globals: Object.assign({}, globals.node, globals.browser, globals.amd),
			parserOptions: {
				impliedStrict: true // ES5에서는 strict mode가 선택사항
			}
		}
	},
	pluginJs.configs.recommended
];
