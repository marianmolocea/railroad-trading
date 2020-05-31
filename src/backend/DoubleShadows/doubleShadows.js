const ds = require('./dSPattern');
const oanda = require('../API/oandaAPI');


exports.doubleShadows = () => {

  const isWeekday = (day, hours) => {
    return (day > 0 && day < 5) || (day === 0 && hours > 22) || (day === 5 && hours < 18)
  }

  const isNight = (hours) => {
    return (hours >= 22 || hours <= 8)
  }

  let watchList = [
      'EUR_JPY',
      'EUR_AUD',
      'EUR_USD',
      'AUD_CAD',
      'AUD_JPY',
      'AUD_USD',
      'USD_CAD',
      'GBP_USD',
      'EUR_GBP',
      'EUR_CAD',
    ];
  
  setInterval(() => {
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    let day = new Date().getDay();
    let hours = new Date().hours();
    if (!(minutes % 15) && seconds > 0 && seconds <= 30 && isWeekday(day, hours)) {
      watchList.forEach(async (currency) => {
        try {
          const priceData = await oanda.getPriceData(currency, 16, 'M15');
          const order = await ds
            .openOrderIfPattern(
              currency, 
              priceData[priceData.length - 2], 
              priceData[priceData.length - 3], 
              priceData
            );
          if(order) {
            console.log(`Order successfully executed..`)
          }
        } catch (err) {
          console.log(`Error setInterval: ${err}`)
        }
      })
    }
  }, 1000 * 30)

}