function Stats(arr) {
    var self = this;
    var theArray = arr || [];

    //http://en.wikipedia.org/wiki/Mean#Arithmetic_mean_.28AM.29
    self.getArithmeticMean = function() {
        var sum = 0, length = theArray.length;
        for(var i=0;i<length;i++) {
            sum += parseFloat(theArray[i]);
        }
        console.log('sum:' + sum + '   length:' + length);
        return sum/length;
    }

    //http://en.wikipedia.org/wiki/Mean#Geometric_mean_.28GM.29
    self.getGeometricMean = function() {
        var product = 1, length = theArray.length;
        for(var i=0;i<length;i++) {
            product = product * parseFloat(theArray[i]);
        }
        return Math.pow(product,(1/length));
    }

    //http://en.wikipedia.org/wiki/Mean#Harmonic_mean_.28HM.29
    self.getHarmonicMean = function() {
        var sum = 0, length = theArray.length;
        for(var i=0;i<length;i++) {
            sum += (1/parseFloat(theArray[i]));
        }
        return length/sum;
    }

    //http://en.wikipedia.org/wiki/Standard_deviation
    self.getStandardDeviation = function() {
        var arithmeticMean = this.getArithmeticMean();
        var sum = 0, length = theArray.length;
        for(var i=0;i<length;i++) {
            sum += Math.pow(parseFloat(theArray[i])-arithmeticMean, 2);
        }
        return Math.pow(sum/length, 0.5);
    }

    //http://en.wikipedia.org/wiki/Median
    self.getMedian = function() {
        var length = theArray.length;
        var middleValueId = Math.floor(length/2);
        var arr = theArray.sort(function(a, b){return a-b;});
        return arr[middleValueId];
    }

    self.getVariance = function() {
        var length = theArray.length;
        if (length<1) return NaN;
        if (length === 1) return 0;
        var arithmeticMean = this.getArithmeticMean();
        var i = -1;
        var s = 0;
        while(++i < length) {
            var v = parseFloat(theArray[i]) - arithmeticMean;
            s += v * v;
        }
        return s/(length-1);
    }

    self.setArray = function(arr) {
        theArray = arr;
        return self;
    }

    self.getArray = function() {
        return theArray;
    }

    return self;
}
