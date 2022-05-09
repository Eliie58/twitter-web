const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env),
            'STABLE_FEATURE': JSON.stringify(true),
            'EXPERIMENTAL_FEATURE': JSON.stringify(false)
        }), new webpack.ProvidePlugin({
            process: 'process/browser',
        }), new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        }),
        new Dotenv()
    ],
    resolve: {
        alias: {
            process: "process/browser"
        },
        extensions: ['.ts', '.js'],
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/")
        }
    }
};