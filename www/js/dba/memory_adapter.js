var InMemoryAdapter = function() {
 
    this.initialize = function() {
        // No Initialization required
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    };
 
    this.findStudentByLastName = function(searchKey) {
        var deferred = $.Deferred();
        var results = students.filter(function(element) {
            var studentLast = element.lastName;
            return studentLast.toLowerCase().indexOf(searchKey.toLowerCase()) == 0;
        });
        deferred.resolve(results.sort(arrSortBy("lastName")));
        return deferred.promise();
    };

    this.findStudentByGrade = function(searchKey) {
        var deferred = $.Deferred();
        var results = students.filter(function(element) {
            return element.gradeLevel == searchKey;
        });
        deferred.resolve(results.sort(arrSortBy("lastName")));
        return deferred.promise();
    };
	
	this.getAllMeasures = function() {
		var deferred = $.Deferred();
		var results = measures.filter(function(element) {
			//var elName = element.nameFull;
            //var elActive= element.active;
            return element.nameFull != '' && element.active == 1;
        });
        deferred.resolve(results);
        return deferred.promise();
	};

    this.getMeasureByID = function(mid) {
        var deferred = $.Deferred();
        var results = measures.filter(function(element) {
            return element.id == mid && element.active == 1;
        });
        deferred.resolve(results);
        return deferred.promise();
    };

    this.getMeasTot = function(mArr) {
        var deferred = $.Deferred();
        var durArr1 = [15,30,45,60,75,90,105,120,135,150,165,180];
        var durArr2 = ['15 minutes','30 minutes','45 minutes','1 hour','1 hour and 15 minutes','1 hour and 30 minutes','1 hour and 45 minutes','2 hours','2 hours and 15 minutes','2 hours and 30 minutes','2 hours and 45 minutes','3 hours'];
        var tot = 0;
        var x;
        for(x=0;x<mArr.length;x++){
            tot += measures[mArr[x]-1].timeDur;
        }
        var totX = 15 * Math.ceil(tot/15);
        var durStr = durArr2[durArr1.indexOf(totX)];
        var results = [totX,durStr];
        deferred.resolve(results);
        return deferred.promise();
    };

};

function arrSortBy(prop) {
    return function(a,b){
        if( a[prop] > b[prop]){
            return 1;
        } else if( a[prop] < b[prop]){
            return -1;
        }
        return 0;
    }
}