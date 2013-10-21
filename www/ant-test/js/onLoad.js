function onLoad() {
	//for(i=0; i<stimList.length; i++) {
		//document.form.targetType.options[i] = new Option(stimList[i]);
	//}
    getInputData();
	document.getElementById("numberOfTestBlocks").innerHTML = numberOfTestBlocks;
    pushView('instructionPage1');
}