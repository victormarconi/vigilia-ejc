# Vigilia EJC

Site em Node.js/Express para a equipe da Vigilia do EJC, com:

- Carrossel automatico das equipes e santos.
- Formulario de pedidos de oracao.
- Gravacao dos pedidos em MySQL.
- Login administrativo com sessao HTTP-only.
- Painel admin para listar e limpar pedidos.

## Configuracao

1. Instale as dependencias:

```bash
npm install
```

2. Crie um arquivo `.env` a partir do `.env.example` e preencha com as credenciais da hospedagem.

3. Gere o hash da senha do admin:

```bash
npm run make-admin-hash "sua-senha-admin"
```

Copie o hash gerado para `ADMIN_PASSWORD_HASH` no `.env`.

4. Inicialize a tabela no MySQL:

```bash
npm run init-db
```

5. Inicie a aplicacao:

```bash
npm start
```

## Rotas

- Site: `/vigilia`
- Enviar pedido: `POST /vigilia/api/prayer-requests`
- Login admin: `POST /vigilia/api/admin/login`
- Listar pedidos: `GET /vigilia/api/admin/prayer-requests`
- Limpar pedidos: `DELETE /vigilia/api/admin/prayer-requests`
- Healthcheck: `/vigilia/health`

## Deploy

Configure a aplicacao Node na hospedagem apontando para:

- Pasta do projeto: `vigilia`
- Arquivo inicial: `src/server.js`
- Comando de instalacao: `npm install`
- Comando de start: `npm start`

Use `BASE_PATH=/vigilia` se o site ficar dentro dessa subpasta.
