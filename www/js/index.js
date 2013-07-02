
var app = {
    // Application Constructor
    initialize: function() {
        this.dba_adapt = new InMemoryAdapter();
        this.dba_adapt.initialize().done(function() {
            console.log('dba init');
        });
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        console.log("bindEvents");
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('pause', this.onPause, false);
		document.addEventListener('resume', this.onResume, false);
		document.addEventListener('online', this.onOnline, false);
		document.addEventListener('offline', this.onOffline, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        console.log("deviceReady");
		var PIN_val = '';
		var loggedIn = false;
        
        // validate and start the testing session
        $('#sess_start').hammer().on('tap', function(){
			// check to see if a student and at least one measure are selected, else show alert
			if( $('[name=measure]:checked').length > 0 && $('.student_res_hi').length > 0 ) {
				$('#PIN_modal').modal({keyboard:false,backdrop:'static'});
			} else {
				navigator.notification.alert('Select a student and at least one measure.',alertGenericDismissed,'Missing data');
			}
        });
		
		$('.stu_nav_lock').hammer().on('doubletap', function(){
			$('#PIN_modal').modal({keyboard:false,backdrop:'static'});
		});
		
		// save admin PIN and go to session start page
        $('#PIN_ok').hammer().on('tap', function(){
            $('#PIN_modal').modal('hide');
			
			$('.app_adm').hide();
			$('.app_stu').show();
        });
		$('#PIN_cancel').hammer().on('tap', function(){
            $('#PIN_modal').modal('hide');
            var wp=$('.well_pin');
			wp.html('');
			wp.removeClass('well_pin_hi');
			PIN_val='';
        });
		
		// PIN number buttons
		$('.pin-btn').hammer().on('tap', function(){
			var pin_btn_num = $(this).attr('rel');
			var l= PIN_val.length;
			if(l<4){
				var m=l+1;
                $('#well_pin' + m).addClass('well_pin_hi').html('*');
				PIN_val += pin_btn_num;
                n=1;
			}
		});
        
    },
	// pause event handler
    onPause: function() {
	
	},
	// resume event handler
	onResume: function() {
	
	},
	// online event handler
    onOnline: function() {
	
	},
	// offline event handler
    onOffline: function() {
	
	}
};

//////////////////////////////////////////////////

app.initialize();

function sessSearchSubmit(){
    var searchName=$('#student_name').val();
	if(searchName==''){
		navigator.notification.alert('You must enter some portion of a last name.',alertSearchDismissed,'Missing data');
	} else {
		app.dba_adapt.findStudentByLastName(searchName).done(function(studentInfo) {
			var infoStr="<ul class='nav nav-list'>";
			var l=studentInfo.length;
			var s;
			for (var i=0;i<l;i++){
				s=studentInfo[i];
				var cStr = (i==0) ? 'student_res_hi' : '';
				infoStr += "<li class='student_res " + cStr + "' id='" + s.id + "'>" + s.firstName + " " + s.lastName + "   <span class='right'>G: " + s.gradeLevel + "</span></li>";
			}
			infoStr += "</ul>";
			$('#sess_student_results').html(infoStr);
			$('#student_name').val('');
			$('.student_res').hammer().on('tap', function(event){
				$('.student_res').removeClass('student_res_hi');
				$(this).addClass('student_res_hi');
			});
		});
	}
	$('#sess_search').focus();
}

$('#sess_search').hammer().on('tap', function(event){
    sessSearchSubmit();
});

function alertGenericDismissed() {

}

function alertSearchDismissed() {
	
}

$('.admBtn').on('click', function(e){
    e.stopPropagation();
});
// Show an admin page
$('.admBtn').hammer().on('tap', function(){
	$('.adm_content').hide();
    $('.admBtn').not($(this)).removeClass('active');
    $(this).addClass('active');
	var pageId=$(this).attr('id');
	if(pageId=='session') {
		app.dba_adapt.getMeasures().done(function(measInfo) {
			var infoStr='';
			var l=measInfo.length;
			var m;
			var s;
			for (var i=0;i<l;i++){
				s=measInfo[i];
				m=i+1;
				infoStr += "<div class='meas_itm'><label class='checkbox meas'><input type='checkbox' id='measure' name='measure' value='" + s.id + "'>" + s.nameFull + "</label><button type='button' class='btn btn-small btn-more' title='" + s.nameFull + "' data-content='" + s.description + "'>info</button><div class='clear1'></div></div>"
			 }
			 $('#sess_meas_cont').html(infoStr);
			 $('.btn-more').popover({placement:'left',animation:false});
			 $('.btn.more').hammer().on('tap', function(){
				$(this).popover('show');
			 });
			 $('body').hammer().on('tap', function (e) {
				$('.btn-more').each(function () {
					if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
						$(this).popover('hide');
					}
				});
			});
		});
	}
	$('#page_' + pageId).show();
});




