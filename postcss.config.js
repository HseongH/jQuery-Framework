module.exports = {
	plugins: [
		require('postcss-normalize')(),
		require('postcss-preset-env')({
			stage: 3,
			features: {
				'nesting-rules': true,
				'custom-properties': true,
				'custom-media-queries': true
			},
			browsers: ['last 2 versions', 'ie 10-11'],
			autoprefixer: {
				flexbox: 'no-2009'
			}
		}),
		require('postcss-flexbugs-fixes')()
	]
};
