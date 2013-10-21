var softwareVersion = '0.1';

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