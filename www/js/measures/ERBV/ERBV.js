var ERBV = {

    initialize: function() {
        console.log('ERBV initialize');
        // load HR plugin js file
        var pluginFile = appLocalFilePath + 'js/HRMPlugin.js';
        if(pluginFile.fileExists()) {
            $.getScript(pluginFile, function() {
                console.log('HRMPlugin.js loaded');
                if(!navBtnR.hasClass('meas_r')) navBtnR.addClass('meas_r');
                ERBV.bindEvents();
            });
        } else {
            console.log('HRMPlugin.js missing');
        }

    },
    startMeas: function() {
        console.log('ERBV startMeas');
        erbvActive = true;

        $("#stu_nav_btn_r").attr('rel','meas_ok');
        navBtnR.attr('disabled',true);

        ERBV.measIntro();
    },
    measIntro: function() {
        scont="<h1>In this activity ...</h1>";
        scont+="<h2>You will watch two videos.</h2>";
        scont+="<h2>While you watch them, we will keep track of your heart beat.</h2>";
        scont+="<h2>The monitor should be on your wrist and started.</h2>";
        scont+="<h2>&nbsp;</h2>";
        scont+="<h2>Touch the <b>Next</b> button to continue ...</h2>";
        $('.stu_cont').html(scont);

        if(media1) media1.release();
        media1 = new Media(erbvMediaPath + 'erbv-in-this-activity.mp3',
            function() {
                media1.release();
                media1 = new Media(erbvMediaPath + 'touch-next-button.mp3',
                    function() {
                        $('.stu_nav_btn_l').show();
                        $('#stu_repeat_btn').hammer().off().on('tap', function() {
                            ERBV.measIntro();
                        });
                        measStep=1;
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
    pauseMeas: function() {
        measurePaused=true;
        if(myVidPlayer1) {
            if(window.HRMPlugin && window.HRMPlugin.HRMIsConnected()) window.HRMPlugin.readPause();
            myVidPlayer1.pause();
        }
        if(media1) media1.pause();
    },
    resumeMeas: function() {
        measurePaused=false;
        if(myVidPlayer1) {
            if(window.HRMPlugin && window.HRMPlugin.HRMIsConnected()) window.HRMPlugin.readStart();
            myVidPlayer1.play();
        }
        if(media1) media1.play();
    },
    endMeas: function() {
        console.log('ERBV endMeas');
        measurePaused=false;
        if(window.HRMPlugin && window.HRMPlugin.HRMIsConnected()){
            window.HRMPlugin.readEnd();
            window.HRMPlugin.shutdown();
        }
        //if(media1) media1.release();
        if(myVidPlayer1) {
            myVidPlayer1.dispose();
        }
        erbvActive=false;
        $('.app_stu').removeClass('black_back');
        $("#stu_nav_btn_r").attr('rel','intro');
    },
    playMedia: function(fn,disBtn) {
        if(media1) media1.release();
        if(disBtn) {
            navBtnR.attr('disabled',disBtn);
            media1 = new Media(erbvMediaPath + fn,waitSuccess,audioFail);
        } else {
            media1 = new Media(erbvMediaPath + fn,audioSuccess,audioFail);
        }
        if(!measurePaused) media1.play();
    },
    dolphinsIntro: function() {
        scont="<h1>Dolphins Video</h1>";
        scont+="<h2>The first video is two minutes long.</h2>";
        scont+="<h2>It shows dolphins swimming in the ocean.</h2>";
        scont+="<h2>&nbsp;</h2>";
        scont+="<h2>Touch the <b>Next</b> button to continue ...</h2>";
        $('.stu_cont').html(scont);

        measStep=2;
        window.HRMPlugin.startup();

        media1.release();
        media1 = new Media(erbvMediaPath + 'erbv-video-dolphins.mp3',
            function() {
                media1.release();
                media1 = new Media(erbvMediaPath + 'touch-next-button.mp3',
                    function() {
                        $('.stu_nav_btn_l').show();
                        $('#stu_repeat_btn').hammer().off().on('tap', function() {
                            ERBV.dolphinsIntro();
                        });
                        measStep=2;
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
    jamieIntro: function() {
        scont="<h1>Jamie's Story</h1>";
        scont+="<h2>The next video is about a brave girl.</h2>";
        scont+="<h2>&nbsp;</h2>";
        scont+="<h2>Touch the <b>Next</b> button to continue ...</h2>";
        $('.stu_cont').html(scont);
        media1.release();
        media1 = new Media(erbvMediaPath + 'erbv-brave-girl.mp3',
            function() {
                media1.release();
                media1 = new Media(erbvMediaPath + 'touch-next-button.mp3',
                    function() {
                        $('.stu_nav_btn_l').show();
                        $('#stu_repeat_btn').hammer().off().on('tap', function() {
                            ERBV.jamieIntro();
                        });
                        measStep=3;
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
    questionIntro: function() {
        scont="<h1>That's it for the video</h1>";
        scont+="<h2>In case you were wondering, Jamie is doing fine today and has fully</h2>";
        scont+="<h2>recovered from her injuries. Now that you've watched the video, we</h2>";
        scont+="<h2>have a few questions about how you feel.</h2>";
        scont+="<h2>&nbsp;</h2>";
        scont+="<h2>Touch the <b>Next</b> button to continue ...</h2>";
        $('.stu_cont').html(scont);
        media1.release();
        media1 = new Media(erbvMediaPath + 'erbv-thats-it-videos.mp3',
            function() {
                media1.release();
                media1 = new Media(erbvMediaPath + 'erbv-questions-feel.mp3',
                    function() {
                        media1.release();
                        media1 = new Media(erbvMediaPath + 'touch-next-button.mp3',
                            function() {
                                $('.stu_nav_btn_l').show();
                                $('#stu_repeat_btn').hammer().off().on('tap', function() {
                                    ERBV.questionIntro();
                                });
                                measStep=4;
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

    bindEvents: function() {
        console.log('ERBV bindEvents');
        $('.meas_r').hammer().off().on('tap', function() {
            if(erbvActive && btnEnabled(this)) {
                $('.stu_nav_btn_l').hide();
                 if(measStep==1){
                     console.log('ERBV measStep=1');
                     // Check to see if HRM is ready.
                     // If not, alert teacher.
                     window.HRMPlugin.getConnectionStatus();
                     navBtnR.attr('disabled',true);
                     //wait 5 seconds before checking connection state
                     var ts = setTimeout(function() {
                         var cs = window.HRMPlugin.HRM.deviceConnectionState;
                         if(cs==1){
                             ERBV.dolphinsIntro();
                         } else {
                             navigator.notification.alert("Make sure the heart monitor is worn correctly and turned on. Then touch the 'Next' button.",alertSearchDismissed,'Heart Monitor');
                         }
                     },3000);

                 } else if(measStep==2){
                     navBtnR.attr('disabled',true);
                     scont="<video id='vid_dolphins' class='video-js vjs-default-skin' preload='auto' width='800' height='600' poster='" + erbvMediaPath + "dolphins.png'><source src='" + erbvMediaPath + "dolphins.mov' type='video/mp4' /></video><div class='HRM_data'><span id='vid_ctr'></span>&nbsp;&nbsp;&nbsp;<span id='bat_lvl'></span>&nbsp;&nbsp;&nbsp;<span id='hrm_ctr'></span></div>";

                     $('.app_stu').addClass('black_back');
                     $('.stu_nav').hide('slow');
                     $('.stu_cont').html(scont);

                     window.HRMPlugin.HRM.displayElementID='hrm_ctr';
                     myVidPlayer1=videojs('vid_dolphins',{'autoplay':true,'controls':false,'loop':false}, function(){
                         //5-second pause to allow HRM to calibrate
                         //var pause_timer = window.setTimeout(function(){myVidPlayer1.play();}, 5000);
                     });
                     myVidPlayer1.on("play",function(){
                         window.HRMPlugin.readStart();
                     });
                     myVidPlayer1.on("timeupdate",function(){
                         curVidPos= myVidPlayer1.currentTime();
                         var tot_secs=parseInt(curVidPos);
                         var mins=parseInt(tot_secs/60);
                         var secs=tot_secs % 60;
                         var res=(mins < 10 ? '0' + mins : mins) + ':' + (secs < 10 ? '0' + secs : secs);
                         $('#vid_ctr').html(res);
                         $('#bat_lvl').html('battery:' + window.HRMPlugin.HRM.batteryLevel + '%');
                     });
                     myVidPlayer1.on("error",function(){
                         window.HRMPlugin.readPause();

                         //attempt to restart at the current position
                         //myVidPlayer1.src(erbvMediaPath + 'dolphins.mov');
                         console.log('curVidPos=' + curVidPos);
                         myVidPlayer1.currentTime(curVidPos);
                         //myVidPlayer1.play();

                     });
                     myVidPlayer1.on("ended",function(){
                         myVidPlayer1.dispose();
                         $('#vid_dolphins').hide();
                         // end HRM reading
                         window.HRMPlugin.readEnd();
                         // calculate baseline stats
                         ERBV.calcBaseStats();

                         $('.app_stu').removeClass('black_back');
                         $('.stu_nav').show();
                         ERBV.jamieIntro();
                     });
                 } else if(measStep==3){
                     navBtnR.attr('disabled',true);
                     scont="<video id='vid_jamie' class='video-js vjs-default-skin' preload='auto' width='800' height='600' poster='" + erbvMediaPath + "jamie.png'><source src='" + erbvMediaPath + "jamie.mov' type='video/mp4' /></video><div class='HRM_data'><span id='vid_ctr'></span>&nbsp;&nbsp;&nbsp;<span id='bat_lvl'></span>&nbsp;&nbsp;&nbsp;<span id='hrm_ctr'></span></div>";

                     $('.app_stu').addClass('black_back');
                     $('.stu_nav').hide('slow');
                     $('.stu_cont').html(scont);

                     myVidPlayer2=videojs('vid_jamie',{'autoplay':true,'controls':false,'loop':false}, function(){

                     });
                     myVidPlayer2.on("play",function(){
                        // start HRM reading
                         window.HRMPlugin.readStart();
                     });
                     myVidPlayer2.on("timeupdate",function(){
                         var tot_secs=parseInt(myVidPlayer2.currentTime());
                         var mins=parseInt(tot_secs/60);
                         var secs=tot_secs % 60;
                         var res=(mins < 10 ? '0' + mins : mins) + ':' + (secs < 10 ? '0' + secs : secs);
                         $('#vid_ctr').html(res);
                         $('#bat_lvl').html('BL: ' + window.HRMPlugin.HRM.batteryLevel + '%');
                     });
                     myVidPlayer2.on("ended",function(){
                         myVidPlayer2.dispose();
                         $('#vid_jamie').hide();
                         // end HRM reading
                         window.HRMPlugin.readEnd();
                         window.HRMPlugin.shutdown();
                         // calculate stats
                         ERBV.calcReactionStats();

                         $('.app_stu').removeClass('black_back');
                         $('.stu_nav').show();
                         ERBV.questionIntro();
                     });
                 } else if(measStep==4){
                     ERBV.getQuestion(1);
                     measStep=5;
                 } else if(measStep==5){
                     if(ERBV.answerGiven()){
                         ansArr[11]=parseInt(selItm);
                         ERBV.getQuestion(2);
                         measStep=6;
                     }
                 } else if(measStep==6){
                     if(ERBV.answerGiven()){
                         ansArr[12]=parseInt(selItm);
                         ERBV.getQuestion(3);
                         measStep=7;
                     }
                 } else if(measStep==7){
                     if(ERBV.answerGiven()){
                         ansArr[13]=parseInt(selItm);
                         ERBV.getQuestion(4);
                         measStep=8;
                     }
                 } else if(measStep==8){
                     if(ERBV.answerGiven()){
                         ansArr[14]=parseInt(selItm);
                         //save results to server
                         ERBV.saveResults();

                         // finish measure
                         navBtnR.attr('rel','intro');
                         navBtnR.removeClass('meas_r');
                         scont="<h1>You're done with this activity!</h1>";
                         $('.stu_cont').html(scont);
                         ERBV.playMedia('great-youre-done.mp3',false);
                         ERBV.endMeas();
                     }
                 }
            }
        });
    },
    answerGiven: function(){
        if(selItm==0){
            media1.release();
            media1 = new Media(erbvMediaPath + 'erbv-please-touch-answer.mp3',
                function() {
                    media1.release();
                    media1 = new Media(erbvMediaPath + 'erbv-then-touch-next-button.mp3',
                        function() {
                            measStep=3;
                            enableNavRBtn();
                        },
                        audioFail
                    );
                    if(!measurePaused) media1.play();
                },
                audioFail
            );
            if(!measurePaused) media1.play();
            return false;
        } else {
            return true;
        }
    },
    getQuestion: function(qnum) {
        var sc;
        var erbv_q_media;
        var erbv_ch_media;
        switch(qnum) {
            case 1:
                sc="<h1>How <span class='underlined'>sad</span> do you feel?</h1>";
                sc+="<div class='clear20'></div>";
                sc+="<div class='erbv_qbox erbv_qbox_1 emo_3' rel='1'>Not sad at all</div>";
                sc+="<div class='erbv_qbox erbv_qbox_2 emo_4' rel='2'>A little bit sad</div>";
                sc+="<div class='erbv_qbox erbv_qbox_3 emo_5' rel='3'>Pretty sad</div>";
                sc+="<div class='erbv_qbox erbv_qbox_4 emo_6' rel='4'>Really sad</div>";
                erbv_q_media='erbv-q-sad';
                erbv_ch_media='erbv-sad';
                break;
            case 2:
                sc="<h1>How <span class='underlined'>happy</span> do you feel?</h1>";
                sc+="<div class='clear20'></div>";
                sc+="<div class='erbv_qbox erbv_qbox_1 emo_4' rel='1'>Not happy at all</div>";
                sc+="<div class='erbv_qbox erbv_qbox_2 emo_3' rel='2'>A little bit happy</div>";
                sc+="<div class='erbv_qbox erbv_qbox_3 emo_2' rel='3'>Pretty happy</div>";
                sc+="<div class='erbv_qbox erbv_qbox_4 emo_1' rel='4'>Really happy</div>";
                erbv_q_media='erbv-q-happy';
                erbv_ch_media='erbv-happy';
                break;
            case 3:
                sc="<h1>How <span class='underlined'>scared and worried</span> do you feel?</h1>";
                sc+="<div class='clear20'></div>";
                sc+="<div class='erbv_qbox erbv_qbox_1 emo_3' rel='1'>Not scared and worried at all</div>";
                sc+="<div class='erbv_qbox erbv_qbox_2 emo_4' rel='2'>A little bit scared and worried</div>";
                sc+="<div class='erbv_qbox erbv_qbox_3 emo_5' rel='3'>Pretty scared and worried</div>";
                sc+="<div class='erbv_qbox erbv_qbox_4 emo_6' rel='4'>Really scared and worried</div>";
                erbv_q_media='erbv-q-scared';
                erbv_ch_media='erbv-scared';
                break;
            case 4:
                sc="<h1>How <span class='underlined'>sorry</span> do you feel for Jamie, the girl who was burned?</h1>";
                sc+="<div class='clear20'></div>";
                sc+="<div class='erbv_qbox erbv_qbox_1 emo_3' rel='1'>Not sorry for Jamie at all</div>";
                sc+="<div class='erbv_qbox erbv_qbox_2 emo_4' rel='2'>A little bit sorry for Jamie</div>";
                sc+="<div class='erbv_qbox erbv_qbox_3 emo_5' rel='3'>Pretty sorry for Jamie</div>";
                sc+="<div class='erbv_qbox erbv_qbox_4 emo_6' rel='4'>Really sorry for Jamie</div>";
                erbv_q_media='erbv-q-sorry';
                erbv_ch_media='erbv-sorry';
                break;
            default:
        }
        navBtnR.attr('disabled',true);
        selItm=0;
        $('.stu_cont').html(sc);
        media1.release();
        media1 = new Media(erbvMediaPath + erbv_q_media + '.mp3',
            function() {
                erbv_hilite_choice(1);
                media1.release();
                media1 = new Media(erbvMediaPath + erbv_ch_media + '-1.mp3',
                    function() {
                        erbv_hilite_choice(2);
                        media1.release();
                        media1 = new Media(erbvMediaPath + erbv_ch_media + '-2.mp3',
                            function() {
                                erbv_hilite_choice(3);
                                media1.release();
                                media1 = new Media(erbvMediaPath + erbv_ch_media + '-3.mp3',
                                    function() {
                                        erbv_hilite_choice(4);
                                        media1.release();
                                        media1 = new Media(erbvMediaPath + erbv_ch_media + '-4.mp3',
                                            function() {
                                                erbv_hilite_choice(0);
                                                // only give instructions for the first question
                                                if(qnum==1){
                                                    media1.release();
                                                    media1 = new Media(erbvMediaPath + 'erbv-tap-button-how-you-feel.mp3',
                                                        function() {
                                                            media1.release();
                                                            media1 = new Media(erbvMediaPath + 'erbv-then-touch-next-button.mp3',
                                                                function() {
                                                                    ERBV.enableQBtns(erbv_ch_media,qnum);
                                                                },
                                                                audioFail
                                                            );
                                                            if(!measurePaused) media1.play();
                                                        },
                                                        audioFail
                                                    );
                                                    if(!measurePaused) media1.play();
                                                } else {
                                                    ERBV.enableQBtns(erbv_ch_media,qnum);
                                                }
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
    },
    enableQBtns: function(erbv_ch_media,qnum) {
        $('.erbv_qbox').hammer().off().on('tap', function(event){
            selItm=$(this).attr('rel');
            $('.erbv_qbox').removeClass('erbv_qbox_hi');
            $(this).addClass('erbv_qbox_hi');
            navBtnR.removeAttr('disabled');
            ERBV.playMedia(erbv_ch_media + '-' + selItm + '.mp3',false);
        });
        $('.stu_nav_btn_l').show();
        $('#stu_repeat_btn').hammer().off().on('tap', function() {
            ERBV.getQuestion(qnum);
        });
    },
    saveResults: function() {
        var erbvResData = { 'op': 'procResDataSingle','key': 1, 'measure_name': 'ERBV', "school_id": BATVars.school_id, "student_id": BATVars.selStudentId, "grade_level": BATVars.selStudentGrade, "admin_id": BATVars.admin_id, "score": 0, "res_data": ansData};
        if(checkConnection()=='wifi'){
            // save to server
            var ansData= JSON.stringify(ansArr);
            console.log('ERBV results:' + ansData);
            $.ajax({
                type: 'POST',
                url: baseAjax,
                data: erbvResData,
                timeout: 30000,
                headers: { "cache-control": "no-cache" },
                crossDomain: true,
                success: function(data,status,xhr) {
                    var errMsg= data.errMsg;
                    console.log('Saved ERBV results - errMsg:' + errMsg);
                    if (errMsg == "") {

                    }
                    else {
                        // Display error message
                        navigator.notification.alert(errMsg,alertSearchDismissed,'Error');
                    };
                },
                error: function(data,status,xhr) {
                    navigator.notification.alert('Measure data not saved',alertSearchDismissed,'Data save error');
                }
            });
        } else {
            // save results locally for later upload
            localResultData.push(erbvResData);
        }
    },
    qTimeRem1: function() {
        $('.ERBV_reminderText').hide().html("Please make a selection and touch the Next button").fadeIn('slow');
    },
    calcBaseStats: function() {
        var baseAvg=window.HRMPlugin.getReadArithmeticMean(35,95);
        var baseIndVar=window.HRMPlugin.getReadIndexOfVariability(0,95);
        ansArr[0]= parseFloat(baseAvg.toFixed(1));
        ansArr[1]= parseFloat(baseIndVar.toFixed(2));
        console.log('baseAvg:' + ansArr[0] + '  baseIndVar:' + ansArr[1]);
    },
    calcReactionStats: function() {
        var baseIndVar=window.HRMPlugin.getReadIndexOfVariability(0,281);
        var seg1Avg_Pre=window.HRMPlugin.getReadArithmeticMean(64,74);   //10-sec seg before fire seg
        var seg1Avg=window.HRMPlugin.getReadArithmeticMean(75,97);   //fire seg
        var seg1Avg_Post=window.HRMPlugin.getReadArithmeticMean(98,108);   //10-sec seg after fire seg
        var seg2Avg_Pre=window.HRMPlugin.getReadArithmeticMean(168,178); //10-sec seg before Jamie's recovery
        var seg2Avg=window.HRMPlugin.getReadArithmeticMean(179,213); //Jamie's recovery
        var seg2Avg_Post=window.HRMPlugin.getReadArithmeticMean(214,224); //10-sec seg after Jamie's recovery
        var seg3Avg_Pre=window.HRMPlugin.getReadArithmeticMean(253,263); //10-sec seg before playground taunting
        var seg3Avg=window.HRMPlugin.getReadArithmeticMean(264,281); //playground taunting
        ansArr[2]=parseFloat(baseIndVar.toFixed(2));
        ansArr[3]=parseFloat(seg1Avg_Pre.toFixed(1));
        ansArr[4]=parseFloat(seg1Avg.toFixed(1));
        ansArr[5]=parseFloat(seg1Avg_Post.toFixed(1));
        ansArr[6]=parseFloat(seg2Avg_Pre.toFixed(1));
        ansArr[7]=parseFloat(seg2Avg.toFixed(1));
        ansArr[8]=parseFloat(seg2Avg_Post.toFixed(1));
        ansArr[9]=parseFloat(seg3Avg_Pre.toFixed(1));
        ansArr[10]=parseFloat(seg3Avg.toFixed(1));
    }
};

var erbvImgPath=appLocalFilePath + 'measures/erbv/img/';
var erbvMediaPath=appLocalFilePath + 'measures/erbv/media/';

var myVidPlayer1,myVidPlayer2;
var curVidPos=0;
var measStep;
var selItm;
var ansArr=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

// ------

ERBV.initialize();

function waitSuccess() {
    navBtnR.removeAttr('disabled');
}

function erbv_hilite_choice(idx) {
    $('.erbv_qbox').removeClass('erbv_qbox_hi');
    $('.erbv_qbox_'+idx).addClass('erbv_qbox_hi');
}

$('.stu_nav_wrap').hammer().off().on('tap', function(){
    if(!$('.stu_nav').is(":visible")) $('.stu_nav').show();
});


