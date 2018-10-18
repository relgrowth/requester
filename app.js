const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const iconv = require('iconv-lite');
const app = express();
let port = process.env.PORT || 3000;

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
      'encoding': null,
      'timeout': 5000
    },
    (error, response, body) => {
      if(response !== undefined) {
        let data = iconv.decode(response.body, 'cp1251');
        res.json(data);
      } else {
        console.log('Timeout');
        res.json('Timeout');
      }
    });
  } catch(e) {
    console.log(e);
    res.json(e);
  }

});

app.listen(port, () => console.log('App listening on ' + port))

// Utility
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
