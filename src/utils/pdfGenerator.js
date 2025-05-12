/**
 * Utilitário para geração de PDF
 */
const PDFGenerator = {
    /**
     * Gera PDF a partir de um elemento HTML
     * @param {string} elementId - ID do elemento a ser convertido
     * @returns {Promise<boolean>} - Resolve com true se bem-sucedido
     */
    async generate(elementId = 'pdf-export-container') {
        try {
            // Verifica dependências
            if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
                throw new Error('Bibliotecas html2canvas/jsPDF não carregadas');
            }

            const element = document.getElementById(elementId);
            if (!element) throw new Error(`Elemento #${elementId} não encontrado`);

            // Configurações para mobile
            const options = {
                scale: 2,
                useCORS: true,
                scrollY: 0,
                logging: true,
                allowTaint: true,
                backgroundColor: '#FFFFFF'
            };

            // Converte HTML para canvas
            const canvas = await html2canvas(element, options);
            
            // Cria PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                hotfixes: ['px_scaling']
            });

            // Adiciona imagem ao PDF
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('tarefas.pdf');
            
            return true;
        } catch (error) {
            console.error('Erro no PDFGenerator:', error);
            throw error;
        }
    }
};

// Torna disponível globalmente
window.PDFGenerator = PDFGenerator;