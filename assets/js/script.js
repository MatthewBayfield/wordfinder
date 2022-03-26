//Event listeners to allow the how_to_play window to be opened and closed using the relevant buttons.

let howToPlayWindow = document.getElementById('how_to_play_window');
let closeButton = howToPlayWindow.children[2];
closeButton.addEventListener('click', function (event) {
    howToPlayWindow = document.getElementById('how_to_play_window');
    howToPlayWindow.style.display = 'none';
})

document.getElementById('game_instructions').addEventListener('click', function (event) {
    howToPlayWindow = document.getElementById('how_to_play_window');
    howToPlayWindow.style.display = 'block';
})

// Gives all buttons a form of focus when hovered over.

let allButtons = document.getElementsByTagName('button');
for (let button of allButtons) {
    button.addEventListener('mouseenter', function (event) {
        this.style.border = "solid 0.1rem gold";
    })

    button.addEventListener('mouseleave', function (event) {
        this.removeAttribute('style');
    })
}

/** Checks whether the sound mode 'on' radio input is checked. 
 * @returns boolean
 */
function soundMode() {
    return document.getElementById('on').checked;
}

// sound effect audio objects variables.
let gameStartSound = new Audio("assets/audio/game_start.mp3");
let timeUpSound = new Audio("assets/audio/time_up_alert.mp3");


//start button click event listener. Changes button to a quit button, and a quit button to start button. Triggers start game sound and starts/resets clock.
document.getElementById('main_game_area').children[1].addEventListener('click', function (event) {
    if (this.textContent === 'Start') {
        this.textContent = 'Quit';
        if (soundMode()) {
            gameStartSound.play();
        }
        if (!(document.getElementById('no_timer').checked)) {
            timer = setInterval(timer_Adjuster, 1000);
        }

    } else {
        this.textContent = 'Start';
        clearInterval(timer);
        setTimer();
    }
})

/** When called sets the start time of the timer, according to the currently checked timer radio input.
 */
function setTimer() {
    if (document.getElementById('threemins').checked) {
        document.getElementsByClassName('sidebar')[0].children[0].children[1].textContent = '03:00';
    } else if (document.getElementById('fivemins').checked) {
        document.getElementsByClassName('sidebar')[0].children[0].children[1].textContent = '05:00';
    } else if (document.getElementById('tenmins').checked) {
        document.getElementsByClassName('sidebar')[0].children[0].children[1].textContent = '10:00';
    } else if (document.getElementById('no_timer').checked) {
        document.getElementsByClassName('sidebar')[0].children[0].children[1].textContent = '--:--';
    }

}

// Event listener to call the setTimer function when any of the timer radio inputs are checked.
for (let input of document.querySelectorAll('[name=timer]')) {
    input.addEventListener('click', function (event) {
        setTimer();
    })
}

/**Gives the timer its timer functionality: decreases by 1 every 1s until 0 when it resets.
 */
function timer_Adjuster() {
    let timeInSeconds = (Number(document.getElementsByClassName('sidebar')[0].children[0].children[1].textContent.slice(0, 2))) * 60 +
        Number(document.getElementsByClassName('sidebar')[0].children[0].children[1].textContent.slice(3, 5));
    if (timeInSeconds > 0) {
        timeInSeconds -= 1;

        let minutes = Math.floor(timeInSeconds / 60);
        let timerSeconds = timeInSeconds % 60;
        if (`${timerSeconds}`.length === 2) {
            let strTime = `0` + `${minutes}` + `:` + `${timerSeconds}`;
            document.getElementsByClassName('sidebar')[0].children[0].children[1].textContent = strTime;
        } else {
            let strTime = `0` + `${minutes}` + `:` + `0` + `${timerSeconds}`;
            document.getElementsByClassName('sidebar')[0].children[0].children[1].textContent = strTime;
        }
    } else {
        clearInterval(timer);
        setTimer();
        document.getElementById('main_game_area').children[1].textContent='Start';
        if (soundMode()) {
            timeUpSound.play();
        }
    }

}