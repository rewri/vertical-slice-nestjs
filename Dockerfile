# Dockerfile multi-stage para otimização
FROM node:22 AS base

# Definir timezone
ENV TZ=America/Sao_Paulo

# Criar diretório da aplicação
WORKDIR /usr/src/app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Configurar apenas o essencial do npm
RUN npm config set fund false && \
    npm config set audit false

# Stage de desenvolvimento
FROM base AS development

# Instalar dependências básicas
RUN npm ci

# Criar usuário não-root para desenvolvimento DEPOIS da instalação
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nestjs

# Copiar código fonte com ownership correto
COPY --chown=nestjs:nodejs . .

# Mudar para usuário não-root
USER nestjs

# Expor porta
EXPOSE 3000

# Comando para desenvolvimento com hot reload
CMD ["npm", "run", "start:dev"]

# Stage de build para produção
FROM base AS build

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Instalar dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Stage de produção
FROM node:22 AS production

# Definir timezone
ENV TZ=America/Sao_Paulo

# Criar usuário não-root para segurança
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nestjs

# Criar diretório da aplicação
WORKDIR /usr/src/app

# Copiar dependências de produção do stage de build
COPY --from=build --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /usr/src/app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /usr/src/app/package*.json ./

# Mudar para usuário não-root
USER nestjs

# Expor porta
EXPOSE 3000

# Variáveis de ambiente para produção
ENV NODE_ENV=production
ENV PORT=3000

# Healthcheck usando node para evitar dependências externas
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "const http = require('http'); const options = {hostname: 'localhost', port: process.env.PORT || 3000, path: '/health', timeout: 5000}; const req = http.request(options, (res) => process.exit(res.statusCode === 200 ? 0 : 1)); req.on('error', () => process.exit(1)); req.end();"

# Comando para produção
CMD ["node", "dist/main.js"]