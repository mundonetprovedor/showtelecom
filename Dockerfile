# Use a imagem oficial do Node.js
FROM node:18-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Força a porta 8080 para evitar problemas de permissão com a porta 80
ENV PORT=8080

# Expõe a porta
EXPOSE 8080

# Comando para iniciar o servidor (direto com node para melhor performance e logs)
CMD ["node", "server.js"]
