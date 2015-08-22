var dest = './build';
var src = './src';
var tmp = './.tmp'

module.exports = {

  js: {
    src: src + '/js/**',
    dest: src,
    uglify: false
  },

  riot: {
    output: src + '/js'
  },

  webpack: {
    entry: src + '/app.js',
    output: {
      filename: 'bundle.js'
    },

    module: {
      loaders: [
        { test: /\.tag$/, loader: 'tag'}
      ]
    },

    resolve: {
      extensions: ['', '.js']
    }
  }
}