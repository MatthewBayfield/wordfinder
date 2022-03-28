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
        document.getElementById('main_game_area').children[1].textContent = 'Start';
        if (soundMode()) {
            timeUpSound.play();
        }
    }

}

// Game mechanics functions

/**Generates an array of single-word containing objects, producing upto 1000 7 Letter words beginnning with the letter submitted as a parameter. 
 * @param {string} letter - all words will begin with this letter
 * @returns wordArray 
 */
async function sevenLetter1000Words(letter) {
    //Words obtained using the datamuse API via the fetch API
    try {
        let wordArray = await fetch(`https://api.datamuse.com/words?sp=${letter}??????&md=f&max=1000`);
        if (!wordArray.ok) {
            throw new Error('HTTP error');
        }
        wordArray = await wordArray.json();
        return wordArray;
    } catch (error) {
        console.error(error);
        alert('Sorry there seems to be a problem, please try again later.');
    }
}

/** Generates an array of upto 5000 7 Letter word containing objects, consisting of 5 sets of upto 1000 words,
 *  with each set containing words beginning with a single random letter.
 * @returns  random7Letter5000WordArray
 */
 async function random7Letter5000Words() {
    try {
        let partialAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w'];
        let randomSetOf5Letters = new Set();
        let random7Letter5000WordArray = [];
        while (randomSetOf5Letters.size < 5) {
            let randomIndex = Math.floor(Math.random() * 23);
            randomSetOf5Letters.add(partialAlphabet[randomIndex]);
        }
        for (letter of randomSetOf5Letters) {
            let batch = await sevenLetter1000Words(letter);
            if (batch === undefined) {
                throw new Error('propagated error from called function');
            }
            random7Letter5000WordArray = random7Letter5000WordArray.concat(batch);
        }
        return random7Letter5000WordArray;
    } catch (error) {
        console.error(error);
    }
}