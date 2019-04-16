const StellarSdk = require('stellar-sdk');
const fs = require('fs');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

let counter = 0;
setInterval(() => {
if (counter >= 10)
    throw 'stopped due to enough wallets';

    fs.readFile('./wallets.json', 'utf8', function (err, data) {
      if (err)
          console.log(err);
      const file = JSON.parse(data);

      const pair = StellarSdk.Keypair.random();
      let privateKey = pair.secret();
      let address = pair.publicKey().toString();
      let privateKey_string = privateKey.toString();
      let wallet = {
        address: address,
        privateKey: privateKey_string
      }
      console.log(wallet);

      //
      const fetch = require('node-fetch');
      (async () => { 
        try {
          const response = await fetch(
            `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`
          );
          const responseJSON = await response.json();
          //console.log("SUCCESS! You have a new account :)\n", responseJSON);
        } catch (e) {
          console.error("ERROR!", e);
        }

        const account = await server.loadAccount(pair.publicKey());
        console.log("Balances for account: " + pair.publicKey());
        account.balances.forEach(function(balance) {
          //console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
        });
      })();
      //

      file.wallets.push(wallet);
      const json = JSON.stringify(file);

      fs.writeFile('./wallets.json', json, 'utf8', function(err) {
        if (err) {
          console.log(err);
      } else {
        console.log('wrote to wallets.json file');
        fs.readFile('./addresses.json', 'utf8', function (err, data1) {
          if (err)
              console.log(err);

          const file1 = JSON.parse(data1);
          file1.addresses.push(address);
          const json1 = JSON.stringify(file1);

          fs.writeFile('./addresses.json', json1, 'utf8', function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('wrote to addresse.json file');
            }
          });
        });
      }
    });
  });
  counter++;
}, 100);

/*const fetch = require('node-fetch');
(async () => { 
  try {
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`
    );
    const responseJSON = await response.json();
    console.log("SUCCESS! You have a new account :)\n", responseJSON);
  } catch (e) {
    console.error("ERROR!", e);
  }

  const account = await server.loadAccount(pair.publicKey());
  console.log("Balances for account: " + pair.publicKey());
  account.balances.forEach(function(balance) {
    console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
  });
})()*/