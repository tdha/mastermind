/*----- TODO -----*/
// checks show 4 pegs
// clearGuess clears check pegs
// time turnCountdown on win/lose condition (and reset it with clearGuess)

/*----- CONSTANTS -----*/
const PERSON = {
    green: 'assets/green.gif', 
    red: 'assets/red.gif',
    blue: 'assets/blue.gif',
    purple: 'assets/purple.gif',
    orange: 'assets/orange.gif',
    yellow: 'assets/yellow.gif',
};

const MYSTERY = 'assets/mystery.png';
const ANONYMOUS = 'assets/anonymous.png';

const PEG = {
    // guessColor[i] = computerColor[i] && guessPanel[i] = computerPanel[i]
    blackPeg: '&#9679;',
    // guessColor[i] = computerColor[i] && guessPanel[i] !== computerPanel[i]
    whitePeg: '&#9675;',
    // guessColor[i] = !computerColor[i]
    emptyPeg: '&#8210;'
};

const newGameButton = document.getElementById('refresh');
const submitGuessButton = document.getElementById('submit');
const submitGuessButtonImg = document.getElementById('submitIcon');
const clearGuessButton = document.getElementById('clear');
const clearGuessButtonImg = document.getElementById('clearIcon');
const headerGetWinner = document.querySelector('header');


/*----- STATE VARIABLES -----*/
let turnCount = 0;
let winner;
    // 'lose' = guess !== computerCode && turn === '0'; 
    // 'win' = guess === computerCode && turn > 0;
let computerCode;
let history;

// variable to store the interval for the turn countdown
// for when a timer (seconds) is added
// IS THIS NEEDED RIGHT NOW?
let turnInterval;

let turnCountdown = 12;
const people = Object.keys(PERSON);
let secretCode = generateSecretCode();
let historySection = document.getElementById('history');


/*----- CACHED ELEMENTS  -----*/
let message = document.querySelector('h1');''


/*----- EVENT LISTENERS -----*/
newGameButton.addEventListener('click', init);
submitGuessButton.addEventListener('click', submitGuess);
clearGuessButton.addEventListener('click', clearGuess);


/*----- FUNCTIONS -----*/
// guess selection modal
// Get the button that opens the modal
const modal = document.getElementById("guessModal");
// When the user clicks on <span> (x), close the modal
const span = document.getElementsByClassName("close")[0];
span.addEventListener("click", function() {
    modal.style.display = "none";
    });
// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
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

            // Get the guess values
            const guessValues = getGuessValues();

            // Check if the guess is valid after every click on the modal
            const isValid = validateGuess(guessValues);

            console.log('IsValid:', isValid);

            // Change the submit button image based on validateGuess
            if (isValid) {
                // Enable the button                
                submitGuessButtonImg.disabled = false; 
                submitGuessButtonImg.src = 'assets/icon-check-48-blue.png';
            } else {
                submitGuessButtonImg.src = 'assets/icon-check-48-grey.png';
                // Disable the button
                submitGuessButtonImg.disabled = true; 
            }

        });
    });

    // Add event listener to each panel div to track the selected panel
    document.querySelectorAll('.guessCode > div').forEach(panel => {
        // Check if the clicked panel is not a codeCheck panel
        panel.addEventListener('click', function() {
            if (!panel.classList.contains('codeCheck')) {
                selectedPanel = panel;

                // Add border treatment to the clicked panel
                panel.classList.add('activeGuessBorder');

                // Remove the 'activeGuessBorder' class from all other panels
                const guessPanels = document.querySelectorAll('.guessCode > div');
                guessPanels.forEach(guessPanel => {
                    if (guessPanel !== panel) {
                        guessPanel.classList.remove('activeGuessBorder');
                    }
                });
            }
        });
    });
}


function clearGuess() {
    const guessCode = document.querySelector('.guessCode');
    const guessPanels = guessCode.querySelectorAll('div');
    
    guessPanels.forEach((panel, index) => {
        if (index < 4) {
            panel.classList.remove('activeGuessBorder');
            panel.classList.remove('codeCheck');
            panel.classList.add('anonymous');
            panel.classList.remove('red', 'yellow', 'green', 'blue', 'purple', 'orange')
        }
    });

    // const guessCodeCheck = guessCode.querySelector('.codeCheck');
    // const codeCheckPegs = guessCodeCheck.querySelectorAll('.peg');

    // codeCheckPegs.forEach((div, index) => {
    //     if (index < 4) {
    //         div.classList.remove('blackPeg');
    //         div.classList.remove('whitePeg');
    //         div.classList.remove('emptyPeg');
    //         div.innerHTML = '';
    //     }
    // });

    // Set img src of submit button to grey
    const submitGuessButtonImg = document.querySelector('#submitIcon');
    submitGuessButtonImg.src = 'assets/icon-check-48-grey.png';

    // Get the guess values after clearing and resetting the panels
    const guessValues = getGuessValues();

    // Check if the guess is valid after every click on the modal
    const isValid = validateGuess(guessValues);
    console.log('Cleared! Is Guess Valid:', isValid);
}


init();


function init() {
    // Winner is cleared i.e. no winner
    winner = null;

    // clear styles applied when win or lose condition is triggered
    headerGetWinner.style.backgroundColor = 'rgba(176, 190, 197, 0.96)';
    message.style.color = '#37474F';
    message.innerText = 'Mastermole!';
    clearGuessButtonImg.src = 'assets/icon-cancel-48.svg';

    // clear existing content in computerCode
    const computerCode = document.querySelector('.computerCode')
    computerCode.innerHTML = '';

    // clear existing content in guessCode
    const guessCode = document.querySelector('.guessCode')
    guessCode.innerHTML = '';

    // generate new secret code
    secretCode = generateSecretCode();
    console.log("Secret code log ", secretCode);


    // history is cleared
    history = '';

 // DO I NEED THIS?   
    // currentGuess is empty
    // checkGuess is hidden; visible when turn is submitted
    currentGuess = '';

    check = '';
    turnCount = 0;
    turnCountdown = 12;
    historySection.innerHTML = '';
    submitGuessButtonImg.src = 'assets/icon-check-48-grey.png';


    // Resetting the computer code's portrait images to MYSTERY.
    for (let i = 0; i < 4; i++) {
        const panelDiv = document.createElement('div');
            // create new dvis
        // panelDiv.classList.add('panel' + (i + 1));
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
        // guessPanel.classList.add('panel' + (i + 1));
        guessPanel.classList.add('anonymous');
            // add the classes
        guessPanel.id = 'buttonModal'
            // add the ID attribute
        const anonymousImg = document.createElement('img');
            // create img tags
        anonymousImg.src = ANONYMOUS;
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
    guessCode.appendChild(codeCheckDiv);

    modalSelect();
    // generatePegs();

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


function getGuessValues() {
    const guessPanels = document.querySelectorAll('.guessCode > div');
    const guessValues = [];
    // Iterate over the first four panels
    for (let i = 0; i < 4; i++) {
        // OLD: guessValues.push(guessPanels[i].classList[0]);
        // extract the colour value form the class list
        const classList = guessPanels[i].classList;
        for (let className of classList) {
            if (className !== 'activeGuessBorder' && className !== 'codeCheck') {
            // if (className !== 'activeGuessBorder' && className !== 'codeCheck' && className !== 'anonymous') {
                guessValues.push(className);
            }
        }
    }
    return guessValues;
}


function validateGuess() {
    const guessValues = getGuessValues();
    const keys = Object.keys(PERSON);

    // Check if all values in guessValues appear as keys in PERSON
    for (let colorValue of guessValues) {
        if (!keys.includes(colorValue)) {
            return false;
        }
    }

    // All values in guessValues are keys in PERSON
    return true;
}

console.log(validateGuess(PERSON));


function submitGuess() {
    // check guess is filled with four suspects
    const guessValues = getGuessValues();
    if (guessValues.length !== 4) {
        // TODO add audio error
        console.log('Pick four suspects.');
        return; 
    }

    // check guess is valid
    const isValidGuess = validateGuess(guessValues);
    if (!isValidGuess) {
        console.log('Invalid guess. Please select valid suspects.');
        return;
    }

    // Call checkGuess after submitting the guess
    checkGuess(secretCode);

    // increment turnCount
    turnCount++;

    // decrement turnCountdown by turnCount
    turnCountdown--;

    // upddate turnCountdown display
    const turnDiv = document.querySelector('.turn > h3');
    turnDiv.textContent = turnCountdown;

    // copy guess
    const guessCode = document.querySelector('.guessCode');
    const guessCodeCopy = guessCode.cloneNode(true);

    // change class of cloned guessCode div to reflect turn number
    guessCodeCopy.classList.remove('guessCode');
    guessCodeCopy.classList.add(`turn${turnCount}`);

    // append clone to history section
    historySection.appendChild(guessCodeCopy);

    // clear the guessCode div
    clearGuess();
    getWinner();
}


// function generatePegs() {
//     const codeCheckDiv = document.querySelector('.codeCheck');
//     // clear existing content
//     codeCheckDiv.innerHTML = '';

//     for( let i = 0; i < 4; i++) {
//         const whitePeg = document.createElement('div');
//         whitePeg.classList.add('peg');
//         whitePeg.innerHTML = PEG.whitePeg;
//         // set divs to inline block
//         // whitePeg.style.display = 'inline-block';
//         codeCheckDiv.appendChild(whitePeg);
//     }
// };


function checkGuess(secretCode) {
    const guessValues = getGuessValues();
    console.log("Guess Values:", guessValues);
    const codeCheckDiv = document.querySelector('.guessCode .codeCheck');
    // Clear existing content
    codeCheckDiv.innerHTML = '';

    const unmatchedGuessIndices = [];
    const unmatchedSecretIndices = [];

    // Find black pegs (exact matches)
    for (let i = 0; i < 4; i++) {
        if (guessValues[i] === secretCode[i]) {
            const blackPeg = document.createElement('div');
            blackPeg.classList.add('peg');
            blackPeg.classList.add('blackPeg');
            blackPeg.innerHTML = PEG.blackPeg;
            codeCheckDiv.appendChild(blackPeg);
        } else {
            unmatchedGuessIndices.push(i);
            unmatchedSecretIndices.push(i);
        }
    }
    console.log("Unmatched Guess Indices:", unmatchedGuessIndices);
    console.log("Unmatched Secret Indices:", unmatchedSecretIndices);

    // Find white pegs (partial matches)
    for (let i = 0; i < unmatchedGuessIndices.length; i++) {
        const guessIndex = unmatchedGuessIndices[i];
        const guessColor = guessValues[guessIndex];
        for (let j = 0; j < unmatchedSecretIndices.length; j++) {
            const secretIndex = unmatchedSecretIndices[j];
            if (guessColor === secretCode[secretIndex]) {
                // Check if the index is not already marked as matched
                if (guessIndex !== secretIndex) {
                    const whitePeg = document.createElement('div');
                    whitePeg.classList.add('peg');
                    whitePeg.classList.add('whitePeg');
                    whitePeg.innerHTML = PEG.whitePeg;
                    codeCheckDiv.appendChild(whitePeg);
                    // Remove the matched indices from the unmatched lists
                    unmatchedGuessIndices.splice(i, 1);
                    unmatchedSecretIndices.splice(j, 1);
                    // Decrement loop counters to account for the removal
                    i--;
                    break;
                }
            }
        }
    }
    console.log("Unmatched Guess Indices after white pegs:", unmatchedGuessIndices);
    console.log("Unmatched Secret Indices after white pegs:", unmatchedSecretIndices);

    // Fill the remaining spaces with empty pegs
    const remainingPegs = 4 - (document.querySelectorAll('.peg').length);
    for (let i = 0; i < remainingPegs; i++) {
        const emptyPeg = document.createElement('div');
        emptyPeg.classList.add('peg');
        emptyPeg.innerHTML = PEG.emptyPeg;
        codeCheckDiv.appendChild(emptyPeg);
    }
}


function getWinner() {
    // Check if the player has won
    const codeCheckDiv = document.querySelector('.guessCode > .codeCheck');
    const blackPegs = codeCheckDiv.querySelectorAll('.blackPeg');
    
    console.log(turnCountdown);
    console.log(blackPegs);
    console.log(codeCheckDiv);

    // Check if the player has four black pegs and turn countdown has not reached 0
    if (blackPegs.length === 4) {
        winner = true;
        // Set message to indicate player wins
        headerGetWinner.style.backgroundColor = '#C6FF00';
        message.style.color = '#1B5E20';
        message.innerText = "Player wins!";
        clearGuessButtonImg.src = 'assets/icon-cancel-48-grey.png';

        // Show computer's secret code
        const computerCodeDiv = document.querySelector('.computerCode');
        computerCodeDiv.innerHTML = '';
        for (let i = 0; i < secretCode.length; i++) {
            const panelDiv = document.createElement('div');
            panelDiv.innerHTML = `<img src="${PERSON[secretCode[i]]}" alt="Portrait">`;
            computerCodeDiv.appendChild(panelDiv);
        }

        return;
    }
    
    // Check if the computer has won
    if (turnCountdown === 0 && winner !== true) {
        // Set message to indicate computer wins
        headerGetWinner.style.backgroundColor = '#FF1744';
        message.style.color = '#FFB74D';
        message.innerText = "You lose!";
        clearGuessButtonImg.src = 'assets/icon-cancel-48-grey.png';
        
        // Show computer's secret code
        const computerCodeDiv = document.querySelector('.computerCode');
        computerCodeDiv.innerHTML = '';
        for (let i = 0; i < secretCode.length; i++) {
            const panelDiv = document.createElement('div');
            panelDiv.innerHTML = `<img src="${PERSON[secretCode[i]]}" alt="Portrait">`;
            computerCodeDiv.appendChild(panelDiv);
        }
        return;
    }
}
