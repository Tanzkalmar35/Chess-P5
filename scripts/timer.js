
var whiteDisplay = document.querySelector('#whiteTimeBox');

var minut = 0
var sec = 0
var mili = 0
playing = false


window.onload = function () { whiteDisplay.textContent = minut + ":" + sec + ":" + mili; playing = true;}

function resetTimer (){

    whiteDisplay.textContent = minut + ":" + sec + ":" + mili;


}

if (playing){

    count()

}

function count() {

    console.log("Game started")
    while (true) {

        mili += 1;
        if(mili >= 100){

            sec +=1;

        }
        if(sec >= 60){

            minut += 1;

        }


    }


}





/*function startWhiteTimer(duration) {

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

    whiteDisplay.textContent = 


}

*/