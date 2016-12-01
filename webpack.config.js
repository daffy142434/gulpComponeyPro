/*


 *  created by ericKuang


 */ 

//内置模块
var path = require('path');

var imamaClass = path.resolve(__dirname, '../imama_server/src/main/resources/templates');
// var es2015 = require('babel-preset-es2015');




//普通webpack任务流工程
/*
module.exports = {
    entry: path.join(__dirname, "../mytest/js/mm.js"),
    resolveLoader: { root: path.join(__dirname, 'node_modules') },
    output: {
        filename: 'main.js',
        path: './build/js/'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',

        }, {
            test: /\.vue$/,
            loader: 'vue'
        }]
    },
    babel: {
        presets: ['babel-preset-es2015'].map(require.resolve)
    }
}
*/

//gulp 任务流工程
module.exports = {
    /*在gulpfile里的browserSync做了处理，这里忽略watch*/
    // watch: true,
    output: {
        filename: './main.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',

        }, {
            test: /\.vue$/,
            loader: 'vue'
        }]
    },
    babel: {
        presets: ['babel-preset-es2015'].map(require.resolve),
        compact: false
    },
    resolve: {
        root: [
            path.resolve(__dirname, '../imama_server/src/main/resources/templates')
        ],
        // alias: {
        //     'xzy': path.join(imamaClass, './maternal/js/browser-messager.js')
        // }

    },
    resolveLoader: { 
        root: path.join(__dirname, 'node_modules') 
    },
}


console.log(__dirname+ '....................................................................')