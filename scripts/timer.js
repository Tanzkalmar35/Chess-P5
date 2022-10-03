
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

function startBlackTimer(duration, whiteDisplay, blackDisplay) {

    blackTimerPlaying = true;
    timer = duration, minutes, seconds;
    
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    blackDisplay.textContent = minutes + ":" + seconds;
    whiteDisplay.textContent = minutes + ":" + seconds;

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

function startWhiteTimer(duration, whiteDisplay, blackDisplay) {

    whiteTimerPlaying = true;
    timer2 = duration, minutes2, seconds2;

    minutes2 = parseInt(timer2 / 60, 10)
    seconds2 = parseInt(timer2 % 60, 10);

    minutes2 = minutes2 < 10 ? "0" + minutes2 : minutes2;
    seconds2 = seconds2 < 10 ? "0" + seconds2 : seconds2;
    blackDisplay.textContent = minutes2 + ":" + seconds2;
    whiteDisplay.textContent = minutes2 + ":" + seconds2;

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

function setupTimer(time) {
    stopTimer();
    minutes2 = parseInt(timer2 / 60, 10)
    seconds2 = parseInt(timer2 % 60, 10);
    minutes2 = minutes2 < 10 ? "0" + minutes2 : minutes2;
    seconds2 = seconds2 < 10 ? "0" + seconds2 : seconds2;
    blackDisplay.textContent = minutes2 + ":" + seconds2;
    startWhiteTimer(time, whiteDisplay, blackDisplay);
}

function stopTimer() {
    clearInterval(interval);
    clearInterval(interval2);
}

function resetTimer() {
    setupTimer(600);
}

