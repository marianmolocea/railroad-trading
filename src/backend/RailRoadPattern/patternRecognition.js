const compareCandles = (item1, item2) => {

    //Calculate the Candles body size
    let bodySize = ({mid}) => {
        return Math.round((+mid.o - +mid.c) * 10000) / 100;
    }
    
    //Compare the size of the candles
    let bodySizeComparison = (item1, item2) => {

        let previous = Math.abs(bodySize(item1))
        let current = Math.abs(bodySize(item2))
    
        if(current > 3) {
            //Calculate the Candles body average size
            //let bodySizeAverage = () => (previous + current) / 2
            
            //Calculate the difference between the size of the body of the candles
            let difference = Math.abs(previous - current);
            
            //Calculate the Percentage
            let diffPercentage = difference /  Math.max(previous, current);
            return diffPercentage
        } else {
            return 1
        }
    }

    let totalSize = ({mid}) => {
        return Math.round((+mid.h - +mid.l) * 10000) / 100;
    }
    
    let totalSizeComparison = (item1, item2) => {

        let current = totalSize(item1);
        let previous = totalSize(item2);

        //let totalSizeAverage = () => (current + previous) / 2
        
        //Calculate the difference between the size of the body of the candles
        let difference = Math.abs(current - previous);
        
        //Calculate the Percentage
        let diffPercentage = difference / Math.max(current, previous);
        return diffPercentage
    }

    let areOppositeCandles = (item1, item2) => {
        return (bodySize(item1) < 0 && bodySize(item2) > 0) ||
            (bodySize(item1) > 0 && bodySize(item2) < 0)
    }

    let bodyComparison = bodySizeComparison(item1, item2);
    let totalComparison = totalSizeComparison(item1, item2);
    let areOpposite = areOppositeCandles(item1, item2);

    if(bodyComparison <= 0.05 && areOpposite) {
        //console.log('Trade 1', bodyComparison)
        return true
    } else if(bodyComparison < 0.081 && totalComparison <= 0.10 && areOpposite) {
        //console.log('Trade 2',bodyComparison, totalComparison)
        return true
    } else {
        return false
    }
}

module.exports = compareCandles;