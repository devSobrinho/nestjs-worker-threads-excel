# Aplicação de Geração de Arquivos Excel com Pool de Threads

Esta aplicação foi desenvolvida para testar a performance na geração de arquivos Excel utilizando o NestJS e o módulo `worker_threads` do Node.js. O foco principal foi aplicar técnicas para melhorar a performance e gerenciar eficientemente a criação de arquivos em um ambiente de alta demanda.

## Descrição

A aplicação fornece uma API para gerar arquivos Excel com base na quantidade solicitada pelo usuário. O processamento é feito de maneira assíncrona utilizando um pool de workers (threads) para garantir que múltiplas solicitações possam ser processadas simultaneamente sem sobrecarregar o servidor.

### Componentes Principais

1. **print.service.ts**: Serviço principal que expõe o método para iniciar a geração de arquivos Excel. Recebe a quantidade de linhas desejadas e a resposta da requisição HTTP.

2. **worker-pool.service.ts**: Gerencia um pool de workers para processar as tarefas de geração de arquivos Excel. Controla o número máximo de threads ativas, enfileira as tarefas e distribui-as entre os workers disponíveis.

3. **print-excel.worker.ts**: Worker responsável por gerar o arquivo Excel. Utiliza o módulo `ExcelJS` para criar o arquivo e o módulo `stream` para enviar os dados do arquivo para o cliente em partes.

### Como Funciona

1. **Recebendo Solicitações**: Quando uma solicitação de geração de arquivo é recebida, o `PrintService` adiciona a tarefa à fila do `WorkerPoolService`.

2. **Processamento de Tarefas**: O `WorkerPoolService` gerencia um pool de workers que processam as tarefas. Se houver workers disponíveis e a fila não estiver vazia, ele atribui uma tarefa a um worker.

3. **Geração do Arquivo**: O worker processa a tarefa, cria o arquivo Excel e envia os dados para a resposta HTTP em partes, usando streams para eficiência.

4. **Gerenciamento de Threads**: A aplicação limita o número máximo de threads ativas para evitar a sobrecarga do servidor. Quando um worker termina seu trabalho ou encontra um erro, a aplicação libera o worker e continua processando as próximas tarefas.

### Melhorias de Performance

- **Utilização de Threads**: A aplicação utiliza `worker_threads` para gerar arquivos em paralelo, o que melhora a performance em comparação com a geração de arquivos síncrona.
- **Gerenciamento de Pool de Threads**: Um pool de threads é implementado para controlar o número máximo de threads ativas e garantir que o servidor não seja sobrecarregado com um número excessivo de workers simultâneos.

- **Streams para Processamento de Arquivos**: O uso de streams permite que os dados do arquivo sejam enviados para o cliente em partes, o que melhora a eficiência na transferência de grandes arquivos.

- **Fila de Tarefas**: As tarefas são enfileiradas e processadas de maneira ordenada, garantindo que cada tarefa seja tratada sem perder performance.

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/your-repository.git
   cd your-repository
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie a aplicação:
   ```bash
   npm run start
   ```

### Testes

Para testar a aplicação, você pode fazer uma solicitação HTTP para o endpoint configurado no `PrintController`, passando a quantidade desejada de linhas para o arquivo Excel.

#### Usando cURL

Você pode testar a aplicação usando cURL com o seguinte comando:

```bash
curl --location 'http://localhost:3000/print/excel?qtd=300'
```

#### Usando Fetch

Alternativamente, você pode usar o método fetch em um ambiente JavaScript/TypeScript para fazer a solicitação:

```javascript
const requestOptions = {
  method: 'GET',
  redirect: 'follow',
};

fetch('http://localhost:3000/print/excel?qtd=300', requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

Substitua 300 pelo número de linhas desejado para gerar o arquivo Excel com a quantidade especificada. Certifique-se de que o servidor está em execução e acessível no endereço http://localhost:3000.
