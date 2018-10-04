const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const app = express();
let port = process.env.PORT || 3000;

app.use(bodyParser.text());

app.get('/', (req, res) => {
  res.send('App running');
});

app.post('/proxy', (req, res, next) => {

  let delay = getRandomInt(2000, 10000);

  setTimeout(function() {

    console.log('Request sent after ' + delay + 'ms');

    try {
      request({
        'url': req.body.url,
        'proxy': `http://${req.body.ip}`,
        'encoding': 'utf8'
      },
      (error, response, body) => {
        if(response !== undefined) {
          res.text(response.body);
        } else {
          console.log('Wrong proxy configuration sent.');
          res.text('Wrong proxy configuration sent.');
        }
      });
    } catch(e) {
      res.text(e);
    }
  }, delay);

});

app.listen(port, () => console.log('App listening on ' + port))

// Utility
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
