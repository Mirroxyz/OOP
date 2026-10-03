class Shape {
    constructor() {
        this.x1 = 0; this.y1 = 0;
        this.x2 = 0; this.y2 = 0;
    }
    setData(x1, y1, x2, y2) {
        this.x1 = x1; this.y1 = y1;
        this.x2 = x2; this.y2 = y2;
    }
    show(ctx) {}
}

class PointShape extends Shape {
    show(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x1 - 2, this.y1 - 2, 4, 4); 
    }
}

class LineShape extends Shape {
    show(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.stroke();
    }
}

class RectShape extends Shape {
    show(ctx) {
        ctx.beginPath();
        ctx.rect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.stroke(); 
    }
}

class EllipseShape extends Shape {
    show(ctx) {
        const radiusX = Math.abs(this.x2 - this.x1);
        const radiusY = Math.abs(this.y2 - this.y1);
        ctx.beginPath();
        ctx.ellipse(this.x1, this.y1, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.fillStyle = "gray"; 
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.stroke();
    }
}

const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');
const menubar = document.getElementById('menubar');

const MAX_SHAPES = 124; 
let shapes = []; 
let currentTool = 'point';
let isDrawing = false;
let startX = 0, startY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - menubar.offsetHeight;
    redrawAll();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const menuObjects = document.getElementById('menu-objects');
const dropdownObjects = document.getElementById('dropdown-objects');

menuObjects.addEventListener('click', (e) => {
    dropdownObjects.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!menuObjects.contains(e.target)) {
        dropdownObjects.classList.remove('show');
    }
});

window.setTool = function(toolId) {
    currentTool = toolId;
    document.querySelectorAll('.dropdown-content button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + toolId).classList.add('active');
};

function redrawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let shape of shapes) {
        shape.show(ctx); 
    }
}

function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (e) => {
    if (shapes.length >= MAX_SHAPES) return; 
    
    const pos = getMousePos(e);
    startX = pos.x;
    startY = pos.y;
    isDrawing = true;

    if (currentTool === 'point') {
        let point = new PointShape();
        point.setData(startX, startY, startX, startY);
        shapes.push(point);
        isDrawing = false;
        redrawAll();
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    
    const pos = getMousePos(e);
    redrawAll(); 

    let tempShape = null;
    switch (currentTool) {
        case 'line': tempShape = new LineShape(); break;
        case 'rect': tempShape = new RectShape(); break;
        case 'ellipse': tempShape = new EllipseShape(); break;
    }

    if (tempShape) {
        tempShape.setData(startX, startY, pos.x, pos.y);
        tempShape.show(ctx); 
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    
    const pos = getMousePos(e);
    let newShape = null;
    
    switch (currentTool) {
        case 'line': newShape = new LineShape(); break;
        case 'rect': newShape = new RectShape(); break;
        case 'ellipse': newShape = new EllipseShape(); break;
    }

    if (newShape) {
        newShape.setData(startX, startY, pos.x, pos.y);
        shapes.push(newShape);
    }
    
    redrawAll();
});