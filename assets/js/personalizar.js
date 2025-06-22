class DrawingApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.elements = [];
        this.isDrawing = false;
        this.currentTool = 'rect';
        this.startX = 0;
        this.startY = 0;
        this.scale = 50; // 50 pixels = 1 meter

        this.initializeCanvas();
        this.setupEventListeners();
        this.setupToolbar();
    }

    initializeCanvas() {
        // Guarda el tamaño original del canvas y ajusta solo la vista sin redimensionar el dibujo
        this.canvas.width = window.innerWidth - 350;
        this.canvas.height = window.innerHeight;
        this.redraw();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));

        // Optimiza el redimensionado con un debounce
        window.addEventListener('resize', this.debounce(() => {
            this.initializeCanvas();
        }, 100));
    }

    setupToolbar() {
        document.getElementById('rect-btn').addEventListener('click', () => this.setTool('rect'));
        document.getElementById('wall-btn').addEventListener('click', () => this.setTool('wall'));
        document.getElementById('door-btn').addEventListener('click', () => this.setTool('door'));
        document.getElementById('window-btn').addEventListener('click', () => this.setTool('window'));
        document.getElementById('text-btn').addEventListener('click', () => this.setTool('text'));
        document.getElementById('clear-btn').addEventListener('click', () => this.clearCanvas());
        document.getElementById('export-btn').addEventListener('click', () => this.showExportModal());
    }

    setTool(tool) {
        this.currentTool = tool;
        document.querySelectorAll('.toolbar button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${tool}-btn`).classList.add('active');
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawElements();

        // Draw current element preview
        switch (this.currentTool) {
            case 'rect':
                this.drawRectangle(this.startX, this.startY, currentX - this.startX, currentY - this.startY);
                break;
            case 'wall':
                this.drawWall(this.startX, this.startY, currentX, currentY);
                break;
            case 'door':
                this.drawDoor(this.startX, this.startY, currentX, currentY);
                break;
            case 'window':
                this.drawWindow(this.startX, this.startY, currentX, currentY);
                break;
        }
    }

    stopDrawing(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        this.elements.push({
            type: this.currentTool,
            startX: this.startX,
            startY: this.startY,
            endX: endX,
            endY: endY,
            color: document.getElementById('color-input').value
        });

        this.isDrawing = false;
        this.redraw();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 0.5;

        // Draw vertical lines
        for (let x = 0; x <= this.canvas.width; x += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y <= this.canvas.height; y += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawRectangle(x, y, width, height) {
        this.ctx.strokeStyle = document.getElementById('color-input').value;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
    }

    drawWall(startX, startY, endX, endY) {
        this.ctx.strokeStyle = document.getElementById('color-input').value;
        this.ctx.lineWidth = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    }

    drawDoor(startX, startY, endX, endY) {
        const width = 40;
        const angle = Math.atan2(endY - startY, endX - startX);
        
        this.ctx.strokeStyle = document.getElementById('color-input').value;
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(startX + width * Math.cos(angle), startY + width * Math.sin(angle));
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(startX, startY, width, angle, angle + Math.PI / 2, false);
        this.ctx.stroke();
    }

    drawWindow(startX, startY, endX, endY) {
        const width = 30;
        this.ctx.strokeStyle = document.getElementById('color-input').value;
        this.ctx.lineWidth = 2;
        
        this.ctx.strokeRect(startX - width / 2, startY - width / 2, width, width);
        
        this.ctx.beginPath();
        this.ctx.moveTo(startX - width / 2, startY);
        this.ctx.lineTo(startX + width / 2, startY);
        this.ctx.moveTo(startX, startY - width / 2);
        this.ctx.lineTo(startX, startY + width / 2);
        this.ctx.stroke();
    }

    drawElements() {
        this.elements.forEach(element => {
            switch (element.type) {
                case 'rect':
                    this.drawRectangle(
                        element.startX,
                        element.startY,
                        element.endX - element.startX,
                        element.endY - element.startY
                    );
                    break;
                case 'wall':
                    this.drawWall(element.startX, element.startY, element.endX, element.endY);
                    break;
                case 'door':
                    this.drawDoor(element.startX, element.startY, element.endX, element.endY);
                    break;
                case 'window':
                    this.drawWindow(element.startX, element.startY, element.endX, element.endY);
                    break;
            }
        });
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawElements();
    }

    clearCanvas() {
        this.elements = [];
        this.redraw();
    }

    showExportModal() {
        const modal = document.getElementById('export-modal');
        modal.style.display = 'block';

        const form = document.getElementById('export-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            const exportData = {
                elements: this.elements,
                projectName: form.elements[0].value,
                description: form.elements[1].value,
                timestamp: new Date().toISOString()
            };
            
            console.log('Exported data:', exportData);
            alert('Diseño enviado con éxito! Un profesional se pondrá en contacto contigo pronto.');
            modal.style.display = 'none';
        };

        // Close modal on "Esc" key press
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
            }
        });

        window.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

// Initialize the app when the window loads
window.onload = () => {
    new DrawingApp();
};
