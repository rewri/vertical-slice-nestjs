# Docker Setup - Vertical Slice NestJS

## 🚀 Início Rápido com Makefile

### Pré-requisitos

- Docker >= 20.10
- Docker Compose >= 2.0
- Make (geralmente já instalado no Linux/macOS)

### Setup em um comando

```bash
# Setup completo para desenvolvimento
make dev
```

### Comandos principais

```bash
# Ver todos os comandos disponíveis
make help

# Subir containers
make up

# Parar containers
make down

# Ver logs
make logs

# Status dos containers
make status
```

## 🏗️ Serviços Disponíveis

### Aplicação NestJS

- **URL**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Container**: `vertical-slice-nestjs-app`
- **Hot reload**: Habilitado em desenvolvimento

### Banco MariaDB

- **Host**: localhost
- **Porta**: 3307
- **Usuário**: nestjs_user
- **Senha**: nestjs_password
- **Database**: nestjs_db
- **Container**: `vertical-slice-nestjs-mariadb`

## 📋 Comandos Make Disponíveis

### Gerenciamento básico

```bash
make up           # Subir containers (desenvolvimento)
make up-prod      # Subir containers (produção)
make down         # Parar containers
make restart      # Reiniciar todos os containers
make status       # Ver status dos containers
make health       # Verificar saúde dos containers
```

### Build e desenvolvimento

```bash
make build        # Build da aplicação
make rebuild      # Rebuild completo (sem cache)
make install      # Instalar dependências npm
make dev          # Setup completo para desenvolvimento
```

### Logs e monitoramento

```bash
make logs         # Ver logs de todos os serviços
make logs-app     # Ver logs apenas da aplicação
make logs-db      # Ver logs apenas do banco
```

### Acesso aos containers

```bash
make shell        # Acessar shell da aplicação
make shell-db     # Acessar shell do MariaDB
make db           # Acessar MariaDB CLI diretamente
```

### Testes

```bash
make test         # Executar testes
make test-watch   # Executar testes em modo watch
make test-e2e     # Executar testes E2E
make lint         # Executar linter
make format       # Formatar código
```

### Limpeza e manutenção

```bash
make clean        # Parar e remover volumes (⚠️ apaga dados)
make clean-images # Remover imagens não utilizadas
make clean-all    # Limpeza completa do sistema
```

### Backup e restore

```bash
make backup-db    # Fazer backup do banco
make restore-db FILE=backup.sql  # Restaurar banco
```

## 🔧 Configurações

### Variáveis de Ambiente

```bash
# Criar arquivo .env automaticamente
make env
```

As principais configurações no `.env`:

```env
NODE_ENV=development
PORT=3000
MARIADB_HOST=localhost
MARIADB_PORT=3307
MARIADB_USER=nestjs_user
MARIADB_PASSWORD=nestjs_password
MARIADB_DATABASE=nestjs_db
```

### Volumes e Persistência

- **mariadb_data**: Dados do MariaDB persistem entre reinicializações
- **Código fonte**: Montado para hot reload em desenvolvimento

## 🏠 Estrutura de Arquivos

```
├── Makefile                   # Comandos para gerenciar Docker
├── docker-compose.yml         # Configuração principal
├── docker-compose.prod.yml    # Sobrescrita para produção
├── Dockerfile                 # Build multi-stage da aplicação
├── .dockerignore             # Arquivos ignorados no build
├── .env.example              # Template de variáveis de ambiente
└── docker/
    └── mariadb/
        ├── init/             # Scripts de inicialização do DB
        │   └── 01-init.sql
        └── conf/             # Configurações do MariaDB
            └── mariadb.cnf
```

## 🚀 Workflows Comuns

### Primeiro uso

```bash
# 1. Setup inicial
make dev

# 2. Verificar se está funcionando
make health
curl http://localhost:3000/health
```

### Desenvolvimento diário

```bash
# Subir ambiente
make up

# Ver logs em tempo real
make logs

# Executar testes
make test

# Parar ao final do dia
make down
```

### Deploy de produção

```bash
# Build e subir em produção
make prod

# Monitorar
make health
make logs
```

### Problemas e debug

```bash
# Ver status detalhado
make status
make health

# Acessar container para debug
make shell

# Ver logs específicos
make logs-app
make logs-db

# Restart completo
make restart
```

## 🔒 Segurança

### Desenvolvimento vs Produção

- **Dev**: Hot reload, volumes montados, logs verbosos
- **Prod**: Build otimizado, usuário não-root, configurações seguras

### Boas práticas implementadas

- Containers executam com usuário não-root
- Healthchecks para todos os serviços
- Secrets via variáveis de ambiente
- Rede isolada entre containers
- Volumes persistentes para dados importantes

## 🆘 Troubleshooting

### Container não inicia

```bash
make logs-app  # Ver erros da aplicação
make logs-db   # Ver erros do banco
```

### Problemas de conexão

```bash
# Verificar rede
make status
docker network ls

# Testar conectividade
make shell
ping mariadb
```

### Reset completo

```bash
# Limpar tudo e recomeçar
make clean-all
make dev
```

### Backup antes de mudanças importantes

```bash
# Sempre faça backup antes de mudanças
make backup-db
```

## 📊 Monitoramento

### Comandos úteis para produção

```bash
# Monitoramento contínuo
watch -n 5 'make status'

# Logs em tempo real
make logs

# Uso de recursos
docker stats
```

### Health checks automáticos

- **App**: Endpoint `/health` verificado a cada 30s
- **MariaDB**: Verificação interna de conectividade a cada 10s
