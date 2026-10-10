export class Shape {
    constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.isRubberBand = false;
    }

    setData(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    show(_ctx) {
        throw new Error('Метод show() має бути реалізований у похідному класі');
    }
}

export class PointShape extends Shape {
    show(ctx) {
        ctx.fillStyle = this.isRubberBand ? '#d22' : '#111';
        ctx.fillRect(this.x1 - 2, this.y1 - 2, 4, 4);
    }
}

export class LineShape extends Shape {
    show(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        // Ж=25: лінія та її гумовий слід мають червоний колір.
        ctx.strokeStyle = '#d22';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.stroke();
    }
}

export class RectShape extends Shape {
    show(ctx) {
        const oppositeX = 2 * this.x1 - this.x2;
        const oppositeY = 2 * this.y1 - this.y2;
        const left = Math.min(this.x2, oppositeX);
        const top = Math.min(this.y2, oppositeY);
        const width = Math.abs(this.x2 - oppositeX);
        const height = Math.abs(this.y2 - oppositeY);

        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = this.isRubberBand ? '#d22' : '#111';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.stroke();
    }
}

export class EllipseShape extends Shape {
    show(ctx) {
        const left = Math.min(this.x1, this.x2);
        const top = Math.min(this.y1, this.y2);
        const width = Math.abs(this.x2 - this.x1);
        const height = Math.abs(this.y2 - this.y1);

        ctx.beginPath();
        ctx.ellipse(left + width / 2, top + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
        ctx.strokeStyle = this.isRubberBand ? '#d22' : '#111';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.stroke();
    }
}
