var path = require("path");
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
  /**
    Entry points are aliases for pages.
  */
  entry: {
    '/home' : './src/js/index.js',
    '/about' : './src/js/about.js'
  },
  output: {
    path: 'dist',
    filename: '/assets/js/[name].bundle.js'
  },
  plugins: [
    /**
      ejs-compiled loader takes care of processing .ejs files before
      the html-webpack-plugin takes over and writes the resulting html
      into a file

      Place generated HTML pages here.
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
      hash: true, //append hash to filename for cache-busting
      inject: 'body',
      foo: true
    }),
    new HtmlPlugin({
      title: 'About',
      filename: 'about/index.html',
      chunks: ['/about'],
    }),
    /**
      Webpack's default behavior for stylesheets is to inline them w/ the pages
      ie create a <style> tag in <head> and inject the styles required in JS.

      Using ExtractTextPlugin will override said behavior and will output individual
      stylesheets.

      Settings for extracted css here
    */
    new ExtractTextPlugin('assets/stylesheets/[name].css', {
      publicPath: 'assets/stylesheets/',
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
  },
  resolve: {
    /**
      Resolve path to /src so imports/requires can get modules w/o knowledge
      of module directory
    */
    root: [
      path.resolve('./src')
    ]
  }
};
