module.exports = {
    mode: "development",
    entry: {
        
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