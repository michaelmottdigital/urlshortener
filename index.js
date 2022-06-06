require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const dns = require('node:dns')
const shortid = require('shortid')
const url = require('node:url')
const app = express();

// Basic Configuration
const port = 8080;


let shortIds = []


app.use(cors());

app.use(bodyParser.urlencoded({ extended: "false" }));
//app.use(bodyParser.json());


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


app.post('/api/shorturl', (req, res) => {

  console.log('*** ids: ', shortIds)
  longURL = req.body.url

  urlParsed = url.parse(longURL)
  
  //urlParsed = new URL(longURL)
  //console.log('*** long url:', longURL)
  //console.log('*** parsed: ', urlParsed)


  if (urlParsed.host) {
    shortId = shortid.generate()
    shortIds.push({shortId: shortId, longURL: longURL})
    res.json({original_url: req.body.url, short_url: shortId })
  } else {
    res.json({error: 'invalid url' })

  }


  // make sure we have a valid url
 /* dns.lookup(urlParsed.host, (err, address, family) => {
    if (err) {
      res.json({error: 'invalid url' })
    } else {
      shortId = shortid.generate()
      shortIds.push({shortId: shortId, longURL: longURL})
      res.json({original_url: req.body.url, short_url: shortId })
    }
     
  })
*/

})


app.get('/api/shorturl/:shortid', (req, res) => {

  var foundItem = shortIds.find((item, index) => {
    if( item.shortId == req.params.shortid) {
      return true
    }
  })
  res.redirect(foundItem.longURL)

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
