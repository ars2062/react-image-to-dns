/** @type {import('webpack').Configuration} */
const config = {
    entry: './src/index.ts',
    target: 'node',
    output: {
        filename: 'index.js',
        clean: true,
        library: 'react-image-to-dns-webpack',
        libraryTarget: 'umd'
    },
    mode: process.env.NODE_ENV || 'production',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    optimization: {
        minimize: false
    },
    externals: {
        "sharp": 'commonjs sharp'
    }
}

module.exports = config