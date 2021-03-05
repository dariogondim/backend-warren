# Backend Warren.


## 🚀 Aplicação
  Um backend de controle de contas bancárias com funções básicas como:
    
    Extrato / histórico da conta (entradas e saídas)
    Realizar um depósito
    Realizar um resgate
    Fazer um pagamento
    Monetizar o saldo mínimo da conta de um dia para o outro
    
  O projeto usa <b> nodejs, postgresql, jest, typeorm, express, tsyringe e jwt</b> como tecnologias, biliotecas e frameworks principais 
  

### 📋 Pré-requisitos

 Projeto testado utilizando <b> nodejs 14.16.0 </b> e <b> typescript 4.0.3 </b>, mas deve funcionar em qualquer versão do node a partir da 10
 O projeto também utiliza uma <b> imagem docker do postgresql</b>, veja abaixo como instalar os pré-requisitos`

### 🔧 Instalação

clonar este repositório, comando: <b> git clone https://github.com/dariogondim/backend-warren </b>
Se você não tem o git, faça o download em: https://git-scm.com/downloads

Se você não tiver <b>yarn</b> instalado, baixe em: https://classic.yarnpkg.com/en/docs/install/#debian-stable
Execute <b> yarn --version </b> para se certificar que tudo correu bem, ele deve retornar algo como <b>1.22.5</b>

Se você não tiver o node instalado, você pode baixar daqui: https://github.com/nvm-sh/nvm
Após instalar, execute <b> nvm i 14 </b>, para instalar a versão 14 do node
Após, execute <b> nvm use 14 </b>
Ele deve retornar algo como <b>Now using node v14.16.0 (npm v6.14.11)</b>

Depois disso, vá até a raiz do projeto, aonde você clonou do git

```
cd backend-warren
yarn
```
Em seguida, você precisa instalar o postgresql, a maneira mais rápida de fazer isso,
é com docker.
Faça o download do docker em:https://www.docker.com/products/docker-desktop
Após a instalação, certifique-se de que ele foi instalado corretamente, digite: <b>docker --version</b>
Ele deve retornar algo parecido com: <i>Docker version 19.03.13, build 4484c46d9d</i>
Se tudo ocorreu bem, execute: <b> docker run --name warren -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres </b>
O comando retorna um resultado parecido com <b> 4207bb17f1d2fcd442500b3ae2afca2bbddbdd6d6022161c02c49b81c31131fd </b>
Copie o retorno, que deve ser diferente desse, e
Execute <b>  docker start 4207bb17f1d2fcd442500b3ae2afca2bbddbdd6d6022161c02c49b81c31131fd  </b>, para iniciar o container,<b>não se esqueça de que isso é 
um exemplo, o codigo após o start,  deve ser o gerado pela sua máquina</b>
Qualquer coisa, se perdeu esse codigo, digite <b> docker ps -a</b>, ele deve retornar uma linha, copie da linha de comando o código do container na primeira coluna na linha retornada e então execute o docker start com o código retornado

Se tudo correu bem, vá até a raiz do seu projeto e execute: <b> yarn typeorm migration:run </b>, isso vai criar o database e os dados de teste
As instruções de conexão com o banco de dados também estão descritas no arquivo <b> ormconfig.json </b> do projeto, se você já souber como
fazer esse processo.

Você então, pode iniciar o projeto com o comando: 

```
yarn dev:server
```
Ele torna a execução inicial do projeto bem mais rápida, ótima para os testes em desenvolvimento

## ⚙️ Executando os testes

  Execute o comando abaixo na raiz do projeto, para se certificar de que as funcionalidades estão funcionando como deveria. 
  
```
yarn test
```
  
  
  Ao final, você receberá um resumo do coverage indicando se todos os testes executaram com sucesso e qual a porcentagem 
  de cobertura de código dos testes da aplicação
  

``` 
  =============================== Coverage summary ===============================
Statements   : 93.76% ( 962/1026 )
Branches     : 86.57% ( 116/134 )
Functions    : 96% ( 24/25 )
Lines        : 93.76% ( 962/1026 )
================================================================================

Test Suites: 14 passed, 14 total
Tests:       67 passed, 67 total
Snapshots:   0 total
Time:        34.703 s

```


Na pasta tmp do projeto, há um arquivo chamado Insomnia_2021-03-01-warren-backend. 
  Faça o download do programa: <b>https://insomnia.rest/download/</b> e importe esse arquivo. 

## 📦 Desenvolvimento
Há exemplos de como testar todos os endpoints
  da aplicação com os dados já previamente inseridos nas migrations do typeorm, mas você pode testar inserindo mais dados.
  Os endpoints criados permitem fazer as seguintes ações:
 
    1. Criação de usuários
    2. Criação de sessões
    3. Criação de depósitos
    4. Criação de saques
    5. Criação de pagamentos internos/transfência (entre as contas do banco da aplicação,
    que no caso dos exemplos, é banco do Brasil, mas poderia ser qualquer outro banco)
    6. Criação de pagamentos externos (para outros bancos). Nesse caso, apenas as informações necessárias, 
    como banco, agencia, conta e cpf,são guardadas,sem chaves estrangeiras nos relacionamentos, pois subentende-se, que sejam de outros bancos

Se você não quiser usar os dados de exemplo, Você pode criar um usuário mas precisa usar um dos clientes de exemplo ou criar diretamente no banco,
pois não há endpoints para isso. Após,chame o método Create de sessions, para gerar um token jwt e salve-o no environmente Dev,substituindo o token que
já existia lá. Só clicar no canto superior esquerdo e selecionar Manage Environment. Esse token indica que o usuário está num ambiente autenticado 
usando um token Bearer jwt.


### Arquitetura do projeto
  #### Módulos e relacionamentos
      O projeto foi dividido logicamente em módulos, que representam o domínio da aplicação: 
      a. bank
        Guarda as informações bancárias da aplicação, como o código(cod) e o nome do banco(name),segundo a 
        Compe (Código do Sistema de Operações Monetárias e Compensações de Outros Papéis.).
      b. agency, 
        As agências bancárias, com o respectivo banco (bank) e o endereço da agência
      c. bankAccount
        As contas bancárias, com suas agências,tipo da conta (currency  = corrente e saving = poupança) e profitability, uma referência
        a uma tabela que indica a porcentagem de remuneração da conta, se tiver, pois é opcional
      d. client
        Os dados dos clientes, como nome completo (fullname) e cpf. # Essas imformações sensíveis ainda não estão sendo criptografadas pela aplicação
      e. profitability
        Os tipos de rentabilização type_profitability (daily ou monthly), a taxa mensal ou diária em si e a descrição. São associadas as transações 
        e as contas bancárias
      f. user
        Guarda o login e senha (criptografados) do usuário. O usuário se associa com um cliente através da tabela clients_has_users, mas não há endpoint
        implementado para isso ainda. A idéia é que o cliente logue com seu email e senha,de uma forma geral, escolha a conta bancária que deseja realizar
        alguma transação. As operações de transações são realizadas em um ambiente autenticado com jwt (json web tokens). O token identifica o usuário e é 
        requerido em todas as operações com as contas bancárias. A conta bancária selecionada é representada pelo campo: bank_account_sender_id nas requisições,
        você pode usar algumas contas dos exemplos adicionados pelo banco de dados. Veja um exemplo em funcionamento usando o aplicativo insomnia, conforme
        explicado acima.
      g. usersHasClients
         Associa um usuário a um cliente. Há a restrição de que um cliente só pode ter um usuário, mas para facilitar possíveis mudanças futuras, foi preferido
         usar essa abordagem em favor de colocar a referência do cliente diretamente na tabela de usuário ou vice-versa
      h. bankTransactions
         Guardam as informações das transações em si. Possuem várias regras de negócio associadas, tais como a compensatioDate, 
         que de acordo com a origin_transaction, podem alterar a data de compensação da transação, seguindo algumas regras similares as originais
         
             Doc: no dia seguinte (não dia útil,como esperado)
             Ted: no mesmo dia até as 17hrs, (sem o horário limite de 06:30 inicial, como esperado)
             Pix: compensam na mesma hora.        
             
         Além disso, é verificado o saldo e se algumas informações básicas estão vindo na requisiçã, como channel ( o canel de onde foi realizada a transação),
         etc. É verificado também, inclusive nos testes, se o tipo da transação e o status está de acordo com o tipo da operação (depósito, saque, pagamento e
         pagamentos externos).
         
         O método getBalance (RetrieveBalanceService), recupera o saldo e extrato em um formato similar a um extrato real,com todas as transações, inclusive
         as futuras, nome do cliente, saldo final, informações da conta e agência, nome do banco, período (que filtra os resultados), balanço e balanço 
         monetizável da aplicação, memo (um lembrete comummente utilizado ao salvar uma transação, opcional) e saldo anterior.
         A monetização implementada é diária, remunerando pelo menor saldo do dia, no dia seguinte, similar a remuneração das contas poupanças e conforme
         a taxa aplicada na tabela profitability, associada a conta e também a transação. Se um mesma taxa for aplicada no dia ou retirada, prevalece a primeira 
         taxa, dentro do mesmo dia. 
         Não foi aplicado ainda outros tipos de remunerações, mensais, por exemplo.
         Não é aceito valores negativos na transação
         Nos pagamentos externos, as propriedades com _destiny no final são obrigatórias, mas nos outros tipos de transações não
         Não é verificado, nem impedido ainda, se um cliente transferir ou pagar, para ele mesmo
         É verificado se o cliente do token, corresponde ao cliente da transação representado na chave estrangeira: em bank_account_sender_id
       
         
         
         
  #### Estrutura das pastas
        Com o objetivo de facilitar mudanças, aplicar a SOLID (https://en.wikipedia.org/wiki/SOLID), isolando as regras de negócio o máximo possível, facilitando
        mudanças de frameworks Orms, tais como typescript, testes da aplicação, pois as <i> bussiness rules </i> estão isoladas, foi implementada a seguinte
        arquitetura:
          a. repositories.
            Há dois tipos de repositório, a especificação, são os que começam com um I na frente do nome do repositório e sempre estão,dentro do módulo,
          um nível abaixo,junto das pastas services,dtos,infra,etc. Eles são especificações dos repositórios reais. Facilitam a criação de novos repositórios,
          como os fakes, usados para teste ou se quisessemos adicionar outra versão usando outro ORM ou ainda se quiséssemos mudar a implementação sem afetar
          muito os services.
          
          b.services.
            Pode ter dois tipos. Nessa aplicação, pode ser observado no módulo bankTransactions. As que estão no pacote shared, contém funções e regras
            usadas pelos serviços do módulo que normalmente, são compartilhadas e reutilizadas por outras partes da aplicação,dentro do mesmo módulo. Mas 
            a regra geral, é deixar qualque código que contenha lógica de negócio la,pois posteriormente,o código pode ser testado (nos arquivos .spec) de forma
            individual,sem estar necessariamente associado ao serviço mais externo do módulo,evitando testar mais de uma vez a mesma coisa.
            ex. A funcão que verifica se o código do cliente no token é igual ao código do cliente na propriedade bank_account_sender_id da aplicação, é usada
            por todos os services (Deposit, Withdraw, Payment e PaymentExternal) mas testada somente uma vez, pelo arquivo de teste ValidateTransactionsService.
            Em cada service, digamos, exterior (Deposit, Withdraw, Payment e PaymentExternal), costuma ser testado apenas se no caso de uma quebra da regra de 
            negócio, a aplicação retorna um erro, conforme esperado. 
              Obs: Foi separado as funções de validação das funções que retornam algum tipo de objeto, guardadas em GetObjsTransactionsService. Algumas
              dessas funcões ainda não foram testadas e outras sequer isoladas, apesar da alta porcetagem de cobertura do código. Na situação ideal, a intenção
              é deixar nos services gerais, apenas os códigos que usam/chamam todas as bussiness rules daquele serviço e retornar exceções quando algumas delas
              são quebradas. Salvando o objeto no repositório correspondente, se tudo estiver validado.
              
          c.controllers
             Usando a dependência tsyringe para recuperar um serviço dentro do controlador correspondente. Sua função é receber os dados da requisição e 
             chamar todos os serviços necessários para a execução do endpoint. Em tese, um controller mapeia um ou mais endpoints filhos de um mesmo pai. 
             Na aplicação, o controller BankTrasactionsController,dentro da pasta infra/http, é responsável por lidar com as requisições do subdominio
             /transactions da aplicão. Ele gerencia os depósitos, saques, pagamentos e extratos. A url é mapeada na pasta routes dentro http, lá também é 
             definido o tipo de método http (post, put,get, etc), se o método usa algum midleware personalizado, como na autenticação, ou se o endpoint precisa
             de autenticação para ser executado. 
             Em suma, o controller pode realizar várias ações,chamando vários serviços dentro de um mesmo endpoint,se
             necessário. A fim de manter a integridade da operação como um todo (atomicidade), pode ser necessário usar transctions (a dependência 
             typeorm-transactional-cls-hooked nos ajuda com isso). Por exemplo, apesar de ter sido feito de outra forma, uma transferência,
             que é uma espécie de pagamento,poderia ser feito usando duas ações, depósito e saque, sendo que ou as duas acontecem ou nada acontece; a transação
             se encaixa nesse cenário. O controller também pode modificar o tipo da resposta, a fim de retornar algo específico,se necessário, tal como o
             controller de usuário, que remove a propriedade password, para que não seja serializada na requisição
          
          d.dto
             Especificam o tipo de dado esperado para realizar uma operação no banco de dados, conforme esperado pelo serviço. Depósito, por exemplo, não
             pede uma conta de destino, pagamentos sim. Pagamentos externos, tornam obrigatórias as propriedades com final _destiny, que não são necessárias
             em outras operações. As vezes, os dados são mesclados com os dados da requisição, alguns dados são gerados diretamente no service, como o
             typeTransaction. Por conta disso, os services costumam ter uma interface chamada IRequest, que também ajuda na organização do código, isolamento
             das propriedades necessárias na requisiçao ( uma espécie de contrato, dentro dos princípios da SOLID). Outra prática comum é, ao invés de
             colocar um único parametro do tipo correspondente no escopo do método, bt:BankTransactions, por exemplo; o que se faz é desestruturar
             o objeto inteiro nas suas propriedades, facilitando a leitura das propriedades que estão sendo modificadas e ajudando a evitar erros, pela falta
             de uma propriedade que é obrigatória, ou uma obrigatória que se tornou opcional, etc.
         e.constants
            O padrão de constants representado no arquivo BankTransactions.constants, ajuda para que as propriedades possam ser mantidas e reutilizadas em mais
            de um local, como nas migrations, facilitando a manutenção do código e evitando erros de difícil percepção.
         f.fakes
            Os fakes repositories e o fakeDatabase e FakeObjs, tem o objetivo de auxiliar os testes para que forneçam a experiẽncia mais próxima possivel 
            da realidade, da estrutura de dados da aplicação mas sem que seja necessário criar banco de dados de testes ou poluir o banco de dados de produção.
          
         
        
        
      


## 🛠️ Construído com

Mencione as ferramentas que você usou para criar seu projeto

* [Nodejs](https://nodejs.org/en/) - Executor de código javascript, base do projeto
* [Typescript](https://www.typescriptlang.org/) - Adiciona tipos ao javascript
* [Docker](https://www.docker.com/) - Container
* [Vs code](https://code.visualstudio.com/) - Editor de código
* [Postgresql](https://www.postgresql.org/) - Banco de dados relacional
* [Typeorm](https://typeorm.io/#/) - Orm para uso com postgres
* [Insomnia](https://insomnia.rest/) - Ferramenta para execução das requisições rest

## 📌 Versão
  Versão 1.0 não oficial


