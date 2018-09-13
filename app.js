const express = require('express');
const request = require('request');
const app = express();
let port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  request({
    'url':'https://www.google.com/search?q=relgrowth&hl=en&gl=US',
    'proxy':'http://115.77.191.180:53281'
  },
  function (error, response, body) {
        console.log(body);
        res.send(body);
  })

})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
