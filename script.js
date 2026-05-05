let currentQuestionIndex = 0;
let skipsLeft = 3;
let cardsUsed = false;
let selectedOption = null;
let isAnswerLocked = false;
let timerInterval = null;
let timeLeft = 20;

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const optionsContainer = document.getElementById('options-container');

const btnStart = document.getElementById('btn-start');
const btnSkip = document.getElementById('btn-skip');
const btnCards = document.getElementById('btn-cards');

const audioStart = document.getElementById('audio-start');
const audioWrong = document.getElementById('audio-wrong');
const audioCorrect = document.getElementById('audio-correct');
const audioGong = document.getElementById('audio-gong');
const audioCards = document.getElementById('audio-cards');
const audioBackground = document.getElementById('audio-background');
const audioWaiting = document.getElementById('audio-waiting');
const speechCerta = document.getElementById('speech-certa');
const speechDisso = document.getElementById('speech-disso');
const speechErrada = document.getElementById('speech-errada');
const speechTempo = document.getElementById('speech-tempo');

function setHostExpression(expression) {
    const avatar = document.getElementById('host-avatar');
    if (avatar) avatar.className = 'host-' + expression;
}

btnStart.addEventListener('click', startGame);

function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    audioStart.play();
    
    currentQuestionIndex = 0;
    skipsLeft = 3;
    cardsUsed = false;
    document.getElementById('skips-left').innerText = skipsLeft;
    btnCards.disabled = false;
    btnSkip.disabled = false;
    
    // Pequeno atraso para a animação
    setTimeout(loadQuestion, 2000);
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame(true);
        return;
    }

    isAnswerLocked = false;
    selectedOption = null;
    audioGong.play();
    audioBackground.play();
    audioWaiting.pause();
    audioWaiting.currentTime = 0;
    setHostExpression('thinking');
    startTimer();

    const q = questions[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.question;
    document.getElementById('current-question-num').innerText = currentQuestionIndex + 1;
    
    updatePrizes();

    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    
    q.options.forEach((optText, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.dataset.index = index;
        div.innerHTML = `
            <span class="letter">${letters[index]}</span>
            <span class="text">${optText}</span>
            <button class="confirm-btn">Confirmar</button>
        `;
        
        div.addEventListener('click', () => selectOption(div));
        
        const confirmBtn = div.querySelector('.confirm-btn');
        confirmBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            confirmAnswer(index, div);
        });

        optionsContainer.appendChild(div);
    });
}

function updatePrizes() {
    const errarIndex = Math.max(0, currentQuestionIndex - 1); // Se errar, cai para o prêmio anterior ou 0
    const errarPrize = currentQuestionIndex === 0 ? "0 PONTOS" : gameConfig.prizes[errarIndex];
    
    const pararPrize = currentQuestionIndex === 0 ? "0 PONTOS" : gameConfig.prizes[currentQuestionIndex - 1];
    const acertarPrize = gameConfig.prizes[currentQuestionIndex];

    const prizeErrar = document.getElementById('prize-errar');
    const prizeParar = document.getElementById('prize-parar');
    const prizeAcertar = document.getElementById('prize-acertar');

    if (prizeErrar) prizeErrar.innerText = errarPrize;
    if (prizeParar) prizeParar.innerText = pararPrize;
    if (prizeAcertar) prizeAcertar.innerText = acertarPrize;
}

function selectOption(element) {
    if (isAnswerLocked) return;
    
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    selectedOption = element;

    // Toca o "Está certo disso?" ao selecionar
    speechDisso.pause();
    speechDisso.currentTime = 0;
    speechDisso.play();
}

function confirmAnswer(index, element) {
    if (isAnswerLocked) return;
    isAnswerLocked = true;
    stopTimer();
    element.classList.remove('selected');

    // Pausa a música de fundo e inicia o suspense
    audioBackground.pause();
    audioWaiting.play();
    setHostExpression('nervous');

    const correctAnswer = questions[currentQuestionIndex].answer;
    
    // Simula o "Está certo disso?" com um delay de suspense
    setTimeout(() => {
        audioWaiting.pause();
        audioWaiting.currentTime = 0;

        if (index === correctAnswer) {
            element.classList.add('correct');
            audioCorrect.play();
            speechCerta.play(); // Silvio Santos: "Certa resposta!"
            setHostExpression('happy');
            setTimeout(() => {
                currentQuestionIndex++;
                loadQuestion();
            }, 3000);
        } else {
            element.classList.add('wrong');
            speechErrada.play(); // Silvio Santos: "Resposta errada!"
            setHostExpression('sad');
            const correctElement = document.querySelector(`.option[data-index="${correctAnswer}"]`);
            if(correctElement) correctElement.classList.add('correct');
            
            audioWrong.play();
            setTimeout(() => {
                endGame(false);
            }, 3000);
        }
    }, 4000); // 4 segundos de suspense
}

function useSkip() {
    if (isAnswerLocked || skipsLeft <= 0) return;
    stopTimer();
    skipsLeft--;
    document.getElementById('skips-left').innerText = skipsLeft;
    
    if (skipsLeft <= 0) {
        btnSkip.disabled = true;
    }
    
    currentQuestionIndex++;
    loadQuestion();
}

function useCards() {
    if (isAnswerLocked || cardsUsed) return;
    cardsUsed = true;
    btnCards.disabled = true;
    
    audioCards.play();
    
    const correctAnswer = questions[currentQuestionIndex].answer;
    const optionsList = Array.from(document.querySelectorAll('.option'));
    
    // Filtra as opções incorretas
    const wrongOptions = optionsList.filter(opt => parseInt(opt.dataset.index) !== correctAnswer);
    
    // Escolhe aleatoriamente de 1 a 3 para eliminar (como no jogo das cartas do Rei/Ás)
    // Para simplificar, vamos remover 2 alternativas incorretas
    const numToRemove = 2;
    
    // Embaralha
    wrongOptions.sort(() => Math.random() - 0.5);
    
    setTimeout(() => {
        for(let i=0; i<numToRemove; i++) {
            wrongOptions[i].classList.add('eliminated');
        }
    }, 1500); // tempo do som tocar
}

function stopGame() {
    if (isAnswerLocked) return;
    stopTimer();
    endGame(null); // null significa que parou
}

function endGame(win) {
    audioBackground.pause();
    audioBackground.currentTime = 0;
    audioWaiting.pause();
    audioWaiting.currentTime = 0;

    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    
    let finalPrize = "0 PONTOS";
    let title = "FIM DE JOGO";
    
    if (win === true) {
        title = "VOCÊ VENCEU!";
        finalPrize = gameConfig.prizes[gameConfig.prizes.length - 1];
        setHostExpression('happy');
    } else if (win === false) {
        title = "QUE PENA, VOCÊ ERROU!";
        const errarIndex = Math.max(0, currentQuestionIndex - 1);
        finalPrize = currentQuestionIndex === 0 ? "0 PONTOS" : gameConfig.prizes[errarIndex];
        setHostExpression('sad');
    } else {
        title = "VOCÊ PAROU!";
        finalPrize = currentQuestionIndex === 0 ? "0 PONTOS" : gameConfig.prizes[currentQuestionIndex - 1];
        setHostExpression('sad');
    }
    
    document.getElementById('end-title').innerText = title;
    document.getElementById('end-prize').innerText = finalPrize;
}

function startTimer() {
    stopTimer();
    timeLeft = 20;
    const timerText = document.getElementById('timer-text');
    timerText.innerText = timeLeft;
    timerText.classList.remove('timer-low');

    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.innerText = timeLeft;

        if (timeLeft <= 5) {
            timerText.classList.add('timer-low');
        }

        if (timeLeft <= 0) {
            stopTimer();
            timeOut();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function timeOut() {
    isAnswerLocked = true;
    audioBackground.pause();
    speechTempo.play(); // Silvio Santos: "O seu tempo acabou!"
    
    setTimeout(() => {
        endGame(false); // Considera como erro se o tempo acabar
    }, 3000);
}
