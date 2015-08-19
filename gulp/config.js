var dest = './build';
var src = './src';

module.exports = {

  js: {
    src: src + '/js/**',
    dest: src,
    uglify: false
  },

  riot: {
    output: src + '/tagjs'
  },

  webpack: {
    entry: src + '/main.js',
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