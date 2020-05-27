const app = require('express')();
const axios = require("axios");
const bodyParser = require('body-parser');

const compareCandles = require('./patternRecognition');
const oanda = require('./oandaAPI');
const placeOrders = require('./placeOrders');

app.use(bodyParser.json());

let watchList = ['EUR_JPY', 'EUR_AUD', 'EUR_USD', 'AUD_CAD', 'AUD_JPY', 'AUD_USD', 'USD_CAD'];

let sellOrder = [];
let buyOrder = [];

setInterval(() => {
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    if(!(minutes % 15) && (seconds > 0 && seconds <= 30)){
        watchList.forEach(async currency => {
            try {
                const priceData = await oanda.getPriceData(currency, 3);
                
                if(compareCandles(priceData[0], priceData[1])) {
                    let so = {currency, order: placeOrders.sellOrder(priceData[0], priceData[1])};
                    let bo = {currency, order: placeOrders.buyOrder(priceData[0], priceData[1])};
                    sellOrder.push(so);
                    buyOrder.push(bo);

                    //await oanda.createPendingOrder(currency, -100, sellOrder.entryPoint, sellOrder.tp, sellOrder.sl);
                    //await oanda.createPendingOrder(currency, 100, buyOrder.entryPoint, buyOrder.tp, buyOrder.sl);
                } else {
                    console.log('No pattern detected')
                }
            } catch (err) {
                console.log(err.TypeError)
            }
        })
    }
}, 1000 * 30);

setInterval(() => {
    if(sellOrder.length) {
        sellOrder.forEach(async ({currency, order}, index) => {
            try{
                let {bid} = await oanda.getCurrentPrice(currency);
                if(order.entryPoint >= bid.c) {
                    let response = await oanda.createMarketOrder(currency, -2000, order.tp, order.sl);
                    if(response.status === 201) {
                        console.log(`New sell order on ${currency} successfully placed...`)
                        buyOrder.splice(index, 1);
                        sellOrder.splice(index, 1);
                    }
                }
            } catch (err) {
                console.log(err)
            }
        })
    } 

    if(buyOrder.length) {
        buyOrder.forEach(async ({currency, order}, index) => {
            try {
                let {ask} = await oanda.getCurrentPrice(currency);
                if(order.entryPoint <= ask.c) {
                    let response = await oanda.createMarketOrder(currency, 2000, order.tp, order.sl);
                    if(response.status === 201) {
                        console.log(`New buy order on ${currency} successfully placed...`)
                        buyOrder.splice(index, 1);
                        sellOrder.splice(index, 1);
                    }
                }
            } catch (err) {
                console.log(err)
            }
        })
    }
}, 1000 * 5)


const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`App is running on port ${port}!`));