const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(__dirname));

// Endpoint para ler as perguntas
app.get('/api/questions', (req, res) => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'questions.js'), 'utf8');
        // Extrai a variável 'questions' e 'gameConfig' do arquivo JS
        // Como o arquivo é um script JS, vamos enviá-lo como JSON
        // Para simplificar, vamos assumir que o arquivo mantém a estrutura constante
        res.sendFile(path.join(__dirname, 'questions.js'));
    } catch (err) {
        res.status(500).send('Erro ao ler perguntas');
    }
});

// Endpoint para salvar a pontuação do jogador
app.post('/api/save-score', (req, res) => {
    const scoreData = req.body;
    const scoresFile = path.join(__dirname, 'scores.json');
    
    let scores = [];
    if (fs.existsSync(scoresFile)) {
        try {
            scores = JSON.parse(fs.readFileSync(scoresFile, 'utf8'));
        } catch (e) { scores = []; }
    }
    
    scores.push(scoreData);
    
    try {
        fs.writeFileSync(scoresFile, JSON.stringify(scores, null, 4));
        res.send('Pontuação salva!');
    } catch (err) {
        res.status(500).send('Erro ao salvar pontuação');
    }
});

// Endpoint para ler as pontuações (Dashboard)
app.get('/api/scores', (req, res) => {
    const scoresFile = path.join(__dirname, 'scores.json');
    if (fs.existsSync(scoresFile)) {
        res.sendFile(scoresFile);
    } else {
        res.json([]);
    }
});

// Endpoint para salvar as perguntas
app.post('/api/save-questions', (req, res) => {
    const { questions, gameConfig } = req.body;
    
    const fileContent = `// Arquivo de perguntas autogerado pelo Admin

const gameConfig = ${JSON.stringify(gameConfig, null, 4)};

const questions = ${JSON.stringify(questions, null, 4)};`;

    try {
        fs.writeFileSync(path.join(__dirname, 'questions.js'), fileContent);
        res.send('Perguntas salvas com sucesso!');
    } catch (err) {
        res.status(500).send('Erro ao salvar perguntas');
    }
});

const { exec } = require('child_process');

// Endpoint para sincronizar mudanças com o Git
app.post('/api/git-sync', (req, res) => {
    console.log("Iniciando sincronização com Git...");
    
    const GITHUB_TOKEN = process.env.GIT_TOKEN;
    if (!GITHUB_TOKEN) {
        return res.status(500).send('Erro: Variável GIT_TOKEN não configurada no servidor.');
    }

    const REPO_URL = `https://${GITHUB_TOKEN}@github.com/mundonetprovedor/showtelecom.git`;

    // Configura a URL com token e faz o push
    const command = `git remote set-url origin ${REPO_URL} && git add questions.js scores.json && git commit -m "Admin: atualização de perguntas e scores [skip ci]" && git push origin main`;
    
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error("Erro no Git:", stderr);
            return res.status(500).send('Erro ao sincronizar com Git: ' + stderr);
        }
        console.log("Git Sync Sucesso:", stdout);
        res.send('Sincronizado com o GitHub com sucesso!');
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Show do Telecom rodando na porta: ${port}`);
});
