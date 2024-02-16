# Mastermole!
A battle of wits as you race to expose the enemy's team of operatives. Play the game [here](https://tdha.github.io/mastermind).

## Table of Contents
+ Introduction
+ Background
+ How to Play
+ Features
+ Screenshots
+ Technologies
+ Build Status
+ Credits
+ Licence
---
## Introduction
Mastermole is an espionage theme on the classic codebreaking board game, [Mastermind](https://en.wikipedia.org/wiki/Mastermind_(board_game)).

The computer generates a secret four-colour code [A, B, C, D] made from any combination of 6 colours (green, red, blue, orange, purple, yellow). Duplicates are allowed.

The player assumes the role of the codebreaker, each turn submitting a combination of four colours as a code for validation. Feedback on the accuracy of the code is provided by the following:
- A **black 'peg'** indicates that one of the colours _matches_ the secret code in both _positon_ (i.e. A, B, C, or D) and _colour_.
- A **white 'peg'** indicates that one of the colours is in the secret code, but does not match its corresponding position.
- No feedback ('empty pegs) indicates that one of the colours does not match the secret code by position or colour.

The player must solve the secret code in twelve (12) turns or loses the game.

## Background
This is project one for General Assembly's Software Immersive Bootcamp. We have been tasked to build a browser-based game using what we've learnt about front-end technologies during the first couple of weeks of the course. Version 1.0 of this game has been the product of one week's worth of effort.

This project both validates my choice to pivot in software development as a career, and also provides a great deal of motivation for continuing. One of the core drivers for me was to fulfil the idea of becoming a 'maker', and alongside my passion for games, the outcome is something I can proudly share (especially my nephews!).

## How to Play
This verison of the game does not come with instructions as it assumes the 'codebreaking' genre has general adoption. There are few user interface (UI) controls and feedback is immediate, making the discovery of the rule mechanics accessible. 

The board is divided into three zones:
1. Computer zone (top) – this is where the secret code is generated. The turn indicator is on the right and starts at 12. Each turn, it will reduce by 1. Upon reaching zero, the game is over and the computer wins.
2. History zone (middle) – this is where the the player's gusses are recorded, as well as the computer's feedback (black pegs, white pegs). The middle zone is scrollable once enough guesses fill the screen. The latest guess is added from the bottom.
3. Player zone (bottom) – this is where the player selects colours to create their 4-combination code and submits them for feedback. Select a colour by clicking one of the four code positions, and a modal will appear with the colour selection. Clicking on a colour will close the modal and assign that colour the that position. The modal also includes the default image, in case it is needed to help visualise the code while thinking. Clicking the X or outside the modal will close it. A player's code can only be submitted once all four positions have colours assigned to them.

At the very bottom of the screen are three (3) buttons. 
1. **Refresh** – (left; circle with arrow) this allows the player to reset the game and start over at any time.
2. **Cancel** – (middle; cross inside a cirlcle) this allows the player to reset their current guess with just one click.
3. **Submit** - (right; tick inside a circle) this submits the guess to the computer for validation, providing feedback in the form of 'pegs' (black, white), as depicted by a filled circle (black) and an outlined circle (white) to the right of the submitted guess in the History zone. The Submit button is grey while colours are being added, and will turn blue once all four (4) colours have been placed.

**Known bug:** The first submitted guess will also depict small dots for 'empty pegs' if that condition is met. Subsequent guesses will only show black and white pegs, with empty pegs implied by the dots' absence. 

## Features
### Responsive layout
This application includes the following breakpoints:
* < 376px
* 575px
* 768px
* 992px
* 1000px +

### Animated illustrations
To build the espionage theme (uncover the 'mole' in Mastermind), character illustrations give the colours an identity. Future versions may be more sophisticated in animation and interaction beyond the low-frame animated gifs.

### Audio
Sound is added in three places.
1. When selecting a character from the pop-up modal, a sound will play randomly from a list of soundbytes at a random interval (1 to 10 clicks). This adds a sense of chatter while selections are made quickly, or provides some interaction feedback during extended periods of thinking. Future versions will feature sound packs based on each character's personality, and will feel more conversational.
2. The countdown time is verbalised. After each turn, the number will be announced. At count three (3), an additional soundbyte plays.
3. Upon winning or losing, a corresponding soundbyte will play.

## Screenshots
![Game in progress](https://github.com/tdha/mastermind/blob/a6fe7808972fc0a4bbc158de512ce4dcbe0db358/assets/readme/mastermole%20game%20in%20progress.png)

![Colour selection modal](https://github.com/tdha/mastermind/blob/a6fe7808972fc0a4bbc158de512ce4dcbe0db358/assets/readme/mastermole%20modal.png)

![Player wins screen](https://github.com/tdha/mastermind/blob/a6fe7808972fc0a4bbc158de512ce4dcbe0db358/assets/readme/mastermole%20win.png)

## Technologies.
Mastermole! is built with HTML, CSS, and Javascript (JS). This application works on Chrome (Version 121.0.6167.160).
Assets include GIF and PNG for images and MP3 for audio.

## Build status
Version 1.0: 2024.02.16: Project presentation and delivery.

### Known bugs
+ Guess validation does not always show 4 pegs (black / white / empty).
+ On submitting a guess, the Player zone does not completely cler i.e. validation pegs from previous guess persist.
+ On winning or losing, the countdown timer disappears.
+ No error modal when guess is submitted with less than four colours.

## Credits
* Joel and CJ for their commitment, dedication, and expertise.
* Triin for chats and laughs.
* General Assembly for an amazing start to the course.
* Images by [pikisuperstar](https://www.freepik.com/free-vector/hand-drawn-people-avatar-collection_5183191.htm#page=2&query=faces&position=42&from_view=author&uuid=fbd8a1cd-6c97-4370-a12a-7c4e689c03fe).

## Licence
TBC.
