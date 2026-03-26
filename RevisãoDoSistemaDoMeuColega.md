# Revisão do Sistema do Colega

## 1. O sistema está funcionando com as funcionalidades solicitadas?
O sistema tem interface gráfica bem limpa e intuitiva. O usuário consegue criar novas questões e colocar mais de uma alternativa correta por questão. Além disso, o usuário pode criar as provas, passando algumas informações para criação da prova, como as questões que farão a composição da nota e também. Ao clicar em uma prova, o usuário tem acesso a um quadro com a possibilidade de gerar provas aleatórias e é possível gerar essas provas. Sendo possível baixar as provas em pdf e baixar também o csv dessas. Todas essas funcionalidades estão funcionando conforme o esperado. A concepção da correção ficou diferente do que eu fiz, mas não vi problemas. Aqui, aparece a pontuação da questão e ao lado a pontuação obtida. 

## 2. Quais os problemas de qualidade do código e dos testes?
Tomando como base o código criado no meu projeto, o projeto em avaliação nesse documento apresentou uma elevação considerável em relação a qualidade. Acredito que a utilização de Skills foi um dos pontos que permitiu a codificação de ótima qualidade. Mas coisas como boilerplate nos services poderiam ser melhoradas. O agente acabou construindo vários try/catchs. Poderia tentar centralizar o processo de um globalErrorHandler.

## 3. Como a funcionalidade e a qualidade desse sistema pode ser comparada com as do seu sistema?
As funcionalidades ficaram muito parecidas. Apenas a correção que teve uma resolução diferente do que eu imaginei. Na minha resolução, coloquei a prova valendo de 0 a 10 e a pontuação da questão era calculada a partir da quantidade de questões na prova. Além disso, meu relatório de notas não era disponibilizado para download. O usuário recebia a avaliação em tela das provas e também da pontuação obtida pelo aluno. Sendo notas maiores que 7 verdes e notas menores vermelhas. A qualidade do código gerado pelo agente do experimento avaliado é melhor do que eu realizei. A necessidade do modelo gerar muito comentário acaba deixando muito lixo para leitura. Além disso, foram utilizadas várias skills que trouxeram um padrão tanto para desenvolvimento de código, quanto para layout. Técnica muito interessante. 

---

### 1. Estratégias de interação utilizada
Foi utilizada uma técnica mais de contextualização massiva no início. Informando desde os requisitos. Focou primeiro na construção do backend e depois partiu para o frontend da aplicação. 

### 2. Situações em que o agente funcionou melhor ou pior
Me parece que em atividades mais recorrentes, como a criação do crud para criação das questões o modelo funcionou muito bem. Relato isso até mesmo pelo feedback dado pelo dev ao agente. Contudo, atividades mais relacionadas ao negócio o agente teve maior problema. Por exemplo, o dev encontrou problemas com a ordenação das questões e o csv gerado. Pois estavam incompatíveis. 

### 3. Tipos de problemas observados (por exemplo, código incorreto ou inconsistências)
Foram identificados problemas de lógica matemática e de sincronização de dados. Um erro crítico ocorreu na implementação das potências de 2, onde o sistema realizava uma concatenação de strings (ex: 1 + 4 resultando em "14") em vez da soma aritmética correta. Outro ponto de falha foi a inconsistência entre o PDF gerado e o gabarito em CSV; o agente aplicou lógicas de embaralhamento (shuffle) diferentes para cada arquivo, tornando o gabarito inútil para a correção daquela prova específica até que o desenvolvedor solicitasse a correção da semente de aleatoriedade.

### 4. Avaliação geral da utilidade do agente no desenvolvimento
Para boilerplate o agente funcionou muito bem. Acredito que o fator de maior dificuldade foi a interação com as regras de negócio e que regras ainda mais complexas podem demandar prompts ainda mais detalhados, incluindo exemplos de funcionamento. 

### 5. Comparação com a sua experiência de uso do agente
O autor desse experimento parece ter mais experiência com a utilização de agentes. Minha utilização foi bem mais simples. Foquei muito mais em dividir a construção do sistema da forma que eu faria e tentei guiar o agente apenas através de prompts. Assim, não utilizei skills ou agents extras. Contudo, acredito que em termos de regras de negócio tive menos problemas com o agente que utilizei.