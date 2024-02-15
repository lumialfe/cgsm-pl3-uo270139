module.exports = {
    mode: "development",
    entry: {
        "prac4-1": "./src/prac4-1.js",
        "prac4-2": "./src/prac4-2.js",
        "prac4-1": "./src/prac4-1.js",
    },
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: __dirname
        },
        devMiddleware: {
            writeToDisk: true
        }
    },
    performance: {
        hints: false,
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000
    },
    module: {
        rules: [
          {
            test: /\.glsl$/,
            use: {
              loader: 'webpack-glsl-loader'
            }
          }
        ]
    }
};