const tpMargin = 25;

const convertPips = (currency, pips) => {
    let price = currency.bid.o;
    return price.split('.')[1].length > 3 ? pips / 10000 : pips / 100;
}

const priceFormat = (currency, price) => {
    let decimals = currency.bid.o.split('.')[1].length;
    return decimals > 3 ? price.toFixed(5) : price.toFixed(3);
}

exports.sellOrder = (previous, current) => {
    let entryPoint = Math.min(+current.bid.l, +previous.bid.l) - convertPips(current, 2);
    let tp = entryPoint - (+current.ask.h - +current.bid.h) - convertPips(current, tpMargin);
    let sl = +current.ask.h + (+current.ask.h - +current.bid.h) + convertPips(current, 2);
    return {
        entryPoint: priceFormat(current, entryPoint), 
        tp: priceFormat(current, tp), 
        sl: priceFormat(current, sl)}
}

exports.buyOrder = (previous, current) => {
    let entryPoint = Math.max(+current.ask.h, +previous.ask.h) + convertPips(current, 2);
    let tp = entryPoint + (+current.ask.l - +current.bid.l) + convertPips(current, tpMargin);
    let sl = +current.bid.l - (+current.ask.l - +current.bid.l) - convertPips(current, 2);
    return {
        entryPoint: priceFormat(current, entryPoint), 
        tp: priceFormat(current, tp), 
        sl: priceFormat(current, sl)}
}