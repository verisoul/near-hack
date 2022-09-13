const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require('webpack');

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