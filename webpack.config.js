var HtmlPlugin = require('html-webpack-plugin');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  /**
    Define custom data to be used by the ff plugins:
     html-webpack-plugin : accessible via webpackConfig.customData
  */
  customData : {
    env: 'development'
  },
  entry: {
    '/home' : './src/index.js',
    '/about' : './src/about.js'
  },
  output: {
    path: 'dist',
    filename: '[name].bundle.js'
  },
  plugins: [
    /**
      Place generated HTML pages here
    */
    new HtmlPlugin({
      /**
        Use .ejs to include partials
      */
      template: 'ejs-compiled!./src/templates/root.ejs',
      filename: 'index.html',
      /**
        The chunks property enumerates w/c assets to write into the template.
        In this case, only include files related to the '/home' chunk.
      */
      chunks: ['/home'],
      hash: true,
      inject: 'body',
      foo: true
    }),
    new HtmlPlugin({
      title: 'About',
      filename: 'about/index.html',
      chunks: ['/about'],
    }),
    /**
      Settings for extracted css here
    */
    new ExtractTextPlugin('stylesheets/[name].css', {
      publicPath: 'stylesheets/',
      allChunks: true
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js/,
        loader: 'babel',
        include: __dirname + '/src'
      },
      {
        test: /\.scss$/i,
        loader: ExtractTextPlugin.extract('style','css!sass')
      }
    ]
  }
};
