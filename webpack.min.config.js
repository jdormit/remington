var webpack = require('webpack');

module.exports = {
    entry: "./index",
    output: {
        path: __dirname + "/docs",
        filename: "remington.min.js",
        library: "Remington",
        libraryTarget: "var"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}
