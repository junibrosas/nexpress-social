const path = require('path');
const CURRENT_WORKING_DIR = process.cwd();
const nodeExternals = require('webpack-node-externals');

const config = {
  name: 'api',
  entry: [ path.join(CURRENT_WORKING_DIR, './src/server.js') ],
  output: {
    path: path.join(CURRENT_WORKING_DIR, '/dist/'),
    filename: 'server.generated.js',
    publicPath: '/dist/',
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals()], // to exclude node_modules when bundling the server
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }]
      },
      {
        test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
        use: 'file-loader'
      }
    ]
  }
}

module.exports = config;
