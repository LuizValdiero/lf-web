# LfWeb

---
## video T1: https://www.youtube.com/watch?v=ykNPDR7zjkA
---

Install: npm, nodejs and Angular cli

Run: npm i && ng serve


## T1

- [x] Conversão de AFND (com e sem ε) para AFD

- [X] União de AF

- [x] Conversão de ER para AFD (usando o algoritmo baseado em árvore sintática - Livro Aho - seção 3.9)
  pdf analise sintatica
  4 funcoes: anulavel, first_pos, follow_pos, last_pos

- [ ] criação da tabela de símbolos

---

- [x] (d) Reconhecimento de sentenças em AF (caracter a carecter)

---

## T2

- [ ] Leitura de uma GLC

- [x] First de uma GLC

- [x] Follow de uma GLC

- [ ] Algoritmo LR Canônico (conforme livro do Aho) (page 107)

- [ ] Table de analise sintática

### LR Canonico

Lista de produções, add prod s'

Calcula first e follow

--

Bottom-Up: deterministico ->
Familia LR
Precedência: Operadores, Simples, Estendida

--

Para a construção de um gerador de analisador sintático são necessários os seguintes
algoritmos (Parte II do trabalho), a depender do algoritmo de análise implementado:

- Se preditivo LL(1): Eliminação de recursão à esquerda, Fatoração, Cálculo de First e Follow, Geração da tabela de análise; Autômato de pilha para análise de sentenças
- Se LR Canônico: Cálculo de First e Follow, Algoritmos correspondentes ao analisador LR Canônico (conforme livro do Aho).
  
A interface de projeto deve **receber e validar a Gramática Livre de Contexto** que descreve a linguagem, identificando terminais (tokes) e não terminais. O fluxo de execução da segunda parte é o seguinte:

- Leitura token a token do arquivo resultante da parte 1
- Uso da tabela de análise para validação da sentença de entrada
- Saída: Mensagem validando ou invalidando o código

--

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
