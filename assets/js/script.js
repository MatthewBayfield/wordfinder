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