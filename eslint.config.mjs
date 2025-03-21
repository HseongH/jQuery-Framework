import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: 'script', // ES5 이하에서는 'script' 사용
			globals: {
				// Node.js 전역 변수
				...globals.node,
				// 브라우저 전역 변수
				...globals.browser,
				// AMD 모듈 시스템 전역 변수
				...globals.amd
			},
			parserOptions: {
				impliedStrict: true // ES5에서는 strict mode가 선택사항
			}
		}
	},
	pluginJs.configs.recommended
];
