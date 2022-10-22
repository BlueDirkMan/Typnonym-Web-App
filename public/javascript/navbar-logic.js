// Navbar Logic
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navLinks = document.getElementsByClassName('nav-links')[0]
const scoreDisplay = document.getElementById("score-display")
const vocabDisplay = document.getElementById("vocab-display")
const synonymDisplay = document.getElementById("synonym-display")

toggleButton.addEventListener('click', () => {
    navLinks.classList.toggle('active')
})

