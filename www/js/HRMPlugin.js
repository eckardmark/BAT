var HRM_timer;
var HRM_readArray = [];
var HRM_statArray = [];
var HRM_paused = false;

function HRM_logread() {
     window.HRMPlugin.logRead();
};

window.HRMPlugin = {
    
    // ----------------------------------------
    // Enums
    // ----------------------------------------
    
    ZoneEnum : {
        ZONE_OFF : 0,  // Led off
        ZONE_LOW : 1,  // Green fast blinking
        ZONE_MID : 2,  // Green slow blinking
        ZONE_HI : 3    // Red fast blinking
    },
    
    // Connection Status
    ConnEnum : {
        DISCONNECTED : 0,
        CONNECTED : 1,
        // Uncommon cases
        CONNECTED_NO_DATA : 2,
        DISCONNECTING_POWER_LOW : 3,
        DISCONNECTING_POWER_OFF : 4,
        DISCONNECTED_POWER_LOW : 5,
        DISCONNECTED_POWER_OFF : 6
    },
    
    // ----------------------------------------
    // Data structure where updated data is stored
    // ----------------------------------------
    
    HRM :
    {
		readIncrement: 1,			// in seconds
        heartRate : 0.0,            // Updated each second
        heartRateQuality : 0,       // 0 to 50
        isTracking : false,         // If false, either unit is off skin or connection is bad
        batteryLevel : 0,           // 0 to 100
        deviceConnectionState : 0,  // See ConnEnum
        elapsedTime : 0,             // In seconds
        displayElementID: ''        //display element ID
    },

    // ----------------------------------------
    // JS layer functions
    // ----------------------------------------
    
    HRMIsConnected : function() {
        return (window.HRMPlugin.HRM.deviceConnectionState == 1);
    },
    
    // ----------------------------------------
    // Intereacting with native layer
    // ----------------------------------------
    
    // Get/Set device behaviour
    
    // By default the device is started up when runnning program
    startup : function() {
        cordova.exec(
                     function(param) {
                        console.log('successful HRM startup');
                     },
                     function(error) {
                        console.log('failed HRM startup');
                     },
                     "HRMPlugin", "Startup", []);
    },
    
    shutdown : function() {
        cordova.exec(
                     function(param) {
                         console.log('successful HRM shutdown');
                     },
                     function(error) {
                         console.log('failed HRM sutdown');
                     },
                     "HRMPlugin", "Shutdown", []);
    },
    
    setZone : function(zoneValue) {
        cordova.exec(
                     function(param) {
                     
                     },
                     function(error) {
                     alert("Setting zone failed");
                     },
                     "HRMPlugin", "SetZone", [zoneValue]);
    },
    
    // Get Data
    getConnectionStatus : function() {
        cordova.exec(
                    function(param) {
                        window.HRMPlugin.HRM.deviceConnectionState = param;
                     },
                     function(error) { window.HRMPlugin.HRM.deviceConnectionState = 0; },
                    "HRMPlugin", "GetConnectionStatus", []);
    },
    
    getHeartRate : function() {
        cordova.exec(
                     function(param) {
                        window.HRMPlugin.HRM.heartRate = param;
                     },
                     function(error) { window.HRMPlugin.HRM.heartRate = 0; },
                     "HRMPlugin", "GetHeartRate", []);
    },
    
    getHRMData : function() {
        cordova.exec(
                     function(param) {
                        window.HRMPlugin.HRM.heartRate = parseFloat(param[0]).toFixed(1);
                        window.HRMPlugin.HRM.heartRateQuality = parseInt(param[1]);
                        window.HRMPlugin.HRM.isTracking = (parseInt(param[2]) == 1);
                        window.HRMPlugin.HRM.batteryLevel = parseInt(param[3]);
                        window.HRMPlugin.HRM.deviceConnectionState = parseInt(param[4]);
                        window.HRMPlugin.HRM.elapsedTime = parseFloat(param[5]);
                     },
                     function(error) { },
                     "HRMPlugin", "GetHRMData", []);
    },
	
	// ----------------------------------------
	// Heart rate collection: start/stop, stats
	// ----------------------------------------

	
	readStart : function() {
		console.log('HRM_readStart');
		if(HRM_paused) {
            HRM_paused=false;
        } else {
            HRM_readArray = [];
        }
		var readInc = window.HRMPlugin.HRM.readIncrement * 1000;
		HRM_timer = window.setInterval(HRM_logread, 1000);
        this.outputDivLog('readStart');
	},
	
	logRead : function() {
		this.getHRMData();
		var jRatio;
        var newRead = window.HRMPlugin.HRM.heartRate;
        var hrQual = window.HRMPlugin.HRM.heartRateQuality;
        var isTracking = window.HRMPlugin.HRM.isTracking;
        var connState = window.HRMPlugin.HRM.deviceConnectionState;
		if(HRM_readArray.length>0){
			var lastRead = HRM_readArray[HRM_readArray.length-1];
			jRatio = newRead/lastRead;
		} else {
			jRatio=1;
		}
        console.log('hrQual:' + hrQual + '  isTracking;' + isTracking + '  connState:' + connState + '  jRatio:' + jRatio.toFixed(1));

		//if still tracking and connection is good, and the reading isn't anomalous
		//if(hrQual>40 && isTracking && connState==1 && jRatio < 1.5 && jRatio > 0.5){
        if(isTracking && connState==1){
			HRM_readArray.push(newRead);
			this.outputDivLog('HR: ' + newRead + '   HQ: ' + hrQual);
        }else{
            HRM_readArray.push(0);
            if(!isTracking){
                this.outputDivLog('not tracking');
            }else if(connState!=1){
                this.outputDivLog('conState:' + connState);
            }
		}
	},

    readPause : function() {
        console.log('HRM_readPause');
        HRM_paused=true;
        window.clearInterval(HRM_timer);
    },
	
	readEnd : function() {
        console.log('HRM_readEnd');
		window.clearInterval(HRM_timer);
		this.getStats();
	},

    getReadArithmeticMean: function(startPos,endPos) {
        var stat = Stats(this.getArraySlice(startPos,endPos));
        var ra_avg = stat.getArithmeticMean();
        console.log('start:' + startPos + '  end:' + endPos +   'getReadArithMean:' + ra_avg);
        return ra_avg;
    },

    getReadGeometricMean: function(startPos,endPos) {
        var stat = Stats(this.getArraySlice(startPos,endPos));
        var ra_avg = stat.getGeometricMean();
        console.log('start:' + startPos + '  end:' + endPos +   'getReadGeoMean:' + ra_avg);
        return ra_avg;
    },

    getReadHarmonicMean: function(startPos,endPos) {
        var stat = Stats(this.getArraySlice(startPos,endPos));
        var ra_avg = stat.getHarmonicMean();
        console.log('start:' + startPos + '  end:' + endPos +   'getReadHarmMean:' + ra_avg);
        return ra_avg;
    },

    getReadStdDev: function(startPos,endPos) {
        var stat = Stats(this.getArraySlice(startPos,endPos));
        var ra_stddev = stat.getStandardDeviation();
        console.log('start:' + startPos + '  end:' + endPos + '  getReadStdDev:' + ra_stddev);
        return ra_stddev;
    },

    getReadVariance: function(startPos,endPos) {
        var stat = Stats(this.getArraySlice(startPos,endPos));
        var ra_var = stat.getVariance();
        console.log('start:' + startPos + '  end:' + endPos + '  getReadVar:' + ra_var);
        return ra_var;
    },

    getReadIndexOfVariability: function(startPos,endPos) {
        var stat = Stats(this.getArraySlice(startPos,endPos));
        var ra_stddev = stat.getStandardDeviation();
        var ra_var = stat.getVariance();
        var ra_indvar = ra_stddev/ra_var;
        console.log('start:' + startPos + '  end:' + endPos + '  getReadIndexOfVar:' + ra_indvar);
        return ra_indvar;
    },

    getArraySlice: function(startPos,endPos) {
        endPos = (endPos > HRM_readArray.length) ? HRM_readArray.length : endPos;
        //grab portion of readArray
        var ra_x = HRM_readArray.slice(startPos,endPos);
        //remove any 0 values from this subarray
        return jQuery.grep(ra_x, function(value) { return value != 0; });
    },
	
	getStats : function() {
        var x= HRM_readArray;
		var s = x.reduce(function(a,b) {return a+b});
		var avgVal = s/x.length;
		var highVal = Math.max.apply(null,x);
		var lowVal = Math.min.apply(null,x);
		HRM_statArray = [avgVal, highVal, lowVal];
		this.outputDivLog('avg: ' + avgVal.toFixed(1) + '  high: ' + highVal + '  low: ' + lowVal);
	},
    
    // ----------------------------------------
    // Logging & Helpers
    // ----------------------------------------
    
    logHRMStatus : function() {
        this.outputDivLog(
                          "Javascript : HRM Status." + " " +
                          "heartRate : " + this.HRM.heartRate + " " +
                          "heartRateQuality : " + this.HRM.heartRateQuality + " " +
                          "isTracking : " + this.HRM.isTracking + " " +
                          "batteryLevel : " + this.HRM.batteryLevel + " " +
                          "deviceConnectionState : " + this.HRM.deviceConnectionState + " " +
                          "elapsedTime : " + this.HRM.elapsedTime + " ");
    },
    
    outputDivLog: function(message) {
        $('#' + window.HRMPlugin.HRM.displayElementID).html(message);
    }
}