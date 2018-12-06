
	var myRec = new p5.SpeechRec(); // new P5.SpeechRec object


	function setup()
	{
		// graphics stuff:
		// instructions:
		textSize(32);
		textAlign(CENTER);
		text("say something", width/2, height/2);
		myRec.onResult = showResult;
		myRec.start();
	}

	function draw()
	{
		// why draw when you can talk?
	}

	function showResult()
	{
		if(myRec.resultValue==true) {
			background(192, 255, 192);
			text(myRec.resultString, width/2, height/2);
			console.log(myRec.resultString);
		}
	}