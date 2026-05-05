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
const audioBackground1 = document.getElementById('audio-background-1');
const audioBackground2 = document.getElementById('audio-background-2');
let currentBackgroundMusic = audioBackground1;
const audioWaiting = document.getElementById('audio-waiting');
const speechCerta = document.getElementById('speech-certa');
const speechDisso = document.getElementById('speech-disso');
const speechErrada = document.getElementById('speech-errada');
const speechTempo = document.getElementById('speech-tempo');

let audioCtx = null; // Instanciado sob demanda para evitar bloqueios de autoplay

function setHostExpression(expression) {
    const avatar = document.getElementById('host-avatar');
    if (avatar) avatar.className = 'host-' + expression;
}

btnStart.addEventListener('click', startGame);

function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    try {
        audioStart.play();
    } catch (e) {}
    
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
    try {
        audioGong.play();
        
        // Alterna música a cada 3 perguntas
        if (audioBackground1) audioBackground1.pause();
        if (audioBackground2) audioBackground2.pause();
        
        if (Math.floor(currentQuestionIndex / 3) % 2 === 0) {
            currentBackgroundMusic = audioBackground1;
        } else {
            currentBackgroundMusic = audioBackground2;
        }
        
        if (currentBackgroundMusic) currentBackgroundMusic.play();
        
        if (audioWaiting) {
            audioWaiting.pause();
            audioWaiting.currentTime = 0;
        }
    } catch (e) {
        console.log("Autoplay prevented or audio error", e);
    }
    setHostExpression('thinking');
    startTimer();

    const q = questions[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.question;
    document.getElementById('current-question-num').innerText = currentQuestionIndex + 1;
    
    updatePrizes();

    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    
    // Criar uma cópia das opções com seus estados originais para embaralhar
    const optionsWithStates = q.options.map((text, index) => ({
        text,
        isCorrect: index === q.answer
    }));

    // Embaralhar as opções
    optionsWithStates.sort(() => Math.random() - 0.5);

    optionsWithStates.forEach((opt, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.dataset.index = index;
        div.innerHTML = `
            <span class="letter">${letters[index]}</span>
            <span class="text">${opt.text}</span>
            <button class="confirm-btn">Confirmar</button>
        `;
        
        // Atribuir o novo índice correto para a lógica de verificação
        if (opt.isCorrect) {
            currentCorrectAnswerIndex = index;
        }

        div.onclick = (e) => {
            if (e.target.className !== 'confirm-btn') {
                selectOption(div);
            }
        };
        
        const confirmBtn = div.querySelector('.confirm-btn');
        confirmBtn.onclick = (e) => {
            e.stopPropagation();
            confirmAnswer(index, div);
        };

        optionsContainer.appendChild(div);
    });
}

let currentCorrectAnswerIndex = 0; // Rastreia a resposta correta após o embaralhamento

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
    try {
        speechDisso.pause();
        speechDisso.currentTime = 0;
        speechDisso.play();
    } catch (e) {}
}

function confirmAnswer(index, element) {
    if (isAnswerLocked) return;
    isAnswerLocked = true;
    stopTimer();
    element.classList.remove('selected');

    // Pausa a música de fundo e inicia o suspense
    try {
        if (currentBackgroundMusic) currentBackgroundMusic.pause();
        if (audioWaiting) audioWaiting.play();
    } catch (e) {
        console.log("Audio suspense play prevented", e);
    }
    
    setHostExpression('nervous');

    const correctAnswer = currentCorrectAnswerIndex;
    
    // Simula o "Está certo disso?" com um delay de suspense
    setTimeout(() => {
        try {
            if (audioWaiting) {
                audioWaiting.pause();
                audioWaiting.currentTime = 0;
            }
        } catch (e) {}

        if (index === correctAnswer) {
            element.classList.add('correct');
            try {
                audioCorrect.play();
                speechCerta.play(); // Silvio Santos: "Certa resposta!"
            } catch (e) {}
            
            setHostExpression('happy');
            setTimeout(() => {
                currentQuestionIndex++;
                loadQuestion();
            }, 3000);
        } else {
            element.classList.add('wrong');
            try {
                speechErrada.play(); // Silvio Santos: "Resposta errada!"
                audioWrong.play();
            } catch (e) {}
            
            setHostExpression('sad');
            const correctElement = document.querySelector(`.option[data-index="${correctAnswer}"]`);
            if(correctElement) correctElement.classList.add('correct');
            
            setTimeout(() => {
                endGame(false);
            }, 3000);
        }
    }, 3000); // 3 segundos de suspense (reduzido de 4)
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
    
    const correctAnswer = currentCorrectAnswerIndex;
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
    if (audioBackground1) audioBackground1.pause();
    if (audioBackground2) audioBackground2.pause();
    if (audioWaiting) audioWaiting.pause();
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
    } else if (win === 'timeout') {
        title = "QUE PENA, Seu Tempo Acabou!";
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
    clearInterval(timerInterval);
    timeLeft = 20;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        // Efeito sonoro de "Tic" e tensão
        playTickSound();

        const timerText = document.getElementById('timer-text');
        if (timeLeft <= 5) {
            timerText.classList.add('timer-low');
        } else {
            timerText.classList.remove('timer-low');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeOut();
        }
    }, 1000);
}

// Função para gerar um som de "Tic" eletrônico (mais tensão conforme o tempo acaba)
async function playTickSound() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        
        // Aumenta a frequência (tom) conforme o tempo acaba para dar mais tensão
        const frequency = timeLeft <= 5 ? 800 : 400;
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
        console.error("Erro ao gerar som de tick", e);
    }
}

function updateTimerDisplay() {
    const timerText = document.getElementById('timer-text');
    if (timerText) timerText.innerText = timeLeft;
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function timeOut() {
    isAnswerLocked = true;
    try {
        if (currentBackgroundMusic) currentBackgroundMusic.pause();
        speechTempo.play(); // Silvio Santos: "O seu tempo acabou!"
    } catch (e) {
        console.error("Erro ao tocar áudio de tempo esgotado", e);
    }
    
    setTimeout(() => {
        endGame('timeout'); // Considera como timeout se o tempo acabar
    }, 4000); // Dá tempo do áudio do Silvio terminar
}
