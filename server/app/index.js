'use strict';
const path = require('path');
const express = require('express');
const app = express();

const isDeveloping = process.env.NODE_ENV !== 'production';
const isTestingServer = process.env.TESTING === 'testing';
console.log('Development Server is: ', process.env.NODE_ENV)

module.exports = app;

// Pass our express application pipeline into the configuration
// function located at server/app/configure/index.js
require('./configure')(app);

// Routes that will be accessed via AJAX should be prepended with
// /api so they are isolated from our GET /* wildcard.
app.use('/api', require('./routes'));
/*
 This middleware will catch any URLs resembling a file extension
 for example: .js, .html, .css
 This allows for proper 404s instead of the wildcard '/*' catching
 URLs that bypass express.static because the given file does not exist.
 */
app.use(function (req, res, next) {

    if (isDeveloping) {
        next();
    } else {
        if (path.extname(req.path).length > 0) {
            res.status(404).end();
        } else {
            next(null);
        }
    }

});

express.static.mime.define({
    'application/x-font-woff': ['woff', 'woff2'],
    'application/font-woff': ['woff','woff2'],
    'application/x-font-truetype': ['ttf']
});
// webpack hot loading middleware
if (isDeveloping && !isTestingServer) {
  const config = require('../../webpack.config.js');
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../../dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '../../dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}


// Error catching endware.
app.use(function (err, req, res, next) {
    console.error(err)
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});

app.use('/lib', express.static(__dirname + '/browser'))
