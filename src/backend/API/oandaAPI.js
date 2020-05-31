const app = require('express')();
const axios = require("axios");
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let baseUrl = 'https://api-fxpractice.oanda.com/v3/accounts/'
let apiKey = 'a54ac62121bd05632b65207b850648c7-7f97a4217216ddc96299ba0631aa0c2f';
let accountId = '101-004-14955831-001';

let headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'Connection': 'Keep-Alive'
}

exports.getAccountData = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${baseUrl}${accountId}`,
            headers
        })
        if(response.status === 200) {
            console.log('Successfully connected..')
            return true;
        }
    } catch (err) {
        console.log(err.response.config, err.response.data);
    }
}

exports.getPriceData = async (currency, count, timeFrame) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${baseUrl}${accountId}/instruments/${currency}/candles?granularity=${timeFrame}&price=MBA&count=${count}`,
            headers
        })
        if(response.status === 200) {
            console.log(`${currency} - Prices data successfully retrieved..`);
            return response.data.candles;
        }
    } catch (err) {
        console.log(err.response.config, err.response.data);
    }
}

exports.getCurrentPrice = async (currency) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${baseUrl}${accountId}/candles/latest?candleSpecifications=${currency}:S5:BA`,
            headers
        })
        if(response.status === 200) {
            console.log(`${currency} - Prices data successfully retrieved..`);
            return response.data.latestCandles[0].candles[1];
        }
    } catch (err) {
        console.log(err.response.config, err.response.data);
    }
}

exports.createPendingOrder = async (currency, volume, entryPrice, tp, sl) => {
    try {
        const response = await axios({
            method: 'POST',
            url: `${baseUrl}${accountId}/orders`,
            headers,
            data: {
                "order": {
                  "price": entryPrice,
                  "stopLossOnFill": {
                    "timeInForce": "GTC",
                    "price": sl
                  },
                  "takeProfitOnFill": {
                    "price": tp
                  },
                  "timeInForce": "GTC",
                  "instrument": currency,
                  "units": volume,
                  "type": "STOP",
                  "positionFill": "DEFAULT"
                }
              }
        })
        if(response.status === 201) {
            console.log('Order successfully placed..');
            //console.log(response)
            return true;
        }
    } catch (err) {
        console.log(err.response.config, err.response.data);
    }
}

exports.createMarketOrder = async (currency, volume, tp, sl) => {
    try {
        const response = await axios({
            method: 'POST',
            url: `${baseUrl}${accountId}/orders`,
            headers,
            data: {
                "order": {
                    "units": volume,
                    "instrument": currency,
                    "timeInForce": "FOK",
                    "type": "MARKET",
                    "positionFill": "DEFAULT"
                  }
              }
        })
        if(response.status === 201) {
            let tradeId = await response.data.orderFillTransaction.tradeOpened.tradeID;
            setStopLose(tradeId, sl);
            setTakeProfit(tradeId, tp);
            console.log(`${currency} - ${volume} - Order successfully placed..`);
            return response;
        }
    } catch (err) {
        console.log(err);
    }
}

const setStopLose = async (id, sl) => {
    try {
        const response = await axios({
            method: 'POST',
            url: `${baseUrl}${accountId}/orders`,
            headers,
            data: {
                "order": {
                  "timeInForce": "GTC",
                  "price": sl,
                  "type": "STOP_LOSS",
                  "tradeID": id
                }
              }
        })
        if(response.status === 201) {
            console.log('Stop Loss successfully placed..');
        }
    } catch (err) {
        console.log(err);
    }
}

const setTakeProfit = async (id, tp) => {
    try {
        const response = await axios({
            method: 'POST',
            url: `${baseUrl}${accountId}/orders`,
            headers,
            data: {
                "order": {
                  "timeInForce": "GTC",
                  "price": tp,
                  "type": "TAKE_PROFIT",
                  "tradeID": id
                }
              }
        })
        if(response.status === 201) {
            console.log('Take profit successfully placed..');
        }
    } catch (err) {
        console.log(err);
    }
}