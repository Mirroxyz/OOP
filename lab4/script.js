import {
    PointShape,
    LineShape,
    RectShape,
    EllipseShape,
    DottedLineShape,
    CubeShape
} from './shapes.js';

class MyEditor {
    static MAX_SHAPES = 125;

    constructor() {
        this.canvas = document.getElementById('editorCanvas');
        this.context = this.canvas.getContext('2d');
        this.menuObjects = document.getElementById('menu-objects');
        this.dropdownObjects = document.getElementById('dropdown-objects');
        this.toolNames = {
            point: 'Крапка',
            line: 'Лінія',
            rect: 'Прямокутник',
            ellipse: 'Еліпс',
            dottedLine: 'Лінія з кружечками',
            cube: 'Каркас куба'
        };
        this.shapeTypes = {
            point: PointShape,
            line: LineShape,
            rect: RectShape,
            ellipse: EllipseShape,
            dottedLine: DottedLineShape,
            cube: CubeShape
        };
        this.shapes = new Array(MyEditor.MAX_SHAPES).fill(null);
        this.shapeCount = 0;
        this.currentTool = 'point';
        this.isDrawing = false;
        this.startPoint = { x: 0, y: 0 };
        this.boundHandlers = [];
        this.bindEvents();
        this.resizeCanvas();
        this.selectTool(this.currentTool);
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
        this.listen(this.menuObjects, 'click', (event) => {
            if (event.target === this.menuObjects) {
                this.toggleObjectMenu();
            }
        });
        this.listen(document, 'click', (event) => {
            if (!this.menuObjects.contains(event.target)) {
                this.closeObjectMenu();
            }
        });
    }

    listen(target, type, handler) {
        target.addEventListener(type, handler);
        this.boundHandlers.push({ target, type, handler });
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
        document.title = `Lab 4 — ${this.toolNames[tool]}`;
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
        return new this.shapeTypes[tool]();
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
        this.context.save();
        this.context.setLineDash([7, 5]);
        preview.show(this.context);
        this.context.restore();
    }

    onMouseDown(event) {
        if (this.shapeCount >= MyEditor.MAX_SHAPES) {
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

    destroy() {
        this.boundHandlers.forEach(({ target, type, handler }) => {
            target.removeEventListener(type, handler);
        });
        this.boundHandlers = [];
        this.shapes.fill(null);
        this.shapeCount = 0;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas = null;
        this.context = null;
    }
}

const editor = new MyEditor();
window.addEventListener('beforeunload', () => editor.destroy(), { once: true });
