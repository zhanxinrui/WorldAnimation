var DashboardPlugin = require('webpack-dashboard/plugin');
module.exports = {
    devtool: 'eval-source-map',
    entry: __dirname + "/src/main.js",
    output: {
        path: __dirname + "/public",
        filename: "bundle.js"
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
        new DashboardPlugin()

    ]



}