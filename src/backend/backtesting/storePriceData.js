const app = require('express')();
const fs = require('fs');
const oanda = require('./oandaAPI');
const bodyParser = require('body-parser');


app.use(bodyParser.json());

let watchList = ['EUR_JPY', 'EUR_CAD', 'EUR_AUD', 'EUR_GBP', 'EUR_USD', 'AUD_CAD', 'AUD_JPY', 'AUD_USD', 'CAD_JPY', 'USD_CAD'];

watchList.forEach(async (currency) => {
     try {
        let data = await oanda.getPriceData(currency, 1500)
        await fs.writeFile(`${currency}.json`, JSON.stringify(data), 'utf8', err => {
            if(err) console.log(err)

            console.log('Saved: ', currency)
        })
     } catch (err) {
         console.error(err)
     }

 })
