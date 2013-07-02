var InMemoryAdapter = function() {
 
    this.initialize = function() {
        // No Initialization required
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }
 
    this.findStudentByLastName = function(searchKey) {
        var deferred = $.Deferred();
		//var l = searchKey.length;
        var results = students.filter(function(element) {
            var studentLast = element.lastName;
            return studentLast.toLowerCase().indexOf(searchKey.toLowerCase()) == 0;
        });
        deferred.resolve(results);
        return deferred.promise();
    }
	
	this.getMeasures = function() {
		var deferred = $.Deferred();
		var results = measures.filter(function(element) {
			var elName = element.nameFull;
            return elName != '';
        });
        deferred.resolve(results);
        return deferred.promise();
	}
 
    var students = [
        {"id": 1, "firstName": "James", "lastName": "King", "gradeLevel": "2"},
        {"id": 2, "firstName": "Julie", "lastName": "Taylor", "gradeLevel": "2"},
        {"id": 3, "firstName": "Eugene", "lastName": "Lee", "gradeLevel": "2"},
        {"id": 4, "firstName": "John", "lastName": "Williams", "gradeLevel": "2"},
        {"id": 5, "firstName": "Ray", "lastName": "Moore", "gradeLevel": "2"},
        {"id": 6, "firstName": "Sarah", "lastName": "Moore", "gradeLevel": "3"},
        {"id": 7, "firstName": "Maggie", "lastName": "Moore", "gradeLevel": "6"},
        {"id": 8, "firstName": "James", "lastName": "Kinsmann", "gradeLevel": "2"},
        {"id": 9, "firstName": "Julie", "lastName": "Teller", "gradeLevel": "2"},
        {"id": 10, "firstName": "Eugene", "lastName": "Miller", "gradeLevel": "2"},
        {"id": 11, "firstName": "John", "lastName": "Miller", "gradeLevel": "2"},
        {"id": 12, "firstName": "Ray", "lastName": "Messing", "gradeLevel": "2"},
        {"id": 13, "firstName": "Sarah", "lastName": "Manning", "gradeLevel": "3"},
        {"id": 14, "firstName": "Maggie", "lastName": "Marston", "gradeLevel": "6"},
        {"id": 15, "firstName": "James", "lastName": "Kalder", "gradeLevel": "2"},
        {"id": 16, "firstName": "Julie", "lastName": "Twist", "gradeLevel": "2"},
        {"id": 17, "firstName": "Eugene", "lastName": "Leonard", "gradeLevel": "2"},
        {"id": 18, "firstName": "John", "lastName": "Williams", "gradeLevel": "2"},
        {"id": 19, "firstName": "Ray", "lastName": "Monroe", "gradeLevel": "2"},
        {"id": 20, "firstName": "Sarah", "lastName": "Medwick", "gradeLevel": "3"},
        {"id": 21, "firstName": "Maggie", "lastName": "Miggens", "gradeLevel": "6"},
        {"id": 22, "firstName": "Julie", "lastName": "Mailer", "gradeLevel": "2"},
        {"id": 23, "firstName": "Eugene", "lastName": "Mallory", "gradeLevel": "2"},
        {"id": 24, "firstName": "John", "lastName": "McQueen", "gradeLevel": "2"},
        {"id": 25, "firstName": "Ray", "lastName": "Mimsey", "gradeLevel": "2"},
        {"id": 26, "firstName": "Sarah", "lastName": "Morton", "gradeLevel": "3"},
        {"id": 27, "firstName": "Maggie", "lastName": "Missoni", "gradeLevel": "6"},
        {"id": 28, "firstName": "James", "lastName": "Mulkey", "gradeLevel": "2"},
        {"id": 29, "firstName": "Julie", "lastName": "McGraw", "gradeLevel": "2"}
    ];
    
    var measures = [
        {"id": 1, "nameFull": "Attention Network Test", "nameShort": "ANT", "description": "This is a description of a test measure in detail. We will add the actual description later. This is just to test the display of a long description to see how well it fits within the required space on the screen."},
        {"id": 2, "nameFull": "Child Report Sympathy Scale", "nameShort": "CRSS", "description": "This is a description of a test measure in detail. We will add the actual description later. This is just to test the display of a long description to see how well it fits within the required space on the screen."},
        {"id": 3, "nameFull": "Social Desirability Scale for Young Children", "nameShort": "SDS", "description": "This is a description of a test measure in detail. We will add the actual description later. This is just to test the display of a long description to see how well it fits within the required space on the screen."},
        {"id": 4, "nameFull": "Empathic Response to Burn Victim", "nameShort": "ERBV", "description": "This is a description of a test measure in detail. We will add the actual description later. This is just to test the display of a long description to see how well it fits within the required space on the screen."},
        {"id": 5, "nameFull": "Moral Emotion Attribution", "nameShort": "MEA", "description": "This is a description of a test measure in detail. We will add the actual description later. This is just to test the display of a long description to see how well it fits within the required space on the screen."},
        {"id": 6, "nameFull": "Peeping Test", "nameShort": "PEEP", "description": "This is a description of a test measure in detail. We will add the actual description later. This is just to test the display of a long description to see how well it fits within the required space on the screen."},
        {"id": 7, "nameFull": "Test of Self-Conscious Affect", "nameShort": "TSCA", "description": "This is a description of a test measure in detail. We will add the actual description later. This is just to test the display of a long description to see how well it fits within the required space on the screen."},
        {"id": 8, "nameFull": "Naglieri Non-Verbal Ability", "nameShort": "NNVA", "description": "This is a description of a test measure in detail. We will add the actual description later. This is just to test the display of a long description to see how well it fits within the required space on the screen."}
    ];
 
}