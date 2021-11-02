const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const isProduction = process.argv.indexOf('-p') >= 0;
let plugins = [];
if (isProduction) {
    plugins.push(new webpack.DefinePlugin({
        "process.env": {
            NODE_ENV: JSON.stringify("production")
        }
    }));
}

plugins.push(new HtmlWebpackPlugin({
    template: './src/settings.html',
    hash: !isProduction,
    title: 'Settings',
    filename: 'settings.html',
    chunks: ['js/settings.js']
}));

plugins.push(new HtmlWebpackPlugin({
    template: './src/background.html',
    hash: false,
    filename: 'background.html',
    chunks: ['js/background.js']
}));

const extractSass = new MiniCssExtractPlugin({
    filename: '/css/style.css'
});
plugins.push(extractSass);

plugins.push(new CopyWebpackPlugin({
    patterns: [
        'src/manifest.json',
        { from: 'src/images', to: 'images' },
        { from: 'src/icons', to: 'icons' }
    ]
}));


module.exports = {
    entry: {
        'js/settings.js': './src/ts/settings.tsx',
        'js/background.js': './src/ts/background.ts'
    },
    output: {
        filename: '[name]',
        path: path.join(__dirname, './dist')
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: isProduction ? false : 'source-map',
    devServer: {
        contentBase: './dist',
        index: 'settings.html'
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },

            { test: /\.(sa|sc|c)ss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']},

            { test: /\.(png|jpg|gif)$/, use: [{ loader: 'url-loader', options: { limit: 8192 } }] }
        ]
    },
    plugins: plugins
};