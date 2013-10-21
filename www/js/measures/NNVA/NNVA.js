
var NNVA = {

    initialize: function() {
        console.log('NNVA initialize');
        if(!navBtnR.hasClass('meas_r')) navBtnR.addClass('meas_r');
        NNVA.bindEvents();
    },
    startMeas: function() {
        console.log('NNVA startMeas');
        groupTot = 5;
        qInGroup = 12;
        curQNum = 1;
        curGroupNum=1;
        curSampNum = 1;
        sampFinished = false;
        finished = false;
        selItm = 0;
        ansArr = [];
        showAnswer = true;
        nnvaActive = true;

        loadSampleQuestions();
        loadActivityQuestions();

        $("#stu_nav_btn_r").attr('rel','meas_ok');
        navBtnR.attr('disabled',true);
        NNVA.measIntro();
    },
    measIntro: function() {
        scont="<h1>In this activity ...</h1>";
        scont+="<h2>You will first look at the box at the top. There are three rows of shapes.</h2>";
        scont+="<h2>The shapes in each row form a pattern, going from left to right.</h2>";
        scont+="<h2>But the last shape in the bottom row is missing.</h2>";
        scont+="<h2>Touch the shape in the lower box that would be the best one to put in the empty space.</h2>";
        scont+="<h2>&nbsp;</h2>";
        scont+="<h2>Then touch the <b>Next</b> button to continue ...</h2>";
        scont+="<div style='margin-top:50px;'><img src='" + nnvaImgPath + "intro1.png' width='260' height='325' style='margin-right:50px;'>&nbsp;&nbsp;<img src='" + nnvaImgPath + "intro2.png' width='260' height='325' style='margin-right:50px;'>&nbsp;&nbsp;<img src='" + nnvaImgPath + "intro3.png' width='260' height='325'></div>";
        $('.stu_cont').html(scont);

        if(media1) media1.release();
        media1 = new Media(nnvaMediaPath + 'this-activity-box-at-the-top.mp3',
            function() {
                $('.stu_nav_btn_l').show();
                $('#stu_repeat_btn').hammer().off().on('tap', function() {
                    NNVA.measIntro();
                });
                measStep=1;
                enableNavRBtn();
            },
            audioFail
        );
        if(!measurePaused) media1.play();
    },
    samplesIntro1: function() {
        scont="<h1>Let's start with some sample questions!</h1>";
        scont+="<h2>After each answer, we will tell you if you got it right or wrong.</h2>";
        scont+="<h2>&nbsp;</h2>";
        scont+="<h2>Touch the <b>Next</b> button to continue ...</h2>";
        $('.stu_cont').html(scont);
        navBtnR.attr('disabled',true);

        if(media1) media1.release();
        media1 = new Media(nnvaMediaPath + 'lets-start-with-sample-questions.mp3',
            function() {
                if(media1) media1.release();
                media1 = new Media(nnvaMediaPath + 'after-answer-tell-you-right-wrong.mp3',
                    function() {
                        if(media1) media1.release();
                        media1 = new Media(nnvaMediaPath + 'touch-next-button.mp3',
                            function() {
                                $('.stu_nav_btn_l').show();
                                $('#stu_repeat_btn').hammer().off().on('tap', function() {
                                    NNVA.samplesIntro1();
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
            audioFail
        );
        if(!measurePaused) media1.play();
    },
    samplesIntro2: function() {
        navBtnR.attr('disabled',true);
        if(media1) media1.release();
        media1 = new Media(nnvaMediaPath + 'lets-start-with-sample-questions.mp3',
            function() {
                $('.stu_nav_btn_l').show();
                $('#stu_repeat_btn').hammer().off().on('tap', function() {
                    NNVA.samplesIntro2();
                });
                enableNavRBtn();
            },
            audioFail
        );
        if(!measurePaused) media1.play();
    },
    questionsIntro: function() {
        scont="<h1>Now we'll do the activity questions.</h1>";
        scont+="<h2>There are five groups. Each group has twelve questions.</h2>";
        scont+="<h2>This time, we won't tell you whether you were right or wrong.</h2>";
        scont+="<h2>Take your time and look at the pattern.</h2>";
        scont+="<h2>&nbsp;</h2>";
        scont+="<h2>When you're ready, touch the <b>Next</b> button.</h2>";
        $('.NNVA_qcont').html(scont);

        if(media1) media1.release();
        media1 = new Media(nnvaMediaPath + 'now-well-do-activity-questions.mp3',
            function() {
                if(media1) media1.release();
                media1 = new Media(nnvaMediaPath + 'five-groups-twelve-questions.mp3',
                    function() {
                        if(media1) media1.release();
                        media1 = new Media(nnvaMediaPath + 'take-your-time-look-at-pattern.mp3',
                            function() {
                                if(media1) media1.release();
                                media1 = new Media(nnvaMediaPath + 'touch-next-button.mp3',
                                    function() {
                                        $('.stu_nav_btn_l').show();
                                        $('#stu_repeat_btn').hammer().off().on('tap', function() {
                                            NNVA.questionsIntro();
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
            audioFail
        );
        if(!measurePaused) media1.play();
    },
    setQCont: function() {
        navBtnR.removeAttr('disabled');
        $('.stu_cont').html("<div class='NNVA_qcont'></div><div class='NNVA_sel c1' rel='1'></div><div class='NNVA_sel c2' rel='2'></div><div class='NNVA_sel c3' rel='3'></div><div class='NNVA_sel c4' rel='4'></div><div class='NNVA_sel c5' rel='5'></div><div class='NNVA_sel c6' rel='6'></div><div class='NNVA_sel c7' rel='7'></div><div class='NNVA_sel c8' rel='8'></div><div class='NNVA_reminderText'></div>");
        NNVA.bindAnsTap();
    },
    bindAnsTap: function() {
        $('.NNVA_sel').hammer().off().on('touch', function(event){
            console.log('NNVA_sel tap');
            selItm=$(this).attr('rel');
            $('.NNVA_sel').removeClass('NNVA_sel_hi');
            $(this).addClass('NNVA_sel_hi');
            thud_sound.play();
            navBtnR.removeAttr('disabled');
        });
    },
    endMeas: function() {
        console.log('NNVA endMeas');
        measurePaused=false;
        if(media1) media1.release();
        nnvaActive=false;
        $("#stu_nav_btn_r").attr('rel','intro');
    },
    pauseMeas: function() {
        measurePaused=true;
        if(media1) media1.pause();
    },
    resumeMeas: function() {
        measurePaused=false;
        if(media1) media1.play();
    },
    playMedia: function(fn,disBtn) {
        if(media1) media1.release();
        if(disBtn) {
            navBtnR.attr('disabled',disBtn);
            media1 = new Media(nnvaMediaPath + fn,waitSuccess,audioFail);
        } else {
            media1 = new Media(nnvaMediaPath + fn,audioSuccess,audioFail);
        }
        media1.play();
    },
    bindEvents: function() {
        console.log('NNVA bindEvents');
        $('.meas_r').hammer().off().on('tap', function() {
            if(nnvaActive && !finished && btnEnabled(this)) {
                $('.stu_nav_btn_l').hide();
                if(measStep==1) {
                    //show samplesIntro
                    NNVA.samplesIntro1();
                } else if(measStep==2) {
                    //show the first sample question
                    qTot = qArr.length;
                    sampTot = sampArr.length;
                    console.log('sampLen=' + sampTot + '   qLen=' + qTot);
                    NNVA.setQCont();
                    NNVA.getQuestion(1,1,true);
                    $('#stu_nav_btn_r_txt').html('Check Answer');
                    showAnswer=true;
                    curSampNum++;
                    measStep=3;
                    NNVA.samplesIntro2();
                } else if(measStep==3) {
                    //continue to show rest of sample questions
                    console.log('measStep=3');
                    if(showAnswer) {
                        var corrAns= sampArr[curSampNum-2].an;
                        $('#stu_nav_btn_r_txt').html('Next');
                        if(selItm==corrAns) {
                            NNVA.playMedia('correct-1.mp3',false);
                        } else {
                            $('.NNVA_sel[rel="' + corrAns + '"]').addClass('NNVA_ans_hi');
                            NNVA.playMedia('correct-answer-green-box.mp3',false);
                        }
                        showAnswer=false;
                    } else {
                        // go to next sample question
                        if(curSampNum<=sampTot) {
                            NNVA.getQuestion(1,curSampNum,true);
                            $('#stu_nav_btn_r_txt').html('Check Answer');
                            showAnswer=true;
                            curSampNum++;
                        } else {
                            // finish sample questions
                            NNVA.removeAnsHi();
                            navBtnR.attr('disabled',true);
                            sampFinished=true;
                            selItm=0;
                            NNVA.questionsIntro();
                        }
                    }
                } else if(measStep==4) {
                    //show activity questions
                    $('.NNVA_reminderText').hide();

                    // save selection
                    if(curQNum>1 && selItm>0) NNVA.saveAnswer(curGroupNum,curQNum-1,selItm);
                    if(curQNum>qInGroup){
                        curQNum=1;
                        curGroupNum++;
                    }
                    // if we've reached the end
                    if(curGroupNum>groupTot) {
                        // save results
                        NNVA.saveResults();
                        // finish measure
                        finished=true;
                        navBtnR.attr('rel','intro');
                        navBtnR.removeClass('meas_l');
                        scont="<h1>You're done with this activity!</h1>";
                        $('.stu_cont').html(scont);
                        NNVA.playMedia('great-youre-done.mp3',false);
                        NNVA.endMeas();
                    } else {
                        NNVA.getQuestion(curGroupNum,curQNum,false);
                        curQNum++;
                    }
                }
            }
        });
    },
    getQuestion: function(groupnum,qnum,sample) {
        NNVA.removeAnsHi();
        NNVA.checkFastAnswering();
        var s1 = (sample) ? 'Sample ' : 'Question ';
        var s2 = (sample) ? 'S' : '';
        var qStr = groupnum + '-' + qnum;
        $('.NNVA_qcont').html("<div class='NNVA_qnum'>" + s1 + qStr + "</div><div class='NNVA_matrix'><img src='" + nnvaImgPath + "Q" + s2 + qStr + ".png'></div><div class='NNVA_choices'><img src='" + nnvaImgPath + "A" + s2 + qStr + ".png'></div>");
        // get start time
        if(!sample) {
            startQTime=new Date();
            qReminder1=setTimeout(NNVA.qTimeRem1,rem1Millisecs);
        }
        navBtnR.attr('disabled',true);
    },
    checkFastAnswering: function() {
        var x = ansArr.length;
        if(x>3){
            if(!(ansArr[x-1].ca || ansArr[x-2].ca || ansArr[x-3].ca) && (ansArr[x-1].tm + ansArr[x-2].tm + ansArr[x-3].tm < 20) && fastAnswerCtr>3) {
                fastAnswerCtr=0;
                // play audio clip?
                navigator.notification.alert('Take your time and look for the pattern.',alertSearchDismissed,'Remember');
            }
        }
        fastAnswerCtr++;
    },
    saveAnswer: function(groupnum,qnum,answer) {
        // get end time, cancel reminder timer
        clearTimeout(qReminder1);
        endQTime=new Date();
        // get time to answer this question
        var idx=(qInGroup*(groupnum-1)) + qnum;
        var timeDiff= endQTime.getTime()-startQTime.getTime();
        var secElapsed=Math.round(timeDiff/1000);
        // get question/answer data
        var qi= qArr[idx-1].qi;
        var an= qArr[idx-1].an;
        var corrAns=(answer==an);
        console.log('{"id": ' + idx + ', "qi": ' + qi + ', "an": ' + answer + ', "ca": ' + corrAns + ', "tm": ' + secElapsed + '}');
        // save data to array
        ansArr[idx-1]={"id": idx, "qi": qi, "an": answer, "ca": corrAns, "tm": secElapsed};
    },
    saveResults: function() {
        var corrTot=0;
        for(i=0;i<qTot;i++) {
            if(ansArr[i].ca) corrTot++;
        }
        var nnvaResData = { 'op': 'procResDataSingle','key': 1, 'measure_name': 'NNVA', "school_id": BATVars.school_id, "student_id": BATVars.selStudentId, "grade_level": BATVars.selStudentGrade, "admin_id": BATVars.admin_id, "score": score, "res_data": ansData};
        if(checkConnection()=='wifi'){
            // save to server
            var ansData= JSON.stringify(ansArr);
            var score=10*(corrTot/qTot);
            $.ajax({
                type: 'POST',
                url: baseAjax,
                data: nnvaResData,
                timeout: 30000,
                headers: { "cache-control": "no-cache" },
                crossDomain: true,
                success: function(data,status,xhr) {
                    var errMsg= data.errMsg;
                    console.log('Saved NNVA results - errMsg:' + errMsg);
                    if (errMsg == "") {

                    }
                    else {
                        // Display error message
                        navigator.notification.alert(errMsg,alertSearchDismissed,'Error');
                    }
                },
                error: function(data,status,xhr) {
                    navigator.notification.alert('Measure data not saved',alertSearchDismissed,'Data save error');
                }
            });
        } else {
            //save locally for later upload
            localResultData.push(nnvaResData);
        }
    },
    qTimeRem1: function() {
        $('.NNVA_reminderText').hide().html("Please make a selection and touch the Next button").fadeIn('slow');
    },
    removeAnsHi: function() {
        $('.NNVA_sel').removeClass('NNVA_sel_hi');
        $('.NNVA_sel').removeClass('NNVA_ans_hi');
    }
};

var measStep=0;
var qTot;
var qInGroup;
var sampTot;
var curGroupNum;
var curQNum;
var curSampNum;
var nnvaImgPath=appLocalFilePath + 'measures/nnva/img/';
var nnvaMediaPath=appLocalFilePath + 'measures/nnva/media/';
var sampFinished;
var finished=false;
var selItm;
var ansArr;
var showAnswer;
var startQTime;
var endQTime;
var qReminder1;
var rem1Millisecs=45000;   // 45 seconds until reminder
var fastAnswerCtr=0;
var nnvaActive;
var scont;

var sampArr = [];
var qArr = [];


// ------

NNVA.initialize();

function waitSuccess() {
    navBtnR.removeAttr('disabled');
}

function loadQArray(qArr,lPath){
    batFileSystem.root.getFile(lPath,null,
        function(entry){
            entry.file(
                function(file){
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        var jsonStr= evt.target.result;
                        try {
                            qArr = eval('[' + jsonStr + ']');
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

function loadSampleQuestions(){
    var lPath='measures/nnva/data/nnva_samp_data.txt';
    batFileSystem.root.getFile(lPath,null,
        function(entry){
            entry.file(
                function(file){
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        var jsonStr= evt.target.result;
                        try {
                            sampArr = eval('[' + jsonStr + ']');
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

function loadActivityQuestions(){
    var lPath='measures/nnva/data/nnva_data.txt';
    batFileSystem.root.getFile(lPath,null,
        function(entry){
            entry.file(
                function(file){
                    var reader = new FileReader();
                    reader.onloadend = function(evt) {
                        var jsonStr= evt.target.result;
                        qArr = eval('[' + jsonStr + ']');
                    };
                    reader.readAsText(file);
                },
                function(error){
                    console.log(error.code);
                }
            );
        },
        function(error){
            console.log(error.code);
        }
    );
}




