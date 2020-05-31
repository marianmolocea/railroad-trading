const app = require('express')();
const axios = require("axios");
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let baseUrl = 'https://demo-api.ig.com/gateway/deal/'
let apiKey = '2fec0f30f75bb25a70d31c60567a01054770953e';
let identifier = 'bot-user1';
let password = 'Bethebest10';
let xSecurityToken = '';
let cst = '';
let accountData = {};

let headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept': 'application/json; charset=UTF-8',
    'X-IG-API-KEY': apiKey
}

let watchList = ['EURUSD','EURGBP','GBPUSD','USDCAD','USDCHF','USDJPY','AUDUSD','AUDJPY','NZDUSD',]

const getEpic = (currency) => `CS.D.${currency}.CFD.IP`;

const login = async () => {
    try {
        const response = await axios({
            method: 'POST',
            url: `${baseUrl}session`,
            data: {
                identifier,
                password
            },
            headers: {
                'VERSION': 2,
                ...headers
            }
        })
        if(response.status === 200) {
            xSecurityToken = response.headers['x-security-token'];
            cst = response.headers.cst;
            accountData = response.data;
            console.log('Successfully connected..')
            return true;
        }
    } catch (err) {
        console.log(err);
    }
}

const logout = async () => {
    try {
        const response = await axios({
            method: 'DELETE',
            url: `${baseUrl}session`,
            headers: {
                'VERSION': 1,
                'X-SECURITY-TOKEN': xSecurityToken,
                'CST': cst,
                ...headers
            }
        })
        if(response.status === 204) {
            console.log('You are successfully logout!')
        }
    } catch (err) {
        console.log(err.response.config);
    }
}

exports.getCurrencyPrices = async (currency, startDate, endDate, resultsPerPage) => {
    
    if(!xSecurityToken) await login();

    try {
        const response = await axios({
            method: 'GET',
            url: `${baseUrl}prices/${getEpic(currency)}?resolution=MINUTE_15&from=${startDate}&to=${endDate}&pageSize=${resultsPerPage}`,
            headers: {
                'VERSION': 3,
                'X-SECURITY-TOKEN': xSecurityToken,
                'CST': cst,
                ...headers
            }
        })
        let prices = response.data.prices
        return prices;
    } catch (err) {
        console.log(err);
    }
    
}


exports.sendOrder = async () => {
    try {

    } catch (err) {
        
    }
}