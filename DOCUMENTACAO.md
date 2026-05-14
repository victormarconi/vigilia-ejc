# Vigilia EJC

Sistema da Vigilia EJC publicado em vigiliaejcpst.pdm1.com.br.

## Origem

Este repositorio foi criado a partir de export filtrado da VPS.

## Nao versionado

- `.env` e segredos
- bancos, dumps e backups
- `node_modules`, builds e caches
- logs, temporarios e certificados
- anexos privados de atendimento quando existirem

## Backup de dados

Dados persistentes ficam no Google Drive criptografado pelo projeto `pdm-backup`.

## Arquivos versionados

- `vigilia/.gitignore`
- `vigilia/package-lock.json`
- `vigilia/package.json`
- `vigilia/public/admin.css`
- `vigilia/public/admin.html`
- `vigilia/public/admin.js`
- `vigilia/public/index.html`
- `vigilia/public/script.js`
- `vigilia/public/styles.css`
- `vigilia/README.md`
- `vigilia/schema.sql`
- `vigilia/scripts/init-db.js`
- `vigilia/scripts/make-admin-hash.js`
- `vigilia/src/config.js`
- `vigilia/src/db.js`
- `vigilia/src/server.js`
