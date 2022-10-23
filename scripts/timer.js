
var whiteDisplay = document.querySelector('#whiteTimeBox');
var blackDisplay = document.querySelector('#blackTimeBox');

var seconds = 0;
var seconds2 = 0;

var interval;
var timer;

var interval2;
var timer2;

var blackTimerPlaying = false;
var whiteTimerPlaying = false;
var blackTimerSetup = false;
var whiteTimerSetup = false;

function startBlackTimer(duration) {

    whiteTimerPlaying = false;
    blackTimerPlaying = true;

    timer = duration, minutes, seconds;
    
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    blackDisplay.textContent = minutes + ":" + seconds;

    clearInterval(interval2);
    clearInterval(interval);

    interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        blackDisplay.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = 0;
        }
    }, 1000);
}

function startWhiteTimer(duration) {

    blackTimerPlaying = false;
    whiteTimerPlaying = true;

    timer2 = duration, minutes2, seconds2;

    minutes2 = parseInt(timer2 / 60, 10)
    seconds2 = parseInt(timer2 % 60, 10);

    minutes2 = minutes2 < 10 ? "0" + minutes2 : minutes2;
    seconds2 = seconds2 < 10 ? "0" + seconds2 : seconds2;

    whiteDisplay.textContent = minutes2 + ":" + seconds2;

    clearInterval(interval);
    clearInterval(interval2);

    interval2 = setInterval(function () {
        minutes2 = parseInt(timer2 / 60, 10)
        seconds2 = parseInt(timer2 % 60, 10);

        minutes2 = minutes2 < 10 ? "0" + minutes2 : minutes2;
        seconds2 = seconds2 < 10 ? "0" + seconds2 : seconds2;

        whiteDisplay.textContent = minutes2 + ":" + seconds2;

        if (--timer2 < 0) {
            timer2 = 0;
        }
    }, 1000);
}

function setupWhiteTimer(time) {

    whiteTimerSetup = true;

    clearInterval(interval);

    minutes2 = parseInt(timer2 / 60, 10);
    seconds2 = parseInt(timer2 % 60, 10);

    minutes2 = minutes2 < 10 ? "0" + minutes2 : minutes2;
    seconds2 = seconds2 < 10 ? "0" + seconds2 : seconds2;

    startWhiteTimer(time);
}

function setupBlackTimer(time) {

    blackTimerSetup = true;

    clearInterval(interval2);

    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10? "0" + seconds : seconds;
    
    startBlackTimer(time);
}

function continueBlackTimer() {
    var remainingTimeBlack = blackDisplay.textContent;
    
    console.log("Minutes remaining: " + remainingTimeBlack);
    remainingTimeBlack = remainingTimeBlack.split("");

    for (var i = 0; i < 5; i++) {
        if (remainingTimeBlack[i] != ":") {

            var remainingSecondsBlack = remainingTimeBlack[3] + remainingTimeBlack[4];
            var remainingSecondsBlackInMinutes = remainingSecondsBlack / 60;

            var remainingMinutesBlack = remainingTimeBlack[0] + remainingTimeBlack[1];
            var remainingTimeCalcBlack = (parseFloat(remainingMinutesBlack) + parseFloat(remainingSecondsBlackInMinutes)) * 60;

            startBlackTimer(remainingTimeCalcBlack);

        }
    }
    
    console.log("Minutes remaining: " + remainingTimeBlack);
}

function continueWhiteTimer() {
    var remainingTimeWhite = whiteDisplay.textContent;
    
    console.log("Minutes remaining: " + remainingTimeWhite);
    remainingTimeWhite = remainingTimeWhite.split("");

    for (var i = 0; i < 5; i++) {
        if (remainingTimeWhite[i] != ":") {

            var remainingSecondsWhite = remainingTimeWhite[3] + remainingTimeWhite[4];
            var remainingSecondsWhiteInMinutes = remainingSecondsWhite / 60;

            var remainingMinutesWhite = remainingTimeWhite[0] + remainingTimeWhite[1];
            var remainingTimeCalcWhite = (parseFloat(remainingMinutesWhite) + parseFloat(remainingSecondsWhiteInMinutes)) * 60;

            startWhiteTimer(remainingTimeCalcWhite);

        }
    }
    
    console.log("Minutes remaining: " + remainingTimeWhite);
}

function resetTimer() {
    setupWhiteTimer(600);
}

//WHy no way to start black timer your racist?
