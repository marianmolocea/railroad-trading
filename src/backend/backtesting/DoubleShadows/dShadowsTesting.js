const audjpy = require('../../data/AUD_JPY.json');
const audusd = require('../../data/AUD_USD.json');
const audcad = require('../../data/AUD_CAD.json');
const eurusd = require('../../data/EUR_USD.json');
const eurjpy = require('../../data/EUR_JPY.json');
const eurgbp = require('../../data/EUR_GBP.json');
const euraud = require('../../data/EUR_AUD.json');
const eurcad = require('../../data/EUR_CAD.json');
const gbpusd = require('../../data/GBP_USD.json');
const usdcad = require('../../data/USD_CAD.json');
const cadjpy = require('../../data/CAD_JPY.json');

const ds = require('./dsPatternRecognition');

let watchList = [
    {currency: audjpy, name: 'audjpy'}, 
    {currency: eurusd, name: 'eurusd'},
    {currency: gbpusd, name: 'gbpusd'}, 
    {currency: usdcad, name: 'usdcad'}, 
    {currency: audusd, name: 'audusd'}, 
    {currency: eurcad, name: 'eurcad'}, 
    {currency: audcad, name: 'audcad'}, 
    {currency: euraud, name: 'euraud'},
    {currency: eurjpy, name: 'eurjpy'},
    {currency: eurgbp, name: 'eurgbp'},
    {currency: cadjpy, name: 'cadjpy'},
];
let parity = euraud;

console.log(watchList.map(({currency, name}) => {
let patternsFound = currency
    .filter((item, index, arr) => {
        //console.log('PRICE DATA ARR', arr.slice(index - 15, 15));
        return index >= 15 && ds.patternTesting(item, arr[index - 1], arr.slice(index - 15, index))
    });

let results = patternsFound.map(el => {
    let nextIndex = currency.indexOf(el) + 1;
    let currentIndex = currency.indexOf(el);
    let previousIndex = currency.indexOf(el) - 1;
    let result = 0;
    while(!result && nextIndex !== currency.length) {
        result = ds.checkResults(
            currency[previousIndex],
            el, 
            currency[nextIndex], 
            ds.orderDetails(
                el, 
                currency[previousIndex],
                currency.slice(currentIndex - 15, currentIndex)
            )
        );
        nextIndex = nextIndex + 1;
        if(result) {
            return result
        }
    }
})

//console.log(results.reduce((total, value) => total + value, 0) * 10000)

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