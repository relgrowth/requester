const throng = require('throng');

const WORKERS = process.env.WEB_CONCURRENCY || 1;
const PORT = process.env.PORT || 3000;

throng({
  workers: WORKERS,
  lifetime: Infinity
}, start);

function start() {
  const express = require('express');
  const request = require('request');
  const bodyParser = require('body-parser');
  const iconv = require('iconv-lite');
  const timeout = require('connect-timeout');
  const app = express();

  app.use(timeout(10000, { respond: false }));
  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    res.send('App running');
  });

  app.post('/proxy', (req, res, next) => {

    try {
      request({
        'url': req.body.url,
        'proxy': `http://${req.body.ip}`,
        'encoding': null
      },
      (error, response, body) => {
        if(req.timedout) { return res.json('Wrong proxy configuration sent.'); }
        if(response !== undefined) {
          let data = iconv.decode(response.body, 'cp1251');
          res.json(data);
        } else {
          console.log(error);
          res.json('Wrong proxy configuration sent.');
        }
      });
    } catch(e) {
      res.json(e);
    }

  });

  app.post('/startpage-proxy', (req, res, next) => {

    try {
      request({
        'url': req.body.url,
        'proxy': `http://${req.body.ip}`,
        'encoding': null
      },
      (error, response, body) => {
        if(req.timedout) { console.log('Timeout'); return res.json('Timeout'); }
        if(response !== undefined) {
          let data = iconv.decode(response.body, 'cp1251');
          res.json(data);
        } else {
          console.log(error);
          res.json('Wrong proxy configuration sent.');
        }
      });
    } catch(e) {
      res.json(e);
    }

  });

  app.listen(PORT, () => console.log('App listening on ' + PORT));

  // Utility
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
