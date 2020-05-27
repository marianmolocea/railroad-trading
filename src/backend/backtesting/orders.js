const audjpy = require('../data/AUD_JPY.json');
const audusd = require('../data/AUD_USD.json');
const audcad = require('../data/AUD_CAD.json');
const eurusd = require('../data/EUR_USD.json');
const eurjpy = require('../data/EUR_JPY.json');
const eurgbp = require('../data/EUR_GBP.json');
const euraud = require('../data/EUR_AUD.json');
const eurcad = require('../data/EUR_CAD.json');
const gbpusd = require('../data/GBP_USD.json');
const usdcad = require('../data/USD_CAD.json');
const cadjpy = require('../data/CAD_JPY.json');

const pattern = require('../patternRecognition');

let watchList = [
    {currency: audjpy, name: 'audjpy'}, 
    {currency: eurusd, name: 'eurusd'},
    {currency: gbpusd, name: 'gbpusd'}, 
    {currency: usdcad, name: 'usdcad'}, 
    {currency: audusd, name: 'audusd'}, 
    {currency: eurcad, name: 'eurcad'}, 
    {currency: audcad, name: 'audcad'}, 
    {currency: euraud, name: 'euraud'}];

let tpMargin = 20

console.log(watchList.map(({currency, name}) => {
let patternsArr = currency.filter((item, index) => index > 0 && pattern(item, currency[index - 1]));

const convertPips = (currency, pips) => {
    let price = currency.bid.o;
    return price.split('.')[1].length > 3 ? pips / 10000 : pips / 100;
}

const priceFormat = (currency, price) => {
    let decimals = currency.mid.o.split('.')[1].length;
    let multiplier = decimals > 3 ? 10000 : 100
    return Math.round(price * multiplier) / multiplier;
}

const sellOrder = (item) => {
    let entryPoint = +item.bid.l - convertPips(item, 2);
    let tp = entryPoint - convertPips(item, tpMargin);
    let sl = +item.bid.h + convertPips(item, 2);
    return {entryPoint, tp, sl}
}

const buyOrder = (item) => {
    let entryPoint = +item.ask.h + convertPips(item, 2);
    let tp = entryPoint + convertPips(item, tpMargin);
    let sl = +item.bid.l - convertPips(item, 2);
    return {entryPoint, tp, sl}
}

const checkOrderTriggered = (item, buyOrder, sellOrder) => {
    return +item.bid.l <= sellOrder.entryPoint ? 'sell' :
        +item.ask.h >= buyOrder.entryPoint ? 'buy' : false;
}

const checkResult = (initialItem, currentItem) => {
    if(checkOrderTriggered(currentItem, buyOrder(initialItem), sellOrder(initialItem)) === 'sell') {
        let order = sellOrder(initialItem);
        if(+currentItem.ask.l <= order.tp) {
            let result = order.entryPoint - order.tp;
            //console.log('Sell - Take Profit hit:', result);
            return result;
        } else if(+currentItem.ask.h >= order.sl) {
            let result = order.entryPoint - order.sl;
            //console.log('Sell - Stop Loss hit:', result);
            return result;
        }
    } else if(checkOrderTriggered(currentItem, buyOrder(initialItem), sellOrder(initialItem)) === 'buy') {
        let order = buyOrder(initialItem);
        if(+currentItem.bid.h >= order.tp) {
            let result = order.tp - order.entryPoint;
            //console.log('Buy - Take Profit hit:', result);
            return result;
        } else if(+currentItem.bid.l <= order.sl) {
            let result = order.sl - order.entryPoint;
            //console.log('Buy - Stop Loss hit:', result);
            return result;
        }
    } else {
        return false
    }
}

//el => pattern candle 

let results = patternsArr.map(el => {
    let nextIndex = currency.indexOf(el) + 1;
    let result = 0;
    while(!result && nextIndex !== currency.length) {
        result = checkResult(el, currency[nextIndex]);
        nextIndex = nextIndex + 1;
        if(result) {
            return result
        }
    }
})

//console.log(results, results.length);

let lost = results.filter(item => item < 0).length;
let win = results.filter(item => item > 0).length;

let winRate = `${name} - Win trades ${Math.round(win / results.length * 10000) / 100}% / Lost trades ${Math.round(lost / results.length * 10000) / 100}%`

let totals = results.reduce((total, item) => total + item, 0);
let total = totals < 10 ? totals * 10000 : totals > 1000 ? totals / 100 : totals;
let message = total > 0 ? 
        `Total profits form ${results.length} positions: ${total} pips` : 
        `Total losses form ${results.length} positions: ${total} pips`

return `${winRate} \n ${message}`
}))