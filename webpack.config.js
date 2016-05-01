var path = require('path');
var webpack = require('webpack');

const scriptPath = path.join(__dirname, 'browser', 'scripts');
const buildPath = path.join(__dirname, 'build', 'scripts');

module.exports = {
    entry : {
        chat : path.join(scriptPath, 'chat.js')
    },
    output : {
        path : buildPath,
        filename: '[name].min.js'
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
                    scriptPath,
                ],
                test : scriptPath,
                query : {
                    presets : ['es2015']
                }
            }
        ]
    }
};
