// Code to change page from start to main page
const start=document.getElementById("start-btn");
const startpage=document.getElementById("start-container");
const mainpage=document.getElementById("main-container");
start.addEventListener('click',()=>{
    startpage.classList.add('hide');
    startpage.classList.remove('visible');
    mainpage.classList.add('visible');
});


// Audio Controller
class AudioController {
    constructor() {
        this.bgMusic = new Audio('./Audio/nature.mp3');
        this.flipSound = new Audio('./Audio/flip.wav');
        this.matchSound = new Audio('./Audio/match.wav');
        this.victorySound = new Audio('./Audio/victory.wav');
        this.gameOverSound = new Audio('./Audio/gameOver.wav');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}

// Mix or match class to play the game
class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
        document.getElementById('gametitle').innerText="Memory Game";
    }

    startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    startCountdown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countdown);
        this.audioController.gameOver();
        document.getElementById('gametitle').innerText="Game-Over";
        document.getElementById('new-btn').classList.add('visible');
        document.getElementById('new-btn').classList.remove('hide');
    }
    victory() {
        clearInterval(this.countdown);
        this.audioController.victory();
        document.getElementById('gametitle').innerText="You Won";
        document.getElementById('new-btn').classList.add('visible');
        document.getElementById('new-btn').classList.remove('hide');
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visibility');
        });
    }
    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visibility');

            if(this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visibility');
            card2.classList.remove('visibility');
            this.busy = false;
        }, 1000);
    }
    shuffleCards(cardsArray) { 
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

const newbtn=document.getElementById('new-btn');
newbtn.addEventListener('click',ready);

function ready() {
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(60, cards);
    document.getElementById('new-btn').classList.remove('visible');
    document.getElementById('new-btn').classList.add('hide');
    game.startGame();
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}