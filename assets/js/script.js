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


//start button click event listener. Changes button to a quit button.
document.getElementById('main_game_area').children[1].addEventListener('click', function (event) {
    if (this.textContent === 'Start') {
        this.textContent = 'Quit';
        if (soundMode()) {
            gameStartSound.play();
        }
    } else {
        this.textContent = 'Start';
    }
})

/** when called sets the start time of the timer according to the currently checked timer radio input.
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

for (let input of document.querySelectorAll('[name=timer]')) {
    input.addEventListener('click', function (event) {
        setTimer();
    })
}