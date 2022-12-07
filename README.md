# test-ngcash-backend

## Sobre

Projeto teste para vaga de desenvolvedor back-end NodeJS júnior na NG.CASH. Esse projeto é uma API para criar contas de banco e realizar transferências entre os usuários.

Esse projeto usa o NodeJS na versão 16. O código é feito em Typescript e compilado para Javascript.

## Tabela de conteúdos

<!--ts-->

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Endpoints](#endpoints)
- [Pré-requisitos e como rodar a aplicação](#pre-requisitos)
- [Autor](#autor)

<!--te-->

## Funcionalidades

- [x] Cadastro de usuários
- [x] Autenticação de usuários
- [x] Transferência de saldo entre usuários
- [x] Visualização do balanço de sua conta
- [x] Listagem das transações que contém a conta do usuário

## Endpoints

---

Token de acesso é do tipo Bearer JWT

### /

#### GET: Apresenta um Safe!

<br>

### /login

#### POST: Autenticar usuário.

Rota utilizada para realizar o login na aplicação e receber o token de acesso.

Body json

- username: Nome do usuário cadastrado.
- password: Senha do usuário cadastrado.

Resposta

- Um token jwt

### /users

#### POST: Cadastrar usuário.

Rota utilizada para cadastrar um usuário. Uma conta com saldo de R$ 100,00 será criada e associada com esse usuário.

Body json

- username: O nome de usuário que será utilizado na aplicação. Deve ter no mínimo 3 caracteres.
- password: A senha que o usuário utilizará na aplicação. Deve ser composta por pelo menos 8 caracteres, um número e uma letra maiúscula.

Resposta

- Uma mensagem de confirmação do sucesso.

### /accounts/balance

#### GET: Visualizar o próprio saldo da conta.

Rota utilizada para que o usuário verifique o saldo da sua conta. Requer token de acesso.

Resposta

- O saldo da conta.

### /accounts/transfer

#### POST: Transferir quantia para outro usuário.

Rota utilizada para que o usuário transfira uma quantia de dinheiro para a conta de outro usuário. Requer token de acesso.

Body json

- cashInUsername: Nome de usuário do usuário que receberá a transferência.
- value: O valor que será transferido.

Resposta

- Mensagem de sucesso.

### /transactions

#### GET: Listar as transações em que o usuário participou.

Rota utilizada para que o usuário liste as transações em que ele participou, recebendo ou transferindo dinheiro. Requer token de acesso.

Resposta

- Lista das transferências.

<br>

| Queries Params disponíveis |                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------- |
| cashOutTransactions        | Valor: true. Lista apenas as transferências em que o usuário transferiu dinheiro. |
| cashInTransactions         | Valor: true. Lista apenas as transferências em que o usuário recebeu dinheiro.    |
| transactionDate            | Valor: data iso string. Lista apenas as transferências realizadas nesta data.     |

|

<h2 id="pre-requisitos">Pré-requisitos e como executar a aplicação</h2>

Você vai precisar ter instalado no seu computador:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/) (v16)
- [Visual Studio Code](https://code.visualstudio.com/) (opcional)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker-compose](https://docs.docker.com/compose/install/)

### Baixando o projeto

Para baixar esse projeto:

```
# Abra o seu terminal

# Clone esse repositório para a sua máquina

$ git clone https://github.com/HalexV/test-ngcash-backend.git

```

### Instalando as dependências para modificar o projeto

```
# Entre na pasta do projeto

$ cd pasta_do_projeto

# Rode o seguinte comando para instalar as dependências do projeto

$ npm install ci

```

### Executando o projeto em modo de desenvolvimento

- Pré-requisito:
  - Preencha as variáveis de ambiente do arquivo .docker-env na pasta docker-envs/start-dev a seu critério.

```
# O projeto em modo de desenvolvimento é executado de dentro de um container do Docker. O modo de desenvolvimento possui live-reload, ou seja, o servidor é reiniciado toda vez que as alterações no código são salvas.

# Na raiz do projeto (local onde fica o package.json), execute:

$ npm run docker:start:dev:up

# Acesse http://localhost:3000/ para verificar a mensagem Safe!

# Para encerrar a execução em modo de desenvolvimento, execute:

$ npm run docker:start:dev:down
```

### Executando o projeto em modo de produção

- Pré-requisito:
  - Crie o arquivo .env de variáveis de ambiente na pasta docker-envs/start-prod.
  - Preencha as variáveis de ambiente, que são as mesmas dos outros modos de execução, a seu critério.

```
# O projeto em modo de produção é executado de dentro de um container do Docker. O código é compilado para Javascript.

# Na raiz do projeto (local onde fica o package.json), execute:

$ npm run docker:start:prod:up

# Acesse http://localhost:PORT/ para verificar a mensagem Safe!

# Para encerrar a execução em modo de produção, execute:

$ npm run docker:start:prod:down
```

### Executando o projeto em modo de teste unitário

- Pré-requisito:
  - Preencha as variáveis de ambiente do arquivo .docker-env na pasta docker-envs/watch-unit-tests a seu critério.

```
# O projeto em modo de teste unitário é executado de dentro de um container do Docker. O modo de teste unitário possui live-reload, ou seja, o servidor é reiniciado toda vez que as alterações no código da aplicação ou dos testes são salvas.

# Na raiz do projeto (local onde fica o package.json), execute:

$ npm run docker:test:unit:up

# Acesse os logs do container para verificar a execução dos testes

$ docker logs -f watch-unit-tests

# Para encerrar a execução em modo de teste unitário, execute:

$ npm run docker:test:unit:down
```

### Executando o projeto em modo de teste de integração

- Pré-requisito:
  - Preencha as variáveis de ambiente do arquivo .docker-env na pasta docker-envs/watch-integration-tests a seu critério.

```
# O projeto em modo de teste de integração é executado de dentro de um container do Docker. O modo de teste de integração possui live-reload, ou seja, o servidor é reiniciado toda vez que as alterações no código da aplicação ou dos testes são salvas. Uma instância do Postgres é iniciada junto para os testes.

# Na raiz do projeto (local onde fica o package.json), execute:

$ npm run docker:test:integration:up

# Acesse os logs do container para verificar a execução dos testes

$ docker logs -f watch-integration-tests

# Para encerrar a execução em modo de teste de integração, execute:

$ npm run docker:test:integration:down
```

### Executando o projeto em modo de teste End-to-End (E2E)

- Pré-requisito:
  - Preencha as variáveis de ambiente do arquivo .docker-env na pasta docker-envs/watch-e2e-tests a seu critério.

```
# O projeto em modo de teste e2e é executado de dentro de um container do Docker. O modo de teste e2e possui live-reload, ou seja, o servidor é reiniciado toda vez que as alterações no código da aplicação ou dos testes são salvas. Uma instância do Postgres é iniciada junto para os testes.

# Na raiz do projeto (local onde fica o package.json), execute:

$ npm run docker:test:e2e:up

# Acesse os logs do container para verificar a execução dos testes

$ docker logs -f watch-e2e-tests

# Para encerrar a execução em modo de teste e2e, execute:

$ npm run docker:test:e2e:down
```

### Executando todos os testes juntos e coletando o coverage

- Pré-requisito:
  - Preencha as variáveis de ambiente do arquivo .docker-env na pasta docker-envs/coverage a seu critério.

```
# O projeto nesse modo de testes é executado de dentro de um container do Docker. Todos os testes criados são executados e o coverage é coletado e refletido para a pasta coverage do projeto. Uma instância do Postgres é iniciada junto para os testes.

# Na raiz do projeto (local onde fica o package.json), execute:

$ npm run docker:coverage:up

# O container é executado e o terminal é ligado aos logs do container automaticamente.

# Quando o coverage é coletado, o container é parado automaticamente. Para destruir o container, execute:

$ npm run docker:coverage:down
```

# Autor

<div>
  <img src="https://avatars.githubusercontent.com/u/14897195?s=96&v=4" alt="Hálex Viotto Gomes" title="Hálex Viotto Gomes" />
  <p>Hálex Viotto Gomes</p>
</div>

<div>
  <a href="https://github.com/HalexV">
    <img src="https://img.shields.io/static/v1?label=GitHub&message=HalexV&color=181717&style=for-the-badge&logo=GitHub"/>
  </a>

  <a href="https://www.linkedin.com/in/halexviottogomes/">
    <img src="https://img.shields.io/static/v1?label=LinkedIn&message=Hálex Viotto Gomes&color=0A66C2&style=for-the-badge&logo=LinkedIn"/>
  </a>
</div>
