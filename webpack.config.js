module.exports = {
    entry: "./index",
    output: {
        path: __dirname + "/docs",
        filename: "remington.js",
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
    }
}
