
var ANT = {

    settings: {

    },

    init: function() {
        s=this.settings;

    },

    bindUIActions: function() {

    },

    startMeas: function() {

    },

    pauseMeas: function() {

    },

    endMeas: function() {

    },

    saveData: function() {

    }
};

// ------ Variables

var softwareVersion = '1.0';
var trialResults = [];
var currentBlock;
var currentTrial;
var trialCount;
var trialStartTime;

var id;
var age;
var gender;
var sessionNumber;
var studyID;
var targetType;
var monitorSize;

var ppi;
var frameWidth;
var frameHeight;
var frameMarginHeight;
var targetWidth;
var targetHeight;
var spacing;

var viewStack = new Array();

var setupData = [];
var resultsData = [];
var testBlock = 0;
var numberOfTestBlocks = 4;

var frameMarginHeightInches = 0.25;
var targetWidthInches = 0.5;
var targetHeightInches = 0.5;
var spacingInches = 0.4;

// ------ OnLoad functions

function onLoad() {
    getInputData();
    pushView('instructionPage1');
}

// ------ Trial functions

//blockNumber is the current phase of te test.  It will be 0 for the practice phase and then 1 and 2 for the actual test
//inputTrialSet is expected to contain the trials, order doesn't matter (it's randomized internally).  Each trial is run exactly once.  If you need duplicates of trials, they MUST be in here multiple times.
function startTest(blockNumber, inputTrialSet) {
    document.onkeydown = earlyEnd;			//Set the early interrupt
    currentBlock = blockNumber;				//Keep track of the current block
    currentTrial = 0;						//The current data set uses 32 trials/test
    trialCount = inputTrialSet.length;		//All tests are 32 trials, but check anyway
    trialResults = [];						//We'll keep our results in this array
    practiceFeedbackUP = document.getElementById('practiceFeedbackUP');
    practiceFeedbackDOWN = document.getElementById('practiceFeedbackDOWN');
    iPadLeft = 	document.getElementById('iPadLeft');
    iPadRight = document.getElementById('iPadRight');

    //Setup the test in random order
    for (trialIndex=currentTrial; trialIndex<(trialCount+currentTrial); trialIndex++) {
        sourceTrial = randomNumber(0,(inputTrialSet.length-1));		//Get a random trial
        trialResults[trialIndex] = inputTrialSet[sourceTrial];	//Set up the results to contain the trial info
        inputTrialSet.splice(sourceTrial,1);							//Remove the current trial from the pool, so we don't get it again
    }

    //Go through the test in reverse order and setup the view stack so we can quickly flip through them during testing
    for (reverseTrialIndex=(trialResults.length-1);reverseTrialIndex>=currentTrial;reverseTrialIndex--) {
        pushView('cueType10');
        pushView(trialResults[reverseTrialIndex][1]+trialResults[reverseTrialIndex][2]+trialResults[reverseTrialIndex][4]);
        pushView('cueType10');
        pushView('cueType'+trialResults[reverseTrialIndex][0]+trialResults[reverseTrialIndex][3]);
        pushView('cueType10');
    }
    pushView('blankView');
    startTrial();							//Start the first trial
}

function startTrial() {
    trialResults[currentTrial][10] = new Date();							//Start time, for accurate inter-trial times
    stage1();														//Move on to the first screen
}

//Initial Fixation
function stage1() {
    stage1Time = randomNumber(400,1000);		//Get a random integer between 400 and 1000
    popView();									//Display the fixation cross
    currentTimer = setTimeout('stage2()',stage1Time);			//Delay for the random period above
    //Risky to do things after the timeout is set, but it keeps us on time
    trialResults[currentTrial][6] = stage1Time;	//Save the time in the output
    practiceFeedbackUP.innerHTML = '';
    practiceFeedbackDOWN.innerHTML = '';
}

//Cue
function stage2() {
    popView();					//Display the appropriate cue
    currentTimer = setTimeout('stage3()',100);	//Delay 100ms
}

//Second Fixation
function stage3() {
    popView();					//Remove the cue
    currentTimer = setTimeout('stage4()',400);	//Delay 400ms
}

//Target
function stage4() {
    popView();											//Display the target
    stage4Timer = startTimer('stage4Callback()',1500);	//Delay 1500ms unless interrupted.  We use the startTimer() function for an interruptable timer.
    trialResults[currentTrial][11] = new Date();		//Save the current date (for time later)
    document.onkeydown = stage4Interrupted;				//Set up the interrupt
}

//Timeout
function stage4Callback() {
    document.onkeydown = earlyEnd;				//Disable that interrupt so it can't be triggered later
    trialResults[currentTrial][7] = 1500;	//Failed, so max reation time
    trialResults[currentTrial][8] = 0;		//No key pressed
    practiceFeedbackUP.innerHTML = 'Timeout';
    practiceFeedbackDOWN.innerHTML = 'Timeout';
    stage5();								//Proceed to next stage immediately
}

//Interrupt
function stage4Interrupted(e) {
    //Check e (for IE safety)
    if (!e) {
        e = window.event;												//If IE, use window.event instead
    }
    //Check if it was a key we care about (left or right arrow)
    if (e.keyCode == 37) {
        document.onkeydown = earlyEnd;									//We're in!  Disable interrupt
        trialResults[currentTrial][7] = interruptTimer(stage4Timer);	//Stop the timer and get the reaction time
        trialResults[currentTrial][8] = e.keyCode;						//Save the keycode for later
        if(trialResults[currentTrial][4] == 'L'){
            practiceFeedbackUP.innerHTML = 'Correct';
            practiceFeedbackDOWN.innerHTML = 'Correct';
        } else {
            practiceFeedbackUP.innerHTML = 'Incorrect';
            practiceFeedbackDOWN.innerHTML = 'Incorrect';
        }
        stage5();														//Proceed to next stage
    } else if (e.keyCode == 39) {
        document.onkeydown = earlyEnd;									//We're in!  Disable interrupt
        trialResults[currentTrial][7] = interruptTimer(stage4Timer);	//Stop the timer and get the reaction time
        trialResults[currentTrial][8] = e.keyCode;						//Save the keycode for later
        if(trialResults[currentTrial][4] == 'R'){
            practiceFeedbackUP.innerHTML = 'Correct';
            practiceFeedbackDOWN.innerHTML = 'Correct';
        } else {
            practiceFeedbackUP.innerHTML = 'Incorrect';
            practiceFeedbackDOWN.innerHTML = 'Incorrect';
        }
        stage5();														//Proceed to next stage
    } else if (e.keyCode == 27) {
        earlyEnd(e);
    }
}

//Inter-trial Fixation
function stage5() {
    popView();							//Show the fixation again
    nowDate = new Date().getTime();		//Get the date for use in the timeout
    if (currentTrial<(trialCount-1)){	//If we're not on the last trial, we loop
        currentTrial++;					//Increment the number for the next round
        currentTimer = setTimeout('startTrial()', 3500-(nowDate-trialResults[currentTrial-1][10].getTime()));
        //We set up the timer to use the time delta from the beginning, rather than adding up the stage 1 and 4 times above.  This keeps everything ever-so-slightly more accurate throughout multiple trials
    } else {
        //If we are done, let's wrap it up
        currentTimer = setTimeout('endTest()', 3500-(nowDate-trialResults[currentTrial][10].getTime()));
    }
}

function earlyEnd(e) {
    //Check e (for IE safety)
    if (!e) {
        e = window.event;												//If IE, use window.event instead
    }
    //Check if it was a key we care about (left or right arrow)
    if (e.keyCode == 27) {
        //Kill all timers
        clearTimeout(currentTimer);
        clearTimeout(stage4Timer);
        //Disable keydown event trigger
        document.onkeydown = null;
        //Delete current trial
        trialResults.splice(currentTrial, trialCount-currentTrial);
        if(testBlock || !confirm('Press OK to skip the practice round or press Cancel to cancel the entire test')) {
            //Turn up the currentBlock so that no more tests will run
            testBlock = 4;
        }
        //End test/trial
        endTest();
    }


}

//Finale
function endTest() {
    testCallback(currentBlock,trialResults);		//That's it!  Let's move on to the results.
}

// ------ Navigation functions

function getInputData() {
    monitorSize = 10;
    ppi = calculatePPI();
    setupData = [0, 0, 'm', 0, 0, 0, 'Arrow', new Date(), 'endDate', monitorSize, ppi];
    setupDisplay();
}

function calculatePPI() {
    screenWidth = screen.width;
    screenHeight = screen.height;
    aspectRatio = screenWidth/screenHeight;
    return ((screenWidth/(monitorSize))*(Math.sqrt(1 + (1/(aspectRatio*aspectRatio)))));
}

function submitForm() {
    getInputData();
    pushView('instructionPage1');
}

function pushView(viewID) {
    if (viewStack.length > 0)
        viewStack[viewStack.length - 1].style.visibility = "hidden";
    view = document.getElementById(viewID);
    view.style.visibility = "visible";
    viewStack.push(view);
}

function popView() {
    viewStack.pop().style.visibility = "hidden";
    viewStack[viewStack.length - 1].style.visibility = "visible";
}

function areYouReady() {
    if(confirm('Are you ready to begin?')) {
        document.getElementById('practiceFeedbackUP').style.visibility='visible';
        document.getElementById('practiceFeedbackDOWN').style.visibility='visible';
        startTest(testBlock, trialSet());
    }
}

function testCallback(block, data) {
    resultsData[block] = data;
    document.getElementById('practiceFeedbackUP').style.visibility='hidden';
    document.getElementById('practiceFeedbackDOWN').style.visibility='hidden';
    if (testBlock < numberOfTestBlocks) {
        testBlock++;
        if (testBlock%2)
            alert('Are you ready to start Test#' + (testBlock+1)/2 + '?');
        startTest(testBlock, trialSet());
    } else {
        popView();
        pushView('exportPage');
        generateExportLink(resultsData);
        testBlock = 0;
    }
}

// ------ Display functions

function setupDisplay() {
    //Calculate the following parameters in pixels based on the PPI
    frameWidth = targetWidthInches*6*ppi;
    frameHeight = ((frameMarginHeightInches + spacingInches)*2 + (targetHeightInches*3)) * ppi;
    frameMarginHeight = frameMarginHeightInches * ppi;
    targetWidth = targetWidthInches * ppi;
    targetHeight = targetHeightInches * ppi;
    spacing = spacingInches * ppi;

    //Adjust the size of the "testPage" frame
    testPage = document.getElementById('testPage');
    testPage.style.height = ""+frameHeight+"px";
    testPage.style.width = ""+frameWidth+"px";

    //Adjust the size of the "testPageContainer" frame
    testPageContainer = document.getElementById('testPageContainer');
    testPageContainer.style.height = ""+frameHeight+"px";
    testPageContainer.style.width = ""+frameWidth+"px";
    testPageContainer.style.left = ""+((window.innerWidth - frameWidth)/2)+"px";
    testPageContainer.style.top = ""+((window.innerHeight - frameHeight)/2)+"px";

    document.getElementById('practiceFeedbackUP').style.top = ""+frameMarginHeight+"px";
    document.getElementById('practiceFeedbackDOWN').style.bottom = ""+frameMarginHeight+"px";

    //Regex expressions for finding items by class names
    frameMarginRegex = new RegExp('\\bframeMargin\\b');
    spacingRegex = new RegExp('\\bspacing\\b');
    targetRegex = new RegExp('\\btarget\\b');
    cueRegex = new RegExp('\\bcue\\b');
    targetTypeRefRegex = new RegExp('\\btargetTypeRef\\b');
    displayRegex = new RegExp('\\bdisplay\\b');

    //Loop through all elements and adjust their sizes according to the PPI
    elements = document.getElementsByTagName('*');
    for(i=0; i<elements.length; i++) {
        if(frameMarginRegex.test(elements[i].className)) {			//Frame Margin
            elements[i].style.height = ""+frameMarginHeight+"px";
        }else if(spacingRegex.test(elements[i].className)) {		//Spacing
            elements[i].style.height = ""+spacing+"px";
            //elements[i].style.width = ""+(2*spacing)+"px";
        }else if(targetRegex.test(elements[i].className)) {			//Target
            leftRegex = new RegExp('Left');
            rightRegex = new RegExp('Right');
            if(leftRegex.test(elements[i].getAttribute('src')))
                elements[i].setAttribute('src', "images/targets/" + targetType + "Left.png");
            if(rightRegex.test(elements[i].getAttribute('src')))
                elements[i].setAttribute('src', "images/targets/" + targetType + "Right.png");
            elements[i].style.width = ""+targetWidth+"px";
            elements[i].style.height = ""+targetHeight+"px";
        }else if(cueRegex.test(elements[i].className)) {			//Cue
            elements[i].style.width = ""+targetWidth+"px";
            elements[i].style.height = ""+targetHeight+"px";
        }else if(targetTypeRefRegex.test(elements[i].className)) {	//Stimulus Type
            elements[i].innerHTML = targetType.toLowerCase();
        }else if(displayRegex.test(elements[i].className)) {		//Display
            elements[i].style.width = ""+frameWidth+"px";
            elements[i].style.height = ""+frameHeight+"px";
        }
    }
}

// ------ Analysis functions

function generateSummary(userInfo, results) {
    //These are sub-arrays, filtered versions of the full array
    var allCorrectRT = [];
    var C1T1 = [];
    var C1T2 = [];
    var C2T1 = [];
    var C2T2 = [];
    var C3T1 = [];
    var C3T2 = [];
    var C4T1 = [];
    var C4T2 = [];
    var allResults = [];
    if (results[1]) {
        allResults = results[1];
        if (results[2]) {
            allResults = results[1].concat(results[2]);
            if (results[3]) {
                allResults = results[1].concat(results[2]).concat(results[3]);
                if (results[3])
                    allResults = results[1].concat(results[2]).concat(results[3]).concat(results[4]);
            }
        }
    }

    for (i in allResults) {
        allResults[i][9] = 0;						//Start with Correct marked False
        if (isCorrect(allResults[i])) {				//Check the keypress
            allResults[i][9] = 1;					//Mark correct if so
            allCorrectRT.push(allResults[i][7]);	//Add its time to the correct list
        }

        //Figure out what type of trial it is, of the 8 possible, and sort
        if((allResults[i][0]==1)&&(allResults[i][1]=='congruent')) {
            C1T1.push(allResults[i]);
        } else if((allResults[i][0]==1)&&(allResults[i][1]=='incongruent')) {
            C1T2.push(allResults[i]);
        } else if((allResults[i][0]==2)&&(allResults[i][1]=='congruent')) {
            C2T1.push(allResults[i]);
        } else if((allResults[i][0]==2)&&(allResults[i][1]=='incongruent')) {
            C2T2.push(allResults[i]);
        } else if((allResults[i][0]==3)&&(allResults[i][1]=='congruent')) {
            C3T1.push(allResults[i]);
        } else if((allResults[i][0]==3)&&(allResults[i][1]=='incongruent')) {
            C3T2.push(allResults[i]);
        } else if((allResults[i][0]==4)&&(allResults[i][1]=='congruent')) {
            C4T1.push(allResults[i]);
        } else if((allResults[i][0]==4)&&(allResults[i][1]=='incongruent')) {
            C4T2.push(allResults[i]);
        }
    }

    var summary = [];
    //The first row is the headers
    summary[0] = ['uniqueID','studyID','ANTversion','targFile','ANTdate','ANTtime','SessionDur','Session','Age','Sex','Group','ANT.N','med.all','mean.all','sd.all','min.all','max.all','alert','orient','conflict','pc.all','e.all','nocue','double','centre','spatial','cong','incong','med.C1T1','med.C1T2','med.C2T1','med.C2T2','med.C3T1','med.C3T2','med.C4T1','med.C4T2','mean.C1T1','mean.C1T2','mean.C2T1','mean.C2T2','mean.C3T1','mean.C3T2','mean.C4T1','mean.C4T2','e.nocue','e.double','e.centre','e.spatial','e.incong','e.cong','pc.C1T1','pc.C1T2','pc.C2T1','pc.C2T2','pc.C3T1','pc.C3T2','pc.C4T1','pc.C4T2']
    summary[1] = [];
    summary[1][0] = userInfo[0];							//userID
    summary[1][1] = userInfo[4];							//studyID
    summary[1][2] = softwareVersion;						//ANTversion
    summary[1][3] = userInfo[6];							//targFile
    summary[1][4] = formatDate(userInfo[7]);				//ANTdate
    summary[1][5] = formatTime(userInfo[7]);				//ANTtime
//	summary[1][6] = (userInfo[8]-userInfo[7])/1000;
    summary[1][6] = formatMilliseconds(userInfo[8]-userInfo[7]);	//SessionDur
    summary[1][7] = userInfo[3];							//Session
    summary[1][8] = userInfo[1];							//Age
    summary[1][9] = userInfo[2];							//Sex
    summary[1][10] = userInfo[5];							//Group
    summary[1][11] = allResults.length						//ANT.N
    summary[1][12] = median(allCorrectRT);					//med.all
    summary[1][13] = mean(allCorrectRT);					//mean.all
    summary[1][14] = (Math.round((standardDeviation(allCorrectRT))*100))/100;		//sd.all
    summary[1][15] = arrayMin(allCorrectRT);				//min.all
    summary[1][16] = arrayMax(allCorrectRT);				//max.all

    //Now we're going to work from the bottom up, because it makes the math easier
    //pc = Percent Correct, not Percent Error, I think
    summary[1][57] = (Math.round((100-percentError(C4T2))*100))/100;				//pc.C4T2
    summary[1][56] = (Math.round((100-percentError(C4T1))*100))/100;				//pc.C4T1
    summary[1][55] = (Math.round((100-percentError(C3T2))*100))/100;				//pc.C3T2
    summary[1][54] = (Math.round((100-percentError(C3T1))*100))/100;				//pc.C3T1
    summary[1][53] = (Math.round((100-percentError(C2T2))*100))/100;				//pc.C2T2
    summary[1][52] = (Math.round((100-percentError(C2T1))*100))/100;				//pc.C2T1
    summary[1][51] = (Math.round((100-percentError(C1T2))*100))/100;				//pc.C1T2
    summary[1][50] = (Math.round((100-percentError(C1T1))*100))/100;				//pc.C1T1

    totalCong = C1T1.concat(C2T1,C3T1,C4T1);
    summary[1][49] = percentError(totalCong);				//e.cong
    totalIncong = C1T2.concat(C2T2,C3T2,C4T2);
    summary[1][48] = percentError(totalIncong);				//e.incong
    totalSpatial = C4T1.concat(C4T2);
    summary[1][47] = percentError(totalSpatial);			//e.spatial
    totalCentre = C2T1.concat(C2T2);
    summary[1][46] = percentError(totalCentre);				//e.centre
    totalDouble = C3T1.concat(C3T2);
    summary[1][45] = percentError(totalDouble);				//e.double
    totalNoCue = C1T1.concat(C1T2);
    summary[1][44] = percentError(totalNoCue);				//e.nocue

    //Get the response time values for the correct trials
    var C1T1RT = valueArray(onlyCorrect(C1T1),7);
    var C1T2RT = valueArray(onlyCorrect(C1T2),7);
    var C2T1RT = valueArray(onlyCorrect(C2T1),7);
    var C2T2RT = valueArray(onlyCorrect(C2T2),7);
    var C3T1RT = valueArray(onlyCorrect(C3T1),7);
    var C3T2RT = valueArray(onlyCorrect(C3T2),7);
    var C4T1RT = valueArray(onlyCorrect(C4T1),7);
    var C4T2RT = valueArray(onlyCorrect(C4T2),7);

    summary[1][43] = mean(C4T2RT);							//mean.C4T2
    summary[1][42] = mean(C4T1RT);							//mean.C4T1
    summary[1][41] = mean(C3T2RT);							//mean.C3T2
    summary[1][40] = mean(C3T1RT);							//mean.C3T1
    summary[1][39] = mean(C2T2RT);							//mean.C2T2
    summary[1][38] = mean(C2T1RT);							//mean.C2T1
    summary[1][37] = mean(C1T2RT);							//mean.C1T2
    summary[1][36] = mean(C1T1RT);							//mean.C1T1

    summary[1][35] = median(C4T2RT);						//med.C4T2
    summary[1][34] = median(C4T1RT);						//med.C4T1
    summary[1][33] = median(C3T2RT);						//med.C3T2
    summary[1][32] = median(C3T1RT);						//med.C3T1
    summary[1][31] = median(C2T2RT);						//med.C2T2
    summary[1][30] = median(C2T1RT);						//med.C2T1
    summary[1][29] = median(C1T2RT);						//med.C1T2
    summary[1][28] = median(C1T1RT);						//med.C1T1

    incongMedians = [summary[1][29],summary[1][31],summary[1][33],summary[1][35]];
    summary[1][27] = mean(incongMedians);					//incong
    congMedians = [summary[1][28],summary[1][30],summary[1][32],summary[1][34]];
    summary[1][26] = mean(congMedians);						//cong
    spatialMedians = [summary[1][34],summary[1][35]];
    summary[1][25] = mean(spatialMedians);					//spatial
    centreMedians = [summary[1][30],summary[1][31]];
    summary[1][24] = mean(centreMedians);					//centre
    doubleMedians = [summary[1][32],summary[1][33]];
    summary[1][23] = mean(doubleMedians);					//double
    noCueMedians = [summary[1][28],summary[1][29]];
    summary[1][22] = mean(noCueMedians);					//nocue

    summary[1][21] = percentError(allResults);				//e.all
    summary[1][20] = 100-summary[1][21];					//pc.all

    summary[1][19] = summary[1][27]-summary[1][26];			//conflict
    summary[1][18] = summary[1][24]-summary[1][25];			//orient
    summary[1][17] = summary[1][22]-summary[1][23];			//alert

    return summary;
}

function generateData(userInfo, results) {
    var outputResults = [];
    //The first row is the headings
    outputResults[0] = ['uniqueID','StudyNum','age','sex','group','targFile','Date','block','trial','CueType','TargLoc','TargDirection','Congruency','TrialStartTime','targetOnTime','firstFix','Response','Correct','RT','LowRT'];
    destinationRow=1;												//We've already filled in outputResults[0], so we'll start from 1
    for (sourceTest in results) {			//The test number (should only be 0,1,2)
        for (sourceTrial in results[sourceTest]) {	//The trial within that test (32/test)
            outputResults[destinationRow] = [];
            outputResults[destinationRow][0] = userInfo[0];						//uniqueID
            outputResults[destinationRow][1] = userInfo[4];						//studyNum
            outputResults[destinationRow][2] = userInfo[1];						//age
            outputResults[destinationRow][3] = userInfo[2];						//sex
            outputResults[destinationRow][4] = userInfo[5];						//group
            outputResults[destinationRow][5] = userInfo[6];						//targetType
            outputResults[destinationRow][6] = formatDate(userInfo[7]);			//Date
            outputResults[destinationRow][7] = sourceTest;								//block
            outputResults[destinationRow][8] = parseInt(sourceTrial)+1;					//trial
            outputResults[destinationRow][9] = results[sourceTest][sourceTrial][0];					//CueType
            outputResults[destinationRow][10] = results[sourceTest][sourceTrial][2];					//TargLoc
            outputResults[destinationRow][11] = results[sourceTest][sourceTrial][4];				//TargDirection
            outputResults[destinationRow][12] = results[sourceTest][sourceTrial][1];				//Congruency
            outputResults[destinationRow][13] = formatTime(results[sourceTest][sourceTrial][10]);//trialStartTime
            outputResults[destinationRow][14] = formatTime(results[sourceTest][sourceTrial][11]);//targetOnTime
            outputResults[destinationRow][15] = results[sourceTest][sourceTrial][6];				//firstFix
            switch (results[sourceTest][sourceTrial][8]) {								//Response
                case 37:
                    outputResults[destinationRow][16] = 'L';
                    break;
                case 39:
                    outputResults[destinationRow][16] = 'R';
                    break;
                default:
                    outputResults[destinationRow][16] = 'None';
                    break;
            }
            outputResults[destinationRow][17] = isCorrect(results[sourceTest][sourceTrial]);		//Correct
            outputResults[destinationRow][18] = results[sourceTest][sourceTrial][7];				//RT
            if (results[sourceTest][sourceTrial][7]<100) {								//LowRT
                outputResults[destinationRow][19] = 1;
            } else {
                outputResults[destinationRow][19] = 0;
            }
            destinationRow++;
        }
    }
    return outputResults;	//Returns the total results at a big 2 dimensional array
}

//Array Filtering

//This function checks if an entry is correct or not.  To be correct, the response time must be between 100ms (preemptive) and 1500ms (timeout) AND the correct key must be pressed.
function isCorrect(recordEntry) {
    if ((recordEntry[7]!=1500)&&(recordEntry[7]>100)&&(((recordEntry[4]=='L')&&(recordEntry[8]==37))||((recordEntry[4]=='R')&&(recordEntry[8]==39)))) {
        return 1;
    } else {
        return 0;
    }
}

//Filters an array of trials by correctness, returning only the correct
function onlyCorrect(inputArray) {
    outputArray = [];
    for (i in inputArray) {
        if (isCorrect(inputArray[i])) {
            outputArray.push(inputArray[i]);
        }
    }
    return outputArray;
}

//Returns a simple array of the values at indexOfValues of the given complex array
function valueArray(inputArray, indexOfValues) {
    outputArray = [];
    for (i in inputArray) {
        outputArray.push(inputArray[i][indexOfValues]);
    }
    return outputArray;
}

// ------ Export functions

function dataCSV(data,newline) {
    csv = "";					//Start with an empty string
    for (dataRow in data) {		//Iterate through the rows
        //We then iterate through every column but the last one, since the last doesn't need a comma
        for (dataCell=0;(dataCell<((data[dataRow].length)-1));dataCell++) {
            csv += data[dataRow][dataCell]+",";
        }
        csv += data[dataRow][dataCell];		//Finalize the row with the last column
        if (newline != null) {				//Use a specific newline, if given
            csv += newline;
        } else {
            csv += '\r\n';
        }
    }
    return csv;
}

//Generates the data URI, which contains the contents of the test.  This can be linked to so that, in the event that a user doesn't have flash 10, the user may still download/open the data in a new window
//Takes the data in CSV string format
function dataURI(csvData,mimeType) {
    return "data:"+mimeType+";charset=utf-8,"+csvData;
}

function createExportLink(divName,exportFilename,data) {
    document.getElementById(divName).innerHTML = '<a href="'+dataURI(dataCSV(data,'%0D%0A'),'text/plain')+'" target="_blank">View results in a new window.</a>';
}

//Generates the flash links and the textual new-window links from the data.
function generateExportLink(data) {
    setupData[8] = new Date();
    fileName = setupData[0]+' - '+(setupData[8].getFullYear())+'-'+pad((setupData[8].getMonth()+1),2)+'-'+pad((setupData[8].getDate()),2);

    createExportLink('summaryExportLink',fileName+' - Summary.csv',generateSummary(setupData,data));
    createExportLink('dataExportLink',fileName+' - Data.csv',generateData(setupData,data));
    document.getElementById('summaryFilename').value = fileName+' - Summary.csv';
    document.getElementById('dataFilename').value = fileName+' - Data.csv';
}

// ------ Date functions

function formatDate(inputDate) {
    outputString = pad(inputDate.getDate(),2)+'-';
    outputString += abbreviatedNameOfMonth(inputDate.getMonth())+'-';
    outputString += inputDate.getFullYear();
    return outputString;
}

function formatTime(inputDate) {
    return (pad(inputDate.getHours(),2)+':'+pad(inputDate.getMinutes(),2)+':'+pad(inputDate.getSeconds(),2));
}

function abbreviatedNameOfMonth(monthNumber) {
    var monthArr=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return monthArr[monthNumber];
}

function formatMilliseconds(inputMilliseconds) {
    outputHours = Math.floor(inputMilliseconds/3600000);
    outputMinutes = Math.floor((inputMilliseconds%3600000)/60000);
    outputSeconds = Math.floor((inputMilliseconds%60000)/1000);
    outputMilliseconds = Math.floor(inputMilliseconds%1000);
    return (outputHours?pad(outputHours,2)+':':'')+((outputHours||outputMinutes)?pad(outputMinutes,2)+':':'')+pad(outputSeconds,2)+'.'+pad(outputMilliseconds,3);
}

function pad(theNumber,desiredLength) {
    while ((''+theNumber).length < desiredLength) {
        theNumber = '0'+theNumber;
    }
    return theNumber;
}

// ------ Timer functions

function startTimer(callback, delay) {
    timerStartTime = new Date().getTime();		//Get the current time in ms
    return setTimeout(callback, delay);			//Set a timer like usual
}

//This is an event-driven early timer termination.  It returns the elapsed time sing the timer started
function interruptTimer(timerID) {
    interruptedTime = new Date().getTime()-timerStartTime;		//We do this first so the time is as accurate as possible, even though we waste a line
    clearTimeout(timerID);										//Cancel that timer so it doesn't timeout later.
    return interruptedTime;										//Return the elapsed time
}

// ------ Random functions

function randomNumber(minimum,maximum) {
    //Math.floor rounds down, so we need to add 1 to our max-min delta
    return Math.floor(Math.random()*(maximum-minimum+1))+minimum;
}

// ------ Statistics functions

//Finds the percentage of incorrect/failed trials (rounded to 2 places)
function percentError(inputArray) {
    return Math.round(((1-((onlyCorrect(inputArray).length)/inputArray.length))*100)*100)/100;
}

//num^2
function square(num) {
    return num*num;
}

//Finds the maximum value in a given simple array of values
function arrayMin(inputArray) {
    tempArray = inputArray.slice(0);
    tempArray.sort(sortNumbers);
    return tempArray[tempArray.length-1];
}

//Finds the minimum value in a given simple array of values
function arrayMax(inputArray) {
    tempArray = inputArray.slice(0);
    tempArray.sort(sortNumbers);
    return tempArray[0];
}

//Finds the median of an array of values (rounded to integer)
function median(inputArray) {
    tempArray = inputArray.slice(0);	//There is no js way to duplicate an object, so this is a bit of a hack to do it.
    tempArray.sort(sortNumbers);
    midpoint = Math.floor(tempArray.length/2);
    if (tempArray.length % 2 != 0) {					//Odd number of entries
        return tempArray[midpoint];
    } else {
        med = (tempArray[midpoint-1] + tempArray[midpoint])/2;	//Even number of entries
        return Math.round(med);
    }

}

//Finds the mean of an array of numbers (rounded to integer)
function mean(inputArray) {
    total = 0;
    for (i in inputArray) {
        total += inputArray[i];
    }
    return Math.round(total/(inputArray.length));
}

//Finds the SD of an array of numbers
function standardDeviation(inputArray) {
    deviation = 0;
    inputMean = mean(inputArray);
    for (i in inputArray) {
        deviation += (square(inputMean - inputArray[i]));
    }
    return Math.sqrt(deviation/(inputArray.length - 1));

}

//This is used by the sort(x) array method when sorting an array of values
function sortNumbers(a,b) {
    return b-a;
}

// ------ Trial data

function trialSet() {
//	0-CueType, 1-TargetType, 2-TargetPosition, 3-CuePosition, 4-TargetDirection, 5-FlankDirection

    return [
        [1,'congruent','UP',0,'L','L'],
        [1,'congruent','UP',0,'R','R'],
        [1,'congruent','DOWN',0,'L','L'],
        [1,'congruent','DOWN',0,'R','R'],
        [1,'incongruent','UP',0,'L','R'],
        [1,'incongruent','UP',0,'R','L'],
        [1,'incongruent','DOWN',0,'L','R'],
        [1,'incongruent','DOWN',0,'R','L'],
        [2,'congruent','UP',0,'L','L'],
        [2,'congruent','UP',0,'R','R'],
        [2,'congruent','DOWN',0,'L','L'],
        [2,'congruent','DOWN',0,'R','R'],
        [2,'incongruent','UP',0,'L','R'],
        [2,'incongruent','UP',0,'R','L'],
        [2,'incongruent','DOWN',0,'L','R'],
        [2,'incongruent','DOWN',0,'R','L'],
        [3,'congruent','UP',0,'L','L'],
        [3,'congruent','UP',0,'R','R'],
        [3,'congruent','DOWN',0,'L','L'],
        [3,'congruent','DOWN',0,'R','R'],
        [3,'incongruent','UP',0,'L','R'],
        [3,'incongruent','UP',0,'R','L'],
        [3,'incongruent','DOWN',0,'L','R'],
        [3,'incongruent','DOWN',0,'R','L'],
        [4,'congruent','UP','UP','L','L'],
        [4,'congruent','UP','UP','R','R'],
        [4,'congruent','DOWN','DOWN','L','L'],
        [4,'congruent','DOWN','DOWN','R','R'],
        [4,'incongruent','UP','UP','L','R'],
        [4,'incongruent','UP','UP','R','L'],
        [4,'incongruent','DOWN','DOWN','L','R'],
        [4,'incongruent','DOWN','DOWN','R','L']
    ];
}
