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

  let delay = getRandomInt(5000, 2000);

  setTimeout(function() {

    console.log('Request sent after ' + delay + 'ms');

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
          console.log('Wrong proxy configuration sent.');
          res.json('Wrong proxy configuration sent.');
        }
      });
    } catch(e) {
      res.json(e);
    }
  }, delay);

});

app.listen(port, () => console.log('App listening on ' + port))

// Utility
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
