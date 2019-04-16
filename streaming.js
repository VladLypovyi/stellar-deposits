const StellarSdk = require('stellar-sdk')
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const fs = require('fs');
const addresses = require('./addresses.json');

var accountId;

fs.readFile('./addresses.json',
    // callback function that is called when reading file is done
    function(err, data) { 
        // json data
        var jsonData = data;
 
        // parse json
        var jsonParsed = JSON.parse(jsonData);
 
        // access elements
        for (let i = 0; i < jsonParsed.addresses.length; i++) {
          accountId = jsonParsed.addresses[i];
          const es = server.payments()/*.forAccount(accountId)*/
            .cursor('now')
            .stream({
              onmessage: function (message) {
                console.log(message);
              }
            })
          //console.log(accountId);
        }
});




// Get a message any time a payment occurs. Cursor is set to "now" to be notified
// of payments happening starting from when this script runs (as opposed to from
// the beginning of time).
/*const es = server.payments().forAccount(accountId)
  .cursor('now')
  .stream({
    onmessage: function (message) {
      console.log(message);
    }
  })*/


