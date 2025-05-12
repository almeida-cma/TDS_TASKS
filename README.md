# Gerenciador de Tarefas MVC com LocalStorage

Um aplicativo de gerenciamento de tarefas completo implementando o padrão MVC (Model-View-Controller) com armazenamento local no navegador (LocalStorage).

## ✨ Funcionalidades

- ✅ **CRUD completo** de tarefas (Criar, Ler, Atualizar, Deletar)
- 📅 Filtros por status (**Todas**, **Pendentes**, **Concluídas**)
- 📤 Exportação/Importação de tarefas em **formato JSON**
- 🖨️ Geração de **relatórios em PDF** ordenados por data
- 📱 Design **totalmente responsivo** para mobile e desktop
- 🗃️ Persistência de dados com **LocalStorage**
- 🎨 Interface moderna e intuitiva

## 🚀 Como Executar

1. Clone o repositório:

2. Abra o arquivo `index.html` em qualquer navegador moderno:
- Google Chrome
- Firefox
- Edge
- Safari

## 🛠️ Tecnologias Utilizadas

- **HTML5** semântico
- **CSS3** moderno com variáveis e Flexbox/Grid
- **JavaScript** puro (ES6+)
- Padrão de arquitetura **MVC** (Model-View-Controller)
- Bibliotecas:
  - [Font Awesome](https://fontawesome.com/) - Ícones
  - [jsPDF](https://parall.ax/products/jspdf) - Geração de PDF
  - [html2canvas](https://html2canvas.hertzen.com/) - Conversão HTML para imagem

## 📂 Estrutura do Projeto

```
/task-manager-mvc/
│── index.html          # Página principal
│── /src/
│   │── /css/
│   │   └── style.css   # Estilos principais
│   │── /js/
│   │   │── app.js      # Ponto de entrada da aplicação
│   │   │── /model/
│   │   │   └── TaskModel.js  # Lógica de dados e LocalStorage
│   │   │── /view/
│   │   │   └── TaskView.js   # Manipulação da interface
│   │   └── /controller/
│   │       └── TaskController.js  # Lógica de controle
│   └── /utils/
│       │── pdfGenerator.js   # Gerador de PDF
│       └── dateHelper.js     # Utilitários para datas
```

## 📌 Versão

1.0.0

---

<div align="center">
Feito com ❤️ por <a href="https://github.com/almeida-cma">Seu Nome</a>
</div>
