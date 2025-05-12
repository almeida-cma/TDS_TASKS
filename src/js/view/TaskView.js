/**
 * View: Gerencia a interface do usuário
 */
class TaskView {
    constructor() {
        // Seleção de elementos
        this.taskList = document.getElementById('task-list');
        this.emptyState = document.getElementById('empty-state');
        this.filterSelect = document.getElementById('filter-tasks');
        
        // Elementos do modal de tarefa
        this.taskModal = document.getElementById('task-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.taskForm = document.getElementById('task-form');
        this.taskIdInput = document.getElementById('task-id');
        this.taskTitleInput = document.getElementById('task-title');
        this.taskDescInput = document.getElementById('task-description');
        this.taskDueDateInput = document.getElementById('task-due-date');
        this.taskStatusSelect = document.getElementById('task-status');
        
        // Elementos do modal de confirmação
        this.confirmModal = document.getElementById('confirm-modal');
        this.confirmDeleteBtn = document.getElementById('confirm-delete');
        
        // Botões de ação
        this.addTaskBtn = document.getElementById('add-task-btn');
        this.cancelTaskBtn = document.getElementById('cancel-task');
        this.cancelDeleteBtn = document.getElementById('cancel-delete');
        this.exportBtn = document.getElementById('export-btn');
        this.importBtn = document.getElementById('import-btn');
        this.importFileInput = document.getElementById('import-file');
        this.generatePdfBtn = document.getElementById('generate-pdf-btn');

        // Inicializa listeners
        this.initModalListeners();
    }

    /**
     * Inicializa listeners para modais
     */
    initModalListeners() {
        // Fechar modais ao clicar no X ou fora
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === this.taskModal || e.target === this.confirmModal) {
                this.closeAllModals();
            }
        });
        
        // Cancelar ações
        this.cancelTaskBtn.addEventListener('click', () => this.closeAllModals());
        this.cancelDeleteBtn.addEventListener('click', () => this.closeAllModals());
    }

    /**
     * Renderiza a lista de tarefas
     * @param {Array} tasks - Lista de tarefas
     */
    renderTaskList(tasks) {
        this.taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            this.emptyState.style.display = 'block';
            return;
        }
        
        this.emptyState.style.display = 'none';
        
        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        });
    }

    /**
     * Cria elemento HTML para uma tarefa
     * @param {Object} task - Objeto de tarefa
     * @returns {HTMLElement} Elemento DOM da tarefa
     */
    createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.status}`;
        
        // Formata data de vencimento
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let dueDateClass = '';
        if (dueDate) {
            const dueDateOnly = new Date(dueDate);
            dueDateOnly.setHours(0, 0, 0, 0);
            
            if (dueDateOnly < today) dueDateClass = 'overdue';
            else if (dueDateOnly.getTime() === today.getTime()) dueDateClass = 'today';
        }
        
        // Conteúdo da tarefa
        taskElement.innerHTML = `
            <div class="task-content">
                <h3 class="task-title">${task.title}</h3>
                ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                <div class="task-meta">
                    ${dueDate ? `
                        <span class="task-due-date ${dueDateClass}">
                            <i class="far fa-calendar-alt"></i>
                            ${dueDate.toLocaleDateString('pt-BR')}
                        </span>
                    ` : ''}
                    <span class="task-status ${task.status}">
                        ${task.status === 'completed' ? 'Concluída' : 'Pendente'}
                    </span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn edit" data-id="${task.id}" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-action-btn delete" data-id="${task.id}" title="Excluir">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        return taskElement;
    }

    /**
     * Abre modal para adicionar/editar tarefa
     * @param {Object|null} task - Tarefa para edição ou null para nova
     */
    openTaskModal(task = null) {
        if (task) {
            this.modalTitle.textContent = 'Editar Tarefa';
            this.taskIdInput.value = task.id;
            this.taskTitleInput.value = task.title;
            this.taskDescInput.value = task.description || '';
            this.taskDueDateInput.value = task.dueDate || '';
            this.taskStatusSelect.value = task.status;
        } else {
            this.modalTitle.textContent = 'Adicionar Nova Tarefa';
            this.taskIdInput.value = '';
            this.taskForm.reset();
        }
        
        this.taskModal.style.display = 'flex';
        this.taskTitleInput.focus();
    }

    /**
     * Abre modal de confirmação de exclusão
     * @param {string} taskId - ID da tarefa
     */
    openConfirmModal(taskId) {
        this.confirmDeleteBtn.dataset.id = taskId;
        this.confirmModal.style.display = 'flex';
    }

    /**
     * Fecha todos os modais
     */
    closeAllModals() {
        this.taskModal.style.display = 'none';
        this.confirmModal.style.display = 'none';
        this.taskForm.reset();
    }

    /**
     * Vincula callback para adicionar/editar tarefa
     * @param {Function} handler - Função de callback
     */
    bindAddEditTask(handler) {
        this.taskForm.addEventListener('submit', e => {
            e.preventDefault();
            
            const taskData = {
                id: this.taskIdInput.value,
                title: this.taskTitleInput.value.trim(),
                description: this.taskDescInput.value.trim(),
                dueDate: this.taskDueDateInput.value,
                status: this.taskStatusSelect.value
            };
            
            handler(taskData);
            this.closeAllModals();
        });
    }

    /**
     * Vincula callback para deletar tarefa
     * @param {Function} handler - Função de callback
     */
    bindDeleteTask(handler) {
        this.confirmDeleteBtn.addEventListener('click', () => {
            const taskId = this.confirmDeleteBtn.dataset.id;
            handler(taskId);
            this.closeAllModals();
        });
    }

    /**
     * Vincula callback para o botão de adicionar tarefa
     * @param {Function} handler - Função de callback
     */
    bindAddTaskButton(handler) {
        this.addTaskBtn.addEventListener('click', () => handler());
    }

    /**
     * Vincula callback para editar tarefa
     * @param {Function} handler - Função de callback
     */
    bindEditTask(handler) {
        this.taskList.addEventListener('click', e => {
            if (e.target.closest('.edit')) {
                const taskId = e.target.closest('.edit').dataset.id;
                handler(taskId);
            }
        });
    }

    /**
     * Vincula callback para solicitar exclusão
     * @param {Function} handler - Função de callback
     */
    bindRequestDeleteTask(handler) {
        this.taskList.addEventListener('click', e => {
            if (e.target.closest('.delete')) {
                const taskId = e.target.closest('.delete').dataset.id;
                handler(taskId);
            }
        });
    }

    /**
     * Vincula callback para filtrar tarefas
     * @param {Function} handler - Função de callback
     */
    bindFilterTasks(handler) {
        this.filterSelect.addEventListener('change', () => {
            const filter = this.filterSelect.value;
            handler(filter);
        });
    }

    /**
     * Vincula callback para exportar tarefas
     * @param {Function} handler - Função de callback
     */
    bindExportTasks(handler) {
        this.exportBtn.addEventListener('click', () => handler());
    }

    /**
     * Vincula callback para importar tarefas
     * @param {Function} handler - Função de callback
     */
    bindImportTasks(handler) {
        this.importBtn.addEventListener('click', () => this.importFileInput.click());
        
        this.importFileInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = event => {
                handler(event.target.result);
                this.importFileInput.value = '';
            };
            reader.readAsText(file);
        });
    }

    /**
     * Vincula callback para gerar PDF
     * @param {Function} handler - Função de callback
     */
    bindGeneratePdf(handler) {
        this.generatePdfBtn.addEventListener('click', () => handler());
    }

    /**
     * Mostra mensagem de alerta
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo de alerta ('success' ou 'error')
     */
    showAlert(message, type = 'success') {
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `${message} <span class="close-alert">&times;</span>`;
        document.body.appendChild(alert);
        
        setTimeout(() => alert.remove(), 3000);
        
        alert.querySelector('.close-alert').addEventListener('click', () => {
            alert.remove();
        });
    }
}