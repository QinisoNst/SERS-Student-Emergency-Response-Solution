
const {https} = require('firebase-functions');
const {default: next} = require('next');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

const server = next({
  dev: isDev,
  // the absolute directory from the package.json file that initializes this module
  // IE: the absolute path from the root of the Cloud Function
  conf: {distDir: path.join(__dirname, '.next')},
});

const nextjsHandle = server.getRequestHandler();

exports.nextServer = https.onRequest((req, res) => {
  return server.prepare().then(() => nextjsHandle(req, res));
});
