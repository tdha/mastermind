/*----- CONSTANTS -----*/
const PERSON = {
    green: 'assets/green.gif', 
    red: 'assets/red.png',
    blue: 'assets/blue.png',
    purple: 'assets/purple.png',
    orange: 'assets/orange.png',
    yellow: 'assets/yellow.png',
};

const MYSTERY = 'assets/mystery.png';
const ANONYMOUS = 'assets/anonymous.png';

const PEG = {
    blackPeg: '&#9679;',
        // guessColor = computerColor && guessPanel = computerPanel
    whitePeg: '&#9675;'
        // guessColor = computerColor && guessPanel !== computerPanel
    // QUESTION: Do I need to define a null state i.e. no correct colours
};

// const GUESS = {
//     guessComponentOne: document.getElementsByClassName('panelOne'),
//     guessComponentTwo: document.getElementsByClassName('panelTwo'),
//     guessComponentThree: document.getElementsByClassName('panelThree'),
//     guessComponentFour: document.getElementsByClassName('panelFour'),
// };

const newGameButton = document.getElementById('refresh');
const submitGuessButton = document.getElementById('submit');
const clearGuessButton = document.getElementById('clear');



/*----- STATE VARIABLES -----*/
let check;
let turn;
let winner; 
    // null = no winner; 
    // 'lose' = guess !== computerCode && turn === '0'; 
    // 'win' = guess === computerCode && turn > 0;
let computerCode;
let history;
let turnInterval;
    // variable to store the interval for the turn countdown.
let turnCountdown = 12;
const people = Object.keys(PERSON);
let secretCode = generateSecretCode();

/*----- CACHED ELEMENTS  -----*/
const message = document.querySelector('h1');


/*----- EVENT LISTENERS -----*/
newGameButton.addEventListener('click', init);
submitGuessButton.addEventListener('click', submitGuess);
clearGuessButton.addEventListener('click', clearGuess);


/*----- FUNCTIONS -----*/

// guess selection modal
const modal = document.getElementById("guessModal");
    // Get the modal
// const buttonOpenModal = document.getElementById("buttonModal");
    // Get the button that opens the modal
const span = document.getElementsByClassName("close")[0];
    // Get the <span> element that closes the modal
// buttonOpenModal.addEventListener("click", function() {
    // modal.style.display = "block";
    // When the user clicks the button, open the modal 
    // });
span.addEventListener("click", function() {
    modal.style.display = "none";
    // When the user clicks on <span> (x), close the modal
    });
window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        // When the user clicks anywhere outside of the modal, close it
        }
    });


function modalSelect() {
    let selectedPanel;

    // Add event listeners to each colored portrait in the modal
    document.querySelectorAll('.modalContent > div').forEach(portrait => {
        portrait.addEventListener('click', function() {
            const newClass = portrait.className;
                if (selectedPanel) {
                    selectedPanel.className = newClass;
                    }
                    modal.style.display = 'none';
                });
            });

    // Add event listener to each panel div to track the selected panel
    document.querySelectorAll('.guessCode > div').forEach(panel => {
        panel.addEventListener('click', function() {
            selectedPanel = panel;
            // Highlight the selected panel or add any other visual indication if needed
            panel.classList.add('activeGuessBorder');

            // Remove the 'activeGuessBorder' class from all other panels
            const guessPanels = document.querySelectorAll('.guessCode > div > div');
            guessPanels.forEach(guessPanel => {
                if (guessPanel !== panel) {
                    guessPanel.classList.remove('activeGuessBorder');
                }
            });
        });
    });
}


function clearGuess() {
    const guessPanels = document.querySelectorAll('.guessCode > div');
    guessPanels.forEach(panel => {
        const panelImg = panel.querySelector('img');
        if (panelImg) {
            panelImg.src = ANONYMOUS;
        }
        const isCodeCheck  = panel.classList.contains('codeCheck');
        panel.removeAttribute('class');
        if (isCodeCheck) {
            panel.classList.add('codeCheck');
        }
        panel.classList.remove('activeGuessBorder');
    });
}
    


init();

function init() {
    winner = null;
        // Winner is cleared i.e. no winner

    message.innerText = 'Mastermole!';

    const computerCode = document.querySelector('.computerCode')
    computerCode.innerHTML = '';
        // clear existing content in computerCode

    const guessCode = document.querySelector('.guessCode')
    guessCode.innerHTML = '';
        // clear existing content in guessCode


    secretCode = generateSecretCode();
    console.log(secretCode);
        // generate new secret code


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

    // create and append the turn div
    const turnDiv = document.createElement('div');
    turnDiv.classList.add('turn');
    turnDiv.innerHTML = `<h3>${turnCountdown}</h3>`
        // initial countdown value
    computerCode.appendChild(turnDiv);



    // Resetting the guess area's portrait images to ANONYMOUS.
    for (let i = 0; i < 4; i++) {
        const guessPanel = document.createElement('div');
            // create new dvis
        guessPanel.classList.add('panel' + (i + 1));
            // add the classes
        guessPanel.id = 'buttonModal'
            // add the ID attribute
        const anonymousImg = document.createElement('img');
            // create img tags
        anonymousImg.src = ANONYMOUS    ;
        anonymousImg.alt = 'Illustration of a person in silhouette.';
        guessPanel.appendChild(anonymousImg);
        guessCode.appendChild(guessPanel);
            // insert ANONYMOUS image into each div within guessCode
    
            // attach event listener to div to open modal
            guessPanel.addEventListener('click', function() {
                modal.style.display = 'block';
                guessPanel.classList.add('activeGuessBorder');
                    // to highlight active guess
            });
    }

    // When the modal closes via click(x), remove the 'activeGuessBorder' class from all panels
    span.addEventListener("click", function() {
        modal.style.display = "none";
        const guessPanels = document.querySelectorAll('.guessCode > div');
        guessPanels.forEach(panel => {
            panel.classList.remove('activeGuessBorder'); 
            // Remove class when modal closes
        });
    });

    // When the modal closes via outside of modal, remove the 'activeGuessBorder' class from all panels
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        const guessPanels = document.querySelectorAll('.guessCode > div');
        guessPanels.forEach(panel => {
            panel.classList.remove('activeGuessBorder'); 
            // Remove class when modal closes
            });
        }
    });

    // create and append the codeCheck div
    const codeCheckDiv = document.createElement('div');
    codeCheckDiv.classList.add('codeCheck');
    codeCheckDiv.innerHTML = '<h2>&#9679;&#9675;&#9675;&#9675;</h2>'
    guessCode.appendChild(codeCheckDiv);

    modalSelect();

}

function render() {
    // QUESTION: what needs to go here?
}

// generate a secret code from shuffling PEOPLE
    // found: Fisher-Yates shuffle algorithm (Knuth shuffle)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
    // generating secret code that allows for duplicates
function generateSecretCode() {
    const shuffledPeople = shuffle(people);
        // shuffle PEOPLE array
    const secretCode = [];
    for (let i = 0; i < 4; i++) {
        // iterates for times for each code sequence
        const randomIndex = Math.floor(Math.random() * shuffledPeople.length);
            // selects a random value with each iteration
        secretCode.push(shuffledPeople[randomIndex]);
    }
    return secretCode; 
}


// game sequence
    // make a currentGuess by selecting four people (popup per person)
    // submit currentGuess
    // currentGuess clears
    // guess now shows in history (scrollable)
    // guess in history shows checkGuess (black peg, white peg, null)
    // turn -1


function getGuessValues() {
    const guessPanels = document.querySelectorAll('.guessCode > div');
    const guessValues = [];
    // Iterate over the first four panels
    for (let i = 0; i < 4; i++) {
        guessValues.push(guessPanels[i].id);
    }
    return guessValues;
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

function getWinner() {
    
}