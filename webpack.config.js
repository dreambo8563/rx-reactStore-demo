process.traceDeprecation = true;
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackTemplate = require('html-webpack-template')
const webpack = require('webpack')
const merge = require('webpack-merge')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

const parts = require('./webpack.parts')

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'public')
}

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
      publicPath: '/'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'template.html',
        title: 'SpaceX',
        minify:{collapseWhitespace:true,collapseBooleanAttributes:true,removeEmptyAttributes:true},
        appMountId: 'app', // Generate #app where to mount
        favicon: 'favicon.ico',
        mobile: true, // Scale page on mobile
        inject: true // html-webpack-template requires this to work
      }),
      new SWPrecacheWebpackPlugin({
        cacheId: 'my-project-name',
        filename: 'my-service-worker.js',
        maximumFileSizeToCacheInBytes: 4194304,
        minify: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/at\.alicdn\.com/,
            handler: 'fastest'
          },
          {
            urlPattern: /^https:\/\/www\.amap\.com/,
            handler: 'fastest'
          }
        ],
        staticFileGlobsIgnorePatterns: [/\.map$/] // use this to ignore sourcemap files
      })
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.css'],
      alias: {
        shared: path.resolve(__dirname, 'src/appSettings'),
        assets: path.resolve(__dirname, 'src/assets'),
        utils: path.resolve(__dirname, 'src/utils'),
        modules: path.resolve(__dirname, 'src/routes'),
        layouts: path.resolve(__dirname, 'src/layouts'),
        constants: path.resolve(__dirname, 'src/constants'),
        store: path.resolve(__dirname, 'src/model/store')
      }
    }
  },
  parts.loadImages({
    options: {
      limit: 15000
    }
  }),
  parts.loadFonts(),
  parts.loadJavaScript({ include: PATHS.app })
])

module.exports = function(env) {
  process.env.BABEL_ENV = env
  if (env === 'production') {
    return merge([
      common,
      {
        output: {
          chunkFilename: 'scripts/[chunkhash].js',
          filename: '[name].[chunkhash].js'
        },
        plugins: [new webpack.HashedModuleIdsPlugin()]
      },
      parts.clean(PATHS.build),
      parts.setFreeVariable('process.env.NODE_ENV', 'production'),
      parts.minifyJavaScript({ useSourceMap: true }),
      parts.extractBundles({
        bundles: [
          {
            name: 'vendor',
            entries: ['react', 'react-router', 'react-dom', 'ramda','babel-polyfill']
          },
          {
            name: 'manifest'
          }
        ]
      }),

      parts.generateSourceMaps({ type: 'hidden-source-map' }),
      parts.extractCSS({
        use: ['css-loader?modules', parts.autoprefix()]
      }),
      // parts.loadCSS(),
      parts.minifyCSS({
        options: {
          discardComments: {
            removeAll: true
          },
          // Run cssnano in safe mode to avoid potentially unsafe transformations.
          safe: true
        }
      })
    ])
  }
  return merge([
    common,
    {
      entry: {
        // react-hot-loader has to run before app!
        app: ['react-hot-loader/patch', PATHS.app]
      },
      output: {
        devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
      },
      plugins: [new webpack.NamedModulesPlugin()]
    },
    parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
    parts.devServer({
      // Customize host/port here if needed
      host: process.env.HOST,
      port: process.env.PORT
    }),
    // parts.extractCSS({use: 'css-loader?modules'})
    parts.loadCSS()
  ])
}
