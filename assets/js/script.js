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

// Assigns a constant variable to the generated random 5000 7 letter word array. A word is selected from this prepopulated list of words everytime a game starts,
//and for every new word within the same game, without duplications. Thus the fetch requests to generate the words needed for the game,
// only have to be performed once when the page  initially loads.
const words7Letters = random7Letter5000Words().then(function (result) {
    return result;
})

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
        do {
            selectedStringCharacterArray = [];
            randomIndex = Math.floor(Math.random() * words7LettersArray.length);
            for (let character of words7LettersArray[randomIndex].word) {
                selectedStringCharacterArray.push(character);
            }
            validCharacters = selectedStringCharacterArray.every(function (character) {
                return Alphabet.includes(character);
            })
        }
        while (usedWords.includes(words7LettersArray[randomIndex].word) || !validCharacters)
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
        let partialAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w'];
        let randomSetOf5Letters = new Set();
        let random8Letter5000WordArray = [];
        while (randomSetOf5Letters.size < 5) {
            let randomIndex = Math.floor(Math.random() * 23);
            randomSetOf5Letters.add(partialAlphabet[randomIndex]);
        }
        for (letter of randomSetOf5Letters) {
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
const words8Letters = random8Letter5000Words().then(function (result) {
    return result;
})


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
        do {
            selectedStringCharacterArray = [];
            randomIndex = Math.floor(Math.random() * words8LettersArray.length);
            for (let character of words8LettersArray[randomIndex].word) {
                selectedStringCharacterArray.push(character);
            }
            validCharacters = selectedStringCharacterArray.every(function (character) {
                return Alphabet.includes(character);
            })
        }
        while (usedWords.includes(words8LettersArray[randomIndex].word) || !validCharacters)
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
        if (document.getElementById('seven').checked) {
            selectedWord = await random7LetterWordSelector();
        } else {
            selectedWord = await random8LetterWordSelector();
        }
        if (selectedWord === undefined) {
            throw new Error('propagated error from called function');
        }
        let urls = [];
        for (i = 4; i <= selectedWord.length; i++) {
            let q = "?";
            let url = "";
            q = q.repeat(i)
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
        console.error(error)
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
async function correctWordListFilterandConcatenate() {
    try {
        urls = await urlGenerator();
        if (urls === undefined) {
            throw new Error('propagated error from called function');
        }
        let concatenatedCorrectWordListArray = [];
        for (let url of urls) {
            filteredWordArrayToConcatenate = await noDefinitionWordFilter(correctWordListFetcher(url));
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
        let currentCorrectWordArray = await correctWordListFilterandConcatenate();
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
            return b - a
        });
        return extractedWordFrequencyArray;
    } catch (error) {
        console.error(error);
    }
}