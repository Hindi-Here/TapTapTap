// создание объектов и их стиль
const circles =
    [
        { color: '#ffa8a8d5', size: 100, duration: 3000, point: 1 },
        { color: '#e59797d6', size: 70, duration: 2000, point: 3 },
        { color: '#cf8a8ad9', size: 40, duration: 1000, point: 5 },

        { color: '#cda9fcd3', size: 100, duration: 3000, point: 1 },
        { color: '#bd9be8da', size: 70, duration: 2000, point: 3 },
        { color: '#a88acfdb', size: 40, duration: 1000, point: 5 },

        { color: '#a9fcd4d2', size: 100, duration: 3000, point: 1 },
        { color: '#9ee8c4dc', size: 70, duration: 2000, point: 3 },
        { color: '#8bccacdd', size: 40, duration: 1000, point: 5 },

        { color: '#fcf4a9d2', size: 100, duration: 3000, point: 1 },
        { color: '#ebe39dd2', size: 70, duration: 2000, point: 3 },
        { color: '#dbd495d2', size: 40, duration: 1000, point: 5 },
    ];

// переменные для js кода
const container = document.getElementById('circle-container');
const scoreDisplay = document.getElementById('score');

const tokensRemainingDisplay = document.getElementById('tokens-remaining');
const tokenScale = document.getElementById('token-scale');

const startGameButton = document.getElementById('start-game-button');
const nameInput = document.getElementById('name-input');

const totalDuration = 120000;
let score = 0;
let tokensRemaining = totalDuration / 1000;
let elapsedTime = 0;

// создание кругов на экране и обновление статистики
function createCircle(circle) {
    const div = document.createElement('div');
    div.className = 'circle';
    div.style.backgroundColor = circle.color;
    div.style.width = `${circle.size}px`;
    div.style.height = `${circle.size}px`;

    const header = document.querySelector('.header');
    const x = Math.random() * (window.innerWidth - circle.size);
    const y = Math.random() * (window.innerHeight - circle.size - header.offsetHeight) + header.offsetHeight;

    div.style.left = `${x}px`;
    div.style.top = `${y}px`;

    div.addEventListener('click', () => {
        score += circle.point;
        scoreDisplay.textContent = `Счет: ${score}`;
        div.remove();
    });

    tokensRemaining -= circle.duration / 1000;
    tokensRemainingDisplay.textContent = `Токенов до конца игры: ${Math.ceil(tokensRemaining)}`;

    const scaleWidth = (tokensRemaining / (totalDuration / 1000)) * 100;
    tokenScale.style.width = `${scaleWidth}%`;

    container.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, circle.duration);

}

// событие нажатия на кнопку запуска
startGameButton.addEventListener('click', () => {
    if (nameInput.value.trim() === "") {
        alert("Пожалуйста, введите имя игрока!");
        return;
    }
    score = 0;
    elapsedTime = 0;
    tokensRemaining = totalDuration / 1000;
    startAnimation();
});

// функция работы программы
function startAnimation() {
    const interval = setInterval(() => {
        if (elapsedTime < totalDuration) {
            const randomCircle = circles[Math.floor(Math.random() * circles.length)];
            createCircle(randomCircle);
            elapsedTime += randomCircle.duration;
        } else {
            clearInterval(interval);
            saveScore(nameInput.value, score);
        }
    }, 500);
}

// сохранение результатов в БД
function saveScore(userName, score) {
    fetch('/Home/SaveScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: userName, score: score })
    })
}