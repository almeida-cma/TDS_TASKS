/**
 * Ponto de entrada da aplicação
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se as dependências estão carregadas
    const checkDependencies = () => {
        const errors = [];
        if (typeof html2canvas === 'undefined') errors.push('html2canvas');
        if (typeof jspdf === 'undefined') errors.push('jsPDF');
        
        if (errors.length > 0) {
            console.error(`Erro: Bibliotecas não carregadas - ${errors.join(', ')}`);
            alert(`Erro: Bibliotecas necessárias não carregadas. Recarregue a página.`);
            return false;
        }
        return true;
    };

    // Inicializa a aplicação
    if (checkDependencies()) {
        const model = new TaskModel();
        const view = new TaskView();
        const controller = new TaskController(model, view);
        controller.init();
    }
});