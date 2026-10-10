import {
    PointShape,
    LineShape,
    RectShape,
    EllipseShape
} from './shapes.js';

class GraphicEditor {
    static MAX_SHAPES = 125;

    constructor() {
        this.canvas = document.getElementById('editorCanvas');
        this.context = this.canvas.getContext('2d');
        this.menubar = document.getElementById('menubar');
        this.menuObjects = document.getElementById('menu-objects');
        this.dropdownObjects = document.getElementById('dropdown-objects');
        this.title = document.querySelector('title');
        this.toolNames = {
            point: 'Крапка',
            line: 'Лінія',
            rect: 'Прямокутник',
            ellipse: 'Еліпс'
        };
        this.shapeTypes = {
            point: PointShape,
            line: LineShape,
            rect: RectShape,
            ellipse: EllipseShape
        };
        this.shapes = new Array(GraphicEditor.MAX_SHAPES).fill(null);
        this.shapeCount = 0;
        this.currentTool = 'point';
        this.isDrawing = false;
        this.startPoint = { x: 0, y: 0 };

        this.bindEvents();
        this.resizeCanvas();
        this.selectTool(this.currentTool);
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());
        this.canvas.addEventListener('mousedown', (event) => this.onMouseDown(event));
        this.canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
        this.canvas.addEventListener('mouseup', (event) => this.onMouseUp(event));
        this.canvas.addEventListener('mouseleave', () => this.onMouseLeave());

        document.querySelectorAll('[data-tool]').forEach((control) => {
            control.addEventListener('click', (event) => this.onNotify(event));
        });
        this.menuObjects.addEventListener('click', (event) => {
            if (event.target === this.menuObjects) {
                this.toggleObjectMenu();
            }
        });
        document.addEventListener('click', (event) => {
            if (!this.menuObjects.contains(event.target)) {
                this.closeObjectMenu();
            }
        });
    }

    onNotify(event) {
        const tool = event.currentTarget.dataset.tool;
        if (tool) {
            this.selectTool(tool);
            this.closeObjectMenu();
        }
    }

    toggleObjectMenu() {
        const isOpen = this.dropdownObjects.classList.toggle('show');
        this.menuObjects.setAttribute('aria-expanded', String(isOpen));
    }

    closeObjectMenu() {
        this.dropdownObjects.classList.remove('show');
        this.menuObjects.setAttribute('aria-expanded', 'false');
    }

    selectTool(tool) {
        if (!this.shapeTypes[tool]) {
            return;
        }
        this.currentTool = tool;
        document.title = `Lab 3 — ${this.toolNames[tool]}`;
        document.querySelectorAll('[data-tool]').forEach((control) => {
            control.classList.toggle('active', control.dataset.tool === tool);
        });
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
        const ShapeClass = this.shapeTypes[tool];
        return new ShapeClass();
    }

    redrawAll() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let index = 0; index < this.shapeCount; index += 1) {
            this.shapes[index].show(this.context);
        }
    }

    drawRubberBand(position) {
        this.redrawAll();
        const preview = this.createShape();
        preview.setData(this.startPoint.x, this.startPoint.y, position.x, position.y);

        preview.isRubberBand = true;
        preview.show(this.context);
    }

    onMouseDown(event) {
        if (this.shapeCount >= GraphicEditor.MAX_SHAPES) {
            return;
        }
        this.startPoint = this.getMousePosition(event);
        this.isDrawing = true;
        if (this.currentTool === 'point') {
            this.addShape(this.startPoint);
            this.isDrawing = false;
        }
    }

    onMouseMove(event) {
        if (this.isDrawing) {
            this.drawRubberBand(this.getMousePosition(event));
        }
    }

    onMouseUp(event) {
        if (!this.isDrawing) {
            return;
        }
        this.addShape(this.getMousePosition(event));
        this.isDrawing = false;
        this.redrawAll();
    }

    onMouseLeave() {
        if (this.isDrawing) {
            this.redrawAll();
        }
    }

    addShape(endPoint) {
        const shape = this.createShape();
        shape.setData(this.startPoint.x, this.startPoint.y, endPoint.x, endPoint.y);
        this.shapes[this.shapeCount] = shape;
        this.shapeCount += 1;
        this.redrawAll();
    }
}

new GraphicEditor();
