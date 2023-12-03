const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/index.js', // Update with your entry file
  output: {
    path: path.resolve(__dirname, 'dist'), // Update with your output directory
    filename: 'bundle.js', // Update with your desired output filename
  },
};
