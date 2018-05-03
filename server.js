const express = require('express');
const app = express();
const habitat = require('habitat');
const morgan = require('morgan');
const helmet = require('helmet');

habitat.load('.env');

app.use(morgan('combined'));

app.use(helmet({
  dnsPrefetchControl: {
    allow: false
  },
  frameguard: {
    action: 'deny'
  },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31560000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  xssFilter: true,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'none\''],
      scriptSrc: [
        '\'self\'',
        '\'unsafe-inline\'',
        '\'unsafe-eval\'',
        '*.shpg.org',
        'https://www.google-analytics.com'
      ],
      connectSrc: ['\'self\''],
      baseUri: ['\'self\''],
      styleSrc: ['\'self\'', '\'unsafe-inline\'', 'https://use.fontawesome.com'],
      fontSrc: ['\'self\'', 'https://use.fontawesome.com'],
      imgSrc: ['\'self\'', 'data:', '*.shpg.org'],
      objectSrc: ['\'self\''],
      sandbox: ['allow-scripts', 'allow-same-origin']
    }
  }
}));

app.use(express.static(__dirname + '/dist', {
  etag: true,
  lastModified: true,
  maxAge: '1d'
}));

app.get('/', (req, res) => {
   res.sendfile(__dirname + '/public/index.html');
});

app.listen(process.env.PORT);
console.log('Listening on port ' + process.env.PORT);