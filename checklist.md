Regras de negócio

- Qualquer pessoa deverá poder fazer parte da NG. Para isso, basta realizar o cadastro informando _username_ e _password_.

- Deve-se garantir que cada _username_ seja único e composto por, pelo menos, 3 caracteres.

- Deve-se garantir que a _password_ seja composta por pelo menos 8 caracteres, um número e uma letra maiúscula. Lembre-se que ela deverá ser _hashada_ ao ser armazenada no banco.

- Durante o processo de cadastro de um novo usuário, sua respectiva conta deverá ser criada automaticamente na tabela **Accounts** com um _balance_ de R$ 100,00. É importante ressaltar que caso ocorra algum problema e o usuário não seja criado, a tabela **Accounts** não deverá ser afetada.

- Todo usuário deverá conseguir logar na aplicação informando _username_ e _password._ Caso o login seja bem-sucedido, um token JWT (com 24h de validade) deverá ser fornecido.

- Todo usuário logado (ou seja, que apresente um token válido) deverá ser capaz de visualizar seu próprio _balance_ atual. Um usuário A não pode visualizar o _balance_ de um usuário B, por exemplo.

- Todo usuário logado (ou seja, que apresente um token válido) deverá ser capaz de realizar um _cash-out_ informando o _username_ do usuário que sofrerá o _cash-in_), caso apresente _balance_ suficiente para isso. Atente-se ao fato de que um usuário não deverá ter a possibilidade de realizar uma transferência para si mesmo.

- Toda nova transação bem-sucedida deverá ser registrada na tabela **Transactions**. Em casos de falhas transacionais, a tabela **Transactions** não deverá ser afetada.

- Todo usuário logado (ou seja, que apresente um token válido) deverá ser capaz de visualizar as transações financeiras (_cash-out_ e _cash-in_) que participou. Caso o usuário não tenha participado de uma determinada transação, ele nunca poderá ter acesso à ela.

- Todo usuário logado (ou seja, que apresente um token válido) deverá ser capaz de filtrar as transações financeiras que participou por:
  - Data de realização da transação e/ou
    - Transações de _cash-out;_
    - Transações de _cash-in._

Unit Tests

[X] Qualquer pessoa deverá poder fazer parte da NG. Para isso, basta realizar o cadastro informando _username_ e _password_.

[x] Deve-se garantir que cada _username_ seja único e composto por, pelo menos, 3 caracteres.

[x] Deve-se garantir que a _password_ seja composta por pelo menos 8 caracteres, um número e uma letra maiúscula. Lembre-se que ela deverá ser _hashada_ ao ser armazenada no banco.

[X] Durante o processo de cadastro de um novo usuário, sua respectiva conta deverá ser criada automaticamente na tabela **Accounts** com um _balance_ de R$ 100,00. É importante ressaltar que caso ocorra algum problema e o usuário não seja criado, a tabela **Accounts** não deverá ser afetada.

[x] Todo usuário deverá conseguir logar na aplicação informando _username_ e _password._ Caso o login seja bem-sucedido, um token JWT (com 24h de validade) deverá ser fornecido.
[x] Validar se o usuário existe
[x] Validar se a senha está correta

[x] Usuário deverá ser capaz de visualizar seu próprio _balance_ atual.

[x] Usuário deverá ser capaz de realizar um _cash-out_ informando o _username_ do usuário que sofrerá o _cash-in_),
[x] caso apresente _balance_ suficiente para isso.
[x] Atente-se ao fato de que um usuário não deverá ter a possibilidade de realizar uma transferência para si mesmo.
[x] Toda nova transação bem-sucedida deverá ser registrada na tabela **Transactions**. Em casos de falhas transacionais, a tabela **Transactions** não deverá ser afetada.

[x] Usuário deverá ser capaz de visualizar as transações financeiras (_cash-out_ e _cash-in_) que participou. Caso o usuário não tenha participado de uma determinada transação, ele nunca poderá ter acesso à ela.
[x] Usuário deverá ser capaz de filtrar as transações financeiras que participou por:
[x] Data de realização da transação e/ou
[x] Transações de _cash-out;_
[x] Transações de _cash-in._

Integration Tests

[x] Qualquer pessoa deverá poder fazer parte da NG. Para isso, basta realizar o cadastro informando _username_ e _password_.
[x] Deve-se garantir que a _password_ seja _hashada_ ao ser armazenada no banco.
[x] Durante o processo de cadastro de um novo usuário, sua respectiva conta deverá ser criada automaticamente na tabela **Accounts** com um _balance_ de R$ 100,00.

[x] Todo usuário deverá conseguir logar na aplicação informando _username_ e _password._ Caso o login seja bem-sucedido, um token JWT (com 24h de validade) deverá ser fornecido.
[x] Validar se o usuário existe
[x] Validar se a senha está correta

[x] Usuário deverá ser capaz de visualizar seu próprio _balance_ atual.

[x] Usuário deverá ser capaz de realizar um _cash-out_ informando o _username_ do usuário que sofrerá o _cash-in_),
[x] Toda nova transação bem-sucedida deverá ser registrada na tabela **Transactions**.

[x] Usuário deverá ser capaz de visualizar as transações financeiras (_cash-out_ e _cash-in_) que participou.
[x] Usuário deverá ser capaz de filtrar as transações financeiras que participou por:
[x] Data de realização da transação e/ou
[x] Transações de _cash-out;_
[x] Transações de _cash-in._

E2E Tests

Middlewares

Ensure Authenticated

[x] Deve retornar 401 quando não for informado o Bearer token no authorization do header
[x] Deve retornar 401 quando o token for inválido
[x] Deve retornar 401 quando o usuário não existir
[x] Deve prosseguir com a chamada da rota no sucesso

Rotas

POST /users

[x] Qualquer pessoa deverá poder fazer parte da NG. Para isso, basta realizar o cadastro informando _username_ e _password_. Deve retornar 201.
[x] Deve retornar 400 quando o username for menor que 3
[x] Deve retornar 400 quando a senha for menor que 8
[x] Deve retornar 400 quando a senha não contém pelo menos um número
[x] Deve retornar 400 quando a senha não contém pelo menos uma letra maiúscula
[x] Deve retornar 400 quando o username já existe

POST /login

[x] Todo usuário deverá conseguir logar na aplicação informando _username_ e _password._ Caso o login seja bem-sucedido, um token JWT (com 24h de validade) deverá ser fornecido. Deve retornar o status 200
[x] Deve retornar 400 se o username não existir
[x] Deve retornar 400 se a senha estiver incorreta

GET /accounts/balance

[x] Usuário deverá ser capaz de visualizar seu próprio _balance_ atual. Deve retornar 200 e o balanço da conta.

POST /accounts/transfer

[x] Usuário deverá ser capaz de realizar um _cash-out_ informando o _username_ do usuário que sofrerá o _cash-in_. Deve retornar 200.
[x] Deve retornar 400 ao tentar transferir dinheiro para si mesmo
[x] Deve retornar 400 se o balanço for insuficiente
[x] Deve retornar 404 se o cash in username não existe

GET /transactions

[x] Usuário deverá ser capaz de visualizar as transações financeiras (_cash-out_ e _cash-in_) que participou. Deve retornar 200.
[x] Usuário deverá ser capaz de filtrar as transações financeiras que participou por:
[x] Data de realização da transação e/ou
[x] Transações de _cash-out;_
[x] Transações de _cash-in._
[x] Em todas as operações acima deve ser retornado o status 200.
