import globals from 'globals';
import pluginJs from '@eslint/js';
import requirejs from 'eslint-plugin-requirejs';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
	{ languageOptions: { globals: { ...globals.node, ...globals.browser, ...globals.amd, requirejs: 'readonly' } } },
	{ plugins: { requirejs } },
	pluginJs.configs.recommended
];
