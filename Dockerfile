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

# Expõe a porta que o servidor usa
EXPOSE 8080

# Comando para iniciar o servidor
CMD ["npm", "start"]
