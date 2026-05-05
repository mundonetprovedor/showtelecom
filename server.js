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

app.listen(port, '0.0.0.0', () => {
    console.log(`Show do Telecom rodando na porta: ${port}`);
});
