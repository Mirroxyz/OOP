import {
    PointShape,
    LineShape,
    RectShape,
    EllipseShape
} from './shapes.js';

const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');
const menubar = document.getElementById('menubar');

const MAX_SHAPES = 124; 
let shapes = []; 
let currentTool = 'point';
let isDrawing = false;
let startX = 0, startY = 0;

const shapeTypes = {
    point: PointShape,
    line: LineShape,
    rect: RectShape,
    ellipse: EllipseShape
};

function createShape(tool) {
    const ShapeClass = shapeTypes[tool];
    return ShapeClass ? new ShapeClass() : null;
}

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
        const point = createShape(currentTool);
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

    const tempShape = createShape(currentTool);

    if (tempShape) {
        tempShape.setData(startX, startY, pos.x, pos.y);
        tempShape.show(ctx); 
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    
    const pos = getMousePos(e);
    const newShape = createShape(currentTool);

    if (newShape) {
        newShape.setData(startX, startY, pos.x, pos.y);
        shapes.push(newShape);
    }
    
    redrawAll();
});