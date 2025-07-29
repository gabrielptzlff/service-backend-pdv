# service-backend-pdv

## Instalação Docker

1. Clone o projeto em sua máquina

   ```bash
   git clone git@github.com:gabrielptzlff/service-backend-pdv.git
   ```

2. Crie o .env para configurar as variáveis de ambiente

   ```bash
   cp ./.env.homolog ./.env
   ```

3. Instale os pacotes necessários

   ```bash
   npm i
   ```

4. Faça o build e start dos containers

   ```bash
   make build && make start
   ```

> A network `pdv-network` serve para que os containers possam comunicar-se, é necessário buildar este docker-compose antes de subir os outros projetos, pois são dependentes da network (exceto o microsserviço de cep)

### Ambiente de desenvolvimento

Para rodar o projeto em ambiente de desenvolvimento:

1. Crie o .env para configurar as variáveis de ambiente

   ```bash
   cp ./.env.homolog ./.env
   ```

2. Altere a variável DB_HOST no `.env` para localhost

3. Execute:

   ```bash
   sudo docker compose up postgres --build -d
   ```

   ```bash
   npm i && npm run dev
   ```

- Alguns comandos docker foram simplificados utilizando Make

---

## Documentação dos Endpoints

### Customers

| Método | Endpoint          | Descrição               | Body/Query Params         |
| ------ | ----------------- | ----------------------- | ------------------------- |
| GET    | `/customers`      | Lista todos os clientes | —                         |
| GET    | `/customers?id=1` | Busca cliente por ID    | Query: `id`               |
| POST   | `/customers`      | Cria um novo cliente    | JSON: dados do cliente    |
| PATCH  | `/customers?id=1` | Atualiza um cliente     | Query: `id`, JSON: campos |
| DELETE | `/customers?id=1` | Remove um cliente       | Query: `id`               |

### Products

| Método | Endpoint         | Descrição               | Body/Query Params         |
| ------ | ---------------- | ----------------------- | ------------------------- |
| GET    | `/products`      | Lista todos os produtos | —                         |
| GET    | `/products?id=1` | Busca produto por ID    | Query: `id`               |
| POST   | `/products`      | Cria um novo produto    | JSON: dados do produto    |
| PATCH  | `/products?id=1` | Atualiza um produto     | Query: `id`, JSON: campos |
| DELETE | `/products?id=1` | Remove um produto       | Query: `id`               |

### Payment Methods

| Método | Endpoint                | Descrição                           | Body/Query Params         |
| ------ | ----------------------- | ----------------------------------- | ------------------------- |
| GET    | `/payment-methods`      | Lista todos os métodos de pagamento | —                         |
| GET    | `/payment-methods?id=1` | Busca método de pagamento por ID    | Query: `id`               |
| POST   | `/payment-methods`      | Cria um novo método de pagamento    | JSON: dados do método     |
| PATCH  | `/payment-methods?id=1` | Atualiza um método de pagamento     | Query: `id`, JSON: campos |
| DELETE | `/payment-methods?id=1` | Remove um método de pagamento       | Query: `id`               |

### Sales

| Método | Endpoint      | Descrição             | Body/Query Params         |
| ------ | ------------- | --------------------- | ------------------------- |
| GET    | `/sales`      | Lista todas as vendas | —                         |
| GET    | `/sales?id=1` | Busca venda por ID    | Query: `id`               |
| POST   | `/sales`      | Cria uma nova venda   | JSON: dados da venda      |
| PATCH  | `/sales?id=1` | Atualiza uma venda    | Query: `id`, JSON: campos |
| DELETE | `/sales?id=1` | Remove uma venda      | Query: `id`               |

---

### Observações

- Todos os endpoints que recebem `id` usam query string, ex: `/customers?id=1`.
- Os métodos `POST` e `PATCH` esperam o corpo da requisição em JSON.
- Para detalhes dos campos aceitos em cada entidade, consulte os DTOs no código-fonte ou a collection postman.

---

### Postman

- Uma collection do Postman está disponível em [`postman/service-backend-pdv.postman_collection.json`](postman/service-backend-pdv.postman_collection.json).
- Para usar:
  1. Abra o Postman.
  2. Clique em "Import" e selecione o arquivo da collection.
  3. Ajuste as variáveis de ambiente conforme necessário.
