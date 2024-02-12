/*----- constants -----*/
const PERSON = {
    green: 'assets/green.gif', 
    red: 'assets/red.png',
    blue: 'assets/blue.png',
    purple: 'assets/purple.png',
    orange: 'assets/orange.png',
    yellow: 'assets/yellow.png',
};

const MYSTERY = 'assets/mystery.png';

const PEG = {
    blackPeg: '&#9679;',
        // guessColor = computerColor && guessPanel = computerPanel
        whitePeg: '&#9675;'
        // guessColor = computerColor && guessPanel !== computerPanel
    // QUESTION: Do I need to define a null state i.e. no correct colours
};

const GUESS = {
    guessComponentOne: document.getElementsByClassName('panelOne'),
    guessComponentTwo: document.getElementsByClassName('panelTwo'),
    guessComponentThree: document.getElementsByClassName('panelThree'),
    guessComponentFour: document.getElementsByClassName('panelFour'),
};

const newGameButton = document.getElementById('refresh');
const clearGuessButton = document.getElementById('clear');
const submitGuessButton = document.getElementById('submit');

/*----- state variables -----*/
let check;
let turn;
let winner; 
    // null = no winner; 
    // 'lose' = guess !== computerCode && turn === '0'; 
    // 'win' = guess === computerCode && turn > 0;
let computerCode;
let history;
let timerInterval;
    // variable to store the interval for the timer countdown.
let turnCountdown = 12;

/*----- cached elements  -----*/
const message = document.querySelector('h1');


/*----- event listeners -----*/
newGameButton.addEventListener('click', init);
submitGuessButton.addEventListener('click', submitGuess);
clearGuessButton.addEventListener('click', clearGuess);


/*----- functions -----*/

init();

function init() {
    winner = null;
        // Winner is cleared i.e. no winner

    message.innerText = 'Mastermole!';

    const computerCode = document.querySelector('.computerCode')
    computerCode.innerHTML = '';
        // clear existing content in computerCode

    history = '';
        // history is cleared
    currentGuess = '';
        // currentGuess is empty
    check = '';
        // checkGuess is hidden; visible when turn is submitted

    // Resetting the computer code's portrait images to MYSTERY.
    for (let i = 0; i < 4; i++) {
        const panelDiv = document.createElement('div');
            // create new dvis
        panelDiv.classList.add('panel' + (i + 1));
            // add the classes
        const mysteryImg = document.createElement('img');
            // create img tags
        mysteryImg.src = MYSTERY;
        mysteryImg.alt = 'Illustration of a person in silhouette with question mark.';
        panelDiv.appendChild(mysteryImg);
        computerCode.appendChild(panelDiv);
            // insert MYSTERY image into each div within computerCode
    }

    // create and append the timer div
    const timerDiv = document.createElement('div');
    timerDiv.classList.add('timer');
    timerDiv.innerHTML = '<h3>12</h3>'
        // initial countdown value
    computerCode.appendChild(timerDiv);
}

function render() {
    // QUESTION: what needs to go here?
}

// game sequence
    // make a currentGuess by selecting four people (popup per person)
    // submit currentGuess
    // currentGuess clears
    // guess now shows in history (scrollable)
    // guess in history shows checkGuess (black peg, white peg, null)
    // turn -1
function makeGuess() {
    // click square in currentGuess
        // currentGuess.getElementByClass('currentTurn > guessCode > panelOne')
    // select PERSON from popup (TODO)
    // selection = panelOne
}

function submitGuess() {
    // if all panels(4) have selections
    // click
        // clears currentGuess
        // adds guess to history
        // checkGuess()
}

function checkGuess() {

}

function clearGuess() {

}

function getWinner() {
    
}

// Get the modal
const modal = document.getElementById("guessModal");

// Get the button that opens the modal
const buttonOpenModal = document.getElementById("buttonModal");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
buttonOpenModal.addEventListener("click", function() {
    modal.style.display = "block";
  });

// When the user clicks on <span> (x), close the modal
span.addEventListener("click", function() {
    modal.style.display = "none";
  });

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });