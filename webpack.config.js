const path = require("path");
const webpack = require("webpack");
const packagejson = require("./package.json");
var DashboardPlugin = require('webpack-dashboard/plugin');


module.exports = {
    devtool: 'eval-source-map',
    entry:{
        runtime:__dirname + "/src/main.js",
     //   vendor: Object.keys(packagejson.dependencies),//获取生产环境依赖的库
        common:__dirname + "/src/util/index.js",
        meshes:__dirname+ "/src/meshes/index.js"
    },
    output: {
        path: __dirname + "/public",
        filename: '[name].js'
    },
    devServer: {
        contentBase: "./public",
        historyApiFallback: true,
        inline: true,
        port:8009
    },

    module: {
        rules: [{
            test: /(\.jsx|\.js)$/,
            use: {
                loader: "babel-loader"
            },
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }]
        },{
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
        },{
            test: /\.(json)$/,
            loader: 'file-loader?limit=8192&name=fonts/[hash:8].[name].[ext]'
            // loader: 'file-loader',options:{name:'fonts/[hash:8].[name].[ext]'}
        }
    ]
    },
    plugins: [
        new DashboardPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name:['runtime','meshes','common'],//vendor是第三方，
            filename:'[name].js',
            minChunks:Infinity
        }),

        // new webpack.optimize.CommonsChunkPlugin({
        //     name:'com',//common是自定义公共模块，就是被引入多次的自己写的
        //     filename:'[name].js',
        //     chunks:['common','mesh'],
        //     minChunks:2
        // }),


        // new webpack.optimize.CommonsChunkPlugin({
        //     name:'common2',//common是自定义公共模块，就是被引入多次的自己写的
        //     filename:'[name].js',
        //     chunks:'bundle'
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name:'common1',//common是自定义公共模块，就是被引入多次的自己写的
        //     filename:'[name].js',
        //     chunks:'bundle'
        // }),

    ]
    // plugins: [
    //     new webpack.optimize.CommonsChunkPlugin({
    //         name: 'vendor',
    //         filename: '[name].js',
    //         minChunks: function (module,count) {
    //             console.log(module.resource,`引用次数${count}`);
    //             //"有正在处理文件" + "这个文件是 .js 后缀" + "这个文件是在 node_modules 中"
    //             return (
    //                 module.resource &&
    //                 /\.js$/.test(module.resource) &&
    //                 module.resource.indexOf(path.join(__dirname, './node_modules')) === 0
    //             )
    //         }
    //     }),
    //     new webpack.optimize.CommonsChunkPlugin({
    //         name: 'runtime',
    //         filename: '[name].js',
    //         chunks: ['vendor']
    //     }),
    // ]



}
