const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const webpack = require('webpack');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'public')
};

const common = merge([
    {
        // Entry accepts a path or an object of entries. We'll be using the latter form
        // given it's convenient with more complex configurations.
        //
        // Entries have to resolve to files! It relies on Node.js convention by default
        // so if a directory contains *index.js*, it will resolve to that.
        entry: {
            app: PATHS.app
        },
        output: {
            path: PATHS.build,
            filename: '[name].[hash].js',
            publicPath :'/'
        },
        plugins: [new HtmlWebpackPlugin({
                template: HtmlWebpackTemplate, title: 'demo', appMountId: 'app', // Generate #app where to mount
                mobile: true, // Scale page on mobile
                inject: false, // html-webpack-template requires this to work
            })],
        resolve: {
            extensions: ['.js', '.jsx','css']
        }
    },
    parts.loadImages({
        options: {
            limit: 15000
        }
    }),
    parts.loadFonts(),
    parts.loadJavaScript({include: PATHS.app})
]);

module.exports = function (env) {
     process.env.BABEL_ENV = env;
    if (env === 'production') {
        return merge([
            common, {
                output: {
                    chunkFilename: 'scripts/[chunkhash].js',
                    filename: '[name].[chunkhash].js'
                },
                plugins: [new webpack.HashedModuleIdsPlugin()]
            },
            parts.clean(PATHS.build),
            parts.setFreeVariable('process.env.NODE_ENV', 'production'),
            parts.minifyJavaScript({useSourceMap: true}),
            parts.extractBundles({
                bundles: [
                    {
                        name: 'vendor',
                        entries: ['react','react-router','react-dom']
                    }, {
                        name: 'manifest'
                    }
                ]
            }),

            parts.generateSourceMaps({type: 'source-map'}),
            parts.extractCSS({
                use: [
                    'css-loader?modules', parts.autoprefix()
                ]
            })
        ]);
    }
    return merge([
        common, {
            entry: {
                // react-hot-loader has to run before app!
                app: ['react-hot-loader/patch', PATHS.app]
            },
            output: {
                devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
            },
            plugins: [new webpack.NamedModulesPlugin()]
        },
        parts.generateSourceMaps({type: 'cheap-module-eval-source-map'}),
        parts.devServer({
            // Customize host/port here if needed
            host: process.env.HOST,
            port: process.env.PORT
        }),
        //parts.extractCSS({use: 'css-loader?modules'})
        parts.loadCSS()
    ]);
};