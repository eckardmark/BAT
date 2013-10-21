var BAT = {
    // Application Constructor
    initialize: function() {
        console.log("BAT init");
        this.bindEvents();
    },

    // Bind Event Listeners
    bindEvents: function() {
        console.log("bindEvents");
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
        console.log("deviceReady");
        if (parseFloat(window.device.version) === 7.0) {
            $('body').addClass('body_ios_7');
        }
        document.addEventListener('pause', onPause, false);
        document.addEventListener('resume', onResume, false);
        document.addEventListener('online', onOnline, false);
        document.addEventListener('offline', onOffline, false);

        console.log("getting fileSystem");
        window.requestFileSystem(LocalFileSystem.PERSISTENT,0,gotFS,gotFSFail);

        loadSounds();
        showBATLogin();
    }

};

BAT.initialize();

var BATVars={"PIN_adm":"","loggedIn":false,"umode":"adm","selStudentId":0,"selStudentName":"","selStudentGrade":"","admin_email":"","admin_id":0,"admin_name":"","school_id":0,"school_name_full":"","school_name_short":""};

var baseRemURL = "http://www.edumetricsconsulting.com/bat/";
var baseAjax = baseRemURL + "ws/batws.php";
var batFileSystem;
var appLocalFilePath;
var schManLoaded=false;
var batMediaPath;
var batImgPath;
var batDataPath;
var batIncludesPath;
var assetFileArr=[];
var assetFileCtr=0;
var thud_sound = null;
var click_sound = null;
var ding_sound = null;
var measures = [];
var students = [];

// pause event handler
function onPause() {
    console.log('onPause');
    //saveBATVars();
}

// resume event handler
function onResume() {
    console.log('onResume');
    if(BATVars.loggedIn){
        schManLoaded=false;
        downloadManifest('resume','manifest.txt');
        //check for results waiting to be uploaded
        uploadLocalResults();
    }
}

// online event handler
function onOnline() {

}

// offline event handler
function onOffline() {

}

function showBATLogin(){
    BATVars.loggedIn=false;
    window.localStorage.clear();
    $('.admBtn').removeClass('active');
    //display stored email value, if any
    //$('#loginEmail').val(BATVars.admin_email);
    $('#login_modal').modal({backdrop:'static'});
    $('#loginEmail').focus();
}

function loginSubmit(){
    var em=$('#loginEmail');
    var pw=$('#loginPassword');
    var em_val=em.val();
    var pw_val=pw.val();
    // check for (valid) email and password values
    if(!validEmail(em_val)){
        navigator.notification.alert('You must enter a valid email address.',alertSearchDismissed,'Missing data');
        em.focus();
    } else if(pw_val=='') {
        navigator.notification.alert('You must enter a password.',alertSearchDismissed,'Missing data');
        pw.focus();
    } else if(checkConnection()!='wifi'){
        navigator.notification.alert('You must be connected to a wi-fi network to login.',alertSearchDismissed,'No Wi-Fi Connection');
    } else {
        //check credentials
        $.ajax({
            type: 'POST',
            url: baseAjax,
            data: { 'op': 'login','em': em_val, 'pw': pw_val},
            dataType: "json",
            timeout: 30000,
            headers: { "cache-control": "no-cache" },
            crossDomain: true,
            success: function(data) {
                console.log('login successful - errMsg:' + data.errMsg);
                if (data.errMsg == "") {
                    // Save the profile information for reuse by other functions
                    BATVars.admin_email = em_val;
                    BATVars.admin_id = data.admin_id;
                    BATVars.admin_name = data.admin_name;
                    BATVars.school_id = data.school_id;
                    BATVars.school_name_full = data.school_name_full;
                    BATVars.school_name_short = data.school_name_short;

                    BATVars.loggedIn=true;
                    $('#login_modal').modal('hide');
                    $('#loginEmail').val('');
                    $('#loginPassword').val('');
                    $('.app_adm').show();
                    showAdmPage('home');
                    $('#home').focus();

                    console.log('ready to download asset files');
                    schManLoaded=false;
                    downloadManifest('start','manifest.txt');
                }
                else {
                    // Display error message
                    navigator.notification.alert('Email/password do not match a registered user.',alertSearchDismissed,'Data error');
                }
            },
            error: function() {
                navigator.notification.alert('Login failed.',alertSearchDismissed,'Login error');
            }
        });
    }
}

//clear login text fields
$(document).on('propertychange keyup input paste', 'input.data_field', function(){
    var io = $(this).val().length ? 1 : 0 ;
    $(this).next('.icon_clear').stop().fadeTo(300,io);
});

$('.icon_clear').hammer().on('tap', function() {
    $(this).delay(300).fadeTo(300,0).prev('input').val('').focus();
});

// Show an admin page
$('.admBtn').hammer().on('tap', function(){
    console.log('admBtn click');
    var btnId=$(this).attr('id');
    showAdmPage(btnId);
});

function showAdmPage(btnId) {
    var thisBtn = $('#' + btnId);
    $('.adm_content').hide();
    $('.admBtn').not(thisBtn).removeClass('active');
    thisBtn.addClass('active');

    switch(btnId) {
        case 'session':
            refreshMeasureList();
            break;
        case 'results':
            showResultsList();
            break;
        case 'measures':
            showMeasures();
            break;
        case 'students':
            showStudents();
            break;
        default:
            break;
    }
    $('#page_' + btnId).show();
}

function refreshMeasureList(){
    BAT.dba_adapt.getAllMeasures().done(function(measInfo) {
        var resMeasSelStr="<option value='0' selected>-- All measures --</option>";
        var infoStr="<ul id='measList'>";
        var l=measInfo.length;
        var m;
        var s;
        for (var i=0;i<l;i++){
            s=measInfo[i];
            m=i+1;
            infoStr += "<li><div class='meas_itm'><label class='checkbox meas'><input type='checkbox' class='chk_meas' name='measure' value='" + s.id + "'>" + s.nameFull + "</label><button type='button' class='btn btn-small btn-more' title='" + s.nameFull + "' data-content='" + s.description + "'>info</button><div class='clear1'></div></div></li>";
            resMeasSelStr += "<option value='" + s.id + "'>" + s.nameFull + "</option>";
        }
        infoStr += "</ul>";
        $('#sess_meas_cont').html(infoStr);
        $('#measList').sortable();
        $('#measList').disableSelection();
        $('.btn-more').popover({placement:'left',animation:false});
        $('.btn.more').hammer().on('tap', function(){
            $(this).popover('show');
        });
        $('#results_meas_sel').html(resMeasSelStr);
        $('body').hammer().on('tap', function (e) {
            $('.btn-more').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });
    });
}

// ------  Session Functions ------

function saveBATVars() {
    if (BATVars) {
        window.localStorage.setItem("batvars", JSON.stringify(window.EDUMETRICS));
    }
}

function loadBATVars() {
    var json_edumetrics = window.localStorage.getItem("batvars");
    if (json_edumetrics) {
        BATVars = $.parseJSON(json_edumetrics);
    }
}

// ------  Callback Functions ------

function alertGenericDismissed() {}

function alertSearchDismissed() {}

function audioSuccess() {}

function audioFail() {}

function enableNavRBtn() {
    navBtnR.removeAttr('disabled');
}

function gotFS(fileSystem){
    console.log("gotFS");
    batFileSystem=fileSystem;
    fileSystem.root.getFile(
        "dummy.html",{create:true, exclusive:false},
        function gotFileEntry(fileEntry){
            appLocalFilePath = fileEntry.fullPath.replace("dummy.html","");
            batMediaPath=appLocalFilePath + 'media/';
            batImgPath=appLocalFilePath + 'img/';
            batDataPath=appLocalFilePath + 'data/';
            batIncludesPath=appLocalFilePath + 'inc/';
            console.log("appLocalFilePath: " + appLocalFilePath);
            fileEntry.remove();

        },
        gotFSFail);
}

function gotFSFail(evt){
    console.log(evt.target.error.code);
}

// ------  Utility Functions -----

function loadSounds(){
    thud_sound=new Media('sounds/thud.wav',audioSuccess,audioFail);
    click_sound=new Media('sounds/click3.wav',audioSuccess,audioFail);
    ding_sound=new Media('sounds/ding.wav',audioSuccess,audioFail);
}

function downloadManifest(mode,fp) {
    if(checkConnection()=='wifi' && batFileSystem && appLocalFilePath){
        $('.admBtn').attr('disabled',true);
        var remURL = 'http://www.edumetricsconsulting.com/bat/' + fp;
        var locURL = appLocalFilePath + fp;
        var fileTransfer=new FileTransfer();
        fileTransfer.download(
            remURL,
            locURL,
            function(entry){
                entry.file(
                    function(file){
                        console.log('manifest downloaded');
                        var reader = new FileReader();
                        reader.onloadend = function(evt) {
                            var jsonStr= evt.target.result;
                            assetFileCtr = 0;
                            assetFileArr = eval('[' + jsonStr + ']');
                            // iterate through assetFileArr
                            downloadAssetFiles(mode);
                        };
                        reader.readAsText(file);
                    },
                    function(error){
                        console.log(error.code);
                        $('.admBtn').attr('disabled',false);
                    }
                );
            },
            function(error){
                console("download error");
                $('.admBtn').attr('disabled',false);
            }
        );
    }
}

function downloadAssetFiles(mode) {
    if(checkConnection()=='wifi' && batFileSystem && appLocalFilePath){
        if (assetFileCtr<assetFileArr.length){
            var cAssetCtr=assetFileCtr+1;
            var assetFileTotal=assetFileArr.length;
            var remURL = 'http://www.edumetricsconsulting.com/bat/' + assetFileArr[assetFileCtr].remURL;
            var fn = assetFileArr[assetFileCtr].filename;
            var locURL = appLocalFilePath + assetFileArr[assetFileCtr].locPath + fn;
            if($('#measLoadAlert').is(":hidden")) $('#measLoadAlert').show();

            batFileSystem.root.getFile(locURL,{create:false, exclusive:false},
                function fileExists(fileEntry){
                    //check local file date against remote file
                    fileEntry.getMetadata(
                        function(metadata){
                            var fd = metadata.modificationTime;
                            var dStr= assetFileArr[assetFileCtr].moddate;
                            var rd = new Date(dStr);
                            if(rd.getTime() > fd.getTime()){
                                //download the newer version
                                downloadRemoteFile(fn,remURL,locURL,mode,cAssetCtr,assetFileTotal);
                            } else {
                                if(mode=='start'){
                                    var ts = setTimeout(function() {
                                        $('#measLoadInfo').html('<div id="measLoadFileTotal">' + cAssetCtr + ' of ' + assetFileTotal + ' files</div><div id="measLoadPctComp">exists</div><div id="measLoadFileName">' + fn + '</div>');

                                    },100);
                                }
                                assetFileCtr++;
                                downloadAssetFiles(mode);
                            }
                        },
                        function(error){}
                    );
                },
                function fileMissing() {
                    console.log('downloadRemoteFile' + remURL);
                    downloadRemoteFile(fn,remURL,locURL,mode,cAssetCtr,assetFileTotal);
                }
            );
        } else {
            if(schManLoaded){
                // both common assets and school files/data loaded
                // refresh measure and student arrays

                loadMeasuresFromJsonFile('data/meas_list.txt');
                loadStudentsFromJsonFile('data/' + BATVars.school_id + '/student_list.txt');

                // load bat_utilities.js
                var utilFile = appLocalFilePath + 'js/bat_utilities.js';
                if(utilFile.fileExists()) {
                    $.getScript(utilFile, function(){
                        console.log('Load bat_utilities succeeded');
                    });
                } else {
                    console.log('bat_utilities missing');
                }

                // load database adapter
                console.log('loading dba');
                BAT.dba_adapt = new InMemoryAdapter();
                BAT.dba_adapt.initialize().done(function() {
                    console.log('dba init');
                });

                //refresh image on home page
                $('#adm_home_img').attr('src', batImgPath + 'adm_home_img.png');
                assetFileCtr=0;
                $('#measLoadInfo').html('');
                $('#measLoadAlert').hide();
                $('.admBtn').attr('disabled',false);
                console.log('all asset files loaded');
            } else {
                //download school manifest
                schManLoaded=true;
                var schManPath =  'data/' + BATVars.school_id + '/sch_manifest.txt';
                downloadManifest(mode,schManPath);
            }
        }
    }
}


function downloadRemoteFile(fn,remURL,locURL,mode,cAssetCtr,assetFileTotal){
    var fileTransfer=new FileTransfer();
    var pctComplete=0;
    fileTransfer.onprogress = function(progEvent){
        if(progEvent.lengthComputable){
            pctComplete= 100*(progEvent.loaded/progEvent.total);
            $('#measLoadInfo').html('<div id="measLoadFileTotal">' + cAssetCtr + ' of ' + assetFileTotal + ' files</div><div id="measLoadPctComp">' + pctComplete.toFixed(0) + '% complete</div><div id="measLoadFileName">' + fn + '</div>');
        }
    };
    fileTransfer.download(
        remURL,
        locURL,
        function(entry){
            // iterate through assetFileArr
            assetFileCtr++;
            downloadAssetFiles(mode);
        },
        function(error){
            console("download error");
        }
    );
}

function loadMeasuresFromJsonFile(fPath){
    batFileSystem.root.getFile(fPath,null,
        function(entry){
            entry.file(
                function(file){
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        var jsonStr= evt.target.result;
                        measures = eval('[' + jsonStr + ']');
                        refreshMeasureList();
                    };
                    reader.readAsText(file);
                },
                function(error){
                    console.log(error.code);
                }
            );
        },null
    );
}

function loadStudentsFromJsonFile(fPath){
    batFileSystem.root.getFile(fPath,null,
        function(entry){
            entry.file(
                function(file){
                    console.log('students list opened');
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        var jsonStr= evt.target.result;
                        try {
                            students = eval('[' + jsonStr + ']');
                        } catch(e) {
                            if(e instanceof SyntaxError) {
                                alert(e.message);
                            }
                        }
                    };
                    reader.readAsText(file);
                },
                function(error){
                    console.log(error.code);
                }
            );
        },null
    );
}


function checkConnection() {
    return navigator.connection.type;
}

function btnEnabled(btn) {
    var disBtn = $(btn).attr('disabled');
    return (typeof disBtn == 'undefined' || disBtn == false);
}

String.prototype.fileExists = function() {
    var filename = this.trim();

    var response = jQuery.ajax({
        url: filename,
        type: 'HEAD',
        async: false
    }).status;

    return (response == 200);
};

function validEmail(em){
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return filter.test(em);
}

function find (arr, key, val) { // Find array element which has a key value of val
    for (var ai, i = arr.length; i--;)
        if ((ai = arr[i]) && ai[key] == val)
            return ai;
    return null;
}





