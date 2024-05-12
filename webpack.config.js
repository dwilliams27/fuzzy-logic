const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      process: require.resolve('process/browser')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY)
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Previously contentBase
    },
    client: {
      overlay: false,  // Disables the error overlay
    },
    compress: true,
    port: 9000,
    open: true, // Automatically open the browser
    hot: true, // Enable hot module replacement
  },
  stats: 'errors-only',  // Output only errors to the console, no other stats,
  devtool: 'source-map', // This is for production
};
