var whiteSeconds = document.getElementById("timerSecondsWhite");
var whiteMinutes = document.getElementById("timerMinutesWhite");

var blackSeconds = document.getElementById("timerSecondsBlack");
var blackMinutes = document.getElementById("timerMinutesBlack");

var gameTime = document.getElementById("thinkingTimeChoice").value;

var gameOver = document.getElementById("gameStatus");

var secW=0;
var minW=10;

var secB=0;
var minB=10;

var chooseTimeW = gameTime;
var chooseTimeB = chooseTimeW;

if (chooseTimeW != null) {
    // set the initial displayed time with the right syntax

    whiteSeconds.innerHTML = (secW < 10) ? "0" + secW : secW;
    whiteMinutes.innerHTML = (chooseTimeW < 10) ? "0" + chooseTimeW : chooseTimeW;

    blackSeconds.innerHTML = (secB < 10) ? "0" + secB : secB;
    blackMinutes.innerHTML = (chooseTimeB<10) ? "0" + chooseTimeB : chooseTimeB;
}

btnWhitePlayer=document.getElementById("btnWhitePlayer");
btnBlackPlayer=document.getElementById("btnBlackPlayer");

const btnStop=document.getElementById("btnStop");
const btnReset=document.getElementById("btnReset");

var whiteIsRunning = false;
var blackIsRunning = false;

btnWhitePlayer.addEventListener('click', event => {
	startWhite();
});

btnBlackPlayer.addEventListener('click', event => {
	startBlack();
});

btnStop.addEventListener('click', event => {
	stop();
});

btnReset.addEventListener('click', event => {
	reset();
});

window.onload = defSetInterval;

function defSetInterval(){
    intervalIDBlack = setInterval(timeBlackMinus, 1000);
    intervalIDWhite = setInterval(timeWhiteMinus, 1000);
    clearInterval(intervalIDBlack);
    clearInterval(intervalIDWhite);
}

function startWhite() {
		whiteIsRunning = true;
		blackIsRunning = false;
		intervalIDWhite = setInterval(timeWhiteMinus, 1000);
  	clearInterval(intervalIDBlack);
			document.getElementById("btnWhitePlayer").disabled = true;
			document.getElementById("btnBlackPlayer").disabled = false;
			document.getElementById("btnBlackPlayer").disabled = false;
			}
			
function startBlack() {
	
	intervalIDBlack = setInterval(timeBlackMinus, 1000);	

	clearInterval(intervalIDWhite);

	document.getElementById("btnBlackPlayer").disabled = true;
    document.getElementById("btnWhitePlayer").disabled = false;

	whiteIsRunning = false;
	blackIsRunning = true;

	document.getElementById("btnWhitePlayer").disabled = false;
}

function timeWhiteMinus() {
    if(secW<=0 && chooseTimeW<=0){
        secW =1;
        chooseTimeW=0;
        gameOver.innerHTML="White lost by time !";
    }else if (secW<=0){
    secW=60;
    chooseTimeW--;
    }
    secW--;
    whiteSeconds.innerHTML = (secW < 10) ? "0" + secW : secW;
    whiteMinutes.innerHTML = (chooseTimeW<10) ? "0" + chooseTimeW : chooseTimeW;
}

function timeBlackMinus() {
    if(secB<=0 && chooseTimeB<=0){
        secB=1;
        chooseTimeB=0;
        gameOver.innerHTML="Black lost by time!"
    }else if (secB<=0){
    secB=60;
    chooseTimeB--;
    }
    secB--;
    blackSeconds.innerHTML = (secB < 10) ? "0" + secB : secB;
    blackMinutes.innerHTML = (chooseTimeB<10) ? "0" + chooseTimeB : chooseTimeB;
}

function stop() {
	 clearInterval(intervalIDWhite);
	 clearInterval(intervalIDBlack);
	 	if (whiteIsRunning == true) {
	 		document.getElementById("btnWhitePlayer").disabled = false;
	 		document.getElementById("btnBlackPlayer").disabled = true;

	 	} else if (blackIsRunning == true) {
	 		document.getElementById("btnBlackPlayer").disabled = false;
	 		document.getElementById("btnWhitePlayer").disabled = true;
	 	}
	 
	 
}

function reset(){
    secW=0;
    secondeW.innerHTML = secW;
    minW=0;
    minuteW.innerHTML = minW;
    secB=0;
    secondeB.innerHTML = secB;
    minuteB.innerHTML = minB;
    chooseTimeW = gameTime;
    chooseTimeB = chooseTimeW;
    minuteW.innerHTML = chooseTimeW;
    minuteB.innerHTML = chooseTimeB; 
    clearInterval(intervalIDBlack);
    clearInterval(intervalIDWhite);
    document.getElementById("btnWhitePlayer").disabled = false;
    document.getElementById("btnBlackPlayer").disabled = false;

}