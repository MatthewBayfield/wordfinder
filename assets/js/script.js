// DOM element constants:

const allButtons = document.getElementsByTagName('button');
//how_to_play window constants
const howToPlayWindow = document.getElementById('how_to_play_window');
const closeButton = howToPlayWindow.children[5];
const gameInstructionsButton = document.getElementById('game_instructions');
//game settings section constants
const gameSettingsButton = document.getElementById('game_settings').children[1];
const gameSettingsWindow = document.getElementById('game_settings').children[2];
const gameSettingsWindowCloseButton = document.getElementById('game_settings').children[2].children[1];
const threeMinsTimerInput = document.getElementById('threemins');
const fiveMinsTimerInput = document.getElementById('fivemins');
const tenMinsTimerInput = document.getElementById('tenmins');
const allTimerRadioInputs = document.querySelectorAll('[name=timer]');
const noTimerRadioInput = document.getElementById('no_timer');
const sevenLetterModeRadioInput = document.getElementById('seven');
const eightLetterModeRadioInput = document.getElementById('eight');
const soundOnRadioInput = document.getElementById('on');
//gameplay area constants
const startAndQuitButton = document.getElementById('main_game_area').children[1];
const timerDisplay = document.getElementsByClassName('sidebar')[0].children[0].children[1];
const resetTilesButton = document.getElementById('reset_button_container').children[0];
const currentScoreContainer = document.querySelectorAll(".sidebar")[1].children[0].querySelector('span');
const correctWordCounterContainer = document.querySelectorAll(".sidebar")[1].children[1].querySelector('span');
const bestScoreContainer = document.querySelectorAll(".sidebar")[1].children[2].querySelector('span');
const eighthLetterTileHolder = document.getElementById('eighth_tile_holder');
const letterTiles = document.getElementsByClassName('tile');
const tileHolders = document.getElementsByClassName('tile_holder');
const checkWordButton = document.getElementsByClassName('sidebar')[0].getElementsByTagName('button')[0];
const nextWordButton = document.querySelectorAll(".sidebar")[0].children[2].querySelector('button');
const unplacedLetterTilesContainer = document.getElementById('gameplay_area').children[0];


//Event listeners to allow the how_to_play window to be opened and closed using the relevant buttons.
closeButton.addEventListener('click', function () {
    howToPlayWindow.style.display = 'none';
});

gameInstructionsButton.addEventListener('click', function () {
    howToPlayWindow.style.display = 'block';
});

// Event listeners that give all buttons a form of focus when hovered over.

for (let button of allButtons) {
    button.addEventListener('mouseenter', function () {
        this.style.border = "solid 0.1rem gold";
    });

    button.addEventListener('mouseleave', function () {
        this.removeAttribute('style');
    });
}

/** Checks whether the sound mode 'on' radio input is checked. 
 * @returns boolean
 */
function soundMode() {
    return soundOnRadioInput.checked;
}

// sound effect audio objects variables.
const gameStartSound = new Audio("assets/audio/game_start.mp3");
const timeUpSound = new Audio("assets/audio/time_up_alert.mp3");
const correctWordSubmittedSound = new Audio("assets/audio/correct_word.mp3");
const incorrectWordSubmittedSound = new Audio("assets/audio/incorrect_word.mp3");


//start/quit button click event listener, that when clicked starts and ends the game, including starting and stopping the timer, adding and removing the letter tiles,
// and resetting the scores.
startAndQuitButton.addEventListener('click', async function () {
    if (this.textContent === 'Start') {
        this.textContent = 'Quit';
        this.disabled = true;
        if (soundMode()) {
            gameStartSound.play();
        }
        if (!(noTimerRadioInput.checked)) {
            timer = setInterval(timerAdjuster, 1000);
        }
        await createLetterTiles();
        this.disabled = false;

    } else {
        resetTilesButton.click();
        removeLetterTiles();
        this.textContent = 'Start';
        clearInterval(timer);
        setTimer();
        currentScoreContainer.textContent = '0';
        correctWordCounterContainer.textContent = '0';
        correctWordsGiven = [];
    }
});

/** When called sets the start time of the timer, according to the currently checked timer radio input.
 */
function setTimer() {
    if (threeMinsTimerInput.checked) {
        timerDisplay.textContent = '03:00';
    } else if (fiveMinsTimerInput.checked) {
        timerDisplay.textContent = '05:00';
    } else if (tenMinsTimerInput.checked) {
        timerDisplay.textContent = '10:00';
    } else if (noTimerRadioInput.checked) {
        timerDisplay.textContent = '--:--';
    }

}

// Event listener to call the setTimer function when any of the timer radio inputs are checked, as well as end the current game, if the timer is changed midgame.
//In addition a change in the checked radio input calls the onloadBestScore function to set the HTML best score content for the selected timer mode.
for (let input of allTimerRadioInputs) {
    input.addEventListener('click', function () {
        setTimer();
        if (startAndQuitButton.textContent === 'Quit') {
            startAndQuitButton.click();
        }
        onloadBestScore();

    });
}

/**Gives the timer its timer functionality. When the timer runs out, it ends the game by calling the gameEnd function. 
 */
function timerAdjuster() {
    try {
        let timeInSeconds = (Number(timerDisplay.textContent.slice(0, 2))) * 60 +
            Number(timerDisplay.textContent.slice(3, 5));
        if (timeInSeconds > 0) {
            timeInSeconds -= 1;

            let minutes = Math.floor(timeInSeconds / 60);
            let timerSeconds = timeInSeconds % 60;
            if (`${timerSeconds}`.length === 2) {
                let strTime = `0` + `${minutes}` + `:` + `${timerSeconds}`;
                timerDisplay.textContent = strTime;
            } else {
                let strTime = `0` + `${minutes}` + `:` + `0` + `${timerSeconds}`;
                timerDisplay.textContent = strTime;
            }
        } else {
            if (soundMode()) {
                timeUpSound.play();
            }
            gameEnd();

        }
    } catch (error) {
        console.error(error);
    }

}

/** Ends the game by simulating a quit button click, after calling the bestScoreUpdater function, and triggering a 'times up' alert that displays a game summary,
 *  as well as a high score alert if one is achieved.
 */
function gameEnd() {
    try {
        let currentBestScore = Number(bestScoreContainer.textContent);
        bestScoreUpdater();
        let currentScore = Number(currentScoreContainer.textContent);
        let correctWordsCounter = Number(correctWordCounterContainer.textContent);
        let pointsToWordsRatio = ((currentScore * 1000) / (correctWordsCounter * 1000)).toFixed(1);
        if (correctWordsCounter === 0) {
            pointsToWordsRatio = 0;
        }
        Swal.fire({
            title: 'TIMES UP!',
            html: `<div>Score:${currentScore}</div>` + `<div>Correct Words:${correctWordsCounter}</div>` + `<div>points-to-words ratio:${pointsToWordsRatio}</div>`,
            customClass: {
                title: 'swal-title',
                popup: 'swal-theme'
            },
            icon: 'info',
            iconColor: '#33047F',
            background: '#99FCFF',
            width: '50%',
            color: '#33047F',
            showConfirmButton: true,
            confirmButtonText: 'CONTINUE'
        }).then(function () {
            let newBestScore = Number(bestScoreContainer.textContent);
            if (currentBestScore < newBestScore) {
                Swal.fire({
                    title: 'NEW HIGH SCORE!',
                    customClass: {
                        title: 'swal-title',
                        popup: 'swal-theme'
                    },
                    icon: 'info',
                    iconColor: '#33047F',
                    background: '#99FCFF',
                    width: '50%',
                    color: '#33047F',
                    showConfirmButton: true,
                    confirmButtonText: 'CONTINUE'
                });
            }
        });
        startAndQuitButton.click();

    } catch (error) {
        console.error(error);
    }
}

// Event listeners that adjust the number of tile holders by adding and removing an eighth holder div element when the seven or eight letter radio input is checked. They also
//simulate a quit button click event, if a different radio input is checked midgame. The HTML best score content is also set to the localStorage best score variable value
// that corresponds to the now selected letter mode, via a call to the onloadBestScore function.

eightLetterModeRadioInput.addEventListener('click', function () {
    eighthLetterTileHolder.style.setProperty('display', 'inline-block');
    if (startAndQuitButton.textContent === 'Quit') {
        startAndQuitButton.click();
    }
    onloadBestScore();
});

sevenLetterModeRadioInput.addEventListener('click', function () {
    eighthLetterTileHolder.style.setProperty('display', 'none');
    if (startAndQuitButton.textContent === 'Quit') {
        startAndQuitButton.click();
    }
    onloadBestScore();
});

// Event listeners that open and close the game settings window, when clicking the respective close or game settings buttons

gameSettingsButton.addEventListener('click', function () {
    gameSettingsWindow.style.setProperty('visibility', 'visible');
});

gameSettingsWindowCloseButton.addEventListener('click', function () {
    gameSettingsWindow.style.removeProperty('visibility');
});

// Reset Tiles button event listener. Effectively removes any letter tiles placed into letter tile holders, and returns the letter tiles to their starting position,
// by making them visible again.
resetTilesButton.addEventListener('click', function () {
    if (startAndQuitButton.textContent === 'Quit') {
        for (let tileHolder of tileHolders) {
            if (tileHolder.children.length !== 0) {
                tileHolder.children[0].remove();

            }
        }
        for (let letterTile of letterTiles) {
            letterTile.style.removeProperty('visibility');
            letterTile.style.removeProperty('border-color');
        }
    }
});

// A click event listener for the check word button, that calls the checkWord function to check whether a valid word has been submitted during a game.
checkWordButton.addEventListener('click', function () {
    if (startAndQuitButton.textContent === 'Quit') {
        checkWord();
    }
});

// A click event listener for the next word button, that calls the nextWord function, if clicked during a game, in order to generate a new set of starting word letter tiles.
nextWordButton.addEventListener('click', function () {
    if (startAndQuitButton.textContent === 'Quit') {
        nextWord();
    }
});

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
        const partialAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w'];
        let randomSetOf5Letters = new Set();
        let random7Letter5000WordArray = [];
        while (randomSetOf5Letters.size < 5) {
            let randomIndex = Math.floor(Math.random() * 23);
            randomSetOf5Letters.add(partialAlphabet[randomIndex]);
        }
        for (let letter of randomSetOf5Letters) {
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

// Assigns a constant variable to the generated random 5000 7 letter word array. A word is selected from this prepopulated list of words everytime a game starts,
//and for every new word within the same game, without duplications. Thus the fetch requests to generate the words needed for the game,
// only have to be performed once when the page  initially loads.
const words7Letters = random7Letter5000Words();

// Used words array to keep track of the starting words already used in a gaming session, to prevent duplication. Words will be added to the array as they are used.
let usedWords = [];

/**Selects a random 7 letter word from the 5000 7 letter random word array, that has not yet been selected as a starting word during the game session.
 *  Adds the selected word to the used word array, to prevent future duplication when another word is selected. Also filters out any word containing spaces or characters not
 * contained in the standard alphabet.
 * @returns a random 7 letter word
 */
async function random7LetterWordSelector() {
    try {
        let words7LettersArray = await words7Letters;
        if (words7LettersArray === undefined) {
            throw new Error('propagated error from called function');
        }
        let randomIndex = Math.floor(Math.random() * words7LettersArray.length);
        let selectedStringCharacterArray = [];
        const Alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        let validCharacters;
        do {
            selectedStringCharacterArray = [];
            randomIndex = Math.floor(Math.random() * words7LettersArray.length);
            for (let character of words7LettersArray[randomIndex].word) {
                selectedStringCharacterArray.push(character);
            }
            validCharacters = selectedStringCharacterArray.every(function (character) {
                return Alphabet.includes(character);
            });
        }
        while (usedWords.includes(words7LettersArray[randomIndex].word) || !validCharacters);
        usedWords.push(words7LettersArray[randomIndex].word);
        return words7LettersArray[randomIndex].word;
    } catch (error) {
        console.error(error);
    }
}

/**Generates an array of single-word containing objects, producing upto 1000 8 Letter words beginnning with the letter submitted as a parameter. 
 * @param {string} letter - all words will begin with this letter
 * @returns wordArray 
 */
async function eightLetter1000Words(letter) {
    //Words obtained using the datamuse API via the fetch API
    try {
        let wordArray = await fetch(`https://api.datamuse.com/words?sp=${letter}???????&md=f&max=1000`);
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

/** Generates an array of upto 5000 8 Letter word containing objects, consisting of 5 sets of upto 1000 words,
 *  with each set containing words beginning with a single random letter.
 * @returns  random8Letter5000WordArray
 */
async function random8Letter5000Words() {
    try {
        const partialAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w'];
        let randomSetOf5Letters = new Set();
        let random8Letter5000WordArray = [];
        while (randomSetOf5Letters.size < 5) {
            let randomIndex = Math.floor(Math.random() * 23);
            randomSetOf5Letters.add(partialAlphabet[randomIndex]);
        }
        for (let letter of randomSetOf5Letters) {
            let batch = await eightLetter1000Words(letter);
            if (batch === undefined) {
                throw new Error('propagated error from called function');
            }
            random8Letter5000WordArray = random8Letter5000WordArray.concat(batch);
        }
        return random8Letter5000WordArray;
    } catch (error) {
        console.error(error);
    }
}

// Assigns a constant variable to the generated random 5000 8 letter word array. A word is selected from this prepopulated list of words everytime a game starts,
//and for every new word within the same game, without duplications. Thus the fetch requests to generate the words needed for the game,
// only have to be performed once when the page  initially loads.
const words8Letters = random8Letter5000Words();


/**Selects a random 8 letter word from the 5000 8 letter random word array, that has not yet been selected as a starting word during the game session.
 *  Adds the selected word to the used word array, to prevent future duplication when another word is selected. Also filters out any word containing spaces or characters not
 * contained in the standard alphabet.
 * @returns a random 8 letter word
 */
async function random8LetterWordSelector() {
    try {
        let words8LettersArray = await words8Letters;
        if (words8LettersArray === undefined) {
            throw new Error('propagated error from called function');
        }
        let randomIndex = Math.floor(Math.random() * words8LettersArray.length);
        let selectedStringCharacterArray = [];
        const Alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        let validCharacters;
        do {
            selectedStringCharacterArray = [];
            randomIndex = Math.floor(Math.random() * words8LettersArray.length);
            for (let character of words8LettersArray[randomIndex].word) {
                selectedStringCharacterArray.push(character);
            }
            validCharacters = selectedStringCharacterArray.every(function (character) {
                return Alphabet.includes(character);
            });
        }
        while (usedWords.includes(words8LettersArray[randomIndex].word) || !validCharacters);
        usedWords.push(words8LettersArray[randomIndex].word);
        return words8LettersArray[randomIndex].word;
    } catch (error) {
        console.error(error);
    }
}

/**Generates an array of partial URLs for forthcoming fetch requests,
 * one for each of the lengths of words ranging from 4 letters up to and including the length of the randomly 7/8 letter selected word.
 * The future fetch requests are used to obtain the correct words lists. 
 * @returns URL array
 */
async function urlGenerator() {
    try {
        let selectedWord;
        if (sevenLetterModeRadioInput.checked) {
            selectedWord = await random7LetterWordSelector();
        } else {
            selectedWord = await random8LetterWordSelector();
        }
        if (selectedWord === undefined) {
            throw new Error('propagated error from called function');
        }
        let urls = [];
        for (let i = 4; i <= selectedWord.length; i++) {
            let q = "?";
            let url = "";
            q = q.repeat(i);
            url = `sp=${q},*%2B${selectedWord}`;
            urls.push(url);
        }
        return urls;
    } catch (error) {
        console.error(error);
    }
}

/**Generates an array of words,  resulting from a fetch request using the partial URL supplied as a parameter
 * 
 * @param  {string} url - this url fragment is inserted into another url to give a full url used for the fetch request
 * @returns retrievedWords - an array of word containing objects
 */
async function correctWordListFetcher(url) {
    try {
        let retrievedWords = await fetch(`https://api.datamuse.com/words?${url}&md=df&max=1000`);
        if (!retrievedWords.ok) {
            throw new Error('HTTP error');
        }
        retrievedWords = await retrievedWords.json();
        return retrievedWords;
    } catch (error) {
        console.error(error);
    }

}

/** Takes as a parameter an unfiltered array of word containing objects, and returns a filtered subset of the same array, where objects not containing a word definition
 * property are filtered out.
 * 
 * @param {response<array>} retrievedWords - an unfiltered array of word containing objects
 * @returns filteredWordarray
 */
async function noDefinitionWordFilter(retrievedWords) {
    try {
        let filteredWordArray = [];
        let unfilteredWordArray = await retrievedWords;
        if (unfilteredWordArray === undefined) {
            throw new Error('propagated error from input parameter');
        }
        for (let i = 0; i < unfilteredWordArray.length; i++) {
            let word = unfilteredWordArray[i];
            if (word.defs != undefined) {
                filteredWordArray.push(word);
            }
        }
        return filteredWordArray;
    } catch (error) {
        console.error(error);
    }
}

/** Generates a concatenated filtered array of word containing objects, made from smaller unfiltered arrays each containing words of a single length between 4 and 7/8 letters
 * of the letters featured in the randomly selected word.
 *  The returned array is an early form of the correct word list array, which in its final form is used to check  the correctness of submitted word answers during the game.
 * @returns concatenatedCorrectWordListArray - a preprocessed form of the correct word answer array 
 */
async function correctWordListFilterAndConcatenate() {
    try {
        let urls = await urlGenerator();
        if (urls === undefined) {
            throw new Error('propagated error from called function');
        }
        let concatenatedCorrectWordListArray = [];
        for (let url of urls) {
            let filteredWordArrayToConcatenate = await noDefinitionWordFilter(correctWordListFetcher(url));
            if (filteredWordArrayToConcatenate === undefined) {
                throw new Error('propagated error from called function');
            }
            concatenatedCorrectWordListArray = concatenatedCorrectWordListArray.concat(filteredWordArrayToConcatenate);
        }
        return concatenatedCorrectWordListArray;
    } catch (error) {
        console.error(error);
    }
}

/** Checks that a word from the correct word list array only contains the same number of a given letter as are found in the random 7/8 letter parent word.
 * 
 * @param {promise<object>} correctWord - A word containing object from the correct word array
 * @param {string} parentWord - The starting random 7/8 letter word
 * @returns A boolean, that is false when the correct word contains different numbers of a given a letter compared to the parent word
 */
function letterChecker(correctWord, parentWord) {
    try {
        let j = 0;
        for (let letter of correctWord.word) {
            if (parentWord.includes(letter)) {
                parentWord = parentWord.slice(0, parentWord.indexOf(letter)) + parentWord.slice(parentWord.indexOf(letter) + 1);
                ++j;
            } else {
                break;
            }
        }
        return (j === correctWord.word.length);
    } catch (error) {
        console.error(error);
    }

}


/** Filters out the words from the correct word list array that return a false boolean when entered as a parameter in the letter checker function.
 * Consequently the resultant word array, features only words with the same number of a given letter as the randomly selected starting word.
 * @returns filteredCorrectWordArray 
 */
async function letterCheckerFilter() {
    try {
        let filteredCorrectWordArray = [];
        let currentCorrectWordArray = await correctWordListFilterAndConcatenate();
        if (currentCorrectWordArray === undefined) {
            throw new Error('propagated error from called function');
        }
        for (let correctWord of currentCorrectWordArray) {
            if (letterChecker(correctWord, usedWords[usedWords.length - 1])) {
                filteredCorrectWordArray.push(correctWord);
            }
        }
        return filteredCorrectWordArray;
    } catch (error) {
        console.error(error);
    }
}

/** Generates an array of google books Ngrams frequencies associated with each word in the filtered correct word array. It first extracts the frequency label and
 *  number from each word, and then just the actual number.
 * @param {promise<array>} unextractedarray 
 * @returns extractedWordFrequencyArray
 */
function wordFrequencyArrayExtractor(unextractedarray) {
    try {
        let extractedWordFrequencyArray = [];
        for (let entry of unextractedarray) {
            let extractedWordFrequency = entry.tags[0];
            let extractedWordFrequencyNumber = extractedWordFrequency.slice(2);
            extractedWordFrequencyArray.push(extractedWordFrequencyNumber);
        }
        return extractedWordFrequencyArray;
    } catch (error) {
        console.error(error);
    }
}

/** Sorts a word frequency array provided as a parameter in descending order by frequency.
 * @param {promise<array>} extractedWordFrequencyArray 
 * @returns extractedWordFrequencyArray - the same parameter array but sorted by frequency in descending order
 */
function sortByWordFrequency(extractedWordFrequencyArray) {
    try {
        extractedWordFrequencyArray.sort(function (a, b) {
            return b - a;
        });
        return extractedWordFrequencyArray;
    } catch (error) {
        console.error(error);
    }
}

/** Fully filters and sorts by their associated google books Ngram word frequency, the word containing objects in the generated correct word array,
 *  itself associated with the random 7/8 letter starting word. Calling this function indirectly calls the random7/8LetterWordSelector function,
 *  and generates the unfiltered and unsorted correct word array for this selected word, which is then fully sorted and filtered.
 * @returns fullySortedFilteredCorrectWordArray
 */
async function correctWordArrayFilterAndSorter() {
    try {
        let unextractedCorrectWordArray = await letterCheckerFilter();
        if (unextractedCorrectWordArray === undefined) {
            throw new Error('propagated error from called function');
        }
        let extractedWordFrequencyArray = wordFrequencyArrayExtractor(unextractedCorrectWordArray);
        let fullySortedFilteredCorrectWordArray = [];
        let sortedExtractedWordFrequencyArray = await sortByWordFrequency(extractedWordFrequencyArray);
        if (sortedExtractedWordFrequencyArray === undefined) {
            throw new Error('propagated error from called function');
        }
        let unsortedExtractedWordFrequencyArray = wordFrequencyArrayExtractor(unextractedCorrectWordArray);
        for (let entry of unsortedExtractedWordFrequencyArray) {
            for (let i = 0; i < unsortedExtractedWordFrequencyArray.length; i++) {
                if (entry === sortedExtractedWordFrequencyArray[i]) {
                    fullySortedFilteredCorrectWordArray[i] = unextractedCorrectWordArray[unsortedExtractedWordFrequencyArray.indexOf(entry)];
                }
            }
        }
        correctWordArray = fullySortedFilteredCorrectWordArray;
        return fullySortedFilteredCorrectWordArray;
    } catch (error) {
        console.error(error);
    }
}

/**Takes as a parameter a random 7/8 letter starting word string, and randomly mixes up the letter order and returns the new letter order as a string
 * 
 * @param {string} randomStartingWord 
 * @returns scrambledRandomStartingWord - a string containing the same letters as the parameter string but in a random order
 */
function scrambler(randomStartingWord) {
    try {
        const wordLength = randomStartingWord.length;
        let length = randomStartingWord.length;
        let indexArray = [];
        for (let i = 0; i < wordLength; i++) {
            indexArray.push(i);
        }
        let randomIndex;
        let scrambledRandomStartingWord = "";
        let letter;
        do {
            randomIndex = Math.floor(Math.random() * length);
            letter = randomStartingWord[indexArray[randomIndex]];
            scrambledRandomStartingWord += letter;
            indexArray.splice(randomIndex, 1);
            length -= 1;
        } while (scrambledRandomStartingWord.length < wordLength);
        return scrambledRandomStartingWord;
    } catch (error) {
        console.error(error);
    }
}


/** Creates the unplaced letter tiles in the HTML gameplay area, for the letters in the current randomly selected 7/8 letter starting word.
 * The letters contained within the tiles are placed in a random order.
 */
async function createLetterTiles() {
    try {
        await correctWordArrayFilterAndSorter();
        const randomStartingWord = usedWords[usedWords.length - 1];
        let scrambledRandomStartingWord = scrambler(randomStartingWord);
        for (let letter of scrambledRandomStartingWord) {
            let tile = document.createElement('div');
            tile.setAttribute('class', 'tile');
            const tileParagraph = document.createElement('p');
            tileParagraph.textContent = letter;
            tile.appendChild(tileParagraph);
            unplacedLetterTilesContainer.appendChild(tile);
        }
        createLetterTileEventListeners();
        createLetterTileHolderEventListeners();
    } catch (error) {
        console.error(error);
    }

}

/** Removes the unplaced random starting word letter tiles from the HTML document
 * 
 */
function removeLetterTiles() {
    try {
        if (letterTiles.length !== 0) {
            while (letterTiles.length !== 0) {
                letterTiles[0].remove();
            }
        }
    } catch (error) {
        console.error(error);
    }
}

// A variable to act as a transient copy of a selected letter tile's HTML content
let selectedTileCopy;

/**When called creates click event listeners for generated letter tiles. A click event triggers a border color change to indicate tile selection,
 *  and removes any other previous event effects applied to the other tiles not currently selected. An event also sets a variable to become a copy of the clicked letter tile
 * HTML content. 
 */
function createLetterTileEventListeners() {
    try {
        for (let letterTile of letterTiles) {
            letterTile.addEventListener('click', function () {
                selectedTileCopy = this;
                this.style.borderColor = 'gold';
                for (let OtherLetterTile of letterTiles) {
                    if (this !== OtherLetterTile) {
                        OtherLetterTile.style.removeProperty('border-color');
                    }
                }
            });
        }
    } catch (error) {
        console.error(error);

    }
}

/** When called, creates click event listeners for the letter tile holders. When the event is triggered the innerHTML of the currently selected letter tile, stored in the
 * selectedTileCopy variable is set as the innerHTML of the clicked tile holder div. The selectedTileCopy variable is then reassigned to be undefined,
 *  and the selected letter tile div hidden.
 * 
 */
function createLetterTileHolderEventListeners() {
    try {
        for (let tileHolder of tileHolders) {
            tileHolder.addEventListener('click', function () {
                if (selectedTileCopy !== undefined && this.innerHTML.length === 0) {
                    this.innerHTML = selectedTileCopy.innerHTML;
                    selectedTileCopy.style.setProperty('visibility', 'hidden');
                    selectedTileCopy = undefined;
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
}

let correctWordArray;
let correctWordsGiven = [];

/**Generates a string from the letter tile containing tile holders representing a user submitted word, and checks whether that word is contained within the correctWordArray,
 * and or in the correctWordsGiven array, that represents correct words already submitted. Depending on whether the word is correct, wrong or already used,
 *  an alert with a corresponding message is produced. A correct unused word is then added to the correctWordsGivenArray.
 */
function checkWord() {
    try {
        let submittedWord = "";
        let correct = false;
        for (let tileHolder of tileHolders) {
            if (tileHolder.children.length !== 0) {
                submittedWord += tileHolder.children[0].textContent;
            }
        }
        for (let correctWord of correctWordArray) {
            if (correctWord.word === submittedWord && !(correctWordsGiven.includes(submittedWord))) {
                Swal.fire({
                    title: 'CORRECT!',
                    customClass: {
                        title: 'swal-title',
                        popup: 'swal-theme'
                    },
                    icon: 'success',
                    iconColor: '#33047F',
                    background: '#99FCFF',
                    width: '50%',
                    color: '#33047F',
                    timer: '2000',
                    showConfirmButton: false
                });
                if (soundMode()) {
                    correctWordSubmittedSound.play();
                }

                correct = true;
                correctWordsGiven.push(submittedWord);
                scoreAdjuster(submittedWord);
            }
        }
        if (!correct) {
            if (correctWordsGiven.includes(submittedWord)) {
                Swal.fire({
                    title: 'Submitted before!',
                    html: 'You have already entered this correct word',
                    customClass: {
                        title: 'swal-title',
                        popup: 'swal-theme'
                    },
                    icon: 'info',
                    iconColor: '#33047F',
                    background: '#99FCFF',
                    width: '50%',
                    color: '#33047F',
                    timer: '3000',
                    showConfirmButton: false
                });
                if (soundMode()) {
                    incorrectWordSubmittedSound.play();
                }
            } else {
                if (submittedWord.length >= 4) {
                    Swal.fire({
                        title: 'INCORRECT!',
                        html: 'Not a valid word',
                        customClass: {
                            title: 'swal-title',
                            popup: 'swal-theme'
                        },
                        icon: 'error',
                        iconColor: '#33047F',
                        background: '#99FCFF',
                        width: '50%',
                        color: '#33047F',
                        timer: '2000',
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        title: 'Word too short!',
                        html: 'Words must be 4 or more letters long',
                        customClass: {
                            title: 'swal-title',
                            popup: 'swal-theme'
                        },
                        icon: 'error',
                        iconColor: '#33047F',
                        background: '#99FCFF',
                        width: '50%',
                        color: '#33047F',
                        timer: '2000',
                        showConfirmButton: false
                    });

                }
                if (soundMode()) {
                    incorrectWordSubmittedSound.play();
                }
            }
        }
        resetTilesButton.click();
    } catch (error) {
        console.error(error);
    }
}

/** Calculates the points scored for a correct submitted word and adds this to the HTML displayed current score. Also increments the correct words HTML element 
 * text content by 1. Finally it checks how many correct words have been given for the current set of letter tiles, and calls the nextWord function if 10 words have been given.
 * @param {string} submittedWord - a word submitted for checking by a user
 */
function scoreAdjuster(submittedWord) {
    try {
        const pointsScored = submittedWord.length;
        let currentScore = Number(currentScoreContainer.textContent);
        currentScore += pointsScored;
        currentScoreContainer.textContent = `${currentScore}`;
        let correctWordCounter = Number(correctWordCounterContainer.textContent);
        correctWordCounter += 1;
        correctWordCounterContainer.textContent = `${correctWordCounter}`;
        if (correctWordsGiven.length === 10) {
            nextWord();
        }

    } catch (error) {
        console.error(error);
    }
}

/** When called evaluates the game settings for the current game, and updates the corresponding localStorage best score variable for the current game settings,
 *  if the current score is greater than its value. A new best score is then set as the best score HTML element content.
 */
function bestScoreUpdater() {
    try {
        let currentScore = Number(currentScoreContainer.textContent);
        for (let option of allTimerRadioInputs) {
            if (option.checked && option !== noTimerRadioInput) {
                const id = option.getAttribute('id');
                let letterMode;
                if (sevenLetterModeRadioInput.checked) {
                    letterMode = 7;
                } else {
                    letterMode = 8;
                }
                let bestScoreVariableName = `${id}bestScore${letterMode}`;
                if (localStorage.getItem(`${bestScoreVariableName}`) === null) {
                    localStorage.setItem(`${bestScoreVariableName}`, `${currentScore}`);
                } else {
                    if (currentScore > localStorage.getItem(`${bestScoreVariableName}`)) {
                        localStorage.setItem(`${bestScoreVariableName}`, `${currentScore}`);
                    }
                }
                bestScoreContainer.textContent = localStorage.getItem(`${bestScoreVariableName}`);
            }
        }
    } catch (error) {
        console.error(error);
    }

}


/** Checks whether a bestScore variable, for the current game settings selected, exists in localStorage, and if it does, sets the Best Score HTML content to its value. 
 */
function onloadBestScore() {
    try {
        for (let option of allTimerRadioInputs) {
            if (option.checked && option !== noTimerRadioInput) {
                const id = option.getAttribute('id');
                let letterMode;
                if (sevenLetterModeRadioInput.checked) {
                    letterMode = 7;
                } else {
                    letterMode = 8;
                }
                let bestScoreVariableName = `${id}bestScore${letterMode}`;
                if (localStorage.getItem(`${bestScoreVariableName}`) !== null) {
                    bestScoreContainer.textContent = localStorage.getItem(`${bestScoreVariableName}`);
                } else {
                    bestScoreContainer.textContent = '0';

                }
            }
        }
        if (noTimerRadioInput.checked) {
            bestScoreContainer.textContent = '--';
        }
    } catch (error) {
        console.error(error);
    }
}

// Sets the displayed HTML document best score, to the  best score localStorage value for the current selected game settings.
onloadBestScore();

/** When called during a game, it first resets the tile holders, and removes the letter tiles, before generating a new set of letter tiles for a new random
 *  starting word. It also resets the correctWordsGiven array, by assigning it to an empty array again. In summary it produces a next word in the game.
 */
async function nextWord() {
    try {
        nextWordButton.disabled = true;
        resetTilesButton.click();
        removeLetterTiles();
        correctWordsGiven = [];
        await createLetterTiles();
        nextWordButton.disabled = false;
    } catch (error) {
        console.error(error);
    }
}