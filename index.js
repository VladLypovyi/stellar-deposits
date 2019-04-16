const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "q565602",
  database: "meta"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post('/api/btc-address-to-name', (req, res) => {
  let addressBtc = req.body.btcAddr;
  let sqlSearchBtcAddress = `SELECT name FROM btc_wallets WHERE address = '${addressBtc}';`;
  con.query(sqlSearchBtcAddress, function (err, result) {
    if (err) throw err;
    if (result && result.length > 0 && !err) {
      let acc = result[0].name;
      res.send({
        btsId: acc
      });
    } else {
      res.send({
        btsId: 'not found'
      });
    }
  });
});

app.post('/api/eth-address-to-name', (req, res) => {
  let addressEth = req.body.ethAddr;
  let sqlSearchEthAddress = `SELECT name FROM eth_wallets WHERE address = '${addressEth}';`;
  con.query(sqlSearchEthAddress, function (err, result) {
    if (err) throw err;
    if (result && result.length > 0 && !err) {
      let acc = result[0].name;
      res.send({
        btsId: acc
      });
    } else {
      res.send({
        btsId: 'not found'
      });
    }
  });
});

app.post('/api/ltc-address-to-name', (req, res) => {
  let addressLtc = req.body.ltcAddr;
  let sqlSearchEthAddress = `SELECT name FROM ltc_wallets WHERE address = '${addressLtc}';`;
  con.query(sqlSearchEthAddress, function (err, result) {
    if (err) throw err;
    if (result && result.length > 0 && !err) {
      let acc = result[0].name;
      res.send({
        btsId: acc
      });
    } else {
      res.send({
        btsId: 'not found'
      });
    }
  });
});

app.post('/api/xlm-address-to-name', (req, res) => {
  let addressXlm = req.body.xlmAddr;
  let sqlSearchXlmAddress = `SELECT name FROM xlm_wallets WHERE address = '${addressXlm}';`;
  con.query(sqlSearchXlmAddress, function (err, result) {
    if (err) throw err;
    if (result && result.length > 0 && !err) {
      let acc = result[0].name;
      res.send({
        btsId: acc
      });
    } else {
      res.send({
        btsId: 'not found'
      });
    }
  });
});

app.post('/api/btc-init', (req, res) => {
  let account = req.body;
  let initSql = `CREATE TABLE IF NOT EXISTS btc_wallets (
    address VARCHAR(200) NOT NULL,
    privateKey VARCHAR(200) NOT NULL,
    name VARCHAR(200) NOT NULL,
    wif VARCHAR(200) NOT NULL,
    public VARCHAR(200) NOT NULL
  );`;

  con.query(initSql, function (err, result) {
    if (err) throw err;
    console.log("Table initiated/checked (btc_wallets)");
  });

  let sqlSearch = `SELECT address FROM btc_wallets
  WHERE name = '${account.name}';`;

  con.query(sqlSearch, function (err, result) {
    if (err) throw err;

    if (result.length == 0) {
      fs.readFile('./wallets.json', 'utf8', function (err, data) {
        if (err)
          console.log(err);

        const file = JSON.parse(data);
        let freshWallet = file.wallets[0];
        console.log(data);
        console.log(file);
        console.log(file.wallets[0]);
        file.wallets.shift();
        setTimeout(() => {
          const json = JSON.stringify(file);
          fs.writeFile('./wallets.json', json, 'utf8', function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('got 1 address from wallets.json file');
            }
          });
        }, 100);

        if (freshWallet) {
          let newAccount = freshWallet;
          let sqlSearchAddress = `SELECT name FROM btc_wallets WHERE address = '${newAccount.address}';`;

          con.query(sqlSearchAddress, function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
              let sql = `INSERT INTO btc_wallets (address, privateKey, name, wif, public) VALUES ('${newAccount.address}', '${newAccount.private}', '${account.name}', '${newAccount.wif}', '${newAccount.public}');`;
              console.log(sql);
              con.query(sql, function (err, resultInsert) {
                if (err) throw err;

                res.send({
                  address: newAccount.address
                });
                console.log("Inserted new wallet to wallets");
              });
            }
            else {
              res.send({
                address: "out of btc addresses (error 6501)"
              });
            }
          });
        }
      })
    } else if (result.length > 0) {
      res.send({
        address: result[0].address
      });
    } else {
      res.send({
        address: "error!"
      });
    }
    console.log("1 record affected");
  });

})

app.post('/api/eth-init', (req, res) => {
  let account = req.body;
  let initSql = `CREATE TABLE IF NOT EXISTS eth_wallets (
    address VARCHAR(200) NOT NULL,
    privateKey VARCHAR(200) NOT NULL,
    name VARCHAR(200) NOT NULL
  );`;

  con.query(initSql, function (err, result) {
    if (err) throw err;
    console.log("Table initiated/checked (eth_wallets)");
  });

  let sqlSearch = `SELECT address FROM eth_wallets
  WHERE name = '${account.name}';`;

  con.query(sqlSearch, function (err, result) {
    if (err) throw err;

    if (result.length == 0) {
      fs.readFile('./wallets-eth-production.json', 'utf8', function (err, data) {
        if (err)
          console.log(err);

        const file = JSON.parse(data);
        let freshWallet = file.wallets[0];
        console.log(data);
        console.log(file);
        console.log(file.wallets[0]);
        file.wallets.shift();
        setTimeout(() => {
          const json = JSON.stringify(file);
          fs.writeFile('./wallets-eth-production.json', json, 'utf8', function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('got 1 address from wallets-eth-production.json file');
            }
          });
        }, 100);

        if (freshWallet) {
          let newAccount = freshWallet;
          let sqlSearchAddress = `SELECT name FROM eth_wallets WHERE address = '${newAccount.address}';`;

          con.query(sqlSearchAddress, function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
              let sql = `INSERT INTO eth_wallets (address, privateKey, name) VALUES ('${newAccount.address}', '${newAccount.privKey}', '${account.name}');`;
              console.log(sql);
              con.query(sql, function (err, resultInsert) {
                if (err) throw err;

                res.send({
                  address: newAccount.address
                });
                console.log("Inserted new wallet to wallets-eth-production");
              });
            }
            else {
              res.send({
                address: "out of eth addresses (error 6501)"
              });
            }
          });
        }
      })
    } else if (result.length > 0) {
      res.send({
        address: result[0].address
      });
    } else {
      res.send({
        address: "error!"
      });
    }
    console.log("1 record affected");
  });
})

app.post('/api/ltc-init', (req, res) => {
  let account = req.body;
  let initSql = `CREATE TABLE IF NOT EXISTS ltc_wallets (
    address VARCHAR(200) NOT NULL,
    privateKey VARCHAR(200) NOT NULL,
    name VARCHAR(200) NOT NULL
  );`;

  con.query(initSql, function (err, result) {
    if (err) throw err;
    console.log("Table initiated/checked (ltc_wallets)");
  });

  let sqlSearch = `SELECT address FROM ltc_wallets
  WHERE name = '${account.name}';`;

  con.query(sqlSearch, function (err, result) {
    if (err) throw err;

    if (result.length == 0) {
      fs.readFile('./wallets-ltc-production.json', 'utf8', function (err, data) {
        if (err)
          console.log(err);

        const file = JSON.parse(data);
        let freshWallet = file.wallets[0];
        console.log(data);
        console.log(file);
        console.log(file.wallets[0]);
        file.wallets.shift();
        setTimeout(() => {
          const json = JSON.stringify(file);
          fs.writeFile('./wallets-ltc-production.json', json, 'utf8', function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('got 1 address from wallets-ltc-production.json file');
            }
          });
        }, 100);

        if (freshWallet) {
          let newAccount = freshWallet;
          let sqlSearchAddress = `SELECT name FROM ltc_wallets WHERE address = '${newAccount.address}';`;

          con.query(sqlSearchAddress, function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
              let sql = `INSERT INTO ltc_wallets (address, privateKey, name) VALUES ('${newAccount.address}', '${newAccount.privKey}', '${account.name}');`;
              console.log(sql);
              con.query(sql, function (err, resultInsert) {
                if (err) throw err;

                res.send({
                  address: newAccount.address
                });
                console.log("Inserted new wallet to wallets-ltc-production");
              });
            }
            else {
              res.send({
                address: "out of ltc addresses (error 6501)"
              });
            }
          });
        }
      })
    } else if (result.length > 0) {
      res.send({
        address: result[0].address
      });
    } else {
      res.send({
        address: "error!"
      });
    }
    console.log("1 record affected");
  });
})


// Stellar api init
app.post('/api/xlm-init', (req, res) => {
  let account = req.body;
  let initSql = `CREATE TABLE IF NOT EXISTS xlm_wallets (
    address VARCHAR(200) NOT NULL,
    privateKey VARCHAR(200) NOT NULL,
    name VARCHAR(200) NOT NULL
  );`;

  con.query(initSql, function (err, result) {
    if (err) throw err;
    console.log("Table initiated/checked (xlm_wallets)");
  });

  let sqlSearch = `SELECT address FROM xlm_wallets
  WHERE name = '${account.name}';`;

  con.query(sqlSearch, function (err, result) {
    if (err) throw err;

    if (result.length == 0) {
      fs.readFile('./wallets-xlm-production.json', 'utf8', function (err, data) {
        if (err)
          console.log(err);

        const file = JSON.parse(data);
        let freshWallet = file.wallets[0];
        console.log(data);
        console.log(file);
        console.log(file.wallets[0]);
        file.wallets.shift();
        setTimeout(() => {
          const json = JSON.stringify(file);
          fs.writeFile('./wallets-xlm-production.json', json, 'utf8', function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('got 1 address from wallets-xlm-production.json file');
            }
          });
        }, 100);

        if (freshWallet) {
          let newAccount = freshWallet;
          let sqlSearchAddress = `SELECT name FROM xlm_wallets WHERE address = '${newAccount.address}';`;

          con.query(sqlSearchAddress, function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
              let sql = `INSERT INTO xlm_wallets (address, privateKey, name) VALUES ('${newAccount.address}', '${newAccount.privKey}', '${account.name}');`;
              console.log(sql);
              con.query(sql, function (err, resultInsert) {
                if (err) throw err;

                res.send({
                  address: newAccount.address
                });
                console.log("Inserted new wallet to wallets-xlm-production");
              });
            }
            else {
              res.send({
                address: "out of xlm addresses (error 6501)"
              });
            }
          });
        }
      })
    } else if (result.length > 0) {
      res.send({
        address: result[0].address
      });
    } else {
      res.send({
        address: "error!"
      });
    }
    console.log("1 record affected");
  });
})

app.get('/api', function (req, res) {
  res.send('Welcome to META1 API!');
});

app.get('*', function (req, res) {
  res.send('Error 404, wrong route, please use /api');
});


app.listen(process.env.PORT, () => console.log(`Running on port ${process.env.PORT}`));
