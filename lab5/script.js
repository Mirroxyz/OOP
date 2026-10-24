import {
    PointShape, LineShape, RectShape, EllipseShape, DottedLineShape, CubeShape
} from './shapes.js';
import { MyTable } from './table.js';

const TYPE_NAMES = {
    point: 'Крапка', line: 'Лінія', rect: 'Прямокутник', ellipse: 'Еліпс',
    dottedLine: 'Лінія з кружечками', cube: 'Каркас куба'
};

class MyEditor {
    static instance = null;
    static MAX_SHAPES = 125;

    constructor() {
        if (MyEditor.instance) {
            throw new Error('MyEditor є Singleton і вже створений');
        }
        this.canvas = document.getElementById('editorCanvas');
        this.context = this.canvas.getContext('2d');
        this.menuObjects = document.getElementById('menu-objects');
        this.dropdownObjects = document.getElementById('dropdown-objects');
        this.menuFile = document.getElementById('menu-file');
        this.dropdownFile = document.getElementById('dropdown-file');
        this.fileInput = document.getElementById('csv-file');
        this.toolNames = TYPE_NAMES;
        this.shapeTypes = { point: PointShape, line: LineShape, rect: RectShape, ellipse: EllipseShape,
            dottedLine: DottedLineShape, cube: CubeShape };
        this.shapes = [];
        this.currentTool = 'point';
        this.selectedIndex = -1;
        this.isDrawing = false;
        this.startPoint = { x: 0, y: 0 };
        this.boundHandlers = [];
        this.table = new MyTable({
            onSelect: (index) => this.selectShape(index),
            onDelete: (index) => this.deleteShape(index),
            onClose: () => this.redrawAll()
        });
        this.bindEvents();
        this.resizeCanvas();
        this.selectTool(this.currentTool);
    }

    static getInstance() {
        if (!MyEditor.instance) {
            MyEditor.instance = new MyEditor();
        }
        return MyEditor.instance;
    }

    listen(target, type, handler) {
        target.addEventListener(type, handler);
        this.boundHandlers.push({ target, type, handler });
    }

    bindEvents() {
        this.listen(window, 'resize', () => this.resizeCanvas());
        this.listen(this.canvas, 'mousedown', (event) => this.onMouseDown(event));
        this.listen(this.canvas, 'mousemove', (event) => this.onMouseMove(event));
        this.listen(this.canvas, 'mouseup', (event) => this.onMouseUp(event));
        this.listen(this.canvas, 'mouseleave', () => this.onMouseLeave());
        document.querySelectorAll('[data-tool]').forEach((control) => {
            this.listen(control, 'click', (event) => this.onNotify(event));
        });
        this.listen(document.getElementById('toggle-table'), 'click', () => this.toggleTable());
        this.listen(document.getElementById('save-csv'), 'click', () => this.saveCsv());
        this.listen(document.getElementById('load-csv'), 'click', () => this.fileInput.click());
        this.listen(this.fileInput, 'change', (event) => this.loadCsv(event));
        this.listen(this.menuObjects, 'click', (event) => {
            if (event.target === this.menuObjects) this.toggleMenu(this.menuObjects, this.dropdownObjects);
        });
        this.listen(this.menuFile, 'click', (event) => {
            if (event.target === this.menuFile) this.toggleMenu(this.menuFile, this.dropdownFile);
        });
        this.listen(document, 'click', (event) => {
            if (!this.menuObjects.contains(event.target)) this.closeMenu(this.menuObjects, this.dropdownObjects);
            if (!this.menuFile.contains(event.target)) this.closeMenu(this.menuFile, this.dropdownFile);
        });
    }

    toggleMenu(menu, dropdown) {
        const open = dropdown.classList.toggle('show');
        menu.setAttribute('aria-expanded', String(open));
    }

    closeMenu(menu, dropdown) {
        dropdown.classList.remove('show');
        menu.setAttribute('aria-expanded', 'false');
    }

    onNotify(event) {
        const tool = event.currentTarget.dataset.tool;
        if (tool) {
            this.selectTool(tool);
            this.closeMenu(this.menuObjects, this.dropdownObjects);
        }
    }

    selectTool(tool) {
        if (!this.shapeTypes[tool]) return;
        this.currentTool = tool;
        document.title = `Lab 5 — ${this.toolNames[tool]}`;
        document.querySelectorAll('[data-tool]').forEach((control) => {
            control.classList.toggle('active', control.dataset.tool === tool);
        });
    }

    toggleTable() {
        if (this.table.dialog) {
            this.table.close();
        } else {
            this.table.open();
            this.table.update(this.shapes);
        }
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.redrawAll();
    }

    getMousePosition(event) {
        const bounds = this.canvas.getBoundingClientRect();
        return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    }

    createShape(tool = this.currentTool) {
        return new this.shapeTypes[tool]();
    }

    redrawAll() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.shapes.forEach((shape) => shape.show(this.context));
        if (this.selectedIndex >= 0 && this.shapes[this.selectedIndex]) {
            this.drawSelection(this.shapes[this.selectedIndex]);
        }
    }

    drawSelection(shape) {
        const left = Math.min(shape.x1, shape.x2) - 8;
        const top = Math.min(shape.y1, shape.y2) - 8;
        const width = Math.abs(shape.x2 - shape.x1) + 16;
        const height = Math.abs(shape.y2 - shape.y1) + 16;
        this.context.save();
        this.context.strokeStyle = '#1677c8';
        this.context.lineWidth = 2;
        this.context.setLineDash([4, 3]);
        this.context.strokeRect(left, top, width, height);
        this.context.restore();
    }

    drawRubberBand(position) {
        this.redrawAll();
        const preview = this.createShape();
        preview.setData(this.startPoint.x, this.startPoint.y, position.x, position.y);
        preview.isRubberBand = true;
        this.context.save();
        this.context.setLineDash([7, 5]);
        preview.show(this.context);
        this.context.restore();
    }

    onMouseDown(event) {
        if (this.shapes.length >= MyEditor.MAX_SHAPES) return;
        this.startPoint = this.getMousePosition(event);
        this.isDrawing = true;
        if (this.currentTool === 'point') {
            this.addShape(this.startPoint);
            this.isDrawing = false;
        }
    }

    onMouseMove(event) {
        if (this.isDrawing) this.drawRubberBand(this.getMousePosition(event));
    }

    onMouseUp(event) {
        if (!this.isDrawing) return;
        this.addShape(this.getMousePosition(event));
        this.isDrawing = false;
        this.redrawAll();
    }

    onMouseLeave() {
        if (this.isDrawing) this.redrawAll();
    }

    addShape(endPoint) {
        const shape = this.createShape();
        shape.setData(this.startPoint.x, this.startPoint.y, endPoint.x, endPoint.y);
        shape.type = this.currentTool;
        this.shapes.push(shape);
        this.table.update(this.shapes);
        this.redrawAll();
    }

    selectShape(index) {
        this.selectedIndex = index;
        this.redrawAll();
    }

    deleteShape(index) {
        if (index < 0 || index >= this.shapes.length) return;
        this.shapes.splice(index, 1);
        this.selectedIndex = -1;
        this.table.update(this.shapes);
        this.redrawAll();
    }

    saveCsv() {
        const rows = ['type,x1,y1,x2,y2', ...this.shapes.map((shape) =>
            [shape.type, shape.x1, shape.y1, shape.x2, shape.y2].join(','))];
        const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'graphic-objects.csv';
        link.click();
        URL.revokeObjectURL(link.href);
        this.closeMenu(this.menuFile, this.dropdownFile);
    }

    async loadCsv(event) {
        const [file] = event.target.files;
        if (!file) return;
        try {
            const lines = (await file.text()).trim().split(/\r?\n/).slice(1);
            const loaded = lines.map((line) => line.split(',')).filter((values) =>
                values.length === 5 && this.shapeTypes[values[0]]).slice(0, MyEditor.MAX_SHAPES);
            this.shapes = loaded.map(([type, x1, y1, x2, y2]) => {
                const shape = this.createShape(type);
                shape.setData(Number(x1), Number(y1), Number(x2), Number(y2));
                shape.type = type;
                return shape;
            });
            this.selectedIndex = -1;
            this.table.update(this.shapes);
            this.redrawAll();
        } catch (error) {
            window.alert(`Не вдалося завантажити CSV: ${error.message}`);
        } finally {
            event.target.value = '';
        }
    }

    destroy() {
        this.table.close();
        this.boundHandlers.forEach(({ target, type, handler }) => target.removeEventListener(type, handler));
        this.boundHandlers = [];
        this.shapes = [];
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas = null;
        this.context = null;
        MyEditor.instance = null;
    }
}

const editor = MyEditor.getInstance();
window.addEventListener('beforeunload', () => editor.destroy(), { once: true });
