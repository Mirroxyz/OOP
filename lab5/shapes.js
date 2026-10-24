export class Shape {
    constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
        this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2;
        this.isRubberBand = false;
    }
    setData(x1, y1, x2, y2) {
        this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2;
    }
    show(_context) { throw new Error('Метод show() має бути реалізований у похідному класі'); }
}

export class PointShape extends Shape {
    show(context) {
        context.fillStyle = this.isRubberBand ? '#d22' : '#111';
        context.fillRect(this.x1 - 2, this.y1 - 2, 4, 4);
    }
}

export class LineShape extends Shape {
    show(context) {
        context.beginPath(); context.moveTo(this.x1, this.y1); context.lineTo(this.x2, this.y2);
        context.strokeStyle = this.isRubberBand ? '#d22' : '#111'; context.lineWidth = 2; context.stroke();
    }
}

export class RectShape extends Shape {
    constructor() { super(); this.fillShape = true; }
    getBounds() {
        const oppositeX = 2 * this.x1 - this.x2;
        const oppositeY = 2 * this.y1 - this.y2;
        return { left: Math.min(this.x2, oppositeX), top: Math.min(this.y2, oppositeY),
            width: Math.abs(this.x2 - oppositeX), height: Math.abs(this.y2 - oppositeY) };
    }
    show(context) {
        const b = this.getBounds(); context.beginPath(); context.rect(b.left, b.top, b.width, b.height);
        if (this.fillShape) { context.fillStyle = '#fff'; context.fill(); }
        context.strokeStyle = this.isRubberBand ? '#d22' : '#111'; context.lineWidth = 2; context.stroke();
    }
}

export class EllipseShape extends Shape {
    getBounds() {
        return { left: Math.min(this.x1, this.x2), top: Math.min(this.y1, this.y2),
            width: Math.abs(this.x2 - this.x1), height: Math.abs(this.y2 - this.y1) };
    }
    show(context) {
        const b = this.getBounds(); context.beginPath();
        context.ellipse(b.left + b.width / 2, b.top + b.height / 2, b.width / 2, b.height / 2, 0, 0, Math.PI * 2);
        context.strokeStyle = this.isRubberBand ? '#d22' : '#111'; context.lineWidth = 2; context.stroke();
    }
}

export class DottedLineShape extends Shape {
    constructor() { super(); this.line = new LineShape(); this.marker = new EllipseShape(); }
    show(context) {
        this.line.setData(this.x1, this.y1, this.x2, this.y2); this.line.isRubberBand = this.isRubberBand; this.line.show(context);
        this.drawMarker(context, this.x1, this.y1); this.drawMarker(context, this.x2, this.y2);
    }
    drawMarker(context, x, y) {
        this.marker.setData(x - 5, y - 5, x + 5, y + 5); this.marker.isRubberBand = this.isRubberBand;
        context.save(); this.marker.show(context); context.fillStyle = this.isRubberBand ? '#fee' : '#fff'; context.fill(); context.restore();
    }
}

export class CubeShape extends Shape {
    constructor() { super(); this.edge = new LineShape(); this.face = new RectShape(); }
    show(context) {
        const left = Math.min(this.x1, this.x2); const top = Math.min(this.y1, this.y2);
        const width = Math.abs(this.x2 - this.x1); const height = Math.abs(this.y2 - this.y1);
        const right = left + width; const bottom = top + height; const offset = Math.min(width, height) * 0.3;
        const front = { left, top: top + offset, right: right - offset, bottom };
        const back = { left: left + offset, top, right, bottom: bottom - offset };
        context.save(); this.drawRectangle(context, front); this.drawRectangle(context, back);
        this.drawEdge(context, front.left, front.top, back.left, back.top);
        this.drawEdge(context, front.right, front.top, back.right, back.top);
        this.drawEdge(context, front.right, front.bottom, back.right, back.bottom);
        this.drawEdge(context, front.left, front.bottom, back.left, back.bottom); context.restore();
    }
    drawRectangle(context, b) {
        this.face.setData((b.left + b.right) / 2, (b.top + b.bottom) / 2, b.right, b.bottom);
        this.face.isRubberBand = this.isRubberBand; this.face.fillShape = false; this.face.show(context);
    }
    drawEdge(context, x1, y1, x2, y2) {
        this.edge.setData(x1, y1, x2, y2); this.edge.isRubberBand = this.isRubberBand; this.edge.show(context);
    }
}
