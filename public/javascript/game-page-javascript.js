// This is made after most of the testing was done (so trasfer the code basically)

// Navbar Logic
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navLinks = document.getElementsByClassName('nav-links')[0]
const scoreDisplay = document.getElementById("score-display")
const vocabDisplay = document.getElementById("vocab-display")
const synonymDisplay = document.getElementById("synonym-display")

toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('active')
})



// ----------------------------------------
const typingBox = document.getElementById("typing-box-form");
const typingInput = document.getElementById("typing-box-input")
const timerDisplay = document.getElementById("timer-display")
const instruction = document.getElementById("instruction")
const wordDisplay = document.getElementById("word-display")
const restartButton = document.getElementById("restart-button")
const saveForm = document.getElementById("save-form")

let currentScore = 0
let wordIndex = 0
let synonymIndex = 0
const wordBank = ["pool", "nice", "kind"]
const synonymBank = []

let characterTyped = 0
const wpmDisplay = document.getElementById("wpm-display")

// Decided to put it all outside, then we'll replace it to what we want inside the function so shoudl be fine
// This is so that we are editing and overwriting the correct variables for all game loops 
let timeLimit = 0
let timerTime = 0

let startTime = 0
let trackedTime = 0

let cpm = 0
let wpm = 0

let gameRestart = 0

let keptScore = 0
let keptwpm = 0
typingBox.addEventListener("submit", (event) => {
    event.preventDefault()
})

let gameCondition = true;
const startFunction = async function (event) {
    if (typingInput.value === "start") {
        typingInput.removeAttribute("placeholder")
        typingInput.value = null
        const sam = await gameLoop().catch((e) => { console.log(`ERROR: ${e}`)})
    }
}

typingInput.addEventListener('input', startFunction)



const dictionaryFetch = async function (randomWord) {
    console.log("---")
    console.log("Dictionary Fetch Function")
    console.log(`Fetching: ${randomWord}`)
    const fetchedList = []
    await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`)
        .then((response) => response.json())
        .then((data) => {
            for (let words of data) {                           // this gives use all the words
                for (let meanings of words.meanings) {          // this gives all the meanings
                    fetchedList.push(...meanings.synonyms)
                }
            }
        })
    return fetchedList
}

const gameLoop = async function () {
    // Game variables
    timeLimit = Date.now() + 10000;
    timerTime = 0

    startTime = Date.now()
    trackedTime = 0

    cpm = 0
    wpm = 0

    gameRestart = false

    // Game Function
    async function changeWord() {
        console.log("---")
        console.log("Change Word Function")
        if (typeof(wordBank[wordIndex])  === 'undefined') {
            console.log("YOU FUCKED UP")
            wordIndex = 0
        }
        const newSynonymList = await dictionaryFetch(wordBank[wordIndex])
        console.log(newSynonymList)
        if (newSynonymList.length >= 5) {
            synonymBank.splice(0, synonymBank.length, ...newSynonymList);
            synonymBank.splice(5, synonymBank.length)
            console.log(synonymBank.length)
            vocabDisplay.innerText = wordBank[wordIndex]
            wordIndex += 1
            console.log(synonymBank)
            console.log("Finish change word")
        } else {
            wordIndex += 1
            await changeWord()
        }

    }
    async function newSynonym() {
        console.log("---")
        console.log("New Synonym Function")
        if (synonymIndex === synonymBank.length) {                      // remember length is 3 if array have 3 words
            await changeWord()
            console.log("changed word")
            synonymIndex = 0
        }
        synonymDisplay.innerText = synonymBank[synonymIndex]
        synonymIndex += 1
    }
    const updateWPM = function (currentCharacterTyped, timerCount) {
        cpm = Math.round(((currentCharacterTyped / timerCount) * 60));
        wpm = Math.round((((currentCharacterTyped / 5) / timerCount) * 60));
        wpmDisplay.innerHTML = wpm
        return wpm
    }

    const typingBoxFunction = function (event) {
        const typedWord = typingInput.value
        if (synonymBank.includes(typedWord)) {
            currentScore += 1
            characterTyped += typedWord.length
            updateWPM(characterTyped, trackedTime)
            scoreDisplay.innerText = currentScore
            newSynonym()
            timeLimit += 2000
            typingInput.value = null;
        }
    }

    // Game Logic   
    typingBox.addEventListener('submit', typingBoxFunction)
    typingInput.removeEventListener('input', startFunction)
    restartButton.addEventListener('click', () => {
        gameRestart = true;
    })

    await changeWord()
    await newSynonym()

    instruction.classList.toggle('active')
    wordDisplay.classList.toggle('active')
    restartButton.classList.toggle('active')
    // We don't want to show the save form before the first gameplay have been completed, so check if save form 
    // have been given the active class (by the end game logic)
    if (saveForm.classList.contains('active')) {
        saveForm.classList.toggle('active')
    }


    // Start Timer
    const interval = setInterval(function () {
        // For Timer Display
        let elapsedTime = timeLimit - Date.now();
        timerTime = (elapsedTime / 1000).toFixed(3);
        timerDisplay.innerHTML = timerTime;
        // For Keeping Track of Time
        let passedTime = Date.now() - startTime;
        trackedTime = (passedTime / 1000).toFixed(3);

        // Game End Logic
        if (timerTime < 0 || gameRestart === true) {
            clearInterval(interval)
            timerDisplay.innerHTML = 10;
            typingBox.removeEventListener('submit', typingBoxFunction)
            typingInput.addEventListener('input', startFunction)
            typingInput.value = null;
            instruction.classList.toggle('active')
            wordDisplay.classList.toggle('active')
            typingInput.setAttribute('placeholder', "start")

            // Keep track of scores gotten
            keptScore = currentScore
            keptwpm = wpm

            // Reset Time
            timeLimit = Date.now() + 10000;
            timerTime = 0
            startTime = Date.now()
            trackedTime = 0
            cpm = 0
            wpm = 0
            gameRestart = false

            // Reset Score & WPM
            currentScore = 0
            wpmDisplay.innerText = 0
            scoreDisplay.innerText = 0
            characterTyped = 0

            // Showing & Hiding Buttons
            saveForm.classList.toggle('active')
            restartButton.classList.toggle('active')
        }
    }, 100);
}


// const restart = document.getElementById("restart")
// restart.addEventListener("click", gameLoop)
// I didn't think of this at first, but then I'm assuming the gameLoop finish right away (I was under the
// impression/semi-autopilot thinking that gameloop was continous, but we have proven time and time again that)
// the stuff after in typingInput event listener worked right away despite the await. That should indicate that
// it's not continious and finishes rigth away.


// Ok after testing this, anotehr thing i was worried about became true. So although the function is not continious,
// the asynchronous function is running. As such, even though we run a gameloop, it's like we have two gameloop
// running at the same time -> indicated by the timer being quickly switched back and forth

// Basically, it's the same problem I have been trying to figure out since last time. How to stop these fucking
// continous function when a condition is met.

// At the moment, I believe the main thing we have a chance of working this whole thing out is the interval
// function because that's the only (I think) continous thing going on.

// Nvm, i think i'm stupid because since the thing is continous because it runs on intervals right, I can just
// continously check the state whether the restart button is clicked or not. So just make a variable then.

// So we don't even need to make it restart the thing on click. We just change the variable. Then if variable is
// true, we reset all the current variables (time tracked, etc, and we go to default state before gameloop)