require('babel-polyfill');
var path = require('path');
var webpack = require('webpack');

var srcPath = path.join(__dirname, '..', 'browser', 'scripts');
var buildPath = path.join(__dirname, '..', 'build', 'scripts');

module.exports = {
    entry : srcPath,
    output : {
        path : buildPath,
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    devtool : 'inline-source-map',
    module : {
        loaders : [
            {
                loader : 'babel-loader',
                include : [
                    srcPath,
                ],
                test : srcPath,
                query : {
                    presets : ['es2015']
                }
            }
        ]
    }
};
