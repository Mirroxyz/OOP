export class Shape {
    constructor() {
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
    }

    setData(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    show(ctx) {}
}

export class PointShape extends Shape {
    show(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x1 - 2, this.y1 - 2, 4, 4);
    }
}

export class LineShape extends Shape {
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

export class RectShape extends Shape {
    show(ctx) {
        ctx.beginPath();
        ctx.rect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.stroke();
    }
}

export class EllipseShape extends Shape {
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
