var PIN_val='';
var selMeasArr=[];
var curMeasNum;
var curMeasShortName;
var curMeasFullName;
var curMeasTimeDur;
var measureInProgress=false;
var measurePaused=false;
var media1 = null;
var scont='';
var navBtnR=$('#stu_nav_btn_r');
var resultsCurPage=1;
var resultsPerPage=10;
var resSelGrade='';
var resSelMeas=0;
var localResultData=[];

function showPINModal() {
    $('#PIN_ok').attr('disabled',true);
    $('#PIN_modal').modal({keyboard:false,backdrop:'static'});
}

function confirmShowPINModal(idx){
    if(idx==1) {
        showPINModal();
    } else {
        if (curMeasShortName) eval(curMeasShortName.toUpperCase() + '.resumeMeas()');
    }
}

// Logout
$('#logout').hammer().off().on('tap', function(){
    BATVars.loggedIn=false;
    $('#loginEmail').val(BATVars.admin_email);
    $('#login_modal').modal({keyboard:false,backdrop:'static'});
});

function startNextMeasure() {
    measureInProgress=true;
    measurePaused=false;
    // mark previous measure as complete
    if(curMeasNum>0){
        $('#measNum' + curMeasNum).addClass('numCircle_done');
    }
    // get next measure info, load files, start measure
    if(curMeasNum<selMeasArr.length) {
        var j = curMeasNum + 1;
        var measID = selMeasArr[curMeasNum];
        BAT.dba_adapt.getMeasureByID(measID).done(function(measInfo) {
            curMeasShortName =  measInfo[0].nameShort;
            curMeasFullName =  measInfo[0].nameFull;
            curMeasTimeDur =  measInfo[0].timeDur;
            scont="<h1>Activity " + j + "</h1>";
            scont+="<h2>" + curMeasFullName + "</h2>";
            $('.stu_cont').html(scont);
            $('#measNum' + j).addClass('numCircle_active');
            if(media1) media1.release();
            media1 = new Media(batMediaPath + 'activity-' + j + '.mp3', loadMeasFilesAndStart, audioFail);
            media1.play();
            curMeasNum++;
        });
    } else {
        // show 'finished' page
        scont="<h1>Way to go!</h1>";
        scont+="<h2>You can tell the teacher that you have finished all of the activities.</h2>";
        $('.stu_cont').html(scont);
        if(media1) media1.release();
        media1 = new Media(batMediaPath + 'way-to-go.mp3',audioSuccess,audioFail);
        media1.play();
        navBtnR.hide();
        measureInProgress=false;
    }
}

function loadMeasFilesAndStart() {
    var jsFile = appLocalFilePath + 'measures/' + curMeasShortName.toLowerCase() + '/' + curMeasShortName + '.js';
    var cssFile = appLocalFilePath + 'measures/' + curMeasShortName.toLowerCase() + '/' + curMeasShortName + '.css';

    // load measure css file
    if(cssFile.fileExists()) {
        $('<link rel="stylesheet" type="text/css" href="' + cssFile + '" >').appendTo("head");
    } else {
        console.log(curMeasShortName + '.css missing');
    }
    // load measure js file
    if(jsFile.fileExists()) {
        $.getScript(jsFile, function() {
            eval(curMeasShortName.toUpperCase() + '.startMeas()');
        });
    } else {
        console.log(curMeasShortName + '.js missing');
    }
}

function sessSearchSubmit(){
    $('.grd-btn').removeClass('btn-primary');
    var searchName=$('#student_name').val();
    if(searchName==''){
        navigator.notification.alert('You must enter some portion of a last name.',alertSearchDismissed,'Missing data');
    } else {
        BAT.dba_adapt.findStudentByLastName(searchName).done(function(studentInfo) {
            showStudentResults(studentInfo);
        });
    }
    $('#sess_search').focus();
}

function showStudentResults(studentInfo){
    var infoStr;
    var l=studentInfo.length;
    if(l==0){
        infoStr="-- No students found --";
    } else {
        // build student list
        var s;
        var sfn;
        infoStr="<ul class='nav nav-list'>";
        for (var i=0;i<l;i++){
            s=studentInfo[i];
            sfn =  s.firstName + " " + s.lastName;
            infoStr += "<li class='student_res' id='" + s.id + "' rel='" + sfn + "'>" + sfn + "   <span class='grade right'>" + s.gradeLevel + "</span></li>";
        }
        infoStr += "</ul>";
    }

    // show list of students
    $('#sess_student_results').html(infoStr);
    $('.student_res').hammer().off().on('touch', function(){
        $('.student_res').removeClass('student_res_hi');
        $(this).addClass('student_res_hi');
        BATVars.selStudentId = $(this).attr('id');
        BATVars.selStudentName=$(this).attr('rel');
        BATVars.selStudentGrade=$(this).find('.grade').html();
    });
}

function startStudentSession(measArr){
    var l=measArr.length;
    var ncStr='';
    var j;

    // set up and show nav bar
    for (var i=0;i<l;i++){
        j=i+1;
        ncStr += "<span id='measNum" + j + "' class='numCircle'>" + j + "</span>";
    }
    $('.stu_nav_meas_num').html(ncStr) ;
    $('.stu_nav_name').html(BATVars.selStudentName);
    curMeasNum=0;

    // show student session page with school logo, enabled Start button
    $('.stu_cont').html("<div class='sch-logo-cent'><img src='" + batDataPath + BATVars.school_id + "/school_logo.png' /></div>");
    enableNavRBtn();
    $('#stu_nav_btn_r_txt').html('Start');
    navBtnR.attr('rel','start');
    $('.app_stu').show();
}

$('#sess_search').hammer().off().on('tap', function(){
    sessSearchSubmit();
});

// validate and start the testing session
$('#sess_start').hammer().off().on('tap', function(){
    console.log('ready to start session');
    // check to see if a student and at least one measure are selected, else show alert
    if( $('[name=measure]:checked').length > 0 && $('.student_res_hi').length > 0 ) {
        showPINModal();
    } else {
        navigator.notification.alert('Select a student and at least one measure.',alertGenericDismissed,'Missing data');
    }
});

$('#PIN_ok').hammer().off().on('tap', function(){
    if(btnEnabled(this)) {
        console.log('PIN_adm:' + BATVars.PIN_adm + '  PIN_val:' + PIN_val);
        $('.well_pin').removeClass('well_pin_hi').html('');
        if(BATVars.umode=='adm'){
            // hide PIN modal, clean up and hide admin
            $('.app_adm').hide();
            $('#PIN_modal').modal('hide');
            BATVars.PIN_adm=PIN_val;
            PIN_val='';
            BATVars.umode='stu';
            // which measures have been selected?
            selMeasArr=$('[name=measure]:checked').map(function(){return $(this).val();}).get();
            // start the student session
            startStudentSession(selMeasArr);
        } else {
            if(PIN_val==BATVars.PIN_adm){
                // end current measure
                if (curMeasShortName) eval(curMeasShortName.toUpperCase() + '.endMeas()');
                // hide PIN modal, clean up and hide student session, show admin
                $('#PIN_modal').modal('hide');
                $('.stu_cont').removeClass('black_back');
                $('.stu_cont').html('');
                $('.stu_nav_btn_l').hide();
                measurePaused=false;
                if(media1) media1.release();
                $('.app_stu').hide();
                BATVars.selStudentName='';
                selMeasArr=[];
                $('#sess_student_results').html('');
                $('[name=measure]').removeAttr('checked');
                $('.grd-btn').removeClass('btn-primary');
                $('.app_adm').show();
                BATVars.PIN_adm='';
                PIN_val='';
                BATVars.umode='adm';
                //upload any cached results
                uploadLocalResults();
            } else {
                PIN_val='';
                navigator.notification.alert('Incorrect PIN. Try again.',alertGenericDismissed,'PIN Error');
            }
        }
    }
});
$('#PIN_cancel').hammer().off().on('tap', function(){
    $('#PIN_modal').modal('hide');
    $('.well_pin').removeClass('well_pin_hi').html('');
    PIN_val='';
    if(BATVars.umode!='adm'){
        if (curMeasShortName) eval(curMeasShortName.toUpperCase() + '.resumeMeas()');
    }
});

// PIN number buttons
$('.pin-btn').hammer().off().on('touch', function(){
    var pin_btn_num = $(this).attr('rel');
    var l= PIN_val.length;
    if(l<4){
        var m=l+1;
        thud_sound.play();
        $('#well_pin' + m).addClass('well_pin_hi').html('*');
        PIN_val += pin_btn_num;
    }
    if(PIN_val.length==4) $('#PIN_ok').removeAttr('disabled');
});

$('.stu_nav_icons').hammer().off().on('doubletap', function(){
    // do you want to stop in the middle of a measure?
    if(measureInProgress) {
        if (curMeasShortName) eval(curMeasShortName.toUpperCase() + '.pauseMeas()');
        navigator.notification.confirm("Do you want to end this activity, or continue?",confirmShowPINModal,"End Activity?","End,Continue")
    } else {
        measurePaused=true;
        showPINModal();
    }
});

$('.grd-btn').hammer().off().on('touch', function(){
    // search for students by grade
    $('#student_name').val('');
    $('.grd-btn').removeClass('btn-primary');
    $(this).addClass('btn-primary');
    var g=$(this).attr('rel');
    BAT.dba_adapt.findStudentByGrade(g).done(function(studentInfo) {
        showStudentResults(studentInfo);
    });
});

navBtnR.hammer().off().on('tap', function(e){
    console.log('stu_nav_btn_r tap');
    e.stopPropagation();
    if(btnEnabled(this)) {
        $('.stu_nav_btn_l').hide();
        var r=$(this).attr('rel');
        switch(r) {
            case 'start':
                introPage();
                break;
            case 'intro':
                startNextMeasure();
                break;
        }
    }
});

function introPage(){
    var l=selMeasArr.length;
    console.log('measArr len=' + l);
    var aStr = (l>1) ? ' activities' : ' activity';
    var nw=['','one','two','three','four','five','six','seven','eight','nine'];
    BAT.dba_adapt.getMeasTot(selMeasArr).done(function(measTotData) {
        scont="<h1>Ok, let's get started.</h1>";
        scont+="<h2>You're going to do " + nw[l] + aStr + " today.</h2>";
        scont+="<h2>It should take about " + measTotData[1] + ".</h2>";
        scont+="<h2>Follow the instructions on the screen and do your best.</h2>";
        scont+="<h2>&nbsp;</h2>";
        scont+="<h2>Touch the <b>Next</b> button to continue ...</h2>";
        $('.stu_cont').html(scont);
        $('#stu_nav_btn_r_txt').html('Next');
        navBtnR.attr('rel','intro');
        navBtnR.attr('disabled',true);
        if(media1) media1.release();
        media1 = new Media(batMediaPath + 'lets-get-started.mp3',
            function() {
                if(media1) media1.release();
                media1 = new Media(batMediaPath + l + '-activity-today.mp3',
                    function() {
                        if(media1) media1.release();
                        media1 = new Media(batMediaPath +'take-' + measTotData[0] + '.mp3',
                            function() {
                                if(media1) media1.release();
                                media1 = new Media(batMediaPath + 'follow-instructions-on-screen.mp3',
                                    function() {
                                        if(media1) media1.release();
                                        media1 = new Media(batMediaPath + 'touch-next-button.mp3',
                                            function(){
                                                $('.stu_nav_btn_l').show();
                                                $('#stu_repeat_btn').hammer().off().on('tap', function() {
                                                    introPage();
                                                });
                                                enableNavRBtn();
                                            },
                                            audioFail
                                        );
                                        if(!measurePaused) media1.play();
                                    },
                                    audioFail
                                );
                                if(!measurePaused) media1.play();
                            },
                            audioFail
                        );
                        if(!measurePaused) media1.play();
                    },
                    audioFail
                );
                if(!measurePaused) media1.play();
            },
            audioFail
        );
        if(!measurePaused) media1.play();
    });
}

function showResultsList(rsortfld,rsortdir,page,studentid,measureid,grade) {
    console.log('showResultsList(' + rsortfld + ',' + rsortdir + ',' + page + ',' + studentid + ',' + measureid + ',' + grade + ')');
    if(typeof page != 'undefined') resultsCurPage=page;
    if(typeof rsortfld == 'undefined') rsortfld='datetime';
    if(typeof rsortdir == 'undefined') rsortdir='DESC';
    if(typeof studentid == 'undefined') studentid=0;
    if(typeof measureid == 'undefined') measureid=0;
    if(typeof grade == 'undefined') grade='';

    if(checkConnection()=='wifi'){
        $.ajax({
            type: 'POST',
            url: baseAjax,
            data: { 'op': 'getResultsList', 'sortfld': rsortfld, 'sortdir': rsortdir, 'page': resultsCurPage, 'perpage': resultsPerPage, 'school_id': BATVars.school_id, 'student_id': studentid, 'measure_id': measureid, 'grade_level': grade, 'admin_id': BATVars.admin_id, 'key': 1 },
            dataType: 'json',
            crossDomain: true,
            success: function(data) {
                var errMsg= data.errMsg;
                console.log('Got results');
                if (errMsg == "") {
                    var resStr;
                    var r_id,s_id,s_first,s_last,m_id,m_itm,score,rawdata,pageCnt,dt,s_grade;
                    var bCls,lCls,aCls,rCls;
                    var sSortArrow='', mSortArrow='', dSortArrow='', gSortArrow='';
                    var sArr=getArrayStudentNames(data.sArr);
                    if(rsortfld=='student_id') {
                        if(rsortdir=='ASC') {
                            sArr = sArr.sort(lastnameComp_ASC);
                        } else {
                            sArr = sArr.sort(lastnameComp_DESC);
                        }
                    }
                    var resCnt=data.resCnt;

                    if(resCnt>0) {
                        // set list header with sorting
                        if(rsortfld=='student_id') sSortArrow=(rsortdir=='ASC') ? '&#x25B2;' : '&#x25BC;';
                        if(rsortfld=='grade_level') gSortArrow=(rsortdir=='ASC') ? '&#x25B2;' : '&#x25BC;';
                        if(rsortfld=='measure_id') mSortArrow=(rsortdir=='ASC') ? '&#x25B2;' : '&#x25BC;';
                        if(rsortfld=='datetime') dSortArrow=(rsortdir=='ASC') ? '&#x25B2;' : '&#x25BC;';

                        resStr ='<div class="result_hdr"><div class="result_name res_hdr" rel="student_id">Student &nbsp;&nbsp;&nbsp;' + sSortArrow + '</div><div class="result_grade res_hdr" rel="grade_level">Grade &nbsp;&nbsp;&nbsp;' + gSortArrow + '</div><div class="result_measure res_hdr" rel="measure_id">Test Measure &nbsp;&nbsp;&nbsp;' + mSortArrow + '</div><div class="result_date res_hdr" rel="datetime">Date &nbsp;&nbsp;&nbsp;' + dSortArrow + '</div><div class="clear1"></div></div>';
                        for(var i=0;i<sArr.length;i++){
                            r_id=sArr[i].id;
                            s_id=sArr[i].student_id;
                            s_first=sArr[i].firstname;
                            s_last=sArr[i].lastname;
                            s_grade=sArr[i].grade;
                            m_id=sArr[i].measure_id;
                            m_itm=find(measures,'id',m_id);
                            score=sArr[i].score;
                            rawdata=sArr[i].res_data;
                            dt=sArr[i].datetime;
                            rCls=(i%2==0) ? 'result_cont_b' : 'result_cont_y';
                            resStr += '<div class="result_cont ' + rCls + '" rel="' + r_id + '">';
                            resStr += '<div class="result_name">' + s_first + ' ' + s_last + '</div><div class="result_grade">' + s_grade + '</div><div class="result_measure">' + m_itm.nameFull + '</div><div class="result_date">' + dt + '</div><div class="clear1"></div>';
                            resStr += '<div class="result_data hidden" id="result_data_' + r_id + '">';
                            resStr += 'Score: ' + score + '<br>' + rawdata;
                            resStr += '</div>';
                            resStr += '</div>';
                        }
                        pageCnt =  Math.ceil(resCnt/resultsPerPage);
                        console.log('resCnt=' + resCnt + '  pageCnt=' + pageCnt);
                        if(pageCnt>1){
                            bCls=(resultsCurPage==1) ? 'disabled' : '';
                            lCls=(resultsCurPage==pageCnt) ? 'disabled' : '';
                            resStr += '<ul class="pagination">';
                            resStr += '<li class="' + bCls + '"><a onclick="showResultsList(\'' + rsortfld + '\',\'' + rsortdir + '\',1,' + studentid + ',' + measureid + ',\'' + grade + '\');">&laquo;</a></li>';
                            for(var i=1;i<=pageCnt;i++){
                                aCls=(i==resultsCurPage) ? 'active' : '';
                                resStr += '<li class="' + aCls + '"><a onclick="showResultsList(\'' + rsortfld + '\',\'' + rsortdir + '\',' + i + ','  + studentid + ',' + measureid + ',\'' + grade + '\');">' + i + '</a></li>';
                            }
                            resStr += '<li class="' + lCls + '"><a onclick="showResultsList(\'' + rsortfld + '\',\'' + rsortdir + '\',' + pageCnt + ',' + studentid + ',' + measureid + ',\'' + grade + '\');">&raquo;</a></li>';
                            resStr += '</ul>';
                        }
                        $('#page_results_cont').html(resStr);
                        $('.result_cont').hammer().off().on('tap', function() {
                            var rel = $(this).attr('rel');
                            $('#result_data_' + rel).slideToggle('fast');
                        });
                        $('.res_hdr').hammer().off().on('tap', function() {
                            var rel = $(this).attr('rel');
                            if(rsortfld==rel){
                                var newsortdir = (rsortdir=='ASC') ? 'DESC' : 'ASC';
                                showResultsList(rsortfld,newsortdir,resultsCurPage,studentid,measureid,grade);
                            } else {
                                showResultsList(rel,rsortdir,resultsCurPage,studentid,measureid,grade);
                            }
                        });
                    } else {
                        $('#page_results_cont').html('-- No results --');
                    }
                }
                else {
                    // Display error message
                    navigator.notification.alert(errMsg,alertSearchDismissed,'Error');
                }
            },
            error: function() {
                navigator.notification.alert('Results not available',alertSearchDismissed,'Error');
            }
        });
        $('.res-grd-btn').hammer().off().on('touch', function(){
            // search for students by grade
            $('.res-grd-btn').removeClass('btn-primary');
            $(this).addClass('btn-primary');
            resSelGrade=$(this).attr('rel');
            showResultsList(rsortfld,rsortdir,1,0,resSelMeas,resSelGrade);
        });
        $('#results_meas_sel').off().on('change', function() {
            resSelMeas=$(this).val();
            showResultsList(rsortfld,rsortdir,1,0,resSelMeas,resSelGrade);
        });
    } else {
        $('#page_results_cont').html('');
        $('#page_results_cont').html("You must be connected to a wi-fi network to get results data.");
    }

}

function getArrayStudentNames(sArr) {
    var sItm,s_id;
    for(var i=0;i<sArr.length;i++){
        s_id=sArr[i].student_id;
        sItm=find(students,'id',s_id);
        sArr[i].firstname=sItm.firstName;
        sArr[i].lastname=sItm.lastName;
    }
    return sArr;
}


function lastnameComp_ASC(a,b){
    if (a.lastname < b.lastname) return -1;
    if (a.lastname > b.lastname) return 1;
    return 0;
}

function lastnameComp_DESC(a,b){
    if (a.lastname < b.lastname) return 1;
    if (a.lastname > b.lastname) return -1;
    return 0;
}

function showStudents() {


}

function showMeasures() {


}

function uploadLocalResults() {
    if(checkConnection()=='wifi' && localResultData.length>0){
        var localResData = JSON.stringify(localResultData);
        $.ajax({
            type: 'POST',
            url: baseAjax,
            data: localResData,
            timeout: 30000,
            headers: { "cache-control": "no-cache" },
            crossDomain: true,
            success: function(data) {
                var errMsg= data.errMsg;
                console.log('Uploaded local results - errMsg:' + errMsg);
                if (errMsg == "") {
                    localResultData=[];
                }
                else {
                    // Display error message
                    navigator.notification.alert(errMsg,alertSearchDismissed,'Error');
                }
            },
            error: function() {
                navigator.notification.alert('An error occurred in uploading saved results',alertSearchDismissed,'Results Not Uploaded');
            }
        });
    }
}

console.log('end of bat_utilities reached');




