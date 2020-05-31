const oanda = require('../API/oandaAPI');

const tradeVolume = 2001

const getPeaks = ({ mid }) => {
  return { high: mid.h, low: mid.l };
};

const convertPips = (price, pips) => {
  return price.split('.')[1].length > 3 ? pips / 10000 : pips / 100;
};

const priceFormat = (price) => {
    let decimals = price.toString().split('.')[1].length;
    return decimals > 3 ? price.toFixed(5) : price.toFixed(3);
}

let bodySize = ({mid}) => {
    let decimals = mid.o.split('.')[1].length;
    let multiplier = decimals === 3 ? 10000 : 1000000
    return Math.round((+mid.o - +mid.c) * multiplier) / 100;
}

let areOppositeCandles = (item1, item2) => {
    return (bodySize(item1) < 0 && bodySize(item2) > 0) ||
        (bodySize(item1) > 0 && bodySize(item2) < 0)
}

const checkTrendDirection = (prices) => {
  let average = prices.slice(0, prices.length - 1).reduce((total, item, i ,arr) => {
      return (total + +item.mid.c / arr.length);
    }, 0);

    if (average > prices[prices.length - 1].mid.c) {
        return 'down';
    } else if (average < prices[prices.length - 1].mid.c) {
        return 'up';
    } else {
        return false;
}
};

let pricesData = '';

const fibonacciRetracement = (prices) => {
  let trend = checkTrendDirection(prices);
  let max = prices.reduce((max, { mid: {h} }) => {
      return +h > max ? +h : max;
  }, 0);

  let min = prices.reduce((min, { mid: {l} }) => {
      return +l < min ? +l : min;
  }, 1000);
  
  return trend === 'down'
  ? max + Math.abs(max - min) * 0.618
  : min + Math.abs(max - min) * 0.382;
};

const shadowComparison = (current, previous, pricesData) => {
  let trend = checkTrendDirection(pricesData);
let currentPeack = getPeaks(current);
let previousPeack = getPeaks(previous);

const checkIfEquals = (current, previous) => {
  return Math.abs(+current - +previous) <= convertPips(current, 0.15);
};

if (checkIfEquals(currentPeack.low, previousPeack.low) && trend === 'down') {
  return 'buy';
} else if (checkIfEquals(currentPeack.high, previousPeack.high) && trend === 'up') {
  return 'sell';
} else {
  //console.log(`The Trend is: ${trend} || ` + 
      //trend === `down`
          //? `Diff between lows = ${Math.abs(currentPeack.low - previousPeack.low)}`
          //: `Diff between hights = ${Math.abs(currentPeack.high - previousPeack.high)}`
      //);
      return false;
  }
};

exports.openOrderIfPattern = async (currency, current, previous, pricesData) => {

  let tpTarget = 20;
  let comparison = shadowComparison(current, previous, pricesData);
  let areOpposite = areOppositeCandles(current, previous);

  let fibTp = priceFormat(+fibonacciRetracement(pricesData));

  let tp = comparison === 'buy' ? 
      Math.abs(+current.ask.c - fibTp) <= convertPips(current.ask.o, tpTarget) ? 
          priceFormat(+current.ask.c + convertPips(current.ask.o, tpTarget)) : fibTp :
      Math.abs(+current.ask.c - fibTp) <= convertPips(current.ask.o, tpTarget) ? 
          priceFormat(+current.ask.c - convertPips(current.ask.o, tpTarget)) : fibTp;

  let sl = comparison === 'buy' ? 
    priceFormat(+getPeaks(current).low + convertPips(current.ask.o, 2)) : 
    priceFormat(+getPeaks(current).high + convertPips(current.ask.o, 2));

  try {
    if (comparison) {
      if (comparison === 'buy' && areOpposite) {
          let response = await oanda.createMarketOrder(currency, tradeVolume, tp, sl);
          if(response.status === 201) {
            console.log(`${currency} BUY order of ${tradeVolume} successfully placed`)
            return true;
          } else {
            console.log(response.status)
            return false;
          }
      } else if (comparison === 'sell' && areOpposite) {
          let response = await oanda.createMarketOrder(currency, (tradeVolume * -1), tp, sl);
          if(response.status === 201) {
            console.log(`${currency} SELL order of -${tradeVolume} successfully placed`);
            return true;
          } else {
            console.log(response.status)
            return false
          }
      } else {
        console.log(`The trend is ${trend} but the pattern is: ${comparison}`);
        return false;
      }
    } else {
      console.log(`The comparison is --- ${comparison}`);
      return false;
    }
  } catch (err) {
    console.log(err)
  }
};