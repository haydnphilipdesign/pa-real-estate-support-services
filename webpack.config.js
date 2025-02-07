{
  test: /\.(sa|sc|c)ss$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: false, // Set to false for global CSS
        importLoaders: 1
      }
    },
    'sass-loader'
  ]
} 