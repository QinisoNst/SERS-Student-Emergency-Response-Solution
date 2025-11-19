
const {https} = require('firebase-functions');
const {default: next} = require('next');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

// The Next.js app directory is located relative to the functions directory
const appDir = path.join(__dirname, '..', 'app');

const server = next({
  dev: isDev,
  conf: {distDir: '.next'},
  // The 'app' directory becomes the CWD for the Next.js server
  customServer: true,
  dir: appDir,
});

const nextjsHandle = server.getRequestHandler();

exports.nextServer = https.onRequest((req, res) => {
  return server.prepare().then(() => nextjsHandle(req, res));
});
