const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const cssnano = require('cssnano')
const pkgPath = path.join(__dirname, 'package.json')
const pkg = require(pkgPath)
const theme = pkg.theme

exports.devServer = function({ host, port }) {
  return {
    devServer: {
      // Enable history API fallback so HTML5 History API based routing works. This is
      // a good default that will come in handy in more complicated setups.
      historyApiFallback: true,

      // Don't refresh if hot loading fails. If you want refresh behavior, set hot:
      // true instead.
      hot: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',
      compress: true,
      proxy: {
        '/stereo': 'http://stereo-dev.fenbeijinfu.com',
        '/test': 'http://localhost:3000'
      },
      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices unlike default `localhost`.
      host, // Defaults to `localhost`
      port:8000  // Defaults to 8080
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
  }
}

exports.loadCSS = function({ include, exclude } = {}) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: false
              }
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader',
            `less-loader?{"modifyVars":${JSON.stringify(theme)}}`
          ]
        }
      ]
    }
  }
}

exports.extractCSS = function({ include, exclude, use }) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,
          use: ExtractTextPlugin.extract({ use: use, fallback: 'style-loader' })
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              `less-loader?{"modifyVars":${JSON.stringify(theme)}}`
            ]
          })
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin({
        filename: '[name].[contenthash].css',
        allChunks: true
      })
    ]
  }
}

exports.autoprefix = function() {
  return {
    loader: 'postcss-loader',
    options: {
      plugins: function() {
        return [require('autoprefixer')]
      }
    }
  }
}

exports.loadImages = function({ include, exclude, options } = {}) {
  return {
    module: {
      rules: [
        {
          test: /\.(png|jpg|jpeg)$/,
          include,
          exclude,

          use: {
            loader: 'url-loader',
            options
          }
        },
        {
          test: /\.svg$/,
          use: 'file-loader'
        }
      ]
    }
  }
}

exports.loadFonts = function({ include, exclude, options } = {}) {
  return {
    module: {
      rules: [
        {
          // Capture eot, ttf, svg, woff, and woff2
          test: /\.(woff2?|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
          include,
          exclude,

          use: {
            loader: 'file-loader',
            options
          }
        }
      ]
    }
  }
}

exports.generateSourceMaps = function({ type }) {
  return { devtool: type }
}

exports.extractBundles = function({ bundles, options }) {
  const entry = {}
  const names = []

  // Set up entries and names.
  bundles.forEach(({ name, entries }) => {
    if (entries) {
      entry[name] = entries
    }

    names.push(name)
  })

  return {
    // Define an entry point needed for splitting.
    entry,
    plugins: [
      // Extract bundles.
      new webpack.optimize.CommonsChunkPlugin(
        Object.assign({}, options, { names })
      )
    ]
  }
}

exports.loadJavaScript = function({ include, exclude }) {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include,
          exclude,
          loader: 'babel-loader',
          options: {
            // Enable caching for improved performance during development. It uses default
            // OS directory by default. If you need something more custom, pass a path to
            // it. I.e., { cacheDirectory: '<path>' }
            cacheDirectory: true
          }
        }
      ]
    }
  }
}

exports.clean = function(path) {
  return {
    plugins: [new CleanWebpackPlugin([path])]
  }
}

exports.minifyJavaScript = function({ useSourceMap }) {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: useSourceMap,
        compress: {
          warnings: false
        }
      }),
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  }
}

exports.setFreeVariable = function(key, value) {
  const env = {}
  env[key] = JSON.stringify(value)

  return {
    plugins: [new webpack.DefinePlugin(env)]
  }
}

exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false
    })
  ]
})
