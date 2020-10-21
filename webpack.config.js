const path = require('path');
module.exports = {
    entry: {
        index: './src/index'
    },
    output: {
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.ts', '.js']
    },
    mode: 'development',
    devtool: 'source-map'
}