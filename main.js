const gameArea = document.getElementById('game-area');
const message = document.getElementById('message');
const result = document.getElementById('result');
const highscoreForm = document.getElementById('highscore-form');
const playerNameInput = document.getElementById('player-name');
const submitScoreBtn = document.getElementById('submit-score');
const highscoreDisplay = document.getElementById('highscore-display');
const themeToggle = document.getElementById('theme-toggle');
const helpButton = document.getElementById('help-button');
const helpModal = document.getElementById('help-modal');
const closeButton = document.querySelector('.close-button');

let state = 'waiting'; // waiting, ready, go, result, tooSoon
let timerId = null;
let startTime = 0;
let bestScore = localStorage.getItem('bestScore') || Infinity;
let bestPlayer = localStorage.getItem('bestPlayer') || '';

function setGameState(newState) {
    state = newState;
    gameArea.className = 'game-area'; // Reset classes

    switch (state) {
        case 'waiting':
            message.textContent = '터치하여 시작하세요';
            gameArea.classList.add('wait');
            break;
        case 'ready':
            message.textContent = '준비...';
            gameArea.classList.add('ready');
            timerId = setTimeout(startGoPhase, Math.random() * 4000 + 1000); // 1-5초 후 시작
            break;
        case 'go':
            message.textContent = '지금!';
            gameArea.classList.add('go');
            startTime = Date.now();
            break;
        case 'result':
            // The reaction time is calculated and displayed in handleGameAreaClick
            break;
        case 'tooSoon':
            message.textContent = '너무 빨라요! 다시 시도하세요.';
            gameArea.classList.add('error');
            clearTimeout(timerId);
            break;
    }
}

function startGoPhase() {
    if (state === 'ready') {
        setGameState('go');
    }
}

function handleGameAreaClick() {
    if (state === 'waiting' || state === 'tooSoon') {
        setGameState('ready');
        result.textContent = '';
        highscoreForm.classList.add('hidden');
    } else if (state === 'result') {
        setGameState('waiting');
        result.textContent = '';
        highscoreForm.classList.add('hidden');
    } else if (state === 'ready') {
        setGameState('tooSoon');
    } else if (state === 'go') {
        const reactionTime = Date.now() - startTime;
        result.textContent = `${reactionTime}ms`;
        setGameState('result');
        checkHighscore(reactionTime);
    }
}

function checkHighscore(currentTime) {
    if (currentTime < bestScore) {
        bestScore = currentTime;
        result.textContent += ' - 신기록 달성!';
        highscoreForm.classList.remove('hidden');
        playerNameInput.focus();
    }
}

function submitHighscore() {
    const newPlayerName = playerNameInput.value.trim();
    if (newPlayerName) {
        bestPlayer = newPlayerName;
        localStorage.setItem('bestScore', bestScore);
        localStorage.setItem('bestPlayer', bestPlayer);
        updateHighscoreDisplay();
        highscoreForm.classList.add('hidden');
        playerNameInput.value = '';
    }
}

function updateHighscoreDisplay() {
    if (bestScore !== Infinity && bestPlayer) {
        highscoreDisplay.textContent = `최고 기록: ${bestPlayer} - ${bestScore}ms`;
    }
}

function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Event Listeners
gameArea.addEventListener('mousedown', handleGameAreaClick);
submitScoreBtn.addEventListener('click', submitHighscore);
playerNameInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        submitHighscore();
    }
});
themeToggle.addEventListener('click', toggleTheme);
helpButton.addEventListener('click', () => {
    helpModal.classList.remove('hidden');
});
closeButton.addEventListener('click', () => {
    helpModal.classList.add('hidden');
});
window.addEventListener('click', (event) => {
    if (event.target === helpModal) {
        helpModal.classList.add('hidden');
    }
});


// Initial Setup
function init() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }

    updateHighscoreDisplay();
    setGameState('waiting');
}

init();
