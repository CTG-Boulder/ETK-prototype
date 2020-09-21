module.exports = {
  devServer: {
    hot: false
  }
  , configureWebpack: {
    output: {
      globalObject: 'this'
    }
    , module: {
      rules: [
        {
          test: /\.js$/
          , use: [
            'ify-loader'
            , 'transform-loader?plotly.js/tasks/compress_attributes.js'
          ]
        }
      ]
    }
  }
}
