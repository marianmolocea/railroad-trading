const compareCandles = (item1, item2) => {

    //Calculate the Candles body size
	let bodySize = ({mid}) => {
		let decimals = mid.o.split('.')[1].length;
		let multiplier = decimals === 3 ? 10000 : 1000000
        return Math.round((+mid.o - +mid.c) * multiplier) / 100;
    }
    
    //Compare the size of the candles
    let bodySizeComparison = (item1, item2) => {

        let previous = Math.abs(bodySize(item1))
        let current = Math.abs(bodySize(item2))
    
        if(Math.min(current, previous) > 3) {
            //Calculate the Candles body average size
            //let bodySizeAverage = () => (previous + current) / 2
            
            //Calculate the difference between the size of the body of the candles
            let difference = Math.abs(previous - current);
            
            //Calculate the Percentage
            let diffPercentage = difference /  Math.max(previous, current);
            return {diffPercentage, difference}
        } else {
            return {diffPercentage: 100, difference: 100}
        }
    }

	let totalSize = ({mid}) => {
		let decimals = mid.o.split('.')[1].length;
		let multiplier = decimals === 3 ? 10000 : 1000000
        return Math.round((+mid.h - +mid.l) * multiplier) / 100;
    }
    
    let totalSizeComparison = (item1, item2) => {

        let current = totalSize(item1);
        let previous = totalSize(item2);

        //let totalSizeAverage = () => (current + previous) / 2
        
        //Calculate the difference between the size of the body of the candles
        let difference = Math.abs(current - previous);
        
        //Calculate the Percentage
        let diffPercentage = difference / Math.max(current, previous);
        return diffPercentage;
    }

    let areOppositeCandles = (item1, item2) => {
        return (bodySize(item1) < 0 && bodySize(item2) > 0) ||
            (bodySize(item1) > 0 && bodySize(item2) < 0)
    }

    let {diffPercentage, difference} = bodySizeComparison(item1, item2);
    let totalComparison = totalSizeComparison(item1, item2);
    let areOpposite = areOppositeCandles(item1, item2);

    if((diffPercentage <= 0.05 || difference <= 1) && totalComparison <= 0.30 && areOpposite) {
        //console.log('Trade 1', bodyComparison)
        return 'trade'
    } else if((diffPercentage <= 0.08 || difference <= 1.5) && totalComparison <= 0.10 && areOpposite) {
        //console.log('Trade 2',bodyComparison, totalComparison)
        return 'trade'
    } else {
        return `Difference: ${difference} || Diff %: ${diffPercentage} || Total size %: ${totalComparison} || Are Opposite: ${areOpposite}`
    }
}

module.exports = compareCandles;