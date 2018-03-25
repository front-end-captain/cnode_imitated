const path = require('path');
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const webpack = require( 'webpack' );
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const cdnConfig = require('./../config').cdn;

// 源代码根目录
const SRC_PATH = path.resolve( 'src' );

// 打包后的输出文件存放目录
const BUILD_PATH = path.resolve( 'build' );

// 线上资源根目录 命名一般为(public / static / assets)  / 必须存在 否则 hmr 将失效
const ASSETS_PATH = cdnConfig.host;

const config = {
  devtool: 'source-map',

  entry: {
    app: SRC_PATH + '/app.js',
    vendor: [
			'react',
			'react-dom',
			'react-router',
			'react-router-dom',
			'redux',
			'react-redux',
			'axios',
			'marked',
		],
  },

  output: {
    path: BUILD_PATH,
    filename: '[name]-[chunkhash:8].js',
    // chunkFilename: '[name]-[hash:8].chunk.js',
    publicPath: ASSETS_PATH
  },

  module: {
		rules: [
			{
        test: /\.(js|jsx)$/,
        enforce: 'pre',
				loader: require.resolve('eslint-loader'),
        include: SRC_PATH,
      },
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: require.resolve('babel-loader'),
				options: {
					compact: true,
				}
			},
      // 由于使用 styled-components 所以要将 css 抽取出来 从外部引入
      // 同时启用 sourceMap 方便调试 css 代码
			{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          Object.assign(
            {
              fallback: {
                loader: require.resolve('style-loader'),
                options: {
                  hmr: false
                }
              },
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 1,
                    minimize: true,
                    spurceMap: false,
                  },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-flexbugs-fixes'),
                      autoprefixer({
                        browsers: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9', // React doesn't support IE8 anyway
                        ],
                        flexbox: 'no-2009',
                      }),
                    ],
                  },
                },
              ],
            },
          )
        )
      },
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]'
        }
			}
		]
	},

  plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new CleanWebpackPlugin(['build']),
    new HtmlWebpackPlugin({
      title: 'cnode',
      inject: true,
      template: path.resolve( __dirname, './../src/template.html' ),
      favicon: path.resolve(__dirname, './../cnode.ico'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new HtmlWebpackPlugin({
			template: "!!ejs-compiled-loader!"  + path.resolve( __dirname, './../src/server.template.ejs' ),
			filename: 'server.ejs',
			favicon: path.resolve(__dirname, './../cnode.ico'),
		}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        comparisons: false,
      },
      output: {
        comments: false,
        ascii_only: true,
      },
      sourceMap: true,
    }),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor'
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			minChunks: Infinity
		}),
		new webpack.NamedModulesPlugin(),
		new NameAllModulesPlugin(),
		new webpack.NamedChunksPlugin(( chunk ) => {
			if ( chunk.name ) {
				return chunk.name;
			}
			return chunk.mapModules( m => path.relative( m.context, m.request ) ).join('_')
		}),
    new ExtractTextPlugin({
			filename: '[name]-[contenthash:5].css',
			ignoreOrder: true,
			allChunks: true
		}),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new BundleAnalyzerPlugin()
  ]
};

module.exports = config;
