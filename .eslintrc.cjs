module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:svelte/recommended', 'prettier'],
	plugins: [],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser'
		}
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2019
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
