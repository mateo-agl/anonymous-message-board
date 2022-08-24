require('ignore-styles');

require('@babel/register')({
	extensions: ['.js', '.jsx', '.ts', '.tsx'],
	ignore: [/(node_module)/],
	presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
});

require('./server');

export {};