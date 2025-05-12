/**
 * Controller: Orquestra Model e View
 */
class TaskController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // Vincula os event handlers
        this.view.bindAddTaskButton(this.handleAddTask.bind(this));
        this.view.bindAddEditTask(this.handleAddEditTask.bind(this));
        this.view.bindEditTask(this.handleEditTask.bind(this));
        this.view.bindRequestDeleteTask(this.handleRequestDeleteTask.bind(this));
        this.view.bindDeleteTask(this.handleDeleteTask.bind(this));
        this.view.bindFilterTasks(this.handleFilterTasks.bind(this));
        this.view.bindExportTasks(this.handleExportTasks.bind(this));
        this.view.bindImportTasks(this.handleImportTasks.bind(this));
        this.view.bindGeneratePdf(this.handleGeneratePdf.bind(this));
    }

    /**
     * Inicializa o controller
     */
    init() {
        // Carrega e exibe todas as tarefas
        const tasks = this.model.getTasks();
        this.view.renderTaskList(tasks);
    }

    /**
     * Manipula a adição de nova tarefa
     */
    handleAddTask() {
        this.view.openTaskModal();
    }

    /**
     * Manipula a adição/edição de tarefa
     * @param {Object} taskData - Dados da tarefa
     */
    handleAddEditTask(taskData) {
        if (taskData.id) {
            // Edição de tarefa existente
            const updatedTask = this.model.updateTask(taskData.id, {
                title: taskData.title,
                description: taskData.description,
                dueDate: taskData.dueDate,
                status: taskData.status
            });
            
            if (updatedTask) {
                this.view.showAlert('Tarefa atualizada com sucesso!');
            } else {
                this.view.showAlert('Erro ao atualizar tarefa', 'error');
            }
        } else {
            // Adição de nova tarefa
            const newTask = {
                title: taskData.title,
                description: taskData.description,
                dueDate: taskData.dueDate,
                status: taskData.status || 'pending'
            };
            
            this.model.addTask(newTask);
            this.view.showAlert('Tarefa adicionada com sucesso!');
        }
        
        // Atualiza a view com o filtro atual
        const currentFilter = this.view.filterSelect.value;
        this.handleFilterTasks(currentFilter);
    }

    /**
     * Manipula a edição de tarefa
     * @param {string} taskId - ID da tarefa
     */
    handleEditTask(taskId) {
        const task = this.model.tasks.find(t => t.id === taskId);
        if (task) this.view.openTaskModal(task);
    }

    /**
     * Manipula a solicitação de exclusão de tarefa
     * @param {string} taskId - ID da tarefa
     */
    handleRequestDeleteTask(taskId) {
        this.view.openConfirmModal(taskId);
    }

    /**
     * Manipula a exclusão de tarefa
     * @param {string} taskId - ID da tarefa
     */
    handleDeleteTask(taskId) {
        const deletedTask = this.model.deleteTask(taskId);
        if (deletedTask) {
            this.view.showAlert('Tarefa excluída com sucesso!');
            
            // Atualiza a view com o filtro atual
            const currentFilter = this.view.filterSelect.value;
            this.handleFilterTasks(currentFilter);
        } else {
            this.view.showAlert('Erro ao excluir tarefa', 'error');
        }
    }

    /**
     * Manipula o filtro de tarefas
     * @param {string} filter - 'all', 'pending' ou 'completed'
     */
    handleFilterTasks(filter) {
        const tasks = this.model.getTasks(filter);
        this.view.renderTaskList(tasks);
    }

    /**
     * Manipula a exportação de tarefas
     */
    handleExportTasks() {
        const tasksJson = this.model.exportTasks();
        const blob = new Blob([tasksJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `tarefas_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.view.showAlert('Tarefas exportadas com sucesso!');
    }

    /**
     * Manipula a importação de tarefas
     * @param {string} json - JSON stringificado
     */
    handleImportTasks(json) {
        const success = this.model.importTasks(json);
        if (success) {
            this.view.showAlert('Tarefas importadas com sucesso!');
            
            // Atualiza a view com o filtro atual
            const currentFilter = this.view.filterSelect.value;
            this.handleFilterTasks(currentFilter);
        } else {
            this.view.showAlert('Erro ao importar tarefas. Verifique o arquivo.', 'error');
        }
    }

    /**
     * Manipula a geração de PDF
     */
    async handleGeneratePdf() {
        try {
            // Verifica se as bibliotecas estão carregadas
            if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
                throw new Error('Bibliotecas para PDF não carregadas');
            }

            // Feedback para o usuário
            this.view.showAlert('Gerando PDF...', 'info');
            
            // Obtém todas as tarefas ordenadas por data
            const tasks = [...this.model.getTasks()].sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });

            // Cria um container temporário para o PDF
            const pdfContainer = document.createElement('div');
            pdfContainer.style.width = '210mm';
            pdfContainer.style.padding = '20px';
            pdfContainer.style.background = 'white';
            
            // Adiciona título
            const title = document.createElement('h1');
            title.textContent = 'Relatório de Tarefas';
            title.style.textAlign = 'center';
            title.style.marginBottom = '20px';
            pdfContainer.appendChild(title);
            
            // Adiciona data de geração
            const date = document.createElement('p');
            date.textContent = `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`;
            date.style.textAlign = 'center';
            date.style.marginBottom = '30px';
            pdfContainer.appendChild(date);
            
            // Adiciona tarefas
            tasks.forEach(task => {
                const taskElement = this.view.createTaskElement(task);
                taskElement.style.marginBottom = '15px';
                taskElement.style.border = '1px solid #eee';
                taskElement.style.padding = '15px';
                pdfContainer.appendChild(taskElement);
            });
            
            // Adiciona ao DOM temporariamente
            document.body.appendChild(pdfContainer);
            
            // Gera o PDF
            const canvas = await html2canvas(pdfContainer, {
                scale: 2,
                useCORS: true,
                scrollY: 0,
                logging: true
            });
            
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('tarefas.pdf');
            
            // Remove o container temporário
            pdfContainer.remove();
            
            this.view.showAlert('PDF gerado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            this.view.showAlert('Falha ao gerar PDF. Tente novamente.', 'error');
        }
    }
}