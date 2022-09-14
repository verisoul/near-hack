const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin");
const zlib = require("zlib");
const zopfli = require("@gfx/zopfli");

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production'
    let config = {
        name: 'client',
        target: 'web',
        devtool: false,
        mode: argv.mode,
        watch: !isProduction,
        entry: path.resolve(__dirname, 'index.js'),
        output: {
            path: path.resolve(__dirname, 'public/js'),
            filename: 'index.js',
            chunkFilename: '[name].index.js',
        },
        resolve: {
            fallback: {"buffer": require.resolve("buffer/")}
        },
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    include: __dirname,
                    exclude: path.resolve(__dirname, 'verisoul/auth-sdk'),
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    "targets": "defaults"
                                }],
                                '@babel/preset-react'
                            ]
                        }
                    }]
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                        },
                    ],
                },
            ]
        },

        plugins: [
            new webpack.ProvidePlugin({
                "React": "react",
            }),
            new CopyPlugin({
                patterns: [
                    {
                        from: `node_modules/@verisoul/ui/auth-sdk`,
                        to: path.resolve(__dirname, 'public/js/auth-sdk'),
                    },
                ],
            }),
            new webpack.ProvidePlugin({
                // Solves Dynamic Framer Motion process undefined error
                process: 'process/browser.js'
            }),
            new CompressionPlugin({
                filename: "[path][base]",
                algorithm: "brotliCompress",
                test: /\.(js)$/,
                compressionOptions: {
                    params: {
                        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                    },
                },
                threshold: 10240,
                minRatio: 0.8,
                deleteOriginalAssets: true,
            }),
            // new CompressionPlugin({
            //     compressionOptions: {
            //         numiterations: 30,
            //     },
            //     algorithm(input, compressionOptions, callback) {
            //         return zopfli.gzip(input, compressionOptions, callback);
            //     },
            // }),
        ],


        devServer: {
            static: {
                directory: path.join(__dirname, "public")
            },
            open: true,
            // https: true,
            port: 3000,
            historyApiFallback: {index: "index.html"},
            compress: false,
        },
    }
    return config
}