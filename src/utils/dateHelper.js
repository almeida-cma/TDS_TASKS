/**
 * Utilitário para manipulação de datas
 */
const DateHelper = {
    /**
     * Formata data para o padrão brasileiro
     * @param {Date} date - Data a ser formatada
     * @returns {string} Data no formato dd/mm/aaaa
     */
    formatToBrazilian(date) {
        if (!date) return '';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    },

    /**
     * Verifica se a data é hoje
     * @param {Date} date - Data a ser verificada
     * @returns {boolean}
     */
    isToday(date) {
        if (!date) return false;
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    },

    /**
     * Verifica se a data está vencida
     * @param {Date} date - Data a ser verificada
     * @returns {boolean}
     */
    isOverdue(date) {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(date);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
    }
};

// Torna disponível globalmente
window.DateHelper = DateHelper;