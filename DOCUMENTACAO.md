# Vigilia EJC - Documentacao Operacional

## Papel do projeto

Vigilia EJC faz parte da VPS PDM. Este repositorio guarda codigo fonte e documentacao, mas nao guarda dados sensiveis nem dados de cliente.

## Dominio

`vigiliaejcpst.pdm1.com.br`

## Caminho na VPS

`/var/www/vigilia`

## Stack

Node.js/Next restaurado, PM2, Nginx, MariaDB

## Processo de execucao

PM2: vigilia-ejc, porta local 3205.

## Dados que nao estao no GitHub

Banco MariaDB vigilia_ejc e .env ficam no backup criptografado.

Esses dados ficam no Google Drive criptografado, via projeto `pdm-backup`.

## O que nao deve ser versionado

- `.env` e variaveis sensiveis
- dumps de banco
- backups `.tar.gz` / `.enc`
- `node_modules`, builds e caches
- logs e temporarios
- certificados/chaves
- uploads privados de clientes, quando existirem

## Observacoes

Repositorio publico, mas sem banco e segredos.

## Checklist de manutencao

- Conferir processo PM2/Docker depois de deploy.
- Conferir Nginx e SSL.
- Conferir se o backup diario rodou.
- Nunca commitar segredos.
- Antes de restaurar em outra VPS, restaurar primeiro banco/.env/uploads pelo backup criptografado.
