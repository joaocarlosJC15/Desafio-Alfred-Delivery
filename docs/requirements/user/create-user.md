# Cadastro de usuários

Route: /users
Type: POST
BodyType: JSON
ResponseType: JSON
Fields: {
  name,
  email,
  birthDate,
  password,
  passwordConfirmation
}

## Process
  - Valida se os campos obrigatórios **name**, **email**, **birthDate**, **password** e **passwordConfirmation** estão presentes.
  - Valida se os campos **password** e **passwordConfirmation** são iguais.
  - Valida se o campo **birthDate** é uma data válida.
  - Valida se o campo **email** é um e-mail válido
  - Valida se o email fornecido pelo campo **email** já está em uso por outro usuário.
  - Gera um hash para o **password** fornecido.
  - Cria um usuário com os dados informados, com o valor do campo **password** sendo substituído pela hash gerada.
  - Gera um **token** de acesso a partir do ID do usuário criado.
  - Armazena o ID e o token do usuário em uma base Redis. 
  - Retorna status **200** com o token de acesso do usuário.

## Exceptions
  - Retorna status **400** se os campos **name**, **email**, **birthDate**, **password** ou **passwordConfirmation** não forem fornecidos.
  - Retorna status **400** se os campos **password** e **passwordConfirmation** não forem iguais.
  - Retorna status **400** se o campo **email** for um e-mail inválido.
  - Retorna status **409** se o **email** fornecido já estiver em uso.
  - Retorna status **500** se ocorrer algum erro interno ao criar a conta do usuário.
  - Retorna erro **500** se ocorrer algum erro interno ao gerar o hash do **password**.
  - Retorna erro **500** se ocorrer algum erro interno ao gerar o token de acesso.
  - Retorna erro **500** se ocorrer algum erro interno ao salvar o ID e o token do usuário em uma base Rédis.