/**
 * Model: Gerencia os dados e persistência no LocalStorage
 */
class TaskModel {
    constructor() {
        this.tasks = [];
        this.STORAGE_KEY = 'tasks_mvc_app';
        this.loadTasks();
    }

    /**
     * Carrega tarefas do LocalStorage
     */
    loadTasks() {
        const storedTasks = localStorage.getItem(this.STORAGE_KEY);
        this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
    }

    /**
     * Salva tarefas no LocalStorage
     */
    saveTasks() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
    }

    /**
     * Adiciona nova tarefa
     * @param {Object} task - Objeto de tarefa {title, description, dueDate, status}
     * @returns {Object} Tarefa criada com ID e timestamps
     */
    addTask(task) {
        const newTask = {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: null
        };
        this.tasks.push(newTask);
        this.saveTasks();
        return newTask;
    }

    /**
     * Atualiza tarefa existente
     * @param {string} id - ID da tarefa
     * @param {Object} updates - Campos para atualizar
     * @returns {Object|null} Tarefa atualizada ou null se não encontrada
     */
    updateTask(id, updates) {
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) return null;
        
        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        this.saveTasks();
        return this.tasks[taskIndex];
    }

    /**
     * Remove tarefa
     * @param {string} id - ID da tarefa
     * @returns {Object|null} Tarefa removida ou null se não encontrada
     */
    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) return null;
        
        const deletedTask = this.tasks.splice(taskIndex, 1)[0];
        this.saveTasks();
        return deletedTask;
    }

    /**
     * Obtém tarefas filtradas
     * @param {string} filter - 'all', 'pending' ou 'completed'
     * @returns {Array} Lista de tarefas
     */
    getTasks(filter = 'all') {
        if (filter === 'all') return [...this.tasks];
        return this.tasks.filter(task => task.status === filter);
    }

    /**
     * Exporta tarefas como JSON
     * @returns {string} JSON stringificado
     */
    exportTasks() {
        return JSON.stringify(this.tasks, null, 2);
    }

    /**
     * Importa tarefas de JSON
     * @param {string} json - JSON stringificado
     * @returns {boolean} Sucesso da operação
     */
    importTasks(json) {
        try {
            const tasks = JSON.parse(json);
            if (!Array.isArray(tasks)) return false;
            
            this.tasks = tasks;
            this.saveTasks();
            return true;
        } catch (error) {
            console.error('Erro ao importar tarefas:', error);
            return false;
        }
    }
}