 - O objetivo do projeto é o desenvolvimento de uma API em NodeJs para gerenciamento financeiro de entradas e saídas monetárias de usuários.

## Instalação da API

### Via docker:
 - Necessário ter instalado o docker.
 - No diretório raiz do projeto, execute:
 > npm run up - iniciar o servidor na porta 3333 em modo debug na porta 9222

### Convencional:
 - Necessário ter instalado a versão 13 do NodeJs.
 - No diretório raiz do projeto, execute:
 > npm build - para compilar o projeto para Javascript
 > npm start - iniciar o servidor na porta 3333 - ou:
 > npm run debug - para iniciar o servidor na porta 3333 em modo debug na porta 9222


-------------------------------------------------------------------------------------

### Testes: 
> npm test - para executar todos os testes
> npm run test:unit - para executar somente os testes unitarios
> npm run test:integration - para executar somente os testes de integracao
> npm run test:ci - para executar todos os testes e mostrar a cobertura dos mesmos

-------------------------------------------------------------------------------------

### API:
- A API executa no endereço http://localhost:3333

## Rotas 
> POST /login - autenticação de usuários
> POST /users - cadastro de usuários
> POST /categories - cadastro de categorias de gastos financeiros




