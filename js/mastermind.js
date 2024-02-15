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
    blackPeg: '&#9679;',
    whitePeg: '&#9675;',
    emptyPeg: '&#8231;'
};

const AUDIOLIST = [
    new Audio('assets/audio/pimpyall.mp3'),
    new Audio('assets/audio/excuse.mp3'),
    new Audio('assets/audio/lalala.mp3'),
    new Audio('assets/audio/crazy.mp3'),
    new Audio('assets/audio/rock.mp3'),
    new Audio('assets/audio/thank.mp3'),
    new Audio('assets/audio/dance.mp3'),
    new Audio('assets/audio/what.mp3')
];

const newGameButton = document.getElementById('refresh');
const submitGuessButton = document.getElementById('submit');
const submitGuessButtonImg = document.getElementById('submitIcon');
const clearGuessButton = document.getElementById('clear');
const clearGuessButtonImg = document.getElementById('clearIcon');
const headerGetWinner = document.querySelector('header');

const soundEleven = new Audio('assets/audio/11-eleven.mp3');
const soundTen = new Audio('assets/audio/10-ten.mp3');
const soundNine = new Audio('assets/audio/9-nine.mp3');
const soundEight = new Audio('assets/audio/8-eight.mp3');
const soundSeven = new Audio('assets/audio/7-seven.mp3');
const soundSix = new Audio('assets/audio/6-six.mp3');
const soundFive = new Audio('assets/audio/5-five.mp3');
const soundFour = new Audio('assets/audio/4-four.mp3');
const soundThree = new Audio('assets/audio/3-three.mp3');
const soundTwo = new Audio('assets/audio/2-two.mp3');
const soundOne = new Audio('assets/audio/1-one.mp3');

const soundCheer = new Audio('assets/audio/cheer.mp3');
const soundDie = new Audio('assets/audio/die.mp3');
const soundFalling = new Audio('assets/audio/falling.mp3');

const randomSounds = document.querySelectorAll('.randomSoundId');


/*----- STATE VARIABLES -----*/
let turnCount = 0;
let winner;
let computerCode;
let history;
let turnCountdown = 12;
const people = Object.keys(PERSON);
let clickCounter = 0;


/*----- CACHED ELEMENTS  -----*/
let message = document.querySelector('h1');''
let secretCode = generateSecretCode();
let historySection = document.getElementById('history');


/*----- EVENT LISTENERS -----*/
newGameButton.addEventListener('click', init);
submitGuessButton.addEventListener('click', submitGuess);
clearGuessButton.addEventListener('click', clearGuess);


/*----- FUNCTIONS -----*/
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
        const mysteryImg = document.createElement('img');
        mysteryImg.src = MYSTERY;
        mysteryImg.alt = 'Illustration of a person in silhouette with question mark.';
        panelDiv.appendChild(mysteryImg);
        computerCode.appendChild(panelDiv);
    }

    // create and append the turn div
    const turnDiv = document.createElement('div');
    turnDiv.classList.add('turn');
    turnDiv.innerHTML = `<h3>${turnCountdown}</h3>`
    computerCode.appendChild(turnDiv);

    // Resetting the guess area's portrait images to ANONYMOUS.
    for (let i = 0; i < 4; i++) {
        const guessPanel = document.createElement('div');
        // add the classes
        guessPanel.classList.add('anonymous');
        // add the ID attribute
        guessPanel.id = 'buttonModal'
        // create img tags
        const anonymousImg = document.createElement('img');
        anonymousImg.src = ANONYMOUS;
        anonymousImg.alt = 'Illustration of a person in silhouette.';
        guessPanel.appendChild(anonymousImg);
        // insert ANONYMOUS image into each div within guessCode
        guessCode.appendChild(guessPanel);

        // attach event listener to div to open modal
        guessPanel.addEventListener('click', function() {
            modal.style.display = 'block';
            // to highlight active guess
            guessPanel.classList.add('activeGuessBorder');
        });
    }

    // When the modal closes via click(x), remove the 'activeGuessBorder' class from all panels
    span.addEventListener("click", function() {
        modal.style.display = "none";
        const guessPanels = document.querySelectorAll('.guessCode > div');
        guessPanels.forEach(panel => {
            // Remove class when modal closes
            panel.classList.remove('activeGuessBorder'); 
        });
    });

    // When the modal closes via outside of modal, remove the 'activeGuessBorder' class from all panels
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        const guessPanels = document.querySelectorAll('.guessCode > div');
        guessPanels.forEach(panel => {
            // Remove class when modal closes
            panel.classList.remove('activeGuessBorder'); 
            });
        }
    });

    // create and append the codeCheck div
    const codeCheckDiv = document.createElement('div');
    codeCheckDiv.classList.add('codeCheck');
    guessCode.appendChild(codeCheckDiv);

    modalSelect();
}


// generate a secret code from shuffling PEOPLE
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
   

// generating secret code that allows for duplicates
function generateSecretCode() {
    // shuffle PEOPLE array
    const shuffledPeople = shuffle(people);
    const secretCode = [];
    for (let i = 0; i < 4; i++) {
        // selects a random value with each iteration
        const randomIndex = Math.floor(Math.random() * shuffledPeople.length);
        secretCode.push(shuffledPeople[randomIndex]);
    }
    return secretCode; 
}


function getGuessValues() {
    const guessPanels = document.querySelectorAll('.guessCode > div');
    const guessValues = [];
    for (let i = 0; i < 4; i++) {
        // extract the colour value form the class list
        const classList = guessPanels[i].classList;
        for (let className of classList) {
            if (className !== 'activeGuessBorder' && className !== 'codeCheck') {
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

    // turnCountdown plays sound for that turn.
    if (turnCountdown === 11) {
        soundEleven.play();
    }
    if (turnCountdown === 10) {
        soundTen.play();
    }
    if (turnCountdown === 9) {
        soundNine.play();
    }
    if (turnCountdown === 8) {
        soundEight.play();
    }
    if (turnCountdown === 7) {
        soundSeven.play();
    }
    if (turnCountdown === 6) {
        soundSix.play();
    }
    if (turnCountdown === 5) {
        soundFive.play();
    }
    if (turnCountdown === 4) {
        soundFour.play();
    }
    if (turnCountdown === 3) {
        soundThree.play();
        setTimeout(() => {
            soundDie.play();
        }, 1000);
    }
    if (turnCountdown === 2) {
        soundTwo.play();
    }
    if (turnCountdown === 1) {
        soundOne.play();
    }
}


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
        emptyPeg.classList.add('peg', 'emptyPeg');
        emptyPeg.innerHTML = PEG.emptyPeg;
        codeCheckDiv.appendChild(emptyPeg);
    }
}


function getWinner() {
    // Check if the player has won
    const codeCheckDiv = document.querySelector('.guessCode > .codeCheck');
    const blackPegs = codeCheckDiv.querySelectorAll('.blackPeg');

    // Check if the player has four black pegs and turn countdown has not reached 0
    if (blackPegs.length === 4) {
        winner = true;
        // Set message to indicate player wins
        headerGetWinner.style.backgroundColor = '#C6FF00';
        message.style.color = '#1B5E20';
        message.innerText = "Player wins!";
        clearGuessButtonImg.src = 'assets/icon-cancel-48-grey.png';

        // Play victory sound
        soundCheer.play();

        // Show computer's secret code
        const computerCodeDiv = document.querySelector('.computerCode');
        computerCodeDiv.innerHTML = '';
        for (let i = 0; i < secretCode.length; i++) {
            const panelDiv = document.createElement('div');
            panelDiv.innerHTML = `<img src="${PERSON[secretCode[i]]}" alt="Portrait">`;
            computerCodeDiv.appendChild(panelDiv);
        }

        // Exit the function after handling player win condition
        return;
    }
    
    // Check if the computer has won
    if (turnCountdown === 0 && winner !== true) {
        // Set message to indicate computer wins
        headerGetWinner.style.backgroundColor = '#FF1744';
        message.style.color = '#FFB74D';
        message.innerText = "You lose!";
        clearGuessButtonImg.src = 'assets/icon-cancel-48-grey.png';

        // Play losing sound
        soundFalling.play();
        
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


randomSounds.forEach(randomSound => {
    randomSound.addEventListener('click', function() {
    // Increment click counter
    clickCounter++;

    // Random number to space out sound on clicks
    const randomN = Math.floor(Math.random() * 10) + 1;

    if (clickCounter % randomN === 0) {
        // Randomly select an audio element from the audioList
        const randomIndex = Math.floor(Math.random() * AUDIOLIST.length);
        const randomAudio = AUDIOLIST[randomIndex];

        randomAudio.play();
        }
    })
});